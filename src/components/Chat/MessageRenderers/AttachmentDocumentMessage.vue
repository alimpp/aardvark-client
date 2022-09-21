<template>
  <div class="d-flex justify-content-center w-100" :class="{'flex-row-reverse': isMine}">
    <MessageBubble class="w-100 d-flex flex-column" :message="message">

      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
      </div>
      
      <MessageFile class="col p-0" :message="message" />

      <div class="d-flex justify-content-start align-items-center">
        <MessageTimestamp :message="message" format="L LT" />
      </div>

    </MessageBubble>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import MessageBubble from '@/components/Chat/MessageComponents/MessageBubble.vue';
import MessageUsername from '@/components/Chat/MessageComponents/MessageUsername.vue';
import MessageTimestamp from '@/components/Chat/MessageComponents/MessageTimestamp.vue';
import BaseChatMessage from "../Base/BaseChatMessage.vue";
import MessageFile from '@/components/Chat/MessageComponents/MessageFile.vue';

@Component({
  name: "AttachmentDocumentMessage",
  components: {MessageBubble, MessageUsername, MessageTimestamp, MessageFile}
})
export default class AttachmentDocumentMessage extends BaseChatMessage {}
</script>