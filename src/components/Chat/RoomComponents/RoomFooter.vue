<template>
  <div class="position-relative room-footer">
    <slot />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({name: "RoomFooter"})
export default class RoomFooter extends BaseRoomComponent {}
</script>

<style lang="scss" scoped>
.room-footer{
  border-bottom-right-radius: 4px;
  background: var(--chat-footer-bg-color);
  padding: 10px 8px 10px;
}
</style>
