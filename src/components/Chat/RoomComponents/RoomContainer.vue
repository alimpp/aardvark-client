<template>
  <div class="w-100 mw-100 d-flex flex-column position-relative room-container">
    <slot />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({name: "RoomContainer"})
export default class RoomContainer extends BaseRoomComponent {
}
</script>

<style lang="scss" scoped>
.room-container{
  background: var(--chat-content-bg-color);
  color: var(--chat-color);
  border: var(--chat-container-border);
  border-radius: var(--chat-container-border-radius);
  box-shadow: var(--chat-container-box-shadow);
  white-space: normal;
  overflow-wrap: break-word;
  overflow: auto;
  transform: translateZ(0);
}
</style>