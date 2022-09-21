<template>
  <span
    class="text-errored d-flex align-items-center w-100 justify-content-end position-relative"
    @mouseenter="canShowRetryLabel = true"
    @mouseleave="canShowRetryLabel = false"
    @click="retryMessage">
      <transition-group tag="div" name="slide-up" class="position-relative w-100 h-100">
        <span class="position-absolute retry-label" :key="1" v-if="!canShowRetryLabel">Failed to send</span>
        <span class="position-absolute retry-label" :key="2" v-if="canShowRetryLabel">Retry</span>
      </transition-group>
      <i class="material-icons">replay</i>
  </span>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageRetry"
})
export default class MessageRetry extends BaseMessageComponent {
  canShowRetryLabel = false;

  retryMessage() {
    this.canShowRetryLabel = false;
    this.$emit('retry', this.message);
  }

}
</script>

<style lang="scss" scoped>
.text-errored{
  cursor: pointer;
  height: 15px;
  min-width: 100px;
  font-size: 10px;
  color: var(--chat-message-color-timestamp);
  &:hover{
    color: var(--brand-color);
  }
  .retry-label{
    top: 0;
    right: 4px;
  }
  i{
    font-size: 15px;
  }
}
</style>