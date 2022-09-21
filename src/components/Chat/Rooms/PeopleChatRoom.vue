<template>
  <RoomContainer class="h-100">
    <RoomMessages :store="store"  :showFloatButton="true"  />
    <div class="position-relative">
      <RoomReply ref="reply" :store="store" />
      <RoomFooter>
        <RoomFooterInput ref="input" :store="store" />
      </RoomFooter>
    </div>
  </RoomContainer>
</template>

<script lang="ts">
import {Component, Ref} from "vue-property-decorator";
import {PeopleChatCSModule} from "@/store";
import RoomContainer from "@/components/Chat/RoomComponents/RoomContainer.vue";
import RoomMessages from "@/components/Chat/RoomComponents/RoomMessages.vue";
import RoomFooter from "@/components/Chat/RoomComponents/RoomFooter.vue";
import RoomFooterInput from "@/components/Chat/RoomComponents/RoomFooterInput.vue";
import RoomReply from "@/components/Chat/RoomComponents/RoomReply.vue";
import BaseRoom from "../Base/BaseRoom.vue";

@Component({
  name: "PeopleChatRoom",
  components: {RoomContainer, RoomMessages, RoomFooter, RoomFooterInput, RoomReply}
})
export default class PeopleChatRoom extends BaseRoom {
  @Ref('reply') reply!: RoomReply;
  @Ref('input') input!: RoomFooterInput;

  get store() {
    return PeopleChatCSModule;
  }

  activated() {
    this.input.focusInput();
  }

  deactivated() {
    this.store.clear();
  }

}
</script>

<style lang="scss" scoped>
::v-deep .checkmark i {
  cursor: default;
}
::v-deep .room-messages{
  margin-top: auto;
}
</style>