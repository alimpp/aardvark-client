import { Action, Module, VuexModule } from "vuex-module-decorators";
import BaseItemsDS from './base/baseItemsDS';
import { Wait, WaitStates } from '@/utils/vuewait';
import GroupsAPI from "@/api/groupsAPI";
import UserDM from "@/datamodels/userDM";

@Module({ name: "chatroommemberds", namespaced: true, stateFactory: true})
export class ChatRoomMemberDS extends BaseItemsDS<UserDM> implements IChatRoomMemberDS {

    constructor(module: VuexModule<ThisType<UserDM>, UserDM>) {
        super(module);
    }
    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_CHANNEL_MEMBER_LOADING)
    // @ts-ignore 
    async doLoad(data: {force: boolean, roomId: number}) {
      if (data.roomId) {
        if ( data.force || !this.items[data.roomId]){
          const members = await GroupsAPI.LIST_CHAT_ROOM_MEMBER({roomId: data.roomId});
          this.addOrReplaceItem({id: data.roomId, items: members})
          return members
        }else {
          return this.items[data.roomId] ;
        }
      }
      return [] ;
    }
}

export interface IChatRoomMemberDS {
  items: { [key: number]: UserDM[] }
}