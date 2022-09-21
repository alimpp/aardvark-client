import UserAPI from "@/api/userAPI"
import MembersAPI from "@/api/membersAPI"
import UserDM from "@/datamodels/userDM"
import { isEmpty } from "@/utils/object"
import { Action, Module } from "vuex-module-decorators"
import BaseItemDS from './base/baseItemDS';
import {SettingsDSModule, ProfileDSModule, MessageDSModule, UserDSModule} from '@/store';
import { APPLICATION_ID, SCOPES } from "@/settings";
import store, { ApplicationDSModule } from "@/store"
import { Wait, WaitStates } from '@/utils/vuewait';
import MemberDM from "@/datamodels/memberDM";

@Module({ name: "userds", namespaced: true })
export class UserDS extends BaseItemDS<UserDM> {

  public get users() {
    return this.items;
  }

  public get currentUser(): UserDM {
    return this.items[SettingsDSModule.selectedUserID] || {};
  }

  public get me() {
    return this.itemsAsArray.find(user => user.id === ProfileDSModule.identifier)
  }

  @Action({ rawError: true })
  async UpdateProfile(member: UserDM) {
    const roomID = ApplicationDSModule.selectedEntityChatRoomID
    const updatedMember = await MembersAPI.UPDATE({member})
    const currentUser = this.itemsAsArray.find(item => item.referenceId === updatedMember.id)
    if (currentUser) {
      currentUser.lastName = updatedMember.lastName
      currentUser.firstName = updatedMember.firstName
      currentUser.countryCode = updatedMember.countryCode
      currentUser.phone = parseInt(updatedMember.phone)
      currentUser.birth = updatedMember.birthdate
      ProfileDSModule.setUpdateFullName(updatedMember.fullName);
      if(ApplicationDSModule.selectedEntityChatRoomID) {
        MessageDSModule.doLoad({force: true, id: roomID});
      }
      this.addOrReplaceItem(currentUser)
    }
  }

  @Action({ rawError: true })
  async UpdateAvatar(image: string): Promise<MemberDM> {
    const roomID = ApplicationDSModule.selectedEntityChatRoomID
    const id = ProfileDSModule.id
    const updatedMember = await MembersAPI.UPDATE_AVATAR({id, image})
    const currentUser = this.itemsAsArray.find(item => item.referenceId === updatedMember.id)
    if (currentUser) {
      currentUser.profileUrl = updatedMember.profileUrl
      ProfileDSModule.setProfileUrl(updatedMember.profileUrl);
      if(ApplicationDSModule.selectedEntityChatRoomID) {
        MessageDSModule.doLoad({force: true, id: roomID});
      }
      this.addOrReplaceItem(currentUser)
    }
    return updatedMember
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_USER_LOADING)
  async listUsers(params?: { sort?: keyof UserDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const users = await UserAPI.LIST(params)
    this.addOrReplaceItems(users)
    return users
  }

  @Action({ rawError: true })
  async updateRoles(user: UserDM) {
    const newRoles = user.organizationRoles
    const previousRoles = this.currentUser.organizationRoles
    if (JSON.stringify(newRoles) !== JSON.stringify(previousRoles)) {
      const removedRoles: string[] = previousRoles.filter(role => !newRoles.includes(role));
      const addedRoles: string[] = newRoles.filter(role => !previousRoles.includes(role));
      const updatedUser = await UserAPI.UPDATE_ROLES({user, addedRoles, removedRoles})
      this.addOrReplaceItems(updatedUser)
      return updatedUser
    }
  }

  @Action({ rawError: true })
  async invite(email: string) {
    const params = {
      email: email,
      role: 'Resource',
      scopes: SCOPES.join(','),
      applicationId: APPLICATION_ID,
      redirectUri: window.location.origin
    }
    await UserAPI.INVITE(params);
  }

  @Action({ rawError: true })
  async kick(userId: number): Promise<UserDM> {
    const user = await UserAPI.KICK({userId});
    this.addOrReplaceItem(user);
    return user;
  }

  @Action({ rawError: true })
  async unkick(userId: number): Promise<UserDM> {
    const user = await UserAPI.UNKICK({userId});
    this.addOrReplaceItem(user);
    return user;
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.users)) {
      const users = await UserAPI.LIST();
      this.addOrReplaceItems(users)
    }
  }

  @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.user
            },
            function onChange(socketUser) {
                if(socketUser.user && socketUser.user?.id !== 0) {
                  UserDSModule.addOrReplaceItem(socketUser.user) 
                }
            }
        );
    }

}
