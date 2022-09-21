import GroupsAPI from '@/api/groupsAPI';
import GroupDM from '@/datamodels/groupDM';
import { isEmpty } from '@/utils/object';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import { SettingsDSModule, UserGroupDSModule } from '@/store';
import {GROUP_TYPE} from '@/utils/constants';
import { Wait, WaitStates } from '@/utils/vuewait';


@Module({ name: 'groupds', namespaced: true })
export class GroupDS extends BaseItemDS<GroupDM> {

  public get currentGroup(): GroupDM {
    return this.items[SettingsDSModule.selectedGroupID] || {};
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const groups = await GroupsAPI.LIST();
      this.addOrReplaceItems(groups);
    }
  }
  
  @Action({ rawError: true })
  async listGroups(params?: { sort?: keyof GroupDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const groups = await GroupsAPI.LIST(params)
    this.addOrReplaceItems(groups)
    return groups
  }

  @Action({rawError: true})
  async chatRoomMember(data: {roomId: number}) {
    const listMember = await GroupsAPI.LIST_CHAT_ROOM_MEMBER(data);
    return listMember;
  }
    

  @Action({ rawError: true })
  async updateGroup(group: GroupDM) {
    const updatedGroup = await GroupsAPI.UPDATE({ group })
    this.addOrReplaceItem(updatedGroup)
    Object.keys(UserGroupDSModule.items).forEach(key => {
      if (UserGroupDSModule.items[key].some(group => group.id === updatedGroup.id)) {
        const currentGroups = UserGroupDSModule.items[key].map(group => group.id === updatedGroup.id ? updatedGroup : group)
        UserGroupDSModule.addOrReplaceItems({ id: key, items: currentGroups});
      }
    })
    return updatedGroup

  }

  @Action({ rawError: true })
  async deactivateGroup(groupId: number) {
    const deletedGroup = await GroupsAPI.DELETE({ groupId });
    this.addOrReplaceItem(deletedGroup);
    return deletedGroup
  }

  @Action({ rawError: true })
  async create(params: { title: string, description: string, type: GROUP_TYPE }) {
    const group = await GroupsAPI.CREATE({title: params.title, description: params.description, type: params.type});
    SettingsDSModule.setNewGroupId(group.id)
    this.addOrReplaceItem(group);
    return group
  }

  @Action({rawError: true})
  async search(data: {query}) {
    const groups = await GroupsAPI.SEARCH(data);
    return groups;
  }

  @Action({rawError: true})
  async join(data: {id: number, memberId: number}) {
    const group = await GroupsAPI.JOIN(data);
    return group;
  }

  @Action({rawError: true})
  async leave(data: {id: number, memberId: number}) {
    const group = await GroupsAPI.LEAVE(data);
    return group;
  }

}
