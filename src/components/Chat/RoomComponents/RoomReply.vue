<template>
  <transition name="slide-up">
    <div v-if="isReplying" class="d-flex align-items-center w-100 reply-container p-2">
      <CoreScrollbar class="w-100 reply-box p-2">
        <img
          v-if="isImageCheck(replyMessage.mimetype)"
          :src="replyMessage.attachment"
          class="reply-message-image mr-1"
        />
        <div class="text-left reply-info">
          <div class="reply-username">{{ replyMessage.username }}</div>
          <div class="reply-content">
            <MessageContent :message="replyMessage" />
          </div>
        </div>
      </CoreScrollbar>
      <div v-if="!isDisabled" class="icon-reply p-2">
        <div class="svg-button" @click="resetMessage">
          <i class="material-icons">close</i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from "vue-class-component";
import MessageContent from "@/components/Chat/MessageComponents/MessageContent.vue";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';

@Component({
  name: "RoomReply",
  components: {MessageContent, CoreScrollbar}
})
export default class RoomReply extends BaseRoomComponent {

  isImageCheck(mimetype: string) {
    return mimetype.includes('image');
  }

  resetMessage() {
    this.store.setReplyMessage(null);
  }

  get replyMessage() {
    return this.store.replyMessage;
  }

  get isReplying() {
    return !!this.replyMessage;
  }

  get isDisabled() {
    return this.store.editMessage !== null;
  }

}
</script>

<style lang="scss" scoped>
.reply-container{
  background: var(--chat-footer-bg-color);
  bottom: 100%;
  left: 0;
  box-sizing: border-box;
  border-radius: 4px 4px 0 0;

  .reply-box{
    background: var(--chat-footer-bg-color-reply);
    border-radius: 4px;
    max-height: 250px;

    .reply-message-image{
      max-height: 100px;
    }
    .reply-info {
      overflow: hidden;
      text-align: left;
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
  }
}
</style>
