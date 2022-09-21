import NuggetDM from '@/datamodels/nuggetDM'
import {JsonParser} from '@/utils/jsonparser'
import {DolphinService} from '@/utils/request'
import NuggetPhaseDM from '@/datamodels/nuggetPhaseDM';
import TagDM from '@/datamodels/tagDM';
import {Toast} from '@/utils/toast';
import ResponseDM from "@/datamodels/responseDM"
import SprintDM from '@/datamodels/sprintDM';

export default class NuggetAPI {

    @Toast<NuggetDM>(result => `Following Nugget ${result.nuggetNumber}`)
    static async SUBSCRIBE(params: {nuggetId: number, showToast?: boolean}) {
        const { nuggetId } = params;
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${nuggetId}`,
            method: 'SUBSCRIBE'
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }

    @Toast<NuggetDM>(result => `Unfollowing Nugget ${result.nuggetNumber}`)
    static async UNSUBSCRIBE(params: {nuggetId: number, showToast?: boolean}) {
        const { nuggetId } = params;
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${nuggetId}`,
            method: 'UNSUBSCRIBE'
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }

    static async GET_NUGGET_BY_ID(nuggetId: number) {
        const { data } = await DolphinService({
            url: `nuggetviews/${nuggetId}`,
            method: 'GET'
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }

    static async LIST_RELATED_NUGGETS(nuggetId: number) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${nuggetId}/relatednuggets`,
            method: 'LIST'
        })
        return JsonParser.deserializeArray(data, NuggetDM);
    }

    @Toast<NuggetDM>(result => `Successfully updated ${result.nuggetNumber}`)
    static async UPDATE_NUGGET(params: {stage?: string, description?: string, title?: string, priority?: string, type?: string, createdByMemberId?: number, leadPhaseId?: number, sprintId?: number, id: number, showToast?: boolean}) {
        const { stage, description, title, priority, type, createdByMemberId, leadPhaseId, sprintId, id } = params;
        const form = {};
        if(stage) form['stage'] = stage;
        if(description) form['description'] = description;
        if(title) form['title'] = title;
        if(priority) form['priority'] = priority;
        if(type) form['kind'] = type;
        if(createdByMemberId) form['memberId'] = createdByMemberId;
        if(leadPhaseId) form['leadPhaseId'] = leadPhaseId;
        if(sprintId) form['sprint'] = sprintId;

        if(!Object.values(form).length) return false;

        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${id}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, NuggetDM);
    }

    static async PATCH_NUGGET_TAGS(params: {nuggetId: number, tagIdsToAdd: number[], tagIdsToRemove: number[]}) {
        if(params.tagIdsToAdd.length === 0 && params.tagIdsToRemove.length === 0) return [];
        const body = [
            ...params.tagIdsToAdd.map(id => ({path: `${params.nuggetId}/tags/${id}`, op: "add", value: null})),
            ...params.tagIdsToRemove.map(id => ({path: `${params.nuggetId}/tags/${id}`, op: "remove", value: null}))
        ]
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets`,
            method: 'PATCH',
            decompress: true,
            data: body
        })
        return JsonParser.deserializeArray(data, TagDM);
    }

    static async PATCH_RELATED_NUGGETS(params: {nuggetId: number, nuggetIdsToAdd: number[], nuggetIdsToRemove: number[]}) {
        if(params.nuggetIdsToAdd.length === 0 && params.nuggetIdsToRemove.length === 0) return [];
        const body = [
            ...params.nuggetIdsToAdd.map(id => ({path: params.nuggetId.toString(), op: "relate", value: { targetNuggetId: id }})),
            ...params.nuggetIdsToRemove.map(id => ({path: params.nuggetId.toString(), op: "unrelate", value: { targetNuggetId: id }}))
        ]
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets`,
            method: 'PATCH',
            decompress: true,
            data: body
        })
        return JsonParser.deserializeArray(data, NuggetDM);
    }

    static async PATCH(params: {body: object[]}) {
        const { data } = await DolphinService({
            method: 'PATCH',
            data: params.body
        })
        // Data can include multiple models.
        return data;
    }

    static async UPDATE_NUGGET_PROJECT(params: { projectId: number, id: number }) {
        const { projectId, id } = params;
        const form = {};
        form['projectId'] = projectId;

        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${id}`,
            method: 'MOVE',
            data: form
        })
        return JsonParser.deserializeObject(data, NuggetDM);
    }

    static async SEARCH(options: {query: string, sort?: keyof NuggetDM, direction?: "ASC" | "DESC", take?: number, filters?: {[key: string]: (string | number)[] }, skip?: number, status?: string}){
        const {query, sort, direction, take, filters, skip, status} = options;

        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(status) params['status'] = status
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }

        const form = {};
        form['query'] = query;


        // @ts-ignore
        const response = await DolphinService({
            url: 'nuggetviews',
            method: 'SEARCH',
            data: form,
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }


    static async LIST(options: { sort?: keyof NuggetDM, direction?: "ASC" | "DESC", take?: number, seenAt?: string, unread?: boolean, responseTime?: string, zone?: string, stage?: string, status?: string, projectId?: number,releaseId?: number,isSubscribed?: number|boolean, sprintId?: number, returnToTriageJobDate?: string, filters?: {[key: string]: (string | number)[]}, skip?: number}) {
        const {sort, direction, take, seenAt, unread, responseTime, zone, stage, isSubscribed, projectId,releaseId, sprintId, filters, skip, status, returnToTriageJobDate} = options;
        const params = {}
        if (sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(seenAt) params['seenAt'] = seenAt
        if(unread) params['unread'] = unread
        if(responseTime) params['responseTime'] = responseTime
        if(zone) params['zone'] = zone
        if(stage) params['stage'] = stage
        if(status) params['status'] = status
        if(isSubscribed) params['isSubscribed'] = isSubscribed
        if(projectId) params['projectId'] = projectId
        if(releaseId) params['releaseId'] = releaseId
        if(sprintId) params['sprintId'] = sprintId;
        if(returnToTriageJobDate) params['returnToTriageJobDate'] = returnToTriageJobDate
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }

        // @ts-ignore
        const response = await DolphinService({
            url: 'nuggetviews',
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }


    @Toast<NuggetPhaseDM>(result => `Phase ${result.phaseTitle} is removed`)
    static async SKIP_PHASE(params: {nuggetId: number, phaseId: number, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
          url: `nuggets/${params.nuggetId}/phases/${params.phaseId}/nuggetphases`,
          method: "SKIP",
        })
        return JsonParser.deserializeObject(data, NuggetPhaseDM);
    }

    @Toast<NuggetPhaseDM>(result => `Phase ${result.phaseTitle} is added`)
      static async UNSKIP_PHASE(params: {nuggetPhaseId: number, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
          url: `nuggetphases/${params.nuggetPhaseId}`,
          method: "UNSKIP",
        })
        return JsonParser.deserializeObject(data, NuggetPhaseDM);
      }

      @Toast<NuggetDM>(result => `Successfully created ${result.nuggetNumber}`)
      static async CREATE(params: {title: string, type: string, projectId: number, priority: string, description: string, stage: string, showToast?: boolean}) {
        const form = {};
        form['title'] = params.title.trim();
        form['stage'] = params.stage;
        form['description'] = params.description.trim();
        form['kind'] = params.type;
        form['priority'] = params.priority;
        form['projectId'] = params.projectId;

          // @ts-ignore
          const { data } = await DolphinService({
            url: `nuggets`,
            method: 'CREATE',
            decompress: true,
            data: form
          })

          return JsonParser.deserializeObject(data, NuggetDM)
      }

    static async DRAFT_SUBSCRIBE(params: {draftNuggetId: number, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `draftnuggets/${params.draftNuggetId}`,
            method: 'SUBSCRIBE'
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }

    static async DRAFT_UNSUBSCRIBE(params: {draftNuggetId: number, showToast?: boolean}) {
            // @ts-ignore
            const { data } = await DolphinService({
                url: `draftnuggets/${params.draftNuggetId}`,
                method: 'UNSUBSCRIBE'
            })
            return JsonParser.deserializeObject(data, NuggetDM)
    }

    static async LIST_NUGGETS_PHASES(options: {nuggetIds: number[], take?: number, skip?: number, sort?: string}) {
        const {nuggetIds, take, skip, sort } = options
        const params = {}
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if (sort) params['sort'] = sort
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggetphases`,
            method: 'LIST',
            data: {nuggetIds: nuggetIds},
            params
        })
        return JsonParser.deserializeArray(data, NuggetPhaseDM)
    }

    static async LIST_PHASES(params: {nuggetId: number}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${params.nuggetId}/nuggetphases`,
            method: 'LIST'
        })
        return JsonParser.deserializeArray(data, NuggetPhaseDM)
    }


    static async SCHEDULE(params: {at: string, nuggetId: number}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${params.nuggetId}/jobs`,
            method: 'SCHEDULE',
            data: {at: params.at}
        })
        return data
    }

    static async REMOVE_SPRINT(params: { projectId: number, nuggetId: number }) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `projects/${params.projectId}/sprints`,
            method: 'REMOVE',
            data: { nuggetId: params.nuggetId }
        })
        return JsonParser.deserializeObject(data, SprintDM)
    }

    static async APPEND_SPRINT(params) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggetsprints`,
            method: 'APPEND',
            data: params
        })
        return JsonParser.deserializeObject(data, Object)
    }

    static async ARCHIVE(params) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${params.nuggetId}`,
            method: 'ARCHIVE',
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }

    static async UNARCHIVE(params) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${params.nuggetId}`,
            method: 'UNARCHIVE',
        })
        return JsonParser.deserializeObject(data, NuggetDM)
    }
    
}
