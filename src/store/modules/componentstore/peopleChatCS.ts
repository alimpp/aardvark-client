import store, {ApplicationDSModule, MessageDSModule, UserDSModule, PeopleChatCSModule, PeopleRoomsCSModule, DirectDSModule} from '@/store';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {ModuleName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import ChatCS from './base/chatCS';
import {ValueOf} from '@/utils/generics';
import {CHAT_ACTIONS, CHAT_EVENTS, MESSAGE_TYPE} from '@/utils/constants';
import MessageDM from '@/datamodels/messageDM';

@Module({name:'peoplechatcs', namespaced: true, stateFactory: true})
export class PeopleChatCS extends ChatCS implements ILifeCycle{
  canShowPopupAvatar = false;
  canShowPopupViewers = false;

  constructor(module: VuexModule<ThisType<ChatCS>, ChatCS>) {
    super(module);
  }

  public get users(): UserDM[] {
    return UserDSModule.itemsAsArray;
  }

  public get roomId() {
    return ApplicationDSModule.selectedPeopleChatRoomID;
  }

  public get canMention() {
    return false;
  }

  public get headerActions() {
    return [];
  }

  public get headerInfo() {
    return {};
  }

  @Action({rawError: true})
  async getMessageType(message: MessageDM): Promise<MESSAGE_TYPE> {
    if (message?.deleted) {
      return MESSAGE_TYPE.CHAT_DELETED_MESSAGE;
    }
    if (message?.mimetype?.startsWith('image')) {
      return MESSAGE_TYPE.CHAT_IMAGE_MESSAGE;
    }
    if (message?.mimetype?.startsWith('video')) {
      return MESSAGE_TYPE.CHAT_VIDEO_MESSAGE;
    }
    if (message?.mimetype?.startsWith('audio')) {
      return MESSAGE_TYPE.CHAT_AUDIO_MESSAGE;
    }
    if (message?.attachment) {
      return MESSAGE_TYPE.CHAT_FILE_MESSAGE;
    }
    return MESSAGE_TYPE.CHAT_TEXT_MESSAGE;
  }

  @Action({rawError: true})
  setRoomId(roomId: number) {
    ApplicationDSModule.setSelectedPeopleChatRoomID(roomId);
  }

  @Action({rawError: true})
  async clear() {
    PeopleRoomsCSModule.updateRoomId(0);
  }

  @Action({rawError: true})
  async updateLatestSeenMessageId(roomID: number) {
    const direct = DirectDSModule.items[roomID];
    if(direct) this.setLatestSeenMessageInfo({[roomID]: direct.latestSeenMessageId || 0});
  }

  @Action({rawError: true})
  onHandleChatAction(data: {action: ValueOf<typeof CHAT_ACTIONS>, message: MessageDM}) {
    switch (data.action.id) {
      case CHAT_EVENTS.CHAT_EVENT_REPLY:
        PeopleChatCSModule.setReplyMessage(data.message);
        break;
      case CHAT_EVENTS.CHAT_EVENT_EDIT:
        PeopleChatCSModule.setEditMessage(data.message);
        break;
      case CHAT_EVENTS.CHAT_EVENT_DELETE:
        PeopleChatCSModule.delete(data.message.id);
        break;
      default:
        break;
    }
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedPeopleChatRoomID
      },
      function onChange(roomID) {
        if(roomID !== 0 && ApplicationDSModule.selectedModule === ModuleName.people) {
          PeopleChatCSModule.updateMessagesFromCache({roomID, messages: MessageDSModule.items[roomID]});
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.messageds.items
      },
      function onChange(messages) {
        const roomID = ApplicationDSModule.selectedPeopleChatRoomID;
        if(roomID !== 0 && ApplicationDSModule.selectedModule === ModuleName.people) {
          PeopleChatCSModule.processNextLatestSeenMessageId();
          PeopleChatCSModule.updateMessagesFromCache({roomID, messages: messages[roomID]});
        }
      }
    );
  }

  @Action({rawError: true})
  async activate() {
    if(ApplicationDSModule.selectedModule === ModuleName.people) {
      const roomID = ApplicationDSModule.selectedPeopleChatRoomID;
      await this.updateMessagesFromCache({roomID, messages: MessageDSModule.items[roomID] });
    }
  }

  @Action({rawError: true})
  async onHandleHeaderAction() {
    return;
  }

}
