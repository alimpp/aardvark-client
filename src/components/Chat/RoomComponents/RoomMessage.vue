<template>
  <div class="room-message">

    <RoomNewMessageBanner v-if="showNewMessageAbove && !showNewMessageBelow" :store="store" />

    <RoomInfoMessage v-if="canShowDateDivider && showDate">{{date}}</RoomInfoMessage>

    <div class="room-message-container w-100" :class="{'offset-current': isMine}">
      <component :class="{'click-reply-message': isReplyActive}" :is="currentMessageComponent" :message="message" :store="store" />
    </div>

    <RoomNewMessageBanner v-if="showNewMessageBelow && !showNewMessageAbove" :store="store" />

  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SimpleBar from 'simplebar-vue';
import { Prop, Watch } from "vue-property-decorator";
import MessageDM from "@/datamodels/messageDM";
import { MESSAGE_TYPE } from "@/utils/constants";
import ChatAuditMessage from "@/components/Chat/MessageRenderers/ChatAuditMessage.vue"
import ChatAudioMessage from "../MessageRenderers/ChatAudioMessage.vue";
import ChatVideoMessage from "@/components/Chat/MessageRenderers/ChatVideoMessage.vue"
import ChatFileMessage from "@/components/Chat/MessageRenderers/ChatFileMessage.vue"
import ChatImageMessage from "@/components/Chat/MessageRenderers/ChatImageMessage.vue"
import ChatTextMessage from "@/components/Chat/MessageRenderers/ChatTextMessage.vue"
import ChatDeletedMessage from "@/components/Chat/MessageRenderers/ChatDeletedMessage.vue"
import AttachmentMediaImageMessage from "@/components/Chat/MessageRenderers/AttachmentMediaImageMessage.vue";
import AttachmentMediaAudioMessage from "@/components/Chat/MessageRenderers/AttachmentMediaAudioMessage.vue";
import AttachmentMediaVideoMessage from "@/components/Chat/MessageRenderers/AttachmentMediaVideoMessage.vue";
import AttachmentDocumentMessage from "@/components/Chat/MessageRenderers/AttachmentDocumentMessage.vue";
import AttachmentLinkMessage from "@/components/Chat/MessageRenderers/AttachmentLinkMessage.vue";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";
import RoomInfoMessage from "@/components/Chat/RoomComponents/RoomInfoMessage.vue";
import RoomNewMessageBanner from "@/components/Chat/RoomComponents/RoomNewMessageBanner.vue";

@Component({
  name: "RoomMessages",
  components: {SimpleBar, RoomInfoMessage, RoomNewMessageBanner}
})
export default class RoomMessages extends BaseRoomComponent {
  @Prop({ required: true }) message!: MessageDM;
  @Prop({ default: 0 }) newMessageId!: number;
  currentMessageType: MESSAGE_TYPE | null = null;
  isReplyActive = false ;

  @Watch('message')
  async onMessageChange() {
    this.currentMessageType = await this.store.getMessageType(this.message);
  }

  get locale() {
    return this.store.locale;
  }

  get messages() {
    return this.store.messages;
  }

  get roomId() {
    return this.message.roomId;
  }

  public get index() {
    return this.messages.findIndex(message => message.id === this.messageId);
  }

  public get showDate() {
    return this.index > 0 && this.message.date !== this.messages[this.index - 1].date;
  }

  public get isLastSeenMessage() {
    return !this.isLastMessage && this.store.latestSeenMessageInfo[this.roomId] === this.message.id;
  }

  public get canShowDateDivider() {
    return this.store.canShowDateDivider;
  }

  public get canShowNewMessagesDivider() {
    return this.store.canShowNewMessageDivider;
  }

  public get date() {
    return this.message.date;
  }

  public get messageId() {
    return this.message.id;
  }

  public get isMine() {
    return this.message.isMine;
  }

  public get lastMessage() {
    return this.messages[this.messages.length - 1];
  }

  public get isLastMessage() {
    return this.lastMessage.id === this.message.id;
  }

  public get hasLastSeenMessage() {
    return !!this.store.latestSeenMessageInfo[this.roomId];
  }

  public get isFirstMessage() {
    return this.messages[0].id === this.messageId;
  }

  public get showNewMessageAbove() {
    return this.canShowNewMessagesDivider && this.isFirstMessage && !this.isMine && !this.hasLastSeenMessage;
  }

  public get showNewMessageBelow() {
    return this.canShowNewMessagesDivider && this.hasLastSeenMessage && this.isLastSeenMessage;
  }

  public handleClickOnRepliedMessage(){
    this.isReplyActive = true;
    window.setTimeout(() => {
      this.isReplyActive = false
    } ,2100)
  }

  public get readOnlyMessage() {
    return this.store.readOnlyData.message;
  }

  public get currentMessageComponent() {
    switch (this.currentMessageType) {
      case MESSAGE_TYPE.CHAT_AUDIT_MESSAGE:
        return ChatAuditMessage;
      case MESSAGE_TYPE.CHAT_IMAGE_MESSAGE:
        return ChatImageMessage;
      case MESSAGE_TYPE.CHAT_FILE_MESSAGE:
        return ChatFileMessage;
      case MESSAGE_TYPE.CHAT_DELETED_MESSAGE:
        return ChatDeletedMessage;
      case MESSAGE_TYPE.CHAT_TEXT_MESSAGE:
        return ChatTextMessage;
      case MESSAGE_TYPE.CHAT_AUDIO_MESSAGE:
        return ChatAudioMessage;
      case MESSAGE_TYPE.CHAT_VIDEO_MESSAGE:
        return ChatVideoMessage;
      case MESSAGE_TYPE.ATTACHMENT_MEDIA_IMAGE_MESSAGE:
        return AttachmentMediaImageMessage;
      case MESSAGE_TYPE.ATTACHMENT_MEDIA_AUDIO_MESSAGE:
        return AttachmentMediaAudioMessage;
      case MESSAGE_TYPE.ATTACHMENT_MEDIA_VIDEO_MESSAGE:
        return AttachmentMediaVideoMessage;
      case MESSAGE_TYPE.ATTACHMENT_DOCUMENT_MESSAGE:
        return AttachmentDocumentMessage;
      case MESSAGE_TYPE.ATTACHMENT_LINK_MESSAGE:
        return AttachmentLinkMessage;
      default:
        return ""
    }
  }

  async created(): Promise<void> {
    this.currentMessageType = await this.store.getMessageType(this.message);
  }

}
</script>

<style lang="scss" scoped>
.room-message{
  .click-reply-message{
    border-radius: 10px;
    animation: ReplyAnimation 2s;
    @keyframes ReplyAnimation {
      0%{background: none;}
      25%{
      background: rgba( 98, 98, 98, 0.25 );
      box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
      -webkit-backdrop-filter: blur( 0px );
      border-radius: 10px;
      }
      50%{background: none;}
      75%{
      background: rgba( 98, 98, 98, 0.25 );
      box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
      -webkit-backdrop-filter: blur( 0px );
      border-radius: 10px;
      }
    }
  }
  .room-message-container{
    display: flex;
    width: 100%;
    justify-content: flex-end;
    line-height: 1.4;
    flex-flow: row-reverse;
    &.offset-current{
      flex-flow: row;
    }
  }
}
</style>