import { DolphinService } from "@/utils/request"
import PhaseDM from '@/datamodels/phaseDM';
import { JsonParser } from '@/utils/jsonparser';
import { Toast } from '@/utils/toast';
import NuggetPhaseDM from '@/datamodels/nuggetPhaseDM';

export default class PhaseAPI {

  static async LIST(params: { sort?: keyof PhaseDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
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
      url: `phases`,
      method: 'LIST',
      params: localParams
    })
    return JsonParser.deserializeArray(data, PhaseDM);
  }

  static async LIST_PROJECT_PHASES(params: {projectId: number, sort?: keyof PhaseDM, direction?: "ASC" | "DESC"}) {

    const lParams = {}
    if(params.sort) lParams['sort'] = `${params.direction === 'ASC' ? '' : '-'}${params.sort}`

    // @ts-ignore
    const { data } = await DolphinService({
      url: `projects/${params.projectId}/phases`,
      method: "LIST",
      params: lParams
    })
    return JsonParser.deserializeArray(data, PhaseDM);
  }

  @Toast<PhaseDM>(() => 'Phase successfully updated')
  static async UPDATE(params: {phase: PhaseDM, showToast?: boolean}) {
    const form = {
      title: params.phase.title.trim(),
      skillId: params.phase.skillId,
      description: params.phase.description,
      removedAt: params.phase.removedAt
    }
    // @ts-ignore
    const { data } = await DolphinService({
      url: `phases/${params.phase.id}`,
      method: 'UPDATE',
      data: JSON.stringify(form)
    })
    return JsonParser.deserializeObject(data, PhaseDM)
  }

  @Toast<PhaseDM>(() => 'Successfully deactivated phase')
  static async DELETE(params: {phaseId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `phases/${params.phaseId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, PhaseDM)
  }

  @Toast<PhaseDM>(() => `Successfully created phase`)
  static async CREATE(params: {title: string, description: string, skillId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `phases`,
      method: 'CREATE',
      data: {
        description: params.description.trim(),
        title: params.title.trim(),
        skillId: params.skillId
      }
    })
    return JsonParser.deserializeObject(data, PhaseDM);
  }

  static async READ_NUGGET_PHASE(params: { nuggetPhase: NuggetPhaseDM }) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `nuggetphases/${params.nuggetPhase.id}`,
      method: 'READ'
    })
    return JsonParser.deserializeObject(data, NuggetPhaseDM)
  }

}
