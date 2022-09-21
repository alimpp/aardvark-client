import BaseItemsDS from './base/baseItemsDS';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import MessageDM from '@/datamodels/messageDM';
import store, {ApplicationDSModule, AttachmentDocumentsDSModule} from '@/store';
import AttachmentAPI from "@/api/attachmentAPI";
import {Wait, WaitStates} from '@/utils/vuewait'
import {TAB_ATTACHMENT_ID} from '@/utils/constants';

@Module({name: 'attachmentdocumentsds', namespaced: true, stateFactory: true})
export class AttachmentDocumentsDS extends BaseItemsDS<MessageDM> implements IAttachmentDocumentsDS {
	loadedRooms: { [key: number]: boolean } = {};

	constructor(module: VuexModule<ThisType<MessageDM>, MessageDM>) {
		super(module);
	}

	@Mutation
	setLoadedRooms(data: {roomId: number, isLoaded: boolean}) {
		const {roomId, isLoaded} = data;
		this.loadedRooms = { ...this.loadedRooms, [roomId]: isLoaded };
	}

	@Action({rawError: true})
	async fetch(data: {id: number, skip: number, take: number}): Promise<MessageDM[]> {
		const messages = (await AttachmentAPI.LIST_DOCUMENTS({roomId: data.id, skip: data.skip})).reverse();
		if(data.skip === 0) {
			if(this.items[data.id]) {
				this.addOrReplaceItem({id: data.id, items: [
					...this.items[data.id].map(item => {
						const message = messages.find(message => message.id === item.id);
						return message ? message : item;
					}),
					...messages.filter(message => !this.items[data.id].some(item => item.id === message.id))
				]});
			} else {
				this.addOrReplaceItem({id: data.id, items: messages});
			}
		} else {
			this.addOrReplaceItem({id: data.id, items: [...messages, ...this.items[data.id]]});
		}
		if(!this.loadedRooms[data.id]) this.setLoadedRooms({roomId: data.id, isLoaded: messages.length < data.take});
		return messages;
	}

	@Wait(WaitStates.ACTION_ATTACHMENT_DOCUMENTS_LOADING)
	@Action({rawError: true})
	async doLoad(force = true) {
		const id = ApplicationDSModule.selectedDocumentRoomID;
		if (this.getItems[id] === undefined || force)
			await this.fetch({id, skip: 0, take: 15});
	}


	@Action({rawError: true})
	onInitialization() {
		store.watch(
			function stateToWatch(state) {
				return {id: state.applicationds.selectedDocumentRoomID, view: state.attachmentcs.selectedAttachmentView}
			},
			function onChange({id, view}) {
				if (id !== 0 && view === TAB_ATTACHMENT_ID.DOCUMENTS) {
					AttachmentDocumentsDSModule.doLoad();
				}
			}
		);
		store.watch(
			function stateToWatch(state) {
				return state.messageds.lastNewMessage[0]
			},
			function onChange(message) {
				if(message.mimetype?.contains('text', 'pdf') && message.attachment) {
					AttachmentDocumentsDSModule.addOrReplaceItem({
						id: message.roomId,
						items: [...(store.state.attachmentdocumentsds.items[message.roomId] || []), message]
					})
				}
			}
		);
	}
}

interface IAttachmentDocumentsDS {
	items: {[key: number]: MessageDM[]}
}