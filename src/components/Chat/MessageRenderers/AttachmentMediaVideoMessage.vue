<template>
  <div class="d-flex justify-content-center w-100" :class="{'flex-row-reverse': isMine}">
    <MessageBubble :message="message">

      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
      </div>
      
      <MessageVideo class="video" :message="message" controls disablepictureinpicture controlslist="nodownload noplaybackrate" muted="true" preload="metadata" playsinline />

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
import MessageVideo from '@/components/Chat/MessageComponents/MessageVideo.vue';

@Component({
  name: "AttachmentMediaVideoMessage",
  components: {MessageBubble, MessageUsername, MessageTimestamp, MessageVideo}
})
export default class AttachmentMediaVideoMessage extends BaseChatMessage {}
</script>

<style lang="scss" scoped>
.video{
  height: 189px;
  width: 189px;
}
</style>