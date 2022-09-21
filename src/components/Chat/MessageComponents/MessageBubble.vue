<template>
  <div class="message-card"
    :class="{
      'message-current': isMine,
      'message-deleted': isDeleted
    }">
    <slot />
  </div>
</template>

<script lang="ts">
import { ProfileDSModule } from "@/store";
import { Component } from "vue-property-decorator";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageBubble"
})
export default class MessageBubble extends BaseMessageComponent {

  public get currentUserId() {
    return ProfileDSModule?.id;
  }

  public get isDeleted(): boolean {
    return !!this.message.deleted;
  }

  public get isMine(): boolean {
    return this.message.isMine;
  }

}
</script>

<style lang="scss" scoped>
.message-card {
  background: var(--chat-message-bg-color);
  color: var(--chat-message-color);
  border-radius: 8px;
  font-size: 14px;
  padding: 6px 9px 3px;
  white-space: pre-line;
  max-width: 100%;
  text-align: left;
  word-break: break-word;
  -webkit-transition-property: box-shadow, opacity;
  transition-property: box-shadow, opacity;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow;
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 1px -1px rgba(0, 0, 0, 0.11), 0 1px 2px -1px rgba(0, 0, 0, 0.11);
  box-sizing: border-box;

  &.message-current{
    background: var(--chat-message-bg-color-me) !important;
  }

  &.message-highlight{
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.11), 0 1px 5px -1px rgba(0, 0, 0, 0.11);
  }

  &.message-deleted {
    color: var(--chat-message-color-deleted) !important;
    font-size: 13px !important;
    font-style: italic !important;
    background: var(--chat-message-bg-color-deleted) !important;
  }

}
</style>