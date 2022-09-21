import store, {ApplicationDSModule, MessageDSModule, UserDSModule, EntityChatCSModule, ProfileDSModule, ProjectDSModule, JaguarSocketDSModule} from '@/store';
import { Action, Module, VuexModule } from 'vuex-module-decorators'
import {DetailTabName, EntityType} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import ChatCS from './base/chatCS';
import {ValueOf} from '@/utils/generics';
import {CHAT_ACTIONS, CHAT_EVENTS, CHAT_LABEL_TYPE, MESSAGE_MIMETYPE, MESSAGE_TYPE, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import MessageDM from '@/datamodels/messageDM';
import MessageAPI from '@/api/messageAPI';
import {Roles}  from "@/store/modules/datastore/permissionDS";

@Module({name:'entitychatcs', namespaced: true, stateFactory: true})
export class EntityChatCS extends ChatCS implements ILifeCycle {

    constructor(module: VuexModule<ThisType<ChatCS>, ChatCS>) {
        super(module);
    }

    get isChatActive() {
        return ApplicationDSModule.selectedDetailTab === DetailTabName.chat || ApplicationDSModule.chatSidebarOpen
    }

    public get readOnlyData() {
        const data = {isReadOnly: false, message: ''};
        if(ApplicationDSModule.selectedEntityType === EntityType.sprint) {
            const isMaestro = ProfileDSModule.isProjectMaestro && (ProjectDSModule.currentProject.isProjectMaestro || ProjectDSModule.currentProject.isSecondaryMaestro)
            data.isReadOnly = !isMaestro;
            data.message = 'Sprint chat is read-only';
        }
        return data;
    }

    get roomId() {
        return ApplicationDSModule.selectedEntityChatRoomID
    }

    public get users(): UserDM[] {
        if(this.tabs.find(tab=> tab.id === this.roomId)?.label === CHAT_LABEL_TYPE.PRIVATE){
            return UserDSModule.itemsAsArray.filter(user=> user.organizationRoles.includes(Roles.RESOURCE) );
        }
        return UserDSModule.itemsAsArray;
    }

    public get mentionableUsers(): UserDM[] {
        return this.users;
    }

    get canMention() {
        const currentTab = this.tabs.find(tab => tab.id === this.roomId);
        if(currentTab?.disableMention) return false;
        return true;
    }

    public get headerActions() {
        return [];
    }

    public get headerInfo() {
        return {};
    }

    @Action({rawError: true})
    async updateLatestSeenMessageId(entity) {
        if(entity) {
            this.setLatestSeenMessageInfo({
                [entity.privateRoomId]: entity.privateLatestSeenMessageId || 0,
                [entity.publicRoomId]: entity.publicLatestSeenMessageId || 0,
            });
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
        if (message?.mimetype?.startsWith('video')) {
            return MESSAGE_TYPE.CHAT_VIDEO_MESSAGE;
        }
        if (message?.mimetype?.startsWith('audio')) {
            return MESSAGE_TYPE.CHAT_AUDIO_MESSAGE;
        }
        if (message?.mimetype === MESSAGE_MIMETYPE.AUDIT) {
            return MESSAGE_TYPE.CHAT_AUDIT_MESSAGE;
        }
        if (message?.attachment) {
            return MESSAGE_TYPE.CHAT_FILE_MESSAGE;
        }
        return MESSAGE_TYPE.CHAT_TEXT_MESSAGE;
    }

    @Action({rawError: true})
    setRoomId(roomId: number) {
        ApplicationDSModule.setSelectedEntityChatRoomID(roomId);
        ApplicationDSModule.setSelectedMediaRoomID(roomId);
        ApplicationDSModule.setSelectedDocumentRoomID(roomId);
        ApplicationDSModule.setSelectedLinkRoomID(roomId);
    }

    @Action({rawError: true})
    onHandleChatAction(data: {action: ValueOf<typeof CHAT_ACTIONS>, message: MessageDM}) {
        switch (data.action.id) {
            case CHAT_EVENTS.CHAT_EVENT_REPLY:
              EntityChatCSModule.setReplyMessage(data.message);
              break;
            case CHAT_EVENTS.CHAT_EVENT_EDIT:
            EntityChatCSModule.setEditMessage(data.message);
              break;
            case CHAT_EVENTS.CHAT_EVENT_DELETE:
            EntityChatCSModule.delete(data.message.id);
              break;
            default:
              break;
        }
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.chatSidebarOpen
            },
            function onChange(isOpen) {
                const roomID = ApplicationDSModule.selectedEntityChatRoomID;
                if(isOpen){
                    EntityChatCSModule.updateMessagesFromCache({roomID, messages: MessageDSModule.items[roomID]});
                    if(ApplicationDSModule.selectedEntity?.publicRoomId === roomID  && !ApplicationDSModule.selectedEntity?.isSubscribedPublic) {
                        JaguarSocketDSModule.subscribe(roomID)
                    }
                }

            }
        );
        store.watch(
            function stateToWatch(state, getter) {
                return {roomID: state.applicationds.selectedEntityChatRoomID, selectedEntity: getter['applicationds/selectedEntity']}
            },
            async function onChange(newValue, oldValue) {
                await EntityChatCSModule.updateMessagesFromCache({roomID: newValue.roomID, messages: MessageDSModule.items[newValue.roomID]});
                if (oldValue.roomID !== newValue.roomID && oldValue.roomID !== 0) {
                    await EntityChatCSModule.resetUnreadBadgeCount(oldValue.roomID)
                }
                if(!newValue.selectedEntity && oldValue.selectedEntity && oldValue.roomID === oldValue.selectedEntity?.publicRoomId) {
                    JaguarSocketDSModule.unSubscribe(oldValue.roomID)
                }
                if(newValue.selectedEntity) {
                    if(EntityChatCSModule.isChatActive && newValue.roomID !== newValue.selectedEntity.publicRoomId && oldValue.roomID === oldValue.selectedEntity?.publicRoomId) {
                        JaguarSocketDSModule.unSubscribe(oldValue.roomID)
                    }

                    if(EntityChatCSModule.isChatActive && oldValue.roomID !== newValue.roomID && newValue.selectedEntity?.publicRoomId === newValue.roomID  && !ApplicationDSModule.selectedEntity?.isSubscribedPublic) {
                        JaguarSocketDSModule.subscribe(newValue.roomID)
                    }
                }
            },
        );
        store.watch(
            function stateToWatch(state) {
                return state.messageds.items
            },
            async function onChange(messages) {
                const roomID = ApplicationDSModule.selectedEntityChatRoomID;
                if(roomID !== 0 && ApplicationDSModule.selectedDetailTab === DetailTabName.chat || ApplicationDSModule.chatSidebarOpen) {
                    EntityChatCSModule.processNextLatestSeenMessageId();
                    await EntityChatCSModule.updateMessagesFromCache({roomID, messages: messages[roomID]});
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.newMessage
            },
            function onChange(message) {
                const roomID = ApplicationDSModule.selectedEntityChatRoomID;
                if(message.subscribableType === SUBSCRIBABLE_TYPE.NUGGET  && !message.isMine && roomID !== message.roomId){
                    EntityChatCSModule.updateRoomTabBadgeCount(message);
                }
            }
        );
    }



    @Action({rawError: true})
    async activate() {
        if(ApplicationDSModule.selectedDetailTab === DetailTabName.chat || ApplicationDSModule.chatSidebarOpen) {
            const roomID = ApplicationDSModule.selectedEntityChatRoomID;
            this.processNextLatestSeenMessageId();
            await this.updateMessagesFromCache({roomID, messages: MessageDSModule.items[roomID] });
            if(ApplicationDSModule.selectedEntity?.publicRoomId === roomID  && !ApplicationDSModule.selectedEntity?.isSubscribedPublic) {
                JaguarSocketDSModule.subscribe(roomID)
            }
        }
    }

    @Action({rawError: true})
    async onHandleHeaderAction() {
      return;
    }

  @Action({rawError: true})
  async loadBadgeCountPrivatePublic(tabs) {

    let PrivateId: number | string = 0 ;
    let PublicId: number | string  = 0 ;
    for(let i=0 ; i < tabs.length ; i++){
        if (tabs[i].label === CHAT_LABEL_TYPE.PRIVATE ){
          PrivateId = tabs[i].id ;
        }else  if (tabs[i].label === CHAT_LABEL_TYPE.PUBLIC) {
          PublicId = tabs[i].id ;
        }
      }
    const { data } = await MessageAPI.PATCH(({data: [
        { path: `rooms/${PrivateId}/messages/counts?unread=True`, op: 'get', value: null },
        { path: `rooms/${PublicId}/messages/counts?unread=True`, op: 'get', value: null },
    ]}))
    tabs[0].highBadgeCount = data[0].count;
    tabs[1].highBadgeCount = data[1].count;

    if(JSON.stringify(this.tabs) === JSON.stringify(tabs) ){
        this.setChatTabs({tabs});
    }

  }
}
