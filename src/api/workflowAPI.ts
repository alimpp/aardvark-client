import { DolphinService } from "@/utils/request"
import WorkflowDM from '@/datamodels/workflowDM';
import { JsonParser } from '@/utils/jsonparser';
import { Toast } from '@/utils/toast';
import PhaseDM from '@/datamodels/phaseDM';

export default class WorkflowAPI {
  static async LIST(params: { sort?: keyof WorkflowDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
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
      url: `workflows`,
      method: 'LIST',
      params: localParams
    })
    return JsonParser.deserializeArray(data, WorkflowDM);
  }


  @Toast<WorkflowDM>(() => 'Successfully updated workflow')
  static async UPDATE(params: {workflow: WorkflowDM, showToast?: boolean}) {
    const form = {
      title: params.workflow.title.trim(),
      description: params.workflow.description.trim(),
      removedAt: params.workflow.removedAt
    }
    // @ts-ignore
    const { data } = await DolphinService({
      url: `workflows/${params.workflow.id}`,
      method: 'UPDATE',
      data: JSON.stringify(form)
    })
    return JsonParser.deserializeObject(data, WorkflowDM)
  }

  @Toast<WorkflowDM>(() => 'Successfully deactivated workflow')
  static async DELETE(params: { workflowId: number, showToast?: boolean }) {
     
    // @ts-ignore
    const { data } = await DolphinService({
      url: `workflows/${params.workflowId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, WorkflowDM)
  }

  @Toast<WorkflowDM>(() => `Successfully created workflow`)
  static async CREATE(params: {title: string, description: string, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: 'workflows',
      method: 'CREATE',
      data: {
        description:params.description.trim(),
        title:params.title.trim()
      }
    })
    return JsonParser.deserializeObject(data, WorkflowDM);
  }

  @Toast<PhaseDM>(() => `Successfully added`)
  static async ADD_PHASES({addedPhases=[] , showToast}: {addedPhases: any, showToast?: boolean}) {
    const params= {addedPhases, showToast}

    if (params.addedPhases.length === 0) return [];
    const body = [
      ...params.addedPhases.map(phase => ({ path: `workflows/${phase.workflowId}/phases/${phase.id}`, op: "add", value: { order: phase.order } }))
    ]
    const { data } = await DolphinService({
      url: `/`,
      method: 'PATCH',
      decompress: true,
      data: body
    })
    return JsonParser.deserializeArray(data, PhaseDM)

  }

  @Toast<PhaseDM>(() => 'Successfully removed')
  static async REMOVE_PHASES({removedPhases = [], showToast}: {removedPhases: any , showToast?: boolean}) {
    const params= {removedPhases, showToast}
    if (params.removedPhases.length === 0) return [];
    const body = [
      ...params.removedPhases.map(phase => ({ path: `workflows/${phase.workflowId}/phases/${phase.id}`, op: "remove", value: null }))
    ]
    const { data } = await DolphinService({
      url: `/`,
      method: 'PATCH',
      decompress: true,
      data: body
    })
    return JsonParser.deserializeArray(data, PhaseDM)

  }

  }
