import GroupDetailsAPI from '@/api/groupDetailsAPI';
import MessageAPI from '@/api/messageAPI';
import GroupDetailDM from '@/datamodels/groupDetailDM';
import MessageDM from '@/datamodels/messageDM';
import store, {ApplicationDSModule, BadgeCountCSModule, GroupDetailsDSModule, ProfileDSModule} from '@/store';
import {DEBOUNCE, SOCKET_EVENTS, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import {Wait, WaitStates} from '@/utils/vuewait';
import {debounce} from '@/utils/debounce';
import {Action, Module} from 'vuex-module-decorators'
import {ModuleName} from './applicationDS';
import BaseItemDS from './base/baseItemDS';

@Module({name: 'groupdetailsds', namespaced: true})
export class GroupDetailsDS extends BaseItemDS<GroupDetailDM> {

  @Action({rawError: true})
  async fetch(data: {skip: number, take: number, sort: string, filters?: {[key: string]: string}} = {take: 20, skip: 0, sort: '-recentMessageAt'}) {
    const {skip, take, sort, filters} = data;
    const groupDetails = await GroupDetailsAPI.LIST({skip, take, sort, filters});
    await this.addOrReplaceItems(groupDetails);
    return groupDetails;
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_GROUPDETAILS_LOADING)
  async doLoad() {
    return await this.fetch();
  }

  @Action({rawError: true})
  async getGroupDetailByMessage(message: MessageDM): Promise<GroupDetailDM | undefined> {
    if (!message)  return undefined;
    return this.itemsAsArray.find(group => group.publicRoomId === message.roomId || group.privateRoomId === message.roomId);
  }

  @Action({rawError: true})
  async getRoomUnreadCount(roomId: number) {
    const { data: { 0: {count} } }: {data: {0: {count: number}}} = await MessageAPI.PATCH(({data: [
      { path: `rooms/${roomId}/messages/counts?unread=True`, op: 'get', value: null }
    ]}))
    return count;
  }


  @Action({ rawError: true })
  async updateSeenAt(message: MessageDM): Promise<void> {
    const group: GroupDetailDM | undefined = await this.getGroupDetailByMessage(message);
    if (group) {
      if (group.privateRoomId === message.roomId) {
        group.privateSeenAt = message.seenAt;
      } else if (group.publicRoomId === message.roomId) {
        group.publicSeenAt = message.seenAt;
      }
      this.addOrReplaceItem(group);
    }
  }

  @Action({rawError: true})
  async updateLastSeenMessageIdByMessage(message: MessageDM) {
    const group = await this.getGroupDetailByMessage(message);
    if(group) {
      if(group.privateRoomId === message.roomId) {
        group.privateLatestSeenMessageId = message.id;
      } else if (group.publicRoomId === message.roomId) {
        group.publicLatestSeenMessageId = message.id;
      }
      this.addOrReplaceItem(group);
    }
  }

  @Action({rawError: true})
  async updateLatestMessage(message: MessageDM){
    const group = await this.getGroupDetailByMessage(message);
    if(!group) return;
    if(group.privateRoom) {
      if(message.deleted || !!message.modifiedAt){
        if(group.privateRoom.latestMessageId === message.id){
          group.privateRoom.latestMessage = message;
        }
      } else if(group.privateRoomId === message.roomId){
        group.privateRoom.latestMessage = message;
        group.privateRoom.latestMessageId = message.id;
      }
    }
    if(group.publicRoom) {
      if(message.deleted || !!message.modifiedAt){
        if(group.publicRoom.latestMessageId === message.id){
          group.publicRoom.latestMessage = message;
        }
      }else if(group.publicRoomId === message.roomId){
        group.publicRoom.latestMessageId = message.id;
        group.publicRoom.latestMessage = message;
      }
    }
    this.addOrReplaceItem(group)
  }

  @Action({rawError: true})
  async updateChannelBadgeCountBySeenMessage(message: MessageDM) {
    const group = GroupDetailsDSModule.itemsAsArray.find(group => group.publicRoomId === message.roomId || group.privateRoomId === message.roomId);
    if(!group) return;

    const room = group.privateRoomId === message.roomId ? group.privateRoom : group.publicRoom;
    if(!room) return;

    if(room.latestMessageId === message.roomId) {
      BadgeCountCSModule.setGroupsUnread(BadgeCountCSModule.groupsUnread - Number(room.unreadCount));
      room.unreadCount = 0;
    } else {
      debounce(
        DEBOUNCE.GROUP_DEAILSDS_UPDATE_CHANNEL_BADGE_COUNT_BY_SEEN_MESSAGE,
        async() => {
          if(group.isSubscribedPrivate && group.privateRoom) group.privateRoom.unreadCount = await GroupDetailsDSModule.getRoomUnreadCount(group.privateRoomId);
          if(group.isSubscribedPublic && group.publicRoom) group.publicRoom.unreadCount = await GroupDetailsDSModule.getRoomUnreadCount(group.publicRoomId);
          BadgeCountCSModule.loadMessages();
          GroupDetailsDSModule.addOrReplaceItem(group);
        },
        3000);
    }
  }

  @Action({rawError: true})
  async updateBadgeCount(message: MessageDM) {
    const currentGroupChatRoomID = ApplicationDSModule.selectedGroupChatRoomID;
    const group = await this.getGroupDetailByMessage(message);
    if(!group) return;
    const isOwnMessage = message.senderId === ProfileDSModule?.id;
    const isViewingRoom = currentGroupChatRoomID === message.roomId;
    group.recentMessageAt = message.createdAt;
    if(!isOwnMessage && !isViewingRoom) {
      if(group.privateRoom && group.privateRoomId === message.roomId) {
        group.privateRoom.unreadCount = Number(group.privateRoom.unreadCount) + 1;
      } else if(group.publicRoom && group.publicRoomId === message.roomId) {
        group.publicRoom.unreadCount = Number(group.publicRoom.unreadCount) + 1;
      }
      BadgeCountCSModule.setGroupsUnread(BadgeCountCSModule.groupsUnread + 1);
    }
    this.addOrReplaceItem(group);
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.newMessage
      },
      async function onChange(message) {
        if (message.subscribableType !== SUBSCRIBABLE_TYPE.CHANNEL || !message.id) return;
        await GroupDetailsDSModule.updateSeenAt(message);
        GroupDetailsDSModule.updateLatestMessage(message);
        GroupDetailsDSModule.updateBadgeCount(message);
        if(message.isMine) GroupDetailsDSModule.updateLastSeenMessageIdByMessage(message);
      }
    );

    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.editMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.CHANNEL) return;
        GroupDetailsDSModule.updateLatestMessage(message)
      }
    );

    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.deleteMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.CHANNEL) return;
        GroupDetailsDSModule.updateLatestMessage(message)
      }
    );

    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      async function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.CHANNEL) return;

        if(message?.seenByMemberReferenceId === ProfileDSModule?.id) {
          GroupDetailsDSModule.updateChannelBadgeCountBySeenMessage(message);
          GroupDetailsDSModule.updateLastSeenMessageIdByMessage(message);
          GroupDetailsDSModule.updateSeenAt(message);
        }

      }
    );

    store.watch(
      function stateToWatch(state) {
        return state.applicationds.jaguarSocket
      },
      async function onChange(socket) {
        if(socket && socket.registerEventCallback) {
          socket.registerEventCallback({
            event: SOCKET_EVENTS.RECONNECT,
            callback: async() => {
              if(ApplicationDSModule.selectedModule === ModuleName.groups) {
                // Fetch latest rooms
                const currentRoomId = ApplicationDSModule.selectedGroupChatRoomID;
                const groups = await GroupDetailsDSModule.fetch();

                // If user is currently in a room, decrement badgecounts for that room
                if(currentRoomId) {
                  let unread = 0;
                  for (const group of groups) {
                    if(group.privateRoomId === currentRoomId) {
                      unread = group.privateRoom?.unreadCount || 0;
                      break;
                    } else if (group.publicRoomId === currentRoomId) {
                      unread = group.publicRoom?.unreadCount || 0;
                      break;
                    }
                  }
                  BadgeCountCSModule.setGroupsUnread(BadgeCountCSModule.groupsUnread - unread);
                }
              }
            }
          });
        }
      }
    );

  }

}
