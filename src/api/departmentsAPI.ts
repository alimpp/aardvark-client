import DepartmentDM from '@/datamodels/departmentDM'
import { JsonParser } from '@/utils/jsonparser'
import { DolphinService } from '@/utils/request'
import { Toast } from '@/utils/toast';
import UserDM from '@/datamodels/userDM'

export default class DepartmentsAPI {

  static async LIST(params: { sort?: keyof DepartmentDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
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
      url: `departments`,
      method: 'LIST',
      params:localParams
    })
    return JsonParser.deserializeArray(data, DepartmentDM);
  }

  @Toast<DepartmentDM>(() => 'Successfully updated')
  static async UPDATE(params: {department: DepartmentDM, showToast?: boolean}) {
     
    const form = {
      name: params.department.name,
      removedAt: params.department.removedAt
    }
    // @ts-ignore
    const { data } = await DolphinService({
      url: `departments/${params.department.id}`,
      method: 'UPDATE',
      data: JSON.stringify(form)
    })
    return JsonParser.deserializeObject(data, DepartmentDM)
  }


  @Toast<DepartmentDM>(() => `Successfully deactivated department`)
  static async DELETE(params: {departmentId: number, showToast?: boolean}) {
    // @ts-ignore
     
    const { data } = await DolphinService({
      url: `departments/${params.departmentId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, DepartmentDM)
  }

  @Toast<DepartmentDM>(() => `Successfully created department`)
  static async CREATE(params: {name: string, showToast?: boolean}) {
    // @ts-ignore
    
    const { data } = await DolphinService({
      url: 'departments',
      method: 'CREATE',
      data:  {name:params.name}
    })
    return JsonParser.deserializeObject(data, DepartmentDM);
  }

  static async LIST_MEMBERS(params: {departmentId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `departments/${params.departmentId}/members`,
      method: "LIST"
    })
    return JsonParser.deserializeArray(data, UserDM);
  }


  static async PATCH_MEMBERS(params: {departmentId: number, memberIdsToAdd: number[], memberIdsToRemove: number[]}) {
     
    if (params.memberIdsToAdd.length === 0 && params.memberIdsToRemove.length === 0) return [];
    const body = [
      ...params.memberIdsToAdd.map(id => ({ path: `departments/${params.departmentId}/members/${id}`, op: "add", value: null })),
      ...params.memberIdsToRemove.map(id => ({ path: `departments/${params.departmentId}/members/${id}`, op: "remove", value: null }))
    ]
    // @ts-ignore
    const { data } = await DolphinService({
      url: `/`,
      method: 'PATCH',
      decompress: true,
      data: body
    })
  }

}