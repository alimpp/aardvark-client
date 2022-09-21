import store, {ApplicationDSModule, AttachmentLinkCSModule, AttachmentLinkDSModule, UserDSModule} from '@/store';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {ModuleName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import {ATTACHMENT_LINK_LOCALE, MESSAGE_TYPE} from '@/utils/constants';
import ChatCS from './base/chatCS';
import MessageDM from '@/datamodels/messageDM';

@Module({name:'attachmentlinkcs', namespaced: true, stateFactory: true})
export class AttachmentLinkCS extends ChatCS implements ILifeCycle {
    canShowPopupAvatar = false;
    canShowPopupViewers = false;
    canShowNewMessageDivider = false;
    canShowFiles = false;
    canShowEmojis = false;
    canShowDateDivider = false;
    canShowConversationStarted = false;
    isDisableSeen = true;

	constructor(module: VuexModule<ThisType<any>, any>) {
		super(module);
	}

	public get users(): UserDM[] {
		return UserDSModule.itemsAsArray;
	}

    public get roomId() {
        return ApplicationDSModule.selectedLinkRoomID;
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
        return ATTACHMENT_LINK_LOCALE;
    }

    public get isCacheUndefined() {
        return typeof store.state.attachmentlinkds.items[this.roomId] === 'undefined';
    }

    public get allMessagesLoaded() {
        return AttachmentLinkDSModule.loadedRooms[this.roomId] || false;
    }

	@Action({rawError: true})
	async fetchMessages(data: {id: number, skip: number, take: number}) {
		return await AttachmentLinkDSModule.fetch(data) as unknown as MessageDM[];
	}

	@Action({rawError: true})
	setRoomId(roomId: number) {
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
    async onHandleHeaderAction() {
      return;
    }

	@Action({rawError: true})
	async getMessageType() {
		return MESSAGE_TYPE.ATTACHMENT_LINK_MESSAGE;
	}

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return {items: state.attachmentlinkds.items, roomID: state.applicationds.selectedLinkRoomID}
            },
            function onChange({items, roomID}) {
                AttachmentLinkCSModule.updateMessagesFromCache({roomID, messages: items[roomID] as unknown as MessageDM[]});
            }
        );
    }

    @Action({rawError: true})
    async activate() {
        const roomID = ApplicationDSModule.selectedLinkRoomID;
        AttachmentLinkCSModule.updateMessagesFromCache({roomID, messages: AttachmentLinkDSModule.items[roomID] as unknown as MessageDM[]});
    }
}
