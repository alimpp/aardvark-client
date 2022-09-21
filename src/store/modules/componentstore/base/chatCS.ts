import MessageDM from "@/datamodels/messageDM";
import UserDM from "@/datamodels/userDM";
import store, {MessageDSModule, UserDSModule} from "@/store";
import {CHAT_LOCALE, MESSAGE_TYPE} from "@/utils/constants";
import {Wait, WaitStates} from "@/utils/vuewait";
import {Action, Mutation, VuexModule} from 'vuex-module-decorators'


export default abstract class ChatCS extends VuexModule {
  // Required
  messages: MessageDM[] = [];
  tabs: {id: string | number, highBadgeCount? : number , label: string, disabled?: boolean, disableMention?: boolean}[] = [];
  editMessage: MessageDM | null = null;
  replyMessage: MessageDM | null = null;

  // options, overridable
  canShowPopupAvatar = true;
  canShowPopupViewers = true;
  canShowNewMessageDivider = true;
  canShowScreenRecord = true;
  canShowFiles = true;
  canShowEmojis = true;
  canShowDateDivider = true;
  canShowHeaderToggle = false;
  canShowConversationStarted = true;
  isDisableSeen = false;
  take = 15;

  latestSeenMessageInfo: {[roomId: number]: number | string} = {};

  abstract get roomId(): number;
  abstract get users(): UserDM[];
  abstract get headerActions(): {id: string, title: string}[];
  abstract get headerInfo(): {title?: string, icon?: string};

  public get canMention() {
    return true;
  }

  public get readOnlyData() {
    return {
      isReadOnly: false,
      message: ''
    }
  }

  get messageViewers() { 
    return (messageId: number): UserDM[] => MessageDSModule.messageViewers[messageId] || [];
  }

  public get isCacheUndefined() {
    // MessageDSModule.items[this.roomId] does not update this getter, so use store.state.
    return typeof store.state.messageds.items[this.roomId] === 'undefined';
  }

  public get locale() {
    return CHAT_LOCALE;
  }
  
  public get allMessagesLoaded() {
    return MessageDSModule.loadedRooms[this.roomId] || false;
  }
  
  public get mentionableUsers(): UserDM[] {
    return UserDSModule.itemsAsArray
  }

  public get lastSeenMessageIndex() {
    return MessageDSModule.items[this.roomId]?.findIndex(message => message.id === this.latestSeenMessageInfo[this.roomId]);
  }

  @Mutation
  setLatestSeenMessageInfo(info: {[roomId: number]: number}) {
    this.latestSeenMessageInfo = info;
  }

  @Mutation
  setEditMessage(message: MessageDM | null) {
    this.editMessage = message;
  }

  @Mutation
  setReplyMessage(message: MessageDM | null) {
    this.replyMessage = message;
  }

  @Mutation
  setChatTabs(data: {tabs: {id: string | number,  highBadgeCount? : number , label: string, disabled?: boolean}[]}) {
    this.tabs = data.tabs;
  }

  @Mutation
  setMessages(data: {messages: MessageDM[] | undefined, roomID: number}) {
    this.messages = data.messages || [];
  }

  @Action({rawError: true})
  async flagAsSeen(message: MessageDM) {
    return await MessageDSModule.flagAsSeen(message);
  }

  @Action({rawError: true})
  async see(message: MessageDM) {
    return await MessageDSModule.see(message);
  }

  @Action({rawError: true})
  async delete(messageId: number) {
    await MessageDSModule.delete(messageId);
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_SENDING_MESSAGE)
  async reply(data: {messageId: number, rawBody: string, roomId: number, displayBody: string, file?: {file: File, url: string}, links?: {title: string, url: string}[]}) {
    const temporaryId = '_' + Math.random().toString(36).substr(2, 9);
    await MessageDSModule.reply({...data, temporaryId});
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_SENDING_MESSAGE)
  async retry(message: MessageDM) {
    await MessageDSModule.retry(message)
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_SENDING_MESSAGE)
  async edit(data: {messageId: number, content: string, roomId: number, file: {file: File, url: string}}) {
    await MessageDSModule.edit(data);
  }

  @Action({rawError: true})
  async fetchMessages(data: {id: number, skip: number, take: number}) {
    return await MessageDSModule.fetch(data);
  }

  @Action({rawError: true})
  async listViewers(messageId: number) {
    return MessageDSModule.listViewers(messageId)
  }

  @Action({rawError: true})
  async processNextLatestSeenMessageId() {
    if(this.lastSeenMessageIndex === -1) return;
    const nextMessageAfterSeen = MessageDSModule.items[this.roomId]?.[this.lastSeenMessageIndex + 1];
    if(nextMessageAfterSeen && nextMessageAfterSeen.isMine && nextMessageAfterSeen.id && nextMessageAfterSeen.roomId) {
      this.context.commit('setLatestSeenMessageInfo', {...this.latestSeenMessageInfo, [nextMessageAfterSeen.roomId]: nextMessageAfterSeen.id});
    }
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_SENDING_MESSAGE)
  async sendMessage(data: {displayBody: string, rawBody: string, roomId: number, file?: {file: File, url: string}, links?: {title: string, url: string}[]}) {
    const isLatestSeenLastMessage = this.messages[this.messages.length - 1]?.id === this.latestSeenMessageInfo[this.roomId]
    const temporaryId = '_' + Math.random().toString(36).substr(2, 9);
    if(isLatestSeenLastMessage) this.context.commit('setLatestSeenMessageInfo', {...this.latestSeenMessageInfo, [data.roomId]: temporaryId});
    const message = await MessageDSModule.sendMessage({...data, temporaryId});
    if(message && isLatestSeenLastMessage && this.latestSeenMessageInfo[message.roomId] === message.temporaryId) {
      this.context.commit('setLatestSeenMessageInfo', {...this.latestSeenMessageInfo, [message.roomId]: message.id});
    }
  }

  @Action({rawError: true})
  async updateMessagesFromCache(data: {roomID: number, messages: MessageDM[]}): Promise<void> {
    const {roomID, messages} = data;
    this.context.commit('setMessages', {roomID, messages});
  }

  @Action({rawError: true})
  async updateRoomTabBadgeCount(message: MessageDM) {

   const tabs = [...this.tabs]     
   const roomId = message.roomId

      tabs.map((tab)=>{
        const highBadgeCount = typeof tab.highBadgeCount === 'undefined'? 0 : tab.highBadgeCount            
        if(roomId === tab.id){
          tab.highBadgeCount = highBadgeCount+1
        }
      })
      this.context.commit('setChatTabs',{tabs}) 
  }

  @Action({rawError: true})
  async resetUnreadBadgeCount(oldRoomId){
      if(!oldRoomId) return
      const tabs = [...this.tabs]

      const tab = tabs.find(( tab ) => tab.id === oldRoomId);
      if(tab) tab.highBadgeCount = 0
      this.context.commit('setChatTabs',{tabs})
  }

  abstract onHandleChatAction(action);
  abstract onHandleHeaderAction(action);
  abstract setRoomId(roomId: number);
  abstract getMessageType(message: MessageDM): Promise<MESSAGE_TYPE | null>;
}