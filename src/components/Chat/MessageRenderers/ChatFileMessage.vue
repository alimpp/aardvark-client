<template>
  <div class="d-flex w-100" :class="{'flex-row-reverse': isMine}">
    <MessageAvatar :message="message" :store="store" />
    <MessageBubble class="bubble" :message="message">
      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
        <MessageOptions v-if="!isErrored && !isReadOnly" class="ml-2" :message="message" :actions="actions" @onHandleAction="onHandleAction" />
      </div>
      
      <MessageReply v-if="hasReply" :message="message"/>
      <MessageFile :message="message" />
      <MessageContent v-if="hasContent" class="mt-1" :message="message" />

      <div class="d-flex justify-content-end align-items-center">
        <MessageRetry v-if="isErrored" :message="message" @retry="onRetry" />
        <MessageTimestamp v-if="!isSyncing" :message="message" />
        <MessageSeen v-if="!isSyncing" :message="message" :store="store" />
        <MessageSyncing v-if="isSyncing" :message="message" />
      </div>
    </MessageBubble>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import MessageBubble from '@/components/Chat/MessageComponents/MessageBubble.vue';
import MessageAvatar from '@/components/Chat/MessageComponents/MessageAvatar.vue';
import MessageUsername from '@/components/Chat/MessageComponents/MessageUsername.vue';
import MessageTimestamp from '@/components/Chat/MessageComponents/MessageTimestamp.vue';
import MessageOptions from '@/components/Chat/MessageComponents/MessageOptions.vue';
import MessageContent from '@/components/Chat/MessageComponents/MessageContent.vue';
import MessageSeen from '@/components/Chat/MessageComponents/MessageSeen.vue';
import MessageFile from '@/components/Chat/MessageComponents/MessageFile.vue';
import BaseChatMessage from "../Base/BaseChatMessage.vue";
import MessageRetry from '@/components/Chat/MessageComponents/MessageRetry.vue';
import { CHAT_ACTIONS } from "@/utils/constants";
import {ValueOf} from '@/utils/generics';
import MessageReply from '@/components/Chat/MessageComponents/MessageReply.vue';
import MessageSyncing from '@/components/Chat/MessageComponents/MessageSyncing.vue';

@Component({
  name: "ChatFileMessage",
  components: {MessageBubble, MessageAvatar, MessageUsername, MessageTimestamp, MessageOptions, MessageContent, MessageSeen, MessageFile, MessageRetry, MessageReply, MessageSyncing}
})
export default class ChatFileMessage extends BaseChatMessage {

  get actions() {
    const msgActions: ValueOf<typeof CHAT_ACTIONS>[] = [];
    this.canReply && msgActions.push(CHAT_ACTIONS.REPLY_MESSAGE);
    this.canEdit && msgActions.push(CHAT_ACTIONS.EDIT_MESSAGE)
    this.canDelete && msgActions.push(CHAT_ACTIONS.DELETE_MESSAGE)
    return msgActions;
  }

}
</script>

<style lang="scss" scoped>
.bubble{
  max-width: calc(100% - 100px);
}
</style>