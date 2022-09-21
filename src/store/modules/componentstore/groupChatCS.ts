import store, {ApplicationDSModule, MessageDSModule, UserDSModule, GroupChatCSModule, GroupDetailsDSModule, GroupDSModule, ProfileDSModule, GroupRoomsCSModule, ChatRoomMemberDSModule} from '@/store';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {ModuleName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import ChatCS from './base/chatCS';
import {CHAT_ACTIONS, CHAT_EVENTS, GROUP_ACTIONS, GROUP_EVENTS, GROUP_TYPE, MESSAGE_TYPE, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import {ValueOf} from '@/utils/generics';
import MessageDM from '@/datamodels/messageDM';
import {utcToLocalDateFormat} from '@/utils/date';

@Module({name:'groupchatcs', namespaced: true, stateFactory: true})
export class GroupChatCS extends ChatCS implements ILifeCycle{
  _mentionableUsers: UserDM[] = [] ;

  constructor(module: VuexModule<ThisType<ChatCS>, ChatCS>) {
    super(module);
  }

  public get users(): UserDM[] {
    return UserDSModule.itemsAsArray;
  }

  public get mentionableUsers(): UserDM[] {
    return this._mentionableUsers;
  }

  public get roomId() {
    return ApplicationDSModule.selectedGroupChatRoomID
  }

  public get readOnlyData() {
    const group = GroupDetailsDSModule.itemsAsArray.find(group => group.publicRoomId === this.roomId || group.privateRoomId === this.roomId);
    if(!group) return { isReadOnly: false, message: '' }
    return {
      isReadOnly: !!group.removedAt,
      message: `Archived on ${utcToLocalDateFormat(group.removedAt || '')}`
    };
  }

  public get headerActions() {
    const msgActions: ValueOf<typeof GROUP_ACTIONS>[] = [];
    const isGroupPublic = GroupDetailsDSModule.itemsAsArray.some(group => group.publicRoomId === this.roomId && (group.type === GROUP_TYPE.PUBLIC || (group.type === GROUP_TYPE.BOTH && !group.isSubscribedPrivate)));
    if(isGroupPublic) msgActions.push(GROUP_ACTIONS.LEAVE)
    return msgActions;
  }

  public get headerInfo() {
    const group = GroupDetailsDSModule.itemsAsArray.find(group => group.publicRoomId === this.roomId || group.privateRoomId === this.roomId);
    if(group) return { title: group.title };
    return {};
  }

  @Action({rawError: true})
	async leaveGroup(data: {id: number, memberId: number}) {
		await GroupDSModule.leave(data);
    this.setRoomId(0);
		await GroupDetailsDSModule.removeItemById(data.id);
    GroupRoomsCSModule.setCurrentGroupId(0);
    await GroupRoomsCSModule.updateGroupDetailsFromCache();
	}

  @Action({rawError: true})
  async onHandleHeaderAction(data: {action: ValueOf<typeof GROUP_ACTIONS>}) {
    const group = GroupDetailsDSModule.itemsAsArray.find(group => group.publicRoomId === this.roomId || group.privateRoomId === this.roomId);
    switch (data.action.id) {
      case GROUP_EVENTS.LEAVE:
        if(group) this.leaveGroup({id: group.id, memberId: ProfileDSModule.identifier});
        break;
      default:
        break;
    }
  }

  @Action({rawError: true})
  async getMessageType(message: MessageDM): Promise<MESSAGE_TYPE> {
    if (message?.deleted) {
      return MESSAGE_TYPE.CHAT_DELETED_MESSAGE;
    }
    if (message?.mimetype?.startsWith('image')) {
      return MESSAGE_TYPE.CHAT_IMAGE_MESSAGE;
    }
    if (message.mimetype?.startsWith("video")) {
      return MESSAGE_TYPE.CHAT_VIDEO_MESSAGE;
    }
    if (message?.mimetype?.startsWith("audio")) {
      return MESSAGE_TYPE.CHAT_AUDIO_MESSAGE;
    }
    if (message?.attachment) {
      return MESSAGE_TYPE.CHAT_FILE_MESSAGE;
    }
    return MESSAGE_TYPE.CHAT_TEXT_MESSAGE;
  }

  @Mutation
  setMentionableUsers(users: UserDM[]) {
    this._mentionableUsers = users ;
  }

  @Action({rawError: true})
  async updateLatestSeenMessageId(roomID: number) {
    const group = GroupDetailsDSModule.itemsAsArray.find(group => group.privateRoomId === roomID || group.publicRoomId === roomID);
    if(group) {
      this.setLatestSeenMessageInfo({
        [group.privateRoomId]: group.privateLatestSeenMessageId || 0,
        [group.publicRoomId]: group.publicLatestSeenMessageId || 0,
      });
    }
  }

  @Action({rawError: true})
  async loadMentionableUsers() {
    const roomId = ApplicationDSModule.selectedGroupChatRoomID;
    this.setMentionableUsers([]);
    let users: UserDM[] = [] ;
    const room = GroupRoomsCSModule.rooms?.find(room => room?.privateRoomId === roomId);
    if(room ) {
      users = await ChatRoomMemberDSModule.doLoad({force: false, roomId: roomId})
    }else {
      users =  UserDSModule.itemsAsArray;
    }
    this.setMentionableUsers(users);
  }

  @Action({rawError: true})
  setRoomId(roomId: number) {
    ApplicationDSModule.setSelectedGroupChatRoomID(roomId);
    ApplicationDSModule.setSelectedMediaRoomID(roomId)
    ApplicationDSModule.setSelectedDocumentRoomID(roomId)
    ApplicationDSModule.setSelectedLinkRoomID(roomId)
  }

  @Action({rawError: true})
  async clear() {
    this.setChatTabs({tabs: []});
    this.setMentionableUsers([]);
    GroupRoomsCSModule.updateRoomId(0);
    GroupRoomsCSModule.setCurrentGroupId(0);
  }

  @Action({rawError: true})
  onHandleChatAction(data: {action: ValueOf<typeof CHAT_ACTIONS>, message: MessageDM}) {
    switch (data.action.id) {
      case CHAT_EVENTS.CHAT_EVENT_REPLY:
        GroupChatCSModule.setReplyMessage(data.message);
        break;
      case CHAT_EVENTS.CHAT_EVENT_EDIT:
        GroupChatCSModule.setEditMessage(data.message);
        break;
      case CHAT_EVENTS.CHAT_EVENT_DELETE:
        GroupChatCSModule.delete(data.message.id);
        break;
      default:
        break;
    }
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedGroupChatRoomID
      },
      async function onChange(newValue, oldValue) {
        if (ApplicationDSModule.selectedModule === ModuleName.groups) {
          GroupChatCSModule.resetUnreadBadgeCount(oldValue)
          await GroupChatCSModule.updateMessagesFromCache({roomID: newValue, messages: MessageDSModule.items[newValue]});
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.messageds.items
      },
      async function onChange(messages) {
        const roomID = ApplicationDSModule.selectedGroupChatRoomID;
        if(roomID !== 0 && ApplicationDSModule.selectedModule === ModuleName.groups) {
          GroupChatCSModule.processNextLatestSeenMessageId();
          await GroupChatCSModule.updateMessagesFromCache({roomID, messages: messages[roomID]});
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
          return state.jaguarsocketds.newMessage
      },
      function onChange(message) {
        const roomID = ApplicationDSModule.selectedGroupChatRoomID;
          if(message.subscribableType === SUBSCRIBABLE_TYPE.CHANNEL  && !message.isMine && roomID !== message.roomId){
            GroupChatCSModule.updateRoomTabBadgeCount(message);
          }
      }
    );
  }

  @Action({rawError: true})
  async activate() {
    if(ApplicationDSModule.selectedModule === ModuleName.groups) {
      const roomID = ApplicationDSModule.selectedGroupChatRoomID;
      await this.updateMessagesFromCache({roomID, messages: MessageDSModule.items[roomID] });
    }
  }

}
