import { DolphinService, JaguarService } from "@/utils/request"
import { JsonParser } from '@/utils/jsonparser'
import UserDM from '@/datamodels/userDM';
import GroupDM from '@/datamodels/groupDM';
import DepartmentDM from '@/datamodels/departmentDM';
import {AccountDSModule} from "@/store"
import { Toast } from '@/utils/toast';
import SkillDM from '@/datamodels/skillDM'
import SpecialtyDM from "@/datamodels/specialtyDM";
import ResponseDM from "@/datamodels/responseDM"


export default class UserAPI {
  static async LIST(options: { sort?: keyof UserDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number , isSystem?: boolean} = {}) {
    const { sort, direction, take, filters, skip, isSystem } = options;
    const params = {}
    if (sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
    if (take) params['take'] = take
    if (skip) params['skip'] = skip;
    if (isSystem !== undefined) params['isSystem'] = isSystem
    if (filters) {
      for (const key in filters) {
        if (filters[key].toString() === 'active') {
          params[key] = '\0'
        } else if (filters[key].toString() === 'inactive') {
          params[key] = '!\0'
        } else if (filters[key].toString().includes('active' && 'inactive')) {
          params[key] = null
        } else {
          params[key] = `IN(${filters[key].toString()})`
        }
      }
    }

    // @ts-ignore
    const { data } = await DolphinService({
      url: `organizations/${AccountDSModule.selectedAccount.id}/members`,
      method: "LIST",
      params
    })
    return JsonParser.deserializeArray(data, UserDM);
  }

  @Toast<UserDM[]>(result => `Successfully updated ${result?.[0]?.fullName}`)
  static async UPDATE_ROLES(params: {user: UserDM, addedRoles: string[], removedRoles: string[], showToast?: boolean}) {
    if(params.addedRoles.length === 0 && params.removedRoles.length === 0) return [];
    const body = [
        ...params.addedRoles.map(role => ({path: `organizations/${AccountDSModule.selectedAccount.id}/members/${params.user.id}`, op: "grant", value: {role: role}})),
        ...params.removedRoles.map(role => ({path: `organizations/${AccountDSModule.selectedAccount.id}/members/${params.user.id}`, op: "deny", value: {role: role}}))
    ]
    const { data } = await DolphinService({
      url: `/`,
      method: 'PATCH',
      decompress: true,
      data: body
    });
    return JsonParser.deserializeArray(data, UserDM);
  }


  @Toast<GroupDM>(() => `Successfully updated`)
  static async UPDATE_GROUPS(userId: number, addedGroups: number[],  removedGroups: number[], showToast?: boolean) {
    if(addedGroups.length === 0 && removedGroups.length === 0){
      return [];
    }
    const body: any = [] ;
    if(removedGroups.length != 0){
      body.push(...removedGroups.map(group => ({ path: `members/${userId}/channels/${group}`, op: "remove", value: null})));
    }
    if(addedGroups.length != 0){
      body.push(...addedGroups.map(group => ({ path: `members/${userId}/channels/${group}`, op: "add", value: null})));
    }
    const { data } = await JaguarService({
      url: `/`,
      method: 'PATCH',
      decompress: true,
      data: body
    })
    return JsonParser.deserializeArray(data, GroupDM)

  }

  @Toast<UserDM>(() => `Successfully added`)
  static async ADD_DEPARTMENT(params: {user: UserDM, addedDepartment: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `departments/${params.addedDepartment}/members/${params.user.id}`,
      method: 'ADD',
    })
    return data

  }

  @Toast<UserDM>(() => 'Successfully removed')
  static async REMOVE_DEPARTMENT(params: {user: UserDM, removedDepartment: number, showToast?: boolean}) {
       // @ts-ignore
       const { data } = await DolphinService({
        url: `departments/${params.removedDepartment}/members/${params.user.id}`,
        method: 'REMOVE',
      })

    return data

  }

  @Toast<UserDM>(result => `${result.email} invited to Maestro`)
  static async INVITE(params: { email: string, role: string, scopes: string, applicationId: number, redirectUri: string }, showToast?: boolean) {

    const form = {};
    form['email'] = params.email;
    form['role'] = params.role;
    form['scopes'] = params.scopes;
    form['applicationId'] = params.applicationId;
    form['redirectUri'] = params.redirectUri;


    // @ts-ignore
    const { data } = await DolphinService({
      url: `organizations/${AccountDSModule.selectedAccount.id}/invitations`,
      method: 'CREATE',
      data: form
    })
    return data
  }

  @Toast<UserDM>(() => 'Successfully kicked')
  static async KICK(params: {userId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `organizations/${AccountDSModule.selectedAccount.id}/members/${params.userId}`,
      method: 'KICK'
    })
    return JsonParser.deserializeObject(data, UserDM)
  }

  @Toast<UserDM>(() => 'Successfully')
  static async UNKICK(params: {userId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `organizations/${AccountDSModule.selectedAccount.id}/members/${params.userId}`,
      method: 'UNKICK'
    })
    return JsonParser.deserializeObject(data, UserDM)
  }

  static async DEPARTMENT(params: {userId: number}) {
    // @ts-ignore
    const data  = await DolphinService({
      url: `members/${params.userId}/departments`,
      method: 'GET'
    })    
    return JsonParser.deserializeObject(data , ResponseDM)
  }

  static async LIST_SKILLS(params: {userId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.userId}/skills`,
      method: 'LIST'
    })
    return JsonParser.deserializeArray(data || [], SkillDM)
  }

  static async LIST_SPECIALTIES(params: {userId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.userId}/specialties`,
      method: 'LIST'
    })
    return JsonParser.deserializeArray(data || [], SpecialtyDM)
  }

  static async LIST_PHASE_MEMBERS(params: {PhaseId: number, sort?: keyof UserDM, direction?: "ASC" | "DESC"}) {
    const lParams = {}
    if(params.sort) lParams['sort'] = `${params.direction === 'ASC' ? '' : '-'}${params.sort}`

    // @ts-ignore
    const { data } = await DolphinService({
      url: `phases/${params.PhaseId}/members`,
      method: "LIST",
      params:lParams
    })
    return JsonParser.deserializeArray(data, UserDM);
  }
}
