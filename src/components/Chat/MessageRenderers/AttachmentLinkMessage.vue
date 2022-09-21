<template>
  <div class="d-flex justify-content-center w-100" :class="{'flex-row-reverse': isMine}">
    <MessageBubble class="w-100 d-flex flex-column" :message="message">

      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
      </div>

      <div class="col p-2">
        <div class="pb-1">{{urlTitle}}</div>
        <div class="pb-1"><a :href="urlPath" target="_blank" rel="noopener noreferrer">{{urlPath}}</a></div>
      </div>

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
import MessageImage from '@/components/Chat/MessageComponents/MessageImage.vue';
import AttachmentLinkDM from "@/datamodels/attachmentLinkDM";

@Component({
  name: "AttachmentLinkMessage",
  components: {MessageBubble, MessageUsername, MessageTimestamp, MessageImage}
})
export default class AttachmentLinkMessage extends BaseChatMessage {

  public get urlTitle() {
    return (this.message as unknown as AttachmentLinkDM).title;
  }

  public get urlPath() {
    return (this.message as unknown as AttachmentLinkDM).url;
  }

}
</script>