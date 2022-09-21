<template>
  <div class="d-flex justify-content-center w-100" :class="{'flex-row-reverse': isMine}">
    <MessageBubble :message="message">

      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
      </div>
      
      <MessageAudio :width="189" :message="message" preload="metadata" controls controlsList="nodownload noplaybackrate" :type="message.mimetype" />

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
import MessageAudio from '@/components/Chat/MessageComponents/MessageAudio.vue';

@Component({
  name: "AttachmentMediaAudioMessage",
  components: {MessageBubble, MessageUsername, MessageTimestamp, MessageAudio}
})
export default class AttachmentMediaAudioMessage extends BaseChatMessage {}
</script>