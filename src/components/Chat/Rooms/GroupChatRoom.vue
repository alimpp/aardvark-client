<template>
  <RoomContainer class="h-100">
    <RoomHeader :store="store" @titleClicked="onTitleClicked"  />
    <RoomTabs :store="store" />
    <RoomMessages :store="store" :showFloatButton="true"   />
    <div class="position-relative">
      <RoomReply :store="store" />
      <RoomFooter>
        <RoomFooterInput ref="input" :store="store" />
      </RoomFooter>
    </div>
  </RoomContainer>
</template>

<script lang="ts">
import {Component, Ref} from "vue-property-decorator";
import {DialogCSModule, GroupChatCSModule} from "@/store";
import RoomContainer from "@/components/Chat/RoomComponents/RoomContainer.vue";
import RoomMessages from "@/components/Chat/RoomComponents/RoomMessages.vue";
import RoomFooter from "@/components/Chat/RoomComponents/RoomFooter.vue";
import RoomFooterInput from "@/components/Chat/RoomComponents/RoomFooterInput.vue";
import RoomReply from "@/components/Chat/RoomComponents/RoomReply.vue";
import RoomTabs from "@/components/Chat/RoomComponents/RoomTabs.vue";
import RoomHeader from "@/components/Chat/RoomComponents/RoomHeader.vue";
import CoreDialog from '@/components/Core/CoreDialog.vue'
import BaseRoom from "../Base/BaseRoom.vue";
import ChatRoomMember from '@/components/Form/ChatRoomMember.vue'

@Component({
  name: "GroupChatRoom",
  components: {RoomContainer, RoomMessages, RoomFooter, RoomReply, RoomFooterInput, RoomTabs, RoomHeader, CoreDialog, ChatRoomMember }
})
export default class GroupChatRoom extends BaseRoom {
  isDialogOpen = false
  @Ref('input') input!: RoomFooterInput;

  get store() {
    return GroupChatCSModule;
  }

  activated() {
    this.input.focusInput();
  }

  deactivated() {
    this.store.clear();
  }

  onTitleClicked(){
    const content = ChatRoomMember
    const width = 900
    DialogCSModule.load({
      title: `${this.store.headerInfo.title} Members`,
      isShowingDialog: true,
      noClose: true,
      noConfirm: true,
      width: width,
      content
    });


  }

}
</script>

<style lang="scss" scoped>
::v-deep .room-messages{
  margin-top: auto;
}
</style>