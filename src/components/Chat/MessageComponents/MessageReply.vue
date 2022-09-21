<template>
  <div @click="repliedMessageClicked" class="reply-message">
    <div class="reply-username">{{ replyUsername }}</div>
    <MessageImage v-if="replyHasImage" class="mb-1" width="100%" :message="replyMessage" :noZoom="true" />
    <MessageFile v-if="replyHasFile" class="mb-1" :message="replyMessage" />
    <MessageContent class="reply-content" :message="replyMessage" />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import MessageContent from '@/components/Chat/MessageComponents/MessageContent.vue';
import MessageImage from '@/components/Chat/MessageComponents/MessageImage.vue';
import MessageFile from '@/components/Chat/MessageComponents/MessageFile.vue';
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';
import {EVENTS} from "@/utils/constants";
import { EventBus } from "@/utils/eventBus";

@Component({
  name: "MessageReply",
  components: {MessageContent, MessageImage, MessageFile, CoreScrollbar}
})
export default class MessageReply extends BaseMessageComponent {

  get replyMessage() {
    return this.message.replyMessage;
  }

  get replyUsername() {
    return this.replyMessage?.username;
  }

  get replyHasImage() {
    return this.replyMessage?.mimetype?.includes('image');
  }

  get replyHasFile() {
    return !this.replyHasImage && this.replyMessage?.attachment;
  }

  get replyHasContent() {
    return !!this.replyMessage?.content;
  }

  get replyMessageImagePath() {
    return this.replyMessage?.attachment;
  }

  repliedMessageClicked(event: MouseEvent){
    EventBus.$emit(EVENTS.REPLY_MESSAGE_CLICKED, this.message);
  }
  
}
</script>

<style lang="scss" scoped>
.reply-message {
  background: var(--chat-message-bg-color-reply);
  border-radius: 4px;
  margin: -1px -5px 8px;
  padding: 8px 10px;
  cursor: pointer;

  .reply-username {
    color: var(--chat-message-color-reply-username);
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 2px;
  }

  .reply-content {
    font-size: 12px;
    color: var(--chat-message-color-reply-content);
  }
}
</style>