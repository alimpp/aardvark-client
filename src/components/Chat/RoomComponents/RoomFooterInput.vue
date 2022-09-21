<template>
  <div class="room-footer-input-container w-100">

    <ChatUserSearch
      v-if="canMention && isShowingSearch"
      :store="store"
      :filter="searchUserFilter"
      @select="selectUserToMention"
    />

    <CoreScrollbar class="w-100" suppressScrollY>
      <div class="d-flex align-items-center w-100 h-100">
        <RoomFooterFile v-for="(fileUrl, index) in fileUrls" :key="index" :fileUrl="fileUrl" :store="store" @removeFile="removeFile" />
      </div>
    </CoreScrollbar>

    <div :class="['w-100', 'h-100', 'd-flex', 'align-items-center', {'no-pointer': disabled}]">
      <ChatInput
        ref="ChatInput"
        :class="['message-input',{'no-pointer-stroke': disabled}]"
        :store="store"
        :disabled="disabled"
        @search="onSearchUser"
        @input="onChangeInput"
        @keydown.esc="resetMessage"
        @keydown.enter.exact.prevent=""
        @keydown.tab.exact.prevent
        @send="send"
        @clipBoardImage="clipBoardImage"
      />

      <ChatEmojiPicker
        v-if="canShowEmojis"
        :class="['message-emoji',{'no-pointer-stroke': disabled}]"
        :isEmojiOpen="isEmojiOpen"
        @addEmoji="onAddEmoji"
        @openEmoji="onOpenEmoji"
        :disabled="disabled"
      />

      <div :class="['svg-button', 'message-cancel-edit', {'no-pointer': disabled}]" v-if="editedMessage" @click="resetMessage">
        <i :class="['material-icons',{'no-pointer-stroke': disabled, 'disabled': disabled}]">close</i>
      </div>

       <div v-if="canShowFiles && !editedMessage" :class="['svg-button', 'message-add-attachment',  {'no-pointer': disabled, 'disabled': disabled}]" @click="launchFilePicker">
        <i class="material-icons" :class="['material-icons',{'no-pointer-stroke': disabled}]">attach_file</i>
      </div> 
           
      <div v-if="canShowScreenRecord" :class="['svg-button', 'message-record-screen', {'no-pointer': disabled || disabledScreenRecording, 'disabled': disabled}]" @click="clickScreenRecorder">
        <i class="material-icons" :class="['material-icons',{'no-pointer-stroke': disabled || disabledScreenRecording, 'disabled': disabled  || !disabledScreenRecording}]">video_call</i>
      </div> 


      <div :class="['message-send',{'disabled': isMessageEmpty || disabled,'no-pointer': disabled}]">
          <i class="material-icons" :class="{'no-pointer-stroke': disabled}" @click="send">send</i>
      </div>

      <input v-show="false" type="file" ref="filePicker" @change="onFileChange($event.target.files)" :multiple="!editedMessage" :class="{'no-pointer': disabled}"/>
    </div>
  </div>
</template>

<script lang="ts">
import UserDM from "@/datamodels/userDM";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import ChatInput from "../ChatInput.vue";
import ChatUserSearch from '@/components/Chat/ChatUserSearch.vue';
import ChatEmojiPicker from "@/components/Chat/ChatEmojiPicker.vue";
import RoomFooterFile from "@/components/Chat/RoomComponents/RoomFooterFile.vue";
import MessageDM from "@/datamodels/messageDM";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";
import { ApplicationDSModule, chatBufferCSModule, ScreenRecorderCSModule } from "@/store";
import ChatBufferDM from "@/datamodels/chatBufferDM";
import { debounce } from "@/utils/debounce";
import { createToastNotification } from "@/utils/toast";
import {CHAT_LOCALE, DEBOUNCE, EVENTS} from "@/utils/constants"
import { EventBus } from "@/utils/eventBus";
import { ModuleName } from "@/store/modules/datastore/applicationDS";
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';


@Component({
  name: "RoomFooterInput",
  components: {ChatInput, ChatUserSearch, RoomFooterFile, ChatEmojiPicker, CoreScrollbar}
})
export default class RoomFooterInput extends BaseRoomComponent {
  isShowingSearch = false;
  searchUserFilter = '';
  files: {file: File, url: string}[] = [];
  fileUrls: {url: string, name: string, type: string}[] = [];
  message = "";
  isEmojiOpen = false;
  $refs!: {
    ChatInput: ChatInput
    filePicker: HTMLInputElement
  }

  @Watch("roomId")
  onRoomIdChange() {
    this.resetMessage();
  }

  @Watch("editedMessage")
  onEditMessageChange(value: MessageDM | null) {
    if(value) this.loadEditMessage(value)
  }

  @Watch("messageReply")
  onMessageReplyChange(value: MessageDM | null) {
    if(value) this.focusInput();
    this.updateChatBuffer();
  }
  mounted() {
    EventBus.$on(EVENTS.CLICK_SEND_SCREEN_RECORDER_FILE, () => {
      const selectedModule = ApplicationDSModule.selectedModule;
      let id = 0;
      if(selectedModule === ModuleName.people) {
          id = ApplicationDSModule.selectedPeopleChatRoomID;
      } else if(selectedModule === ModuleName.groups) {
          id = ApplicationDSModule.selectedGroupChatRoomID;
      } else {
          id = ApplicationDSModule.selectedEntityChatRoomID;
      }
      
      if(this.roomId != id)
        return ;
      
      if(ScreenRecorderCSModule.screenRecordedFile.file){
          this.files.push({file: ScreenRecorderCSModule.screenRecordedFile.file , url: ScreenRecorderCSModule.screenRecordedFile.url} );
          this.fileUrls.push({url: ScreenRecorderCSModule.screenRecordedFile.url ,
                              name: ScreenRecorderCSModule.screenRecordedFile.file.name ,
                              type: ScreenRecorderCSModule.screenRecordedFile.file.type
                              });
      }
      EventBus.$emit(EVENTS.RESET_SCREEN_RECORDER) ;
    })
  }
  beforeDestroy() {
    EventBus.$off(EVENTS.CLICK_SEND_SCREEN_RECORDER_FILE)
  }
  

  public get chatInput() {
    return this.$refs.ChatInput;
  }

  public get filePicker() {
    return this.$refs.filePicker;
  }

  public get roomId() {
    return this.store.roomId;
  }

  public get editedMessage() {
    return this.store.editMessage;
  }

  public get messageReply() {
    return this.store.replyMessage;
  }

  public get canShowEmojis() {
    return this.store.canShowEmojis;
  }

  public get canShowFiles() {
    return this.store.canShowFiles;
  }

  public get canShowScreenRecord() {
    return this.store.canShowScreenRecord;
  }

  public get disabled(): boolean  {
    return this.roomId === 0 || this.store.readOnlyData.isReadOnly;
  }

  public get disabledScreenRecording(): boolean  {
    return !ScreenRecorderCSModule.isScreenRecordingActive
  }

  public get isMessageEmpty() {
    return !this.files.length && !this.message.trim();
  }

  public get canMention() {
    return this.store.canMention
  }


  toastExceedingLimit(fileName: string){
    createToastNotification( fileName.toUpperCase().concat(CHAT_LOCALE.MESSAGE_ERROR_LARGE_FILE) , {type: 'error', position: 'bottom'});
  }

  onSearchUser(data: {isShowingSearch: boolean, filter: string}) {
    const {isShowingSearch, filter} = data;
    this.isShowingSearch = isShowingSearch;
    this.searchUserFilter = filter;
  }

  onOpenEmoji(isOpen: boolean) {
    this.isEmojiOpen = !this.disabled && isOpen || false;
  }

  selectUserToMention(user: UserDM) {
    this.chatInput.insertMention(user);
  }

  removeFile(file: File) {
    this.files = this.files.filter(f => f.file.name !== file.name);
    this.fileUrls = this.fileUrls.filter(f => f.name !== file.name);
  }

  resetFiles() {
    this.files = [];
    this.fileUrls = [];
  }

  onChangeInput(message: string) {
    this.message = message;
    this.debouncedUpdateChatBuffer();
  }

  updateChatBuffer(remove= false) {
    const chatBuffer = new ChatBufferDM();
    if(!remove){
      chatBuffer.message = this.message ;
      chatBuffer.content = this.chatInput.getMessage() ;
      chatBuffer.replayMessage = this.messageReply ;
    }else {
      chatBuffer.content = "" ;
      chatBuffer.replayMessage = null ;
    }
    chatBufferCSModule.setChatBuffer({roomId: this.roomId ,data: chatBuffer});
  }
  debouncedUpdateChatBuffer() {
			debounce(DEBOUNCE.UPDATE_CHAT_BUFFER, () => this.updateChatBuffer(), 150);
	}

  resetMessage(ignoreChatBuffer=false): void  {
    this.isShowingSearch = false ;
    const chatBuffer = chatBufferCSModule.items[this.roomId.toString()] ;
    if(!this.disabled && !ignoreChatBuffer && chatBuffer && chatBuffer.content !== ""){
      this.message = chatBuffer.message ;
      this.store.setReplyMessage(chatBuffer.replayMessage);
      this.chatInput.setInput(chatBuffer.content);
    }else {
      this.message = "";
      if(this.chatInput) {
        this.chatInput.clearInput();
        window.setTimeout(() => this.focusInput());
      }
      this.store.setReplyMessage(null);
    }
    this.resetFiles();
    this.store.setEditMessage(null);
    this.isEmojiOpen = false;
  }

