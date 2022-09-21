import TagsAPI from '@/api/tagsAPI';
import TagDM from '@/datamodels/tagDM';
import { SettingsDSModule } from '@/store';
import { isEmpty } from '@/utils/object';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import TagAPI from "@/api/tagsAPI"
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: 'tagds', namespaced: true })
export class TagDS extends BaseItemDS<TagDM> {

    public get currentTag(): TagDM {
        return this.items[SettingsDSModule.selectedTagID] || {};
    }

    @Action({ rawError: true })
    async doLoad() {
        if (isEmpty(this.items)) {
            const tags = await TagsAPI.LIST();
            this.addOrReplaceItems(tags);
        }
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_TAG_LOADING)
    async listTags(params?: { sort?: keyof TagDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
        const tags = await TagAPI.LIST(params)
        this.addOrReplaceItems(tags)
        return tags
    }

    @Action({ rawError: true })
    async updateTag(tag: TagDM) {
        const updatedTag = await TagAPI.UPDATE({tag})
        this.addOrReplaceItem(updatedTag)
        return updatedTag
    }

    @Action({ rawError: true })
    async create(params: { title: string, description: string }) {
        const tag = await TagAPI.CREATE({title:params.title, description:params.description});
        SettingsDSModule.setNewTagId(tag.id)
        this.addOrReplaceItem(tag);
        return tag
    }

    @Action({ rawError: true })
    async deactivateTag(tagId: number) {
        const deletedTag = await TagAPI.DELETE({tagId});
        this.addOrReplaceItem(deletedTag);
        return deletedTag
    }

}
