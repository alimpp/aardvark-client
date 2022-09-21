import ProjectDM from '@/datamodels/projectDM';
import { JsonParser } from '@/utils/jsonparser';
import { DolphinService } from '@/utils/request'
import {Toast} from '@/utils/toast';
import ResponseDM from "@/datamodels/responseDM"
import {Nullable} from '@/utils/generics';

export default class ProjectsAPI {

    static async LIST(options: {sort?: keyof ProjectDM, direction?: "ASC" | "DESC", take?: number, filters?: {[key: string]: (string | number)[] }, skip?: number} = {}): Promise<ResponseDM> {
        const {sort, direction, take, filters, skip} = options;
        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }

        // @ts-ignore
        const response = await DolphinService({
            url: `projects`,
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }

    static async LIST_PROJECTS_DETAILS(options: { take?: number,zone?: string ,skip?: number} = {}): Promise<ResponseDM> {
        const {take,zone ,skip} = options;
        const params = {}
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(zone) params['zone'] = zone;

        // @ts-ignore
        const response  = await DolphinService({
            url: `projectdetails`,
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM);
    }


    @Toast<ProjectDM>(result => `Successfully updated ${result.projectNumber}`)
    static async UPDATE(params: {project: ProjectDM, showToast?: boolean}): Promise<ProjectDM> {
        const form = {};
        form['description'] = params.project.description.trim();
        form['title'] = params.project.title.trim();
        form['status'] = params.project.status;
        if (params.project.managerId) form['managerId'] = params.project.managerId;
        if (params.project.secondaryManagerId || params.project.secondaryManagerId === null) form['secondaryManagerId'] = params.project.secondaryManagerId;

        // @ts-ignore
        const { data } = await DolphinService({
            url: `projects/${params.project.id}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, ProjectDM);
    }

    @Toast<ProjectDM>(result => `Successfully created ${result.projectNumber}`)
    static async CREATE(params: {title: string, workflowId: number, status: string, managerId: number, description: string, secondaryManagerId: Nullable<number>, showToast?: boolean}): Promise<ProjectDM> {
        // @ts-ignore
        const { data } = await DolphinService({
            url: 'projects',
            method: 'CREATE',
            data: {
                description: params.description.trim(),
                managerId:params.managerId,
                secondaryManagerId:params.secondaryManagerId,
                status: params.status,
                title:params.title.trim(),
                workflowId:params.workflowId
            }
        })
        return JsonParser.deserializeObject(data, ProjectDM);
    }

}
