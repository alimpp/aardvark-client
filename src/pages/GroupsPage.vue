<template>
  <div :key="$route.params.roomId" id="GroupChatPage" class="d-flex w-100 h-100 position-relative overflow-hidden">
    <div class="group-container flex-grow-1 w-100 h-100">
      <GroupsChatList ref="groupList"  />
      <GroupChatRoom class="h-100" />
    </div>
    <CoreSidebar
      class="h-100"
      v-model="isSidebarOpen"
      :width="440"
      :loading="false"
      :no-shadow="false"
      :no-close-btn="true"
      :layer="false"
      :mini="true"
      :expand-on-hover="false"
      :mobile="isMobileScreenSize"
      right>
        <Attachments class="attachments" :store="store" />
    </CoreSidebar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GroupChatRoom from "@/components/Chat/Rooms/GroupChatRoom.vue";
import GroupsChatList from "@/components/GroupsChat/GroupsChatList.vue";
import CoreSidebar from "@/components/Core/CoreSidebar.vue";
import {State} from "vuex-class";
import {GroupChatCSModule, GroupRoomsCSModule} from "@/store";
import Attachments from "@/components/DetailSidebar/Attachments.vue";
import router from "@/router";
import { Watch } from "vue-property-decorator";

@Component({
  name: "GroupsPage",
  components: {GroupsChatList, GroupChatRoom, CoreSidebar, Attachments}
})
export default class GroupsPage extends Vue {
  @State('isMobileScreenSize', {namespace: 'applicationds'}) isMobileScreenSize!: boolean;

  get store() {
    return GroupChatCSModule;
  }

  get isSidebarOpen() {
    return GroupRoomsCSModule.isSidebarOpen;
  }

  set isSidebarOpen(value: boolean) {
    GroupRoomsCSModule.setSidebarOpen(value);
  }


  @Watch('$route.params.roomId')
  async function(roomId) {
      const id = Number(this.$route.params.roomId);
      const group = GroupRoomsCSModule.rooms.find(room => room.privateRoomId == id || room.publicRoomId == id);
      if(group!=undefined && id!=undefined) {
        await GroupRoomsCSModule.load();
        GroupRoomsCSModule.setSidebarOpen(true);
        GroupRoomsCSModule.setCurrentGroupId(group.id)
        GroupRoomsCSModule.updateRoomId(roomId)
        GroupRoomsCSModule.resetUnreadCount({group, roomId});
        const room = GroupRoomsCSModule.rooms?.find(room => room?.id === group?.id) || null;
        if (room)
            (this.$refs.groupList as GroupsChatList).onRoomChange({ room, scrollToRoom: true });

      }
       router.push({ name: router.currentRoute.name as (string | undefined) } );
  }

  async activated() {
    await GroupRoomsCSModule.load();
    GroupChatCSModule.activate();
  }

}
</script>

<style lang="scss" scoped>
.group-container{
  display: grid;
  grid-template-columns: minmax(350px, 1fr) 4fr;
  grid-template-rows: 100%;
}
::v-deep {
  .max-height-moduletab-content {
    height: 100% !important;
  }
}
</style>