import {DolphinService} from "@/utils/request"
import {JsonParser} from "@/utils/jsonparser";
import AssignmentDM from "@/datamodels/assignmentDM";
import {Toast} from '@/utils/toast';
import ResponseDM from "@/datamodels/responseDM"

export default class AssignmentAPI {

    static async LIST(options: {sort?: keyof AssignmentDM, direction?: "ASC" | "DESC", take: number, filters?: {[key: string]: (string | number)[] }, memberId?: number | string, zone?: string, status?: string, perspective?: string, extendNeedApproval?: boolean | string, boarding?: string, startDate?: string, responseTime?: string, nuggetId?: number, lastTimecardTimestamp?: string, skip?: number}) {
        const {sort, direction, take, memberId, zone, status, perspective, boarding, startDate, extendNeedApproval, responseTime, nuggetId, lastTimecardTimestamp, filters, skip} = options;
        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(memberId) params['memberId'] = memberId
        if(zone) params['zone'] = zone
        if(status) params['status'] = status
        if(perspective) params['perspective'] = perspective
        if(boarding) params['tempo'] = boarding
        if(startDate) params['startDate'] = startDate
        if(extendNeedApproval) params['extendNeedApproval'] = extendNeedApproval
        if(responseTime) params['responseTime'] = responseTime
        if(nuggetId) params['nuggetId'] = nuggetId
        if(lastTimecardTimestamp) params['lastTimecardTimestamp'] = lastTimecardTimestamp
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }

        // @ts-ignore
        const response = await DolphinService({
            url: 'assignmentviews',
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }

    @Toast<AssignmentDM>(result => `Successfully updated ${result.id}`)
    static async UPDATE(params: {assignment: AssignmentDM, showToast?: boolean}) {
         
        const form = {};
        form['startDate'] = params.assignment.startDate;
        form['endDate'] = params.assignment.endDate;
        form['estimatedHours'] = params.assignment.estimatedHours;
        form['status'] = params.assignment.status;

        // @ts-ignore
        const { data } = await DolphinService({
            url: `assignments/${params.assignment.id}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, AssignmentDM)
    }

    @Toast<AssignmentDM>(result => `Successfully declined ${result.id}`)
    static async DECLINE(params: {assignmentId: number, showToast?: boolean}) {
         
        // @ts-ignore
        const { data } = await DolphinService({
            url: `assignments/${params.assignmentId}`,
            method: 'DECLINE'
        })
        return JsonParser.deserializeObject(data, AssignmentDM)
    }

    static async PATCH(body: object[]) {
        const { data } = await DolphinService({
            method: 'PATCH',
            data: body
        })
        // Data can include multiple models.
        return data;
    }


    
    @Toast<AssignmentDM>(result => `Successfully unassigned from ${result.fullName}`) 
    static async DELETE(params: {id: number, showToast?: boolean}){
        const form = {};


        // @ts-ignore
        const { data } = await DolphinService({
            url: `assignments/${params.id}`,
            method: 'DELETE',
            data: form
        })
        return JsonParser.deserializeObject(data, AssignmentDM);
    }

    @Toast<AssignmentDM>(result => `Successfully assigned to ${result.fullName}`) 
    static async CREATE(params: {nuggetId: number, phaseId: number, memberId: number, showToast?: boolean}){
        const form = {};
        form['phaseId'] = params.phaseId;
        form['memberId'] = params.memberId;


        // @ts-ignore
        const { data } = await DolphinService({
            url: `nuggets/${params.nuggetId}/assignments`,
            method: 'CREATE',
            data: form
        })
        return JsonParser.deserializeObject(data, AssignmentDM);
    }

}