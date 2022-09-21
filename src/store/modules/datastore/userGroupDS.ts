import GroupDM from '@/datamodels/groupDM';
import UserAPI from "@/api/userAPI"
import { AccountDSModule } from "@/store"
import { Action, Module, VuexModule } from "vuex-module-decorators"
import BaseItemsDS from "./base/baseItemsDS"
import { Wait, WaitStates } from "@/utils/vuewait"
import { GROUP_TYPE } from '@/utils/constants';
import UserGroupAPI from "@/api/userGroupAPI"

@Module({ name: "usergroupds", namespaced: true, stateFactory: true })
export class UserGroupDS extends BaseItemsDS<GroupDM> implements IUserGroupsDS {
  constructor(module: VuexModule<ThisType<GroupDM>, GroupDM>) {
    super(module)
  }

  @Action({ rawError: true })
  async doLoad() {
    return
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_USER_LOADING)
  async updateGroups(params: {groups: GroupDM[], userId: number}) {
    const newGroupsIds = params.groups?.filter(group => group.organizationId === AccountDSModule.selectedAccount.id && group.type !== GROUP_TYPE.PUBLIC).map(group => group.id);
    const previousGroupsIds = this.items[params.userId]?.filter(group => group.organizationId === AccountDSModule.selectedAccount.id && group.type !== GROUP_TYPE.PUBLIC).map(group => group.id);
    if (JSON.stringify(newGroupsIds) !== JSON.stringify(previousGroupsIds)) {
      const addedGroups: number[] = newGroupsIds?.filter(id => !previousGroupsIds.includes(id));
      const removedGroups: number[] = previousGroupsIds?.filter(id => !newGroupsIds.includes(id));
      const groups = await UserAPI.UPDATE_GROUPS(params.userId, addedGroups , removedGroups);
      const currentGroups = [...this.items[params.userId]];
      groups.forEach(response =>{
        const index = currentGroups.findIndex(group => group.id === response.id);
        if (index !== -1) {
          currentGroups.splice(index, 1)
        }else {
          currentGroups.push(response) ;
        }
      });
      this.addOrReplaceItem({ id: params.userId, items: currentGroups })
    }
  }

  @Action({ rawError: true })
  async listGroups(userId) {
    if (userId) {
      const groups = await UserGroupAPI.LIST({ userId: userId })
      this.addOrReplaceItem({ id: userId, items: groups })
      return groups
    }
  }
}

export interface IUserGroupsDS {
  items: { [key: number]: GroupDM[] }
}
