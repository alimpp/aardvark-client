import SkillDM from '@/datamodels/skillDM'
import { JsonParser } from '@/utils/jsonparser'
import { DolphinService } from '@/utils/request'
import { Toast } from '@/utils/toast';

export default class SkillsAPI {

  static async LIST(params: { sort?: keyof SkillDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
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
        } else if (filters[key].toString().includes('active' && 'inactive')) {
          localParams[key] = null
        } else {
          localParams[key] = `IN(${filters[key].toString()})`
        }
      }
  }

    // @ts-ignore
    const { data } = await DolphinService({
      url: `skills`,
      method: 'LIST',
      params: localParams
    })
    return JsonParser.deserializeArray(data, SkillDM);
  }

  @Toast<SkillDM>(() => 'Skill successfully updated')
  static async UPDATE(params: {skill: SkillDM, showToast?: boolean}) {
    const form = {
      title: params.skill.title.trim(),
      description: params.skill.description.trim(),
      removedAt: params.skill.removedAt
    }
    // @ts-ignore
    const { data } = await DolphinService({
      url: `skills/${params.skill.id}`,
      method: 'UPDATE',
      data: JSON.stringify(form)
    })
    return JsonParser.deserializeObject(data, SkillDM)
  }

  @Toast<SkillDM>(() => 'Successfully deactivated skill')
  static async DELETE(params: {skillId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `skills/${params.skillId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, SkillDM)
  }

  @Toast<SkillDM>(() => `Successfully created skill`)
  static async CREATE(params: {title: string, description: string, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: 'skills',
      method: 'CREATE',
      data: {
        description: params.description.trim(),
        title: params.title.trim()
      }
    })
    return JsonParser.deserializeObject(data, SkillDM);
  }

  static async GRANT(params: {memberId: number, skillId: number}): Promise<SkillDM> {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.memberId}/skills/${params.skillId}`,
      method: 'GRANT',
    })
    return JsonParser.deserializeObject(data, SkillDM);
  }

  static async DENY(params: {memberId: number, skillId: number}): Promise<SkillDM> {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.memberId}/skills/${params.skillId}`,
      method: 'DENY'
    })
    return JsonParser.deserializeObject(data, SkillDM);
  }

}
