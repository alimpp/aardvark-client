<template>
  <RoomContainer class="h-100">
    <RoomMessages :store="store" />
  </RoomContainer>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import {AttachmentMediaCSModule} from "@/store";
import RoomContainer from "@/components/Chat/RoomComponents/RoomContainer.vue";
import RoomMessages from "@/components/Chat/RoomComponents/RoomMessages.vue";
import BaseRoom from "../Base/BaseRoom.vue";

@Component({
  name: "AttachmentMediaRoom",
  components: {RoomContainer, RoomMessages}
})
export default class AttachmentMediaRoom extends BaseRoom {

  get store() {
    return AttachmentMediaCSModule;
  }

}
</script>

<style lang="scss" scoped>
$gap: 0.5rem;
::v-deep .room-messages{
  flex-flow: row wrap !important;
  gap: 0 $gap;
  .room-message{
    flex: 0 calc(50% - #{$gap});
    .room-message-container{
      height: 100%;
    }
  }
}
</style>
