import DirectAPI from '@/api/directAPI';
import MessageAPI from '@/api/messageAPI';
import DirectDM from '@/datamodels/directDM';
import MessageDM from '@/datamodels/messageDM';
import store, {ApplicationDSModule, BadgeCountCSModule, DirectDSModule, MessageDSModule, ProfileDSModule} from '@/store';
import {DEBOUNCE, SOCKET_EVENTS, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import {debounce} from '@/utils/debounce';
import {Wait, WaitStates} from '@/utils/vuewait';
import {Action, Module} from 'vuex-module-decorators'
import {ModuleName} from './applicationDS';
import BaseItemDS from './base/baseItemDS';

@Module({name: 'directds', namespaced: true})
export class DirectDS extends BaseItemDS<DirectDM> {

  @Action({rawError: true})
  async create(userReferenceId: number) {
    const direct = await DirectAPI.CREATE({userReferenceId});
    this.addOrReplaceItem(direct);
  }

  @Action({rawError: true})
  async fetch(data: {skip: number, take: number} = {take: 20, skip: 0}) {
    const {skip, take} = data;
    const directs = await DirectAPI.LIST({skip, take, sort: '-autoModifiedAt'});
    this.addOrReplaceItems(directs);
    directs.forEach(direct => {
      if(direct._latestMessage) {
        MessageDSModule.processMessage(direct._latestMessage)
      }
    })
    return directs;
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_ROOM_LOADING)
  async doLoad() {
    // if (isEmpty(this.items)) {
      return await this.fetch();
    // }
  }

  @Action({rawError: true})
  async getRoomUnreadCount(roomId: number) {
    const { data: { 0: {count} } }: {data: {0: {count: number}}} = await MessageAPI.PATCH(({data: [
      { path: `rooms/${roomId}/messages/counts?unread=True`, op: 'get', value: null }
    ]}))
    return count;
  }

  @Action({rawError: true})
  async updateLastSeenMessageIdByMessage(message: MessageDM) {
    const direct: DirectDM | undefined = DirectDSModule.items[message.roomId];
    if(direct) {
      direct.latestSeenMessageId = message.id;
      this.addOrReplaceItem(direct);
    }
  }


  @Action({rawError: true})
  async updateDirectBadgeCountBySeenMessage(message: MessageDM) {
    const direct: DirectDM | undefined = DirectDSModule.items[message.roomId];
    if(direct) {
      if(direct.latestMessageId === message.id) {
        BadgeCountCSModule.setPeopleUnread(BadgeCountCSModule.peopleUnread - Number(direct.unreadCount));
        direct.unreadCount = 0;
        DirectDSModule.addOrReplaceItem(direct);
      } else {
        debounce(
        DEBOUNCE.DIRECTDS_UPDATE_DIRECT_BADGE_COUNT_BY_SEEN_MESSAGE,
          async() => {
            await BadgeCountCSModule.loadMessages();
            direct.unreadCount = await DirectDSModule.getRoomUnreadCount(message.roomId);
            DirectDSModule.addOrReplaceItem(direct);
          },
          3000);
      }
    }
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.newMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.DIRECT) return;

        if(message.isMine) {
          DirectDSModule.updateLastSeenMessageIdByMessage(message);
        }

        // TODO: Move this to a function
        if(message.isMine) return;
        const direct: DirectDM | undefined = DirectDSModule.items[message.roomId];
        if(direct && (ApplicationDSModule.selectedModule !== ModuleName.people || ApplicationDSModule.selectedPeopleChatRoomID !== message.roomId)) {
          direct.unreadCount = Number(direct.unreadCount) + 1;
          direct._latestMessage = message;
          direct.latestMessageId = message.id;
          DirectDSModule.addOrReplaceItem(direct);
          BadgeCountCSModule.setPeopleUnread(BadgeCountCSModule.peopleUnread + 1);
        }
      }
    );

    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      async function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.DIRECT) return;

        if(message.seenByMemberReferenceId === ProfileDSModule?.id) {
          DirectDSModule.updateLastSeenMessageIdByMessage(message);
          DirectDSModule.updateDirectBadgeCountBySeenMessage(message);
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
              if(ApplicationDSModule.selectedModule === ModuleName.people) {
                // Fetch latest rooms
                const currentRoomId = ApplicationDSModule.selectedPeopleChatRoomID;
                const directs = await DirectDSModule.fetch();

                // If user is currently in a room, decrement badgecounts for that room
                if(currentRoomId) {
                  const direct = directs.find(direct => direct.id === currentRoomId);
                  BadgeCountCSModule.setPeopleUnread(BadgeCountCSModule.peopleUnread - (direct?.unreadCount || 0));
                }
              }
            }
          });
        }
      }
    );

  }

}
