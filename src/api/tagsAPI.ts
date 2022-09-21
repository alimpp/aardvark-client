import TagDM from '@/datamodels/tagDM'
import { JsonParser } from '@/utils/jsonparser'
import { DolphinService } from '@/utils/request'
import { Toast } from '@/utils/toast';

export default class TagsAPI {

    static async LIST(params: { sort?: keyof TagDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
        const { sort, direction, take, filters, skip } = params;
        const localParams = {}
        if (sort) localParams['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if (take) localParams['take'] = take
        if (skip) localParams['skip'] = skip;
        if (filters) {
            for (const key in filters) {
                if (filters[key].toString() === 'active') {
                    localParams[key] = '\0'
                } else if (filters[key].toString() === 'inactive') {
                    localParams[key] = '!\0'
                }else if (filters[key].toString().includes('active' && 'inactive')) {
                    localParams[key] = null
                } else {
                    localParams[key] = `IN(${filters[key].toString()})`
                }
            }
        }

        // @ts-ignore
        const { data } = await DolphinService({
            url: `tags`,
            method: 'LIST',
            params: localParams
        })
        return JsonParser.deserializeArray(data, TagDM);
    }

    @Toast<TagDM>(() => 'Successfully updated tag')
    static async UPDATE(params: { tag: TagDM, showToast?: boolean }) {
        const form = {};
        form['title'] = params.tag.title;
        form['description'] = params.tag.description;
        form['removedAt'] = params.tag.removedAt

        // @ts-ignore
        const { data } = await DolphinService({
            url: `tags/${params.tag.id}`,
            method: 'UPDATE',
            data: JSON.stringify(form)
        })
        return JsonParser.deserializeObject(data, TagDM)
    }

    @Toast<TagDM>(() => `Successfully created tag`)
    static async CREATE(params: { title: string, description: string, showToast?: boolean }) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: 'tags',
            method: 'CREATE',
            data: {
                description: params.description,
                title: params.title
            }
        })
        return JsonParser.deserializeObject(data, TagDM);
    }

    @Toast<TagDM>(() => 'Successfully deactivated tag')
    static async DELETE(params: { tagId: number, showToast?: boolean }) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `tags/${params.tagId}`,
            method: 'DELETE'
        })
        return JsonParser.deserializeObject(data, TagDM)
    }



}
