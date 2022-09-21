import BaseItemsDS from './base/baseItemsDS';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import MessageDM from '@/datamodels/messageDM';
import UserDM from '@/datamodels/userDM';
import {createToastNotification} from '@/utils/toast';
import store, { ApplicationDSModule, SprintsViewDSModule, NuggetDSModule, ProjectDSModule ,ReleaseDSModule, ProfileDSModule, MessageDSModule } from '@/store';
import MessageAPI from '@/api/messageAPI';
import { Wait, WaitStates } from '@/utils/vuewait';
import { utcNow } from '@/utils/date';
import {MESSAGE_SIGNATURE, SOCKET_EVENTS, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import { ModuleName, ModuleTabName } from './applicationDS';
import cloneDeep from 'lodash.clonedeep';
import {EntityType} from "@/store/modules/datastore/applicationDS";

@Module({name:'messageds', namespaced: true, stateFactory: true})
export class MessageDS extends BaseItemsDS<MessageDM> implements IMessageDS {
    lastNewMessage = [new MessageDM()]
    loadedRooms: { [roomId: number]: boolean } = {};
    messageViewers: { [messageId: number]: UserDM[] } = {};

    // Unfortunately due to the way vuex-module-decorator works, we have not been able to send initializations in constructor and
    // are instead relying on developers to implement a onInitialization @Action function in the child class that will be called a single time.
    constructor(module: VuexModule<ThisType<MessageDM>, MessageDM>) {
        super(module);
    }
    
    get statusText() {
        return (error) => {
            let statusText
            if (error?.response?.data?.message) {
              statusText = error.response.data.message
            } else if (error?.response?.statusText) {
              statusText = error.response.statusText
            } else if (error?.response?.status) {
              statusText = error.response?.status
            } else {
              statusText = error
            }
            return statusText || ''
        }
    }

    @Mutation
    updateLastNewMessage(message: MessageDM) {
        this.lastNewMessage = [message];
    }
    
    @Mutation
    setLoadedRooms(data: {roomId: number, isLoaded: boolean}) {
        const {roomId, isLoaded} = data;
        this.loadedRooms = { ...this.loadedRooms, [roomId]: isLoaded };
    }
    
    @Mutation
    setMessageViewers(data: { messageId: number, viewers: UserDM[] }): void {
        const { messageId, viewers } = data;
        this.messageViewers = { ...this.messageViewers, [messageId]: viewers };
    }

    @Action({rawError: true})
    async flagAsSeen(message: MessageDM) {
        message.seenAt = utcNow();
        this.addOrReplaceItem({
            id: message.roomId,
            items: this.items[message.roomId].map(item => item.id === message.id ? message : item)
        });
        return message;
    }

    @Action({rawError: true})
    async retry(failedMessage: MessageDM) {
        const id = failedMessage.roomId;
        if(!failedMessage.temporaryId) return;
        failedMessage.isErrored = false;
        try {
            const message = await MessageAPI.SEND({roomId: id, body: failedMessage.rawBody, temporaryId: failedMessage.temporaryId, attachment: failedMessage.tmpFile?.file});
            this.addOrReplaceItem({id, items: this.items[message.roomId].map(existingMessage => existingMessage.temporaryId === failedMessage.temporaryId ? message : existingMessage) });
        } catch (error) {
            failedMessage.isErrored = true;
        }
    }

    @Action({rawError: true})
    async sendMessage(data: {displayBody: string, rawBody: string, temporaryId: string, roomId: number, file?: {file: File, url: string}, links?: {title: string, url: string}[]}) {
        const roomId = data.roomId;
        const temp = new MessageDM().createTemporary(data.displayBody, data.temporaryId, data.rawBody, data.roomId, data.file);
        this.addOrReplaceItem({id: roomId, items: [...this.items[roomId], temp]});
        try {
            const message = await MessageAPI.SEND({roomId: roomId, body: data.rawBody, temporaryId: data.temporaryId, attachment: data.file?.file, links: data.links});
            this.addOrReplaceItem({id: roomId, items: this.items[message.roomId].map(existingMessage => existingMessage.temporaryId === data.temporaryId ? message : existingMessage) });
            this.updateLastNewMessage(message);
            return message;
        } catch (error) {
            const statusText = this.statusText(error)
            if (statusText)
            createToastNotification(statusText || "Failed to send message", {type: 'error', position: 'bottom'});
            temp.isErrored = true;
        }
    }

    @Action({rawError: true})
    async see(message: MessageDM) {
        const selectedModuleTab = ApplicationDSModule.selectedModuleTab

        if (message.subscribableType === SUBSCRIBABLE_TYPE.NUGGET) NuggetDSModule.flagAsSeen(message.roomId);
        const seenMessage = await MessageAPI.SEE({messageId: message.id});
        this.addOrReplaceItem({
            id: message.roomId,
            items: this.items[message.roomId].map(current => current.id === message.id ? seenMessage : current)
        });

        if(selectedModuleTab === ModuleTabName.inboxProjects || ApplicationDSModule.selectedEntityType === EntityType.project){
            ProjectDSModule.flagAsSeen(message.roomId);
        }else if(selectedModuleTab === ModuleTabName.inboxSprints){
            SprintsViewDSModule.flagAsSeen(message.roomId);
        }else if(selectedModuleTab === ModuleTabName.inboxReleases || ApplicationDSModule.selectedEntityType === EntityType.release){
            ReleaseDSModule.flagAsSeen(message.roomId);
        }

        return seenMessage;
}

    @Action({rawError: true})
    async delete(messageId: number) {
        const message = await MessageAPI.DELETE({messageId: messageId});
        this.addOrReplaceItem({
            id: message.roomId,
            items: this.items[message.roomId].map(current => current.id === message.id ? message : current)
        });
    }

    @Action({rawError: true})
    async reply(data: {messageId: number, rawBody: string, displayBody: string, roomId: number, temporaryId: string, file?: {file: File, url: string}, links?: {title: string, url: string}[]}) {
        const roomId = data.roomId;
        const replyMessage = this.items[roomId].find(msg => msg.id === data.messageId);
        const temp = new MessageDM().createTemporary(data.displayBody, data.temporaryId, data.rawBody, data.roomId, data.file, replyMessage);
        this.addOrReplaceItem({id: roomId, items: [...this.items[roomId], temp]});
        try {
            const message = await MessageAPI.REPLY({messageId: data.messageId, body: data.rawBody, temporaryId:  data.temporaryId, attachment: data.file?.file,links: data.links});
            this.addOrReplaceItem({id: roomId, items: this.items[message.roomId].map(existingMessage => existingMessage.temporaryId === data.temporaryId ? message : existingMessage) });
            this.updateLastNewMessage(message);
        } catch (error) {
            const statusText = this.statusText(error)
            if (statusText)
            createToastNotification(statusText || "Failed to send message", {type: 'error', position: 'bottom'});
            temp.isErrored = true;
        }
    }

    @Action({rawError: true})
    async edit(data: {messageId: number, content: string, roomId: number, temporaryId?: string, file?: {file: File, url: string}}): Promise<void> {
        const originalMessage = cloneDeep(this.items[data.roomId].find(message => message.id === data.messageId));
        if(!originalMessage) return;

        const messageCopy = cloneDeep(originalMessage);
        messageCopy.content = data.content;
        messageCopy.details = data.content
        messageCopy.isUpdating = true;
        this.addOrReplaceItem({
            id: messageCopy.roomId,
            items: this.items[messageCopy.roomId].map(current => current.id === messageCopy.id ? messageCopy : current)
        });

        try {
            const message = await MessageAPI.EDIT({messageId: data.messageId, body: data.content, attachment :data.file?.file});
            this.addOrReplaceItem({
                id: message.roomId,
                items: this.items[message.roomId].map(current => current.id === message.id ? message : current)
            });
        } catch (error) {
            this.addOrReplaceItem({
                id: originalMessage.roomId,
                items: this.items[originalMessage.roomId].map(current => current.id === originalMessage.id ? originalMessage : current)
            });
            const statusText = this.statusText(error)
            if (statusText) createToastNotification(statusText || "Failed to update message", {type: 'error', position: 'bottom'});
        }
    }

    @Action({rawError: true})
    async fetch(data: {id: number, skip: number, take: number }) {
        const messages = (await MessageAPI.LIST({roomId:data.id, skip: data.skip, take: data.take})).reverse();
        if(this.items[data.id]) {
            const items = await this.filterAndSort([...this.items[data.id], ...messages]);
            this.addOrReplaceItem({ id: data.id, items });
        } else {
            this.addOrReplaceItem({id: data.id, items: messages});
        }
        if(!this.loadedRooms[data.id]) this.setLoadedRooms({roomId: data.id, isLoaded: messages.length < data.take});
        return messages;
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_MESSAGE_PEOPLE_VIEWED)
    async listViewers(messageId: number) {
        const viewers: UserDM[] | undefined = await MessageAPI.LIST_VIEWERS({ messageId });
        if (viewers?.length) {
            this.setMessageViewers({ messageId, viewers });
        }
    }

    @Wait(WaitStates.ACTION_CHAT_LOADING)
    @Action({rawError: true})
    // TODO: Temp fix for doLoad, need to fix this globally.
    // @ts-ignore
    async doLoad(data: {force?: boolean, id: number} = {force: true, id: 0}) {
        const {force, id} = data;
        if(this.getItems[id] === undefined || force) {
            await this.fetch({id, skip: 0, take: 15});
        }
    }

    @Action({rawError: true})
    private async filterAndSort(messages: MessageDM[]) {
        // Put through a map(message id, message) to filter out duplicate messages, spread values back into an array.
        const arr = [...new Map(messages.map(message => [message.id, message])).values()]
        // Return a sorted array
        return arr.sort((a,b) => {
            if (a.createdAt > b.createdAt) { return 1; }
            if (a.createdAt < b.createdAt) { return -1; }
            return 0;
        })
    }

    @Action({rawError: true})
    async processMessage(message: MessageDM) {
        const roomExistsInCache = typeof this.items[message.roomId] !== 'undefined';
        if(!roomExistsInCache) {
            // Room does not exist, set room with message.
            this.addOrReplaceItem({ id: message.roomId, items: [message] });
        } else {
            const cachedMessageIndex = this.items[message.roomId].findIndex(cacheMessage => cacheMessage.id === message.id);
            if(cachedMessageIndex === -1) {
                // Message does not exist in cache, add it.
                this.addOrReplaceItem({
                    id: message.roomId,
                    items: await this.filterAndSort([...this.items[message.roomId], message])
                });
            } else {
                const items = [ ...this.items[message.roomId] ];
                const cachedMessage = items[cachedMessageIndex];
                let replaceWithNewMessage = false;
    
                // Message does exist, compare modifiedAt dates
                if((!cachedMessage.modifiedAt && message.modifiedAt)) {
                    replaceWithNewMessage = true;
                } else if(message.modifiedAt && cachedMessage.modifiedAt && message.modifiedAt > cachedMessage.modifiedAt) {
                    replaceWithNewMessage = true;
                }

                items[cachedMessageIndex] = replaceWithNewMessage ? message : cachedMessage;
                this.addOrReplaceItem({ id: message.roomId, items });
            }
        }
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedEntityChatRoomID
            },
            function onChange(id) {
                if(id) MessageDSModule.doLoad({force: true, id});
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedPeopleChatRoomID
            },
            function onChange(id) {
                if(id !== 0) MessageDSModule.doLoad({force: true, id});
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedGroupChatRoomID
            },
            function onChange(id) {
                if(id !== 0) MessageDSModule.doLoad({force: true, id});
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
            function onChange(message) {
                if(message.id !== 0 && !message.processedBy.includes(MESSAGE_SIGNATURE.SEEN_SIGNATURE)) {
                    let items = [ ...(store.state.messageds.items[message.roomId] || []) ];
                    const messageIndex = items.findIndex(item => item.id === message.id);
                    if(messageIndex === -1) return;

                    // Bug: Backend sends a SEEN through the socket without updated seenAt/isSeen fields
                    // This sets isSeen/seenAt fields for messages that don't have it & fall before the seen message.
                    items = items.map((item, index) => {
                        if(index > messageIndex || item.isSeen || item.seenAt) return item;
                        const msg = item.id === message.id ? message : item;
                        msg.isSeen = true;
                        if(ProfileDSModule.id === message.seenByMemberReferenceId) msg.seenAt = utcNow();
                        return msg;
                    });
                    
                    MessageDSModule.addOrReplaceItem({id: message.roomId, items});
                    message.processedBy.push(MESSAGE_SIGNATURE.SEEN_SIGNATURE);
                }
            }
        )
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.newMessage
            },
            async function onChange(message) {
                if(message.id !== 0 && !message.processedBy.includes(MESSAGE_SIGNATURE.NEW_SIGNATURE)) {
                    const currentItems = store.state.messageds.items[message.roomId] || [];

                    if( currentItems.some(currentMessage => currentMessage.id === message.id || message.temporaryId && currentMessage.temporaryId === message.temporaryId ) ) {
                        MessageDSModule.addOrReplaceItem({
                            id: message.roomId,
                            items: currentItems.map(current => current.id === message.id || current.temporaryId === message.temporaryId ? message : current)
                        });
                    } else {
                        const items = await MessageDSModule.filterAndSort([...currentItems, message]);
                        MessageDSModule.addOrReplaceItem({id: message.roomId, items});
                    }

                    message.processedBy.push(MESSAGE_SIGNATURE.NEW_SIGNATURE)
                }
            }
        )
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.deleteMessage
            },
            function onChange(message) {
                if(message.id !== 0 && !message.processedBy.includes(MESSAGE_SIGNATURE.DELETE_SIGNATURE)) {
                    const currentItems = store.state.messageds.items[message.roomId] || [message];
                    MessageDSModule.addOrReplaceItem({
                        id: message.roomId,
                        items: currentItems.map(current => current.id === message.id ? message : current)
                    });
                    message.processedBy.push(MESSAGE_SIGNATURE.DELETE_SIGNATURE);
                }
            }
        )
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.editMessage
            },
            function onChange(message) {
                if(message.id !== 0 && !message.processedBy.includes(MESSAGE_SIGNATURE.EDIT_SIGNATURE)) {
                    const currentItems = store.state.messageds.items[message.roomId] || [message];
                    MessageDSModule.addOrReplaceItem({
                        id: message.roomId,
                        items: currentItems.map(current => current.id === message.id ? message : current)
                    });
                    message.processedBy.push(MESSAGE_SIGNATURE.EDIT_SIGNATURE);
                }
            }
        )
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.eventMessage
            },
            function onChange(message) {
                if(message.id !== 0 && !message.processedBy.includes(MESSAGE_SIGNATURE.EVENT_SIGNATURE)) {
                    const currentItems = store.state.messageds.items[message.roomId] || [];

                    if( currentItems.some(currentMessage => currentMessage.id === message.id ) ) {
                        MessageDSModule.addOrReplaceItem({
                            id: message.roomId,
                            items: currentItems.map(current => current.id === message.id ? message : current)
                        });
                    } else {
                        MessageDSModule.addOrReplaceItem({id: message.roomId, items: [...currentItems, message]});
                    }

                    message.processedBy.push(MESSAGE_SIGNATURE.EVENT_SIGNATURE)
                }
            }
        )
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.jaguarSocket
            },
            async function onChange(socket) {
                if(socket && socket.registerEventCallback) {
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.RECONNECT,
                        callback: () => {
                            const selectedModule = ApplicationDSModule.selectedModule;
                            let id = 0;
                            if(selectedModule === ModuleName.people) {
                                id = ApplicationDSModule.selectedPeopleChatRoomID;
                            } else if(selectedModule === ModuleName.groups) {
                                id = ApplicationDSModule.selectedGroupChatRoomID;
                            } else {
                                id = ApplicationDSModule.selectedEntityChatRoomID;
                            }
                            if(id) MessageDSModule.doLoad({force: true, id});
                        }
                    });
                }
            }
        );
    }

}

export interface IMessageDS {
    items: { [key: number]: MessageDM[] }
}
