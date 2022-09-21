import store, {ApplicationDSModule, AttachmentDocumentsCSModule, AttachmentDocumentsDSModule, UserDSModule} from '@/store';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {ModuleName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import UserDM from '@/datamodels/userDM';
import ChatCS from './base/chatCS';
import {ATTACHMENT_DOCUMENT_LOCALE, MESSAGE_TYPE} from '@/utils/constants';

@Module({name: 'attachmentdocumentscs', namespaced: true, stateFactory: true})
export class AttachmentDocumentsCS extends ChatCS implements ILifeCycle {
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
		return ApplicationDSModule.selectedDocumentRoomID;
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
    return ATTACHMENT_DOCUMENT_LOCALE;
  }

	public get isCacheUndefined() {
		return typeof store.state.attachmentdocumentsds.items[this.roomId] === 'undefined';
	}

	public get allMessagesLoaded() {
		return AttachmentDocumentsDSModule.loadedRooms[this.roomId] || false;
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
	async getMessageType() {
		return MESSAGE_TYPE.ATTACHMENT_DOCUMENT_MESSAGE;
	}

	@Action({rawError: true})
	async fetchMessages(data: {id: number, skip: number, take: number}) {
		return await AttachmentDocumentsDSModule.fetch(data);
	}

	@Action({rawError: true})
	onInitialization() {
		store.watch(
			function stateToWatch(state) {
				return {items: state.attachmentdocumentsds.items, roomID: state.applicationds.selectedDocumentRoomID}
			},
			function onChange({items, roomID}) {
				AttachmentDocumentsCSModule.updateMessagesFromCache({roomID, messages: items[roomID]});
			}
		);
	}

	@Action({rawError: true})
	async activate() {
		const roomID = ApplicationDSModule.selectedDocumentRoomID;
		this.updateMessagesFromCache({roomID, messages: AttachmentDocumentsDSModule.items[roomID]})
	}

  @Action({rawError: true})
  async onHandleHeaderAction() {
    return;
  }

}
