<template>
  <div class="text-center room-new-message">
    {{ locale.NEW_MESSAGES }}
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({name: "RoomNewMessageBanner"})
export default class RoomNewMessageBanner extends BaseRoomComponent {

  get locale() {
    return this.store.locale;
  }

}
</script>

<style lang="scss" scoped>
.room-new-message{
  color: var(--chat-message-color-new-messages);
  position: relative;
  text-align: center;
  font-size: 13px;
  padding: 10px 0;

  &:before, &:after{
    border-top: 1px solid var(--chat-message-color-new-messages);
    content: "";
    left: 0;
    position: absolute;
    top: 50%;
    width: calc(50% - 60px);
  }

  &:before{
    left: auto;
    right: 0;
  }
}
</style>