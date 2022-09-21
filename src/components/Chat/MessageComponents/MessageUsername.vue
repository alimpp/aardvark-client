<template>
  <div class="text-username" :class="{'username-reply': !message.deleted && message.replyMessage}">
    <span class="username">{{ message.username }}</span>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageUsername"
})
export default class MessageUsername extends BaseMessageComponent {}
</script>

<style lang="scss" scoped>
.text-username {
  font-size: 14px;
  font-style: normal;
  font-weight: lighter;
  color: var(--chat-message-color-username);
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.username{
  flex: auto;
  color: var(--chat-message-color);
  font-weight: 450;
}

.username-reply {
  margin-bottom: 5px;
}
</style>
