<template>
  <div ref="scrollContainer" id="messages-container" class="h-100 overflow-y-auto d-flex flex-column-reverse scrollbar" v-on:scroll="handleScroll"  >
    <CoreSpinner v-if="canShowLoadingSpinner" class="loading-spinner" />
    <div  class="messages-container d-flex flex-column position-relative" :class="{'messages-hidden': canShowLoadingSpinner && !$wait.is(loadingState)}">
      <div v-if="canShowEmptyRoomMessage" class="text-started">{{ locale.CHAT_EMPTY }}</div>
      <div v-if="canShowMessagesStarted" class="text-started">{{ locale.CONVERSATION_STARTED }} {{ messages[0].date }}</div>
      <div v-if="canShowLoadMoreSpinner" class="load-more-container d-flex justify-content-center align-items-center overflow-hidden w-100">
        <CoreSpinner v-observe-visibility="{callback: (isVisible, entry) => loadMoreMessages(isVisible), throttle: 200}" />
      </div>

      <div v-if="!isScrollInDown && !canShowNoMessages && roomId && showFloatButton">
         <CoreBtn
          @click="handelScrollButton"
          type="button"
          size="lg"
          class="floating-container"
          fab
        >
          <span  class="material-icons h2  m-auto">keyboard_double_arrow_down</span>
        </CoreBtn>

      </div>

      <div class="d-flex flex-column room-messages">

        <RoomMessage
          :ref="`message-${message.id}`"
          v-for="message in messages"
          @clickReplyedMessageTo="onReplyMessageClicked"
          class="mt-2"
          :key="message.isMine ? message.temporaryId || message.id : message.id"
          :message="message"
          :store="store"
          v-observe-visibility="{
            callback: (isVisible, entry) => seen(isVisible, entry, message),
            once: true,
            intersection: {threshold: 0.9}
          }"
        />

        <RoomInfoMessage v-if="isReadOnly && !!roomId">{{readOnlyMessage}}</RoomInfoMessage>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Prop, Ref, Watch } from "vue-property-decorator";
import MessageDM from "@/datamodels/messageDM";
import SimpleBar from 'simplebar-vue';
import RoomMessage from "@/components/Chat/RoomComponents/RoomMessage.vue";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import { WaitStates } from "@/utils/vuewait";
import {ApplicationDSModule} from '@/store'
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";
import RoomInfoMessage from "@/components/Chat/RoomComponents/RoomInfoMessage.vue";
import { EventBus } from "@/utils/eventBus";
import {EVENTS} from "@/utils/constants";
import CoreBtn from '@/components/Core/CoreBtn.vue'

@Component({
  name: "RoomMessages",
  components: {SimpleBar, RoomMessage, CoreSpinner, RoomInfoMessage, CoreBtn}
})
export default class RoomMessages extends BaseRoomComponent {
  @Prop({ required: false , default:false}) isSlider!: boolean;
  @Prop({ required: false , default:false}) showFloatButton!: boolean;
  @Ref('roomMessages') roomMessages!: RoomMessage[];
  @Ref('scrollContainer') scrollContainer!: HTMLDivElement;
  isScrollInDown = true;
  isLoadingMoreMessages = false;
  showLoadingSpinnerForReplyClick = false;
  replyMessageId: number | null = null ;
  replyEventListenerRegistered = false;
  replyMessageCallBack = (message: MessageDM) => this.onReplyMessageClicked(message);

  @Watch("messages", {deep: true})
  async onMessagesChange(newVal: MessageDM[], oldVal: MessageDM[]) {
    window.setTimeout(() => {
      if(this.replyMessageId) {
        this.handleClickOnRepliedMessage(this.replyMessageId);
      }
    }, 1);

    // New message scroll
    if(newVal.length === oldVal.length + 1 && !oldVal.some(msg => msg.id === newVal[newVal.length - 1]?.id) && newVal[newVal.length - 1]?.isMine) {
      this.scrollToBottom(true);
    }
  }

  @Watch("roomId")
  async onRoomIdChange() {
    this.isLoadingMoreMessages = false;
  }

  handleClickOnRepliedMessage(messageId: number){
    if((this.isSlider && ApplicationDSModule.chatSidebarOpen) || (!this.isSlider && !ApplicationDSModule.chatSidebarOpen)){
      const messageReference = this.$refs[`message-${messageId}`]?.[0] as RoomMessage | undefined;
      if(messageReference){
        this.showLoadingSpinnerForReplyClick = false;
        messageReference.$el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
        messageReference.handleClickOnRepliedMessage();
        this.replyMessageId = null;
      } else {
        this.replyMessageId = messageId;
        this.loadMoreMessages(true, 100);
        this.showLoadingSpinnerForReplyClick = true;
      }
    }
  }

  onReplyMessageClicked(message: MessageDM){
    if(this.messages.includes(message, 0) && message.replyMessage){
      this.handleClickOnRepliedMessage(message.replyMessage.id)
    }
  }

  async activateReplyMessageListener() {
    if (!this.replyEventListenerRegistered) {
      EventBus.$on(EVENTS.REPLY_MESSAGE_CLICKED, this.replyMessageCallBack);
      this.replyEventListenerRegistered = true;
    }
  }

  activated() {
    this.activateReplyMessageListener();
  }

  mounted() {
    this.activateReplyMessageListener();
  }

  destroyed() {
    EventBus.$off(EVENTS.REPLY_MESSAGE_CLICKED, this.replyMessageCallBack)
    this.replyEventListenerRegistered = false;
  }

  handleScroll() {
    this.isScrollInDown =   this.scrollContainer.scrollTop > - 65   ;
  }
  handelScrollButton(){
     this.scrollToBottom(true)
  }

  get locale() {
    return this.store.locale;
  }

  public get messages() {
    return this.store.messages;
  }

  public get roomId() {
    return this.store.roomId;
  }

  public get allMessagesLoaded() {
    return this.store.allMessagesLoaded;
  }

  public get canShowNoMessages() {
    return this.roomId && !this.store.isCacheUndefined && !this.messages.length && this.allMessagesLoaded;
  }

  public get canShowMessagesStarted() {
    return !!this.messages.length && this.allMessagesLoaded && this.store.canShowConversationStarted;
  }

  public get take() {
    return this.store.take;
  }

  public get loadingState() {
    return WaitStates.ACTION_CHAT_LOADING
  }

  public get showLoadingSpinner() {
    return (this.store.isCacheUndefined && !!this.roomId);
  }

  public get canShowLoadingSpinner() {
    return this.store.isCacheUndefined && !!this.roomId  || (this.showLoadingSpinnerForReplyClick);
  }

  public get canShowLoadMoreSpinner() {
    return !!this.roomId && !this.allMessagesLoaded && !this.store.isCacheUndefined && !!this.messages.length;
  }

  public get isCacheUndefined() {
    return this.store.isCacheUndefined;
  }

  public get canShowEmptyRoomMessage() {
    return !!this.roomId && !this.isCacheUndefined && !this.messages.length;
  }

  public get isDisableSeen() {
    return this.store.isDisableSeen;
  }

  seen(isVisible: boolean, entry: IntersectionObserverEntry, message: MessageDM) {
    // If tmp id, not visible, is own message, or has seen the message already, do nothing.
    if(message.id === -1 || !isVisible || message.isMine || message.seenAt || this.isDisableSeen) return;

    // Get the most recent message from another user.
    const lastOtherMessage = [...this.messages].reverse().find(messageItem => !messageItem.isMine && !message.seenAt);

    // If we are on that last unseen message, send it to SEEN, else flag message as seen
    lastOtherMessage?.id === message.id ? this.store.see(message) : this.store.flagAsSeen(message);
  }

  async loadMoreMessages(isVisible: boolean, take = this.store.take) {
    if(isVisible && !this.isLoadingMoreMessages) {
      this.isLoadingMoreMessages = true;
      const {scrollTop} = this.scrollContainer;
      await this.store.fetchMessages({id: this.store.roomId, skip: this.messages.length, take});
      await this.$nextTick();
      this.scrollContainer.scrollTo({top: scrollTop});
      this.isLoadingMoreMessages = false;
    }
  }

  scrollToBottom(force = false) {
    if(force) window.setTimeout(() => this.scrollContainer.scrollTo({top: 0}));
    else if(this.scrollContainer.scrollTop === 0) window.setTimeout(() => this.scrollContainer.scrollTo({top: 0}));
  }

}
</script>

<style lang="scss" scoped>
.loading-spinner{
  position: fixed;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.load-more-container {
  height: 40px;
  padding: 0;
  margin-top: 10px;
  top: 0;
  left: 0;
}

.messages-container {
  padding: 0 5px 5px;
  flex: 1 1 auto;
  &.messages-hidden {
    opacity: 0;
  }
}
.text-started {
  font-size: 14px;
  color: var(--chat-message-color-started);
  font-style: italic;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  height: 25px;
  line-height: 25px;
}
.floating-container{
  position: fixed;
  bottom: 0;
  right: 0;
  margin-right: 1rem;
  margin-bottom: 5rem;
  font-size: 1.5rem;
  z-index: 999;
}
.overflow-y-auto {
  overflow-y: auto;
}
.scrollbar{
  scrollbar-color: rgba(170, 170, 170, 0.5) transparent;
  scrollbar-width: auto;
}
.scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(170, 170, 170, 0.5);
  opacity: 0.5;
  border-radius: 5px;
}

</style>
