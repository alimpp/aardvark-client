<template>
  <div class="d-flex w-100" :class="{'flex-row-reverse': isMine}">
    <MessageAvatar :message="message" :store="store" />
    <MessageBubble class="bubble" :message="message">
      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
        <MessageOptions
          v-if="!isErrored && !isReadOnly"
          class="ml-2"
          :message="message"
          :actions="actions"
          @onHandleAction="onHandleAction"
        />
      </div>

      <MessageReply v-if="hasReply" :message="message" />

      <MessageVideo
        class="video"
        :message="message"
        :type="message.mimetype"
        disablepictureinpicture
        playsinline
        controls
        controlslist="nodownload noplaybackrate"
        preload="metadata"
        muted="true"
      />
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
import {Component} from "vue-property-decorator";
import MessageBubble from '@/components/Chat/MessageComponents/MessageBubble.vue';
import MessageUsername from '@/components/Chat/MessageComponents/MessageUsername.vue';
import MessageTimestamp from '@/components/Chat/MessageComponents/MessageTimestamp.vue';
import BaseChatMessage from "../Base/BaseChatMessage.vue";
import MessageVideo from '../MessageComponents/MessageVideo.vue';
import {CHAT_ACTIONS} from "@/utils/constants";
import {ValueOf} from "@/utils/generics";
import MessageAvatar from "../MessageComponents/MessageAvatar.vue";
import MessageContent from "../MessageComponents/MessageContent.vue";
import MessageOptions from "../MessageComponents/MessageOptions.vue";
import MessageReply from "../MessageComponents/MessageReply.vue";
import MessageRetry from "../MessageComponents/MessageRetry.vue";
import MessageSeen from "../MessageComponents/MessageSeen.vue";
import MessageSyncing from "../MessageComponents/MessageSyncing.vue";
@Component({
  name: "ChatVideoMessage",
  components: {MessageBubble, MessageVideo, MessageAvatar, MessageUsername, MessageTimestamp, MessageOptions, MessageContent, MessageSeen, MessageRetry, MessageReply, MessageSyncing}
})
export default class ChatVideoMessage extends BaseChatMessage {
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
.bubble {
  max-width: calc(100% - 100px);
}
.video{
  height: 250px;
}
</style>
