<template>
  <RoomContainer>
    <RoomTabs :store="store" />
    <RoomMessages :isSlider="isSlider" :showFloatButton="true" :store="store" />
    <div class="position-relative">
      <RoomReply :store="store" />
      <RoomFooter>
        <RoomFooterInput ref="input" :store="store" />
      </RoomFooter>
    </div>    
  </RoomContainer>
</template>

<script lang="ts">
import {Component, Prop, Ref} from "vue-property-decorator";
import {EntityChatCSModule} from "@/store";
import RoomContainer from "@/components/Chat/RoomComponents/RoomContainer.vue";
import RoomMessages from "@/components/Chat/RoomComponents/RoomMessages.vue";
import RoomFooter from "@/components/Chat/RoomComponents/RoomFooter.vue";
import RoomTabs from "@/components/Chat/RoomComponents/RoomTabs.vue";
import RoomFooterInput from "@/components/Chat/RoomComponents/RoomFooterInput.vue";
import RoomReply from "@/components/Chat/RoomComponents/RoomReply.vue";
import BaseRoom from "../Base/BaseRoom.vue";

@Component({
  name: "EntityChatRoom",
  components: {RoomContainer, RoomMessages, RoomFooter, RoomTabs, RoomReply, RoomFooterInput}
})
export default class EntityChatRoom extends BaseRoom {
  @Ref('input') input!: RoomFooterInput;
  @Prop({ required: false , default:false}) isSlider!: boolean;
  get store() {
    return EntityChatCSModule;
  }

}
</script>

<style lang="scss" scoped>
::v-deep .room-messages{
  margin-top: auto;
}
</style>