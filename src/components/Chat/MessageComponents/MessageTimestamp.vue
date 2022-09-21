<template>
  <span v-if="!isErrored" class="timestamp pr-1">{{timestamp}}</span>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import dayjs from "dayjs";

@Component({
  name: "MessageTimestamp"
})
export default class MessageTimestamp extends BaseMessageComponent {
  @Prop({default: 'LT'}) readonly format!: string;

  get isErrored() {
    return this.message.isErrored;
  }

  get createdAt() {
    return this.message.createdAt;
  }

  get timestamp() {
    return dayjs.utc(this.createdAt).local().format(this.format);
  }

}
</script>

<style lang="scss" scoped>
.timestamp{
  font-size: 10px;
  color: var(--chat-message-color-timestamp);
}
</style>