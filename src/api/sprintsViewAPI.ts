import {JsonParser} from '@/utils/jsonparser';
import {DolphinService} from '@/utils/request'
import ResponseDM from "@/datamodels/responseDM"
import SprintDM from '@/datamodels/sprintDM';

export default class SprintsViewAPI {

    static async LIST(options: {sort?: keyof SprintDM, direction?: "ASC" | "DESC", zone: string, take: number, skip?: number, isReleased?: boolean, filters?: {[key: string]: (string | number)[]}, hasProductionNuggets: boolean, hasBackloggedNuggets: boolean}) {
        const {sort, direction, take, zone, filters, skip, hasProductionNuggets, hasBackloggedNuggets, isReleased} = options;
        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take;
        if(zone) params['zone'] = zone;
        if(skip) params['skip'] = skip;
        if(hasBackloggedNuggets) params['hasBackloggedNuggets'] = hasBackloggedNuggets;
        if(hasProductionNuggets) params['hasProductionNuggets'] = hasProductionNuggets;
        if(isReleased !== undefined) params['isReleased'] = isReleased
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }
        // @ts-ignore
        const response = await DolphinService({
            url: `sprintviews`,
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM);
    }

    static async LIST_SPRINTS_DETAILS(options: {sort?: keyof SprintDM, direction?: "ASC" | "DESC", zone?: string, take?: number, skip?: number, isReleased?: boolean, filters?: {[key: string]: (string | number)[]}, hasProductionNuggets?: boolean, hasBackloggedNuggets?: boolean, hasEstimatedNuggets?: boolean}) {
        const {sort, direction, take, zone, filters, skip, hasProductionNuggets, hasBackloggedNuggets, hasEstimatedNuggets, isReleased} = options;
        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take;
        if(zone) params['zone'] = zone;
        if(skip) params['skip'] = skip;
        if(hasBackloggedNuggets) params['hasBackloggedNuggets'] = hasBackloggedNuggets;
        if(hasEstimatedNuggets) params['hasEstimatedNuggets'] = hasEstimatedNuggets;
        if(hasProductionNuggets) params['hasProductionNuggets'] = hasProductionNuggets;
        if(isReleased !== undefined) params['isReleased'] = isReleased
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }
        // @ts-ignore
        const response = await DolphinService({
            url: `sprintreleaseviews`,
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM);
    }

    static async APPEND_RELEASE_SPRINT(args: {releaseId: number, sprintId: number}) {
        // @ts-ignore
        const response = await DolphinService({
            url: `releases/${args.releaseId}/sprints/${args.sprintId}`,
            method: 'APPEND'
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }

    static async REMOVE_RELEASE_SPRINT(args: {releaseId: number, sprintId: number}) {
        // @ts-ignore
        const response = await DolphinService({
            url: `releases/${args.releaseId}/sprints/${args.sprintId}`,
            method: 'REMOVE'
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }

}