  async updateMessage(messageId: number, content: string, roomId: number, file: {file: File, url: string}) {
    await this.store.edit({messageId, content, roomId, file});
  }

  async replyToMessage(messageId: number, rawBody: string, displayBody: string, files: {file: File, url: string}[]) {
    const roomId = this.roomId;
    const links = rawBody.linkify().map(link => ({title: link.value, url: link.href}));
    if(files.length === 0) {
      await this.store.reply({messageId, rawBody, roomId, displayBody, links});
    } else {
      // TODO: PATCH THIS. DONT SEND MULTIPLES.
      files.forEach((file, index) => {
        this.store.reply({messageId, rawBody: index === 0 ? rawBody : '', displayBody: index === 0 ? displayBody : '', links: index === 0 ? links : [], roomId, file});
      });
    }
  }

  async sendMessage(rawBody: string, displayBody: string, files: {file: File, url: string}[]) {
    if(this.disabled) return;
    const roomId = this.roomId;
    const links = rawBody.linkify().map(link => ({title: link.value, url: link.href}));
    if(files.length === 0) {
      await this.store.sendMessage({rawBody, displayBody, roomId, links});
    } else {
      // TODO: PATCH THIS. DONT SEND MULTIPLES.
      files.forEach((file, index) => {
        this.store.sendMessage({rawBody: index === 0 ? rawBody : '', displayBody: index === 0 ? displayBody : '', roomId, file, links: index === 0 ? links : []});
      });
    }
  }

  async send() {
    if(this.isMessageEmpty || this.isShowingSearch) return;
    const message = this.message.trim();
    const displayBody = this.chatInput.formattedMessage(true);
    const editedMessage = this.editedMessage!;
    const messageReplyId = this.messageReply?.id;
    const files = this.files;
    this.updateChatBuffer(true);
    this.resetMessage(true);

    if(editedMessage) {
      this.updateMessage(editedMessage.id, message, editedMessage.roomId, files[0]);
    } else if(messageReplyId) {
      this.replyToMessage(messageReplyId, message, displayBody, files);
    } else {
      this.sendMessage(message, displayBody, files);
    }
  }

  async clipBoardImage(file){
    if(this.disabled) return;
      if(file.size >= CHAT_LOCALE.ATTACHMENT_MAXIMUM_SIZE ){
        this.toastExceedingLimit(file.name);
      }else{
        const url = URL.createObjectURL(file);
        this.files.push({file, url});
        this.fileUrls.push({url, name: file.name, type: file.type});
      }
  }

  onAddEmoji(emoji: {name: string, icon: string}) {
    if(this.disabled) return;
    this.chatInput.addEmoji(emoji);
  }

  launchFilePicker() {
    if(this.disabled) return;
    this.filePicker.value = "";
    this.filePicker.click();
  }
  clickScreenRecorder() {
    if(this.disabled || !this.disabledScreenRecording) return;
    ScreenRecorderCSModule.setOriginalRoomId(this.roomId);
    EventBus.$emit(EVENTS.CLICK_SCREEN_RECORDER) ;
  }

  loadEditMessage(message: MessageDM) {
    this.resetFiles();
    if(message.attachment && message.mimetype) {
      this.fileUrls.push({url: message.attachment, type: message.mimetype, name: message.file || ''})
    }
    if(message.replyMessage) {
      this.store.setReplyMessage(message.replyMessage);
    }
    this.message = message.content;
    this.chatInput.setAndFormatMessage(message.content);
  }

  async onFileChange(files: FileList) {
    if(this.disabled) return;
    Array.from(files).forEach(file => {
      if(file.size >= CHAT_LOCALE.ATTACHMENT_MAXIMUM_SIZE ){
        this.toastExceedingLimit(file.name)
      }else{
        const url = URL.createObjectURL(file);
        this.files.push({file, url})
        this.fileUrls.push({url, name: file.name, type: file.type});
        this.focusInput();
      }
    })
  }

  focusInput() {
    if (!this.chatInput) return;
    this.chatInput.focusInput();
  }

}
</script>

<style lang="scss" scoped>
.room-footer-input-container {
  border-bottom-right-radius: 4px;
}
.message-input{
  flex: auto;
  max-width: calc(100% - 100px);
  ::v-deep div[data-ph="Type message"] {
      background: var(--chat-message-bg-color);
  }
}
.no-pointer {
  pointer-events: none;
}
.no-pointer-stroke {
  pointer-events: stroke;
}

.message-add-attachment, .message-emoji, .message-cancel-edit, .message-send, .message-record-screen{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 35px;
  height: inherit;
  &.disabled {
    &:hover {
      transform: none;
      opacity: unset;
    }
    i{
      color: #999;
      cursor: not-allowed;
    }
  }
}
</style>