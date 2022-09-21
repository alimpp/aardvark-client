<template>
  <div class="text-center">
    <span class="notification d-inline-flex p-2 my-3 text-capitalize">
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({name: "RoomInfoMessage"})
export default class RoomInfoMessage extends BaseRoomComponent {
}
</script>

<style lang="scss" scoped>
.notification{
  white-space: normal;
  overflow-wrap: break-word;
  border-radius: 4px;
  font-size: 12px;
  color: var(--chat-message-color-date);
  background: var(--chat-message-bg-color-date);
  box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 1px -1px rgba(0, 0, 0, 0.11), 0 1px 2px -1px rgba(0, 0, 0, 0.11);
}
</style>