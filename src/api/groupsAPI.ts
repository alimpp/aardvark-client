import GroupDM from '@/datamodels/groupDM'
import UserDM from '@/datamodels/userDM';
import {GROUP_TYPE} from '@/utils/constants';
import { JsonParser } from '@/utils/jsonparser'
import { JaguarService } from '@/utils/request'
import { Toast } from '@/utils/toast';

export default class GroupsAPI {

  static async LIST(params: { sort?: keyof GroupDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number } = {}) {
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
    const { data } = await JaguarService({
      url: `channels`,
      method: 'LIST',
      params: localParams
    })
    return JsonParser.deserializeArray(data, GroupDM);
  }

  static async LIST_CHAT_ROOM_MEMBER(params: {roomId: number}) {

    // @ts-ignore
    const {data} = await JaguarService({
      url:`rooms/${params.roomId}/members`,
      method: 'LIST'
    })

    return JsonParser.deserializeArray(data || [], UserDM)
  }



  @Toast<GroupDM>(() => 'Successfully updated group')
  static async UPDATE(params: {group: GroupDM, showToast?: boolean}) {
    const form = {
      title:params.group.title.trim(),
      description:params.group.description.trim(),
      removedAt:params.group.removedAt,
      type:params.group.type,
    }
    // @ts-ignore
    const { data } = await JaguarService({
      url: `channels/${params.group.id}`,
      method: 'UPDATE',
      data: JSON.stringify(form)
    })
    return JsonParser.deserializeObject(data, GroupDM)
  }


  @Toast<GroupDM>(() => 'Successfully deactivated channel')
  static async DELETE(params: { groupId: number, showToast?: boolean }) {
    // @ts-ignore
    const { data } = await JaguarService({
      url: `channels/${params.groupId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, GroupDM)
  }

  @Toast<GroupDM>(() => `Successfully created group`)
  static async CREATE(params: {title: string, description: string, type: GROUP_TYPE, showToast?: boolean}) {
    // @ts-ignore

    const { data } = await JaguarService({
      url: 'channels',
      method: 'CREATE',
      data: {
        description: params.description.trim(),
        title: params.title.trim(),
        type: params.type
      }
    })
    return JsonParser.deserializeObject(data, GroupDM);
  }

  static async JOIN(params: {id: number, memberId: number}): Promise<GroupDM> {
    const { id } = params;
    // @ts-ignore
    const { data } = await JaguarService({
      url: `channels/${id}`,
      method: 'JOIN',
    });
    return JsonParser.deserializeObject(data, GroupDM);
  }

  static async LEAVE(params: {id: number, memberId: number}): Promise<GroupDM> {

    // @ts-ignore
    const { data } = await JaguarService({
      url: `channels/${params.id}`,
      method: 'LEAVE',
    });
    return JsonParser.deserializeObject(data, GroupDM);
  }

  static async SEARCH(params: {query: string}) {
    // @ts-ignore
    const { data } = await JaguarService({
      url: `channels`,
      method: 'SEARCH',
      params
    });
    return JsonParser.deserializeArray(data, GroupDM);
  }

}