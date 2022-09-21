import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import GroupDM from '@/datamodels/groupDM';
import store, {UserDSModule, GroupDSModule, DepartmentDSModule, UserDepartmentDSModule, UserGroupDSModule, UserDetailCSModule} from '@/store';
import DepartmentDM from '@/datamodels/departmentDM';
import { GROUP_TYPE } from '@/utils/constants';

export enum ROLES {
  COMMON_USER = "Common User",
  RESOURCE = "Resource",
  LEAD_RESOURCE = "Lead Resource",
  PROJECT_MAESTRO = "Project Maestro",
  RELEASE_MAESTRO = "Release Maestro",
  ADMIN = "Admin",
}

@Module({ name: 'userdetailcs', namespaced: true, stateFactory: true })
export class UserDetailCS extends VuexModule implements ILifeCycle {

  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  userDetail: UserDM = new UserDM();
  _userGroups: GroupDM[] = []

  memberRoles =
    [
      { id: ROLES.COMMON_USER, title: "Common User" },
      { id: ROLES.RESOURCE, title: "Resource" },
      { id: ROLES.LEAD_RESOURCE, title: "Lead Resource" },
      { id: ROLES.PROJECT_MAESTRO, title: "Project Maestro" },
      { id: ROLES.RELEASE_MAESTRO, title: "Release Maestro" },
      { id: ROLES.ADMIN, title: "Admin" }
    ]

  get groups() {
    return GroupDSModule.sortedItems('title')?.filter(group => group.type !== GROUP_TYPE.PUBLIC);
  }

  get departments() {
    const departments = DepartmentDSModule.sortedItems('name')?.filter(item => item.removedAt === '') || []
    const currentUserDepartment = UserDepartmentDSModule.items[UserDSModule.currentUser.id]?.department
    if(currentUserDepartment){
      if(departments?.some(department => department.id === currentUserDepartment.id)){
        return departments
      }else {
        return [currentUserDepartment, ...departments]
      }
    }else {
      return departments
    }
  }

  public get userDepartment() {
    return UserDepartmentDSModule.items[UserDSModule.currentUser.id] 
  }
 
  @Mutation
  setUserGroups(value) {
    this._userGroups = value;
  }
  
  get userGroups() {
    return this._userGroups
  }

  @Mutation
  setUserDetail(user: UserDM) {
    this.userDetail = user;
  }

  @Action({ rawError: true })
  async updateUserDetailFromCache() {
    this.setUserDetail(cloneDeep(UserDSModule.currentUser))
    this.setUserGroups(UserGroupDSModule.items[UserDSModule.currentUser.referenceId])
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return { selectedUserId: state.settingsds.selectedUserID, user: state.userds.itemWatch }
      },
      async function onChange(user) {
        const departments = UserDepartmentDSModule.items[user.selectedUserId];
        const referenceId = UserDSModule.itemsAsArray.find(item => item.id === user.selectedUserId)?.referenceId
        let groups
        if (referenceId) groups = UserGroupDSModule.items[referenceId]
        if (user.selectedUserId && !departments) {
          await UserDepartmentDSModule.doLoad(user.selectedUserId);
        }
        if (user.selectedUserId && !groups) {
          await UserGroupDSModule.listGroups(referenceId)
        }
        await UserDetailCSModule.updateUserDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.usergroupds.items
      },
      function onChange(items) {
        UserDetailCSModule.setUserGroups(UserGroupDSModule.items[UserDSModule.currentUser.referenceId]);
      }
    );
  }

  @Action({ rawError: true })
  async updateRoles() {
    await UserDSModule.updateRoles(this.userDetail)
  }

  @Action({ rawError: true })
  async updateGroups() {
    await UserGroupDSModule.updateGroups({groups: this.userGroups, userId: this.userDetail.referenceId})
  }

  @Action({ rawError: true })
  async updateDepartment(userDepartment: DepartmentDM) {
    if(!userDepartment) return ; 
    await UserDepartmentDSModule.update({ user: this.userDetail, department: userDepartment })
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
