import store, {ApplicationDSModule, AttachmentMediaCSModule, AttachmentMediaDSModule, UserDSModule} from '@/store';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {ModuleName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import MessageDM from '@/datamodels/messageDM';
import UserDM from '@/datamodels/userDM';
import ChatCS from './base/chatCS';
import {ATTACHMENT_MEDIA_LOCALE, MESSAGE_TYPE} from '@/utils/constants';

@Module({name:'attachmentmediacs', namespaced: true, stateFactory: true})
export class AttachmentMediaCS extends ChatCS implements ILifeCycle {
    canShowPopupAvatar = false;
    canShowPopupViewers = false;
    canShowNewMessageDivider = false;
    canShowFiles = false;
    canShowEmojis = false;
    canShowDateDivider = false;
    canShowConversationStarted = false;
    isDisableSeen = true;

    constructor(module: VuexModule<ThisType<ChatCS>, ChatCS>) {
        super(module);
    }

    public get users(): UserDM[] {
        return UserDSModule.itemsAsArray;
    }

    public get roomId() {
        return ApplicationDSModule.selectedMediaRoomID;
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

    public get locale() {
        return ATTACHMENT_MEDIA_LOCALE;
    }

	public get isCacheUndefined() {
		return typeof store.state.attachmentmediads.items[this.roomId] === 'undefined';
	}

    public get allMessagesLoaded() {
        return AttachmentMediaDSModule.loadedRooms[this.roomId] || false;
    }

    @Action({rawError: true})
    async fetchMessages(data: {id: number, skip: number, take: number}): Promise<MessageDM[]> {
      return await AttachmentMediaDSModule.fetch(data);
    }

    @Action({rawError: true})
    setRoomId(roomId: number): void {
        ApplicationDSModule.setSelectedMediaRoomID(roomId);
        ApplicationDSModule.setSelectedDocumentRoomID(roomId);
        ApplicationDSModule.setSelectedLinkRoomID(roomId);

        if(ApplicationDSModule.selectedModule === ModuleName.groups) {
            ApplicationDSModule.setSelectedGroupChatRoomID(roomId);
        } else {
            ApplicationDSModule.setSelectedEntityChatRoomID(roomId);
        }
    }

    @Action({rawError: true})
    onHandleChatAction() {
        return;
    }

    @Action({rawError: true})
    async getMessageType(message: MessageDM): Promise<MESSAGE_TYPE | null> {
        if (message?.mimetype?.startsWith('video')) {
            return MESSAGE_TYPE.ATTACHMENT_MEDIA_VIDEO_MESSAGE;
        }
        if (message?.mimetype?.startsWith('audio')) {
            return MESSAGE_TYPE.ATTACHMENT_MEDIA_AUDIO_MESSAGE;
        }
        return MESSAGE_TYPE.ATTACHMENT_MEDIA_IMAGE_MESSAGE;
    }

    @Action({rawError: true})
    onInitialization(): void {
        store.watch(
            function stateToWatch(state) {
                return { items: state.attachmentmediads.items, roomID: state.applicationds.selectedMediaRoomID }
            },
            function onChange({items, roomID}) {
                AttachmentMediaCSModule.updateMessagesFromCache({roomID, messages: items[roomID]});
            }
        );
    }

    @Action({rawError: true})
    async activate(): Promise<void> {
        const roomID = ApplicationDSModule.selectedMediaRoomID;
        this.updateMessagesFromCache({roomID, messages: AttachmentMediaDSModule.items[roomID]})
    }

    @Action({rawError: true})
    async onHandleHeaderAction(): Promise<void> {
      return;
    }

}
