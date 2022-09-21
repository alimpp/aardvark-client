import {DolphinService} from '@/utils/request'
import {JsonParser} from '@/utils/jsonparser';
import {Toast} from '@/utils/toast';
import SprintDM from '@/datamodels/sprintDM';

export default class SprintAPI {

    @Toast<SprintDM>(result => `Successfully created ${result.number}-${result.name}`)
    static async CREATE(params: {projectId: number, name: string, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `projects/${params.projectId}/sprints`,
            data: {name: params.name},
            method: 'CREATE'
        })
        return JsonParser.deserializeObject(data, SprintDM);
    }

    static async LIST(options: {projectId?: number, releaseId?: number,params?: any}) {
        const {projectId, releaseId} = options
        const params = {}

        if(projectId) params['projectId'] = projectId
        if(releaseId) params['releaseId'] = releaseId

        // @ts-ignore
        const { data } = await DolphinService({
            url: `sprintreleaseviews`,
            method: "LIST",
            params: {...params, ...options.params }
        })

        return JsonParser.deserializeArray(data, SprintDM);
    }

    @Toast<SprintDM>(result => `Successfully Deleted ${result.number}-${result.name}`)
    static async DELETE(params: {sprintId: number, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `sprints/${params.sprintId}`,
            method: 'DELETE'
        })
        return JsonParser.deserializeObject(data, SprintDM);
    }

    @Toast<SprintDM>(result => `Successfully Updated ${result.number}-${result.name}`)
    static async UPDATE(params: {sprintId: number, sprintName: string, projectId: number, description?: string, period?: string, showToast?: boolean}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `projects/${params.projectId}/sprints/${params.sprintId}`,
            method: 'UPDATE',
            data: {name: params.sprintName, description: params.description, period: params.period}
        })
        return JsonParser.deserializeObject(data, SprintDM);
    }
    
    @Toast<SprintDM>(result => `Successfully Updated ${result.number}-${result.name}`)
    static async RESCHEDULE(params: {returnToTriage: string, sprintId: number, moveNugget?: boolean}) {
        const form = {
            at: params.returnToTriage,
            moveNugget : params.moveNugget
        }
        // @ts-ignore
        const { data } = await DolphinService({
            url: `sprints/${params.sprintId}`,
            method: 'RESCHEDULE',
            data: form
        })
        return JsonParser.deserializeObject(data, SprintDM)
    }


}
