<template>
  <div class="d-flex w-100" :class="{'flex-row-reverse': isMine}">
    <MessageAvatar :message="message" :store="store" />
    <MessageBubble class="bubble" :message="message">

      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
      </div>
      
      <div class="d-flex align-items-center">
        <i class="material-icons mr-1">block</i>
        <span> {{locale.MESSAGE_DELETED}} </span>
      </div>

      <div class="d-flex justify-content-end align-items-center">
        <MessageTimestamp :message="message" />
        <MessageSeen :message="message" :store="store" />
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
import MessageSeen from '@/components/Chat/MessageComponents/MessageSeen.vue';
import BaseChatMessage from "../Base/BaseChatMessage.vue";

@Component({
  name: "ChatDeletedMessage",
  components: {MessageBubble, MessageAvatar, MessageUsername, MessageTimestamp, MessageSeen}
})
export default class ChatDeletedMessage extends BaseChatMessage {
  
  get locale() {
    return this.store.locale;
  }

}
</script>

<style lang="scss" scoped>
.bubble{
  max-width: calc(100% - 100px);
}
</style>