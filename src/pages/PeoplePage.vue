<template>
  <div :key="$route.params.roomId" id="ChatPage" class="d-flex w-100 h-100 position-relative">
    <div class="direct-container flex-grow-1 w-100 h-100">
      <DirectList ref="userList"/>
      <PeopleChatRoom class="h-100" />
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
        <Attachments :store="store" />
    </CoreSidebar>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PeopleChatRoom from "@/components/Chat/Rooms/PeopleChatRoom.vue";
import DirectList from "@/components/Direct/DirectList.vue";
import CoreSidebar from "@/components/Core/CoreSidebar.vue";
import {State} from "vuex-class";
import {PeopleChatCSModule, PeopleRoomsCSModule} from "@/store";
import Attachments from "@/components/DetailSidebar/Attachments.vue";
import router from "@/router";
import { Watch } from "vue-property-decorator";
import { EventBus } from "@/utils/eventBus";
import { EVENTS } from "@/utils/constants";
import DirectDM from "@/datamodels/directDM";

@Component({
  name: "PeoplePage",
  components: {DirectList, PeopleChatRoom, CoreSidebar, Attachments}
})
export default class PeoplePage extends Vue {
  @State('isMobileScreenSize', {namespace: 'applicationds'}) isMobileScreenSize!: boolean;

  get store() {
    return PeopleChatCSModule;
  }

  get isSidebarOpen() {
    return PeopleRoomsCSModule.isSidebarOpen;
  }

  set isSidebarOpen(value: boolean) {
    PeopleRoomsCSModule.setSidebarOpen(value);
  }
  selectPeopleRoom(room: DirectDM){
    if(room === undefined || room.id === null)
      return ;
    PeopleRoomsCSModule.setSidebarOpen(true);
    PeopleRoomsCSModule.updateRoomId(room.id)
    PeopleRoomsCSModule.resetUnreadCount(room);
    (this.$refs.userList as DirectList).onRoomChange({ room, scrollToRoom: true });
  }

  mounted()
  {
     this.registerNotificationEventBus();
  }

  registerNotificationEventBus() {
    EventBus.$on(EVENTS.PEOPLE_NOTIFICATION_CLICKED, async(data: {roomId: number}) => {
      const id = data.roomId;
      let room = PeopleRoomsCSModule.rooms.find(room => room.id == id);
      if(room===undefined ) {
        await PeopleRoomsCSModule.load();
        this.$nextTick(() => {  
          room = PeopleRoomsCSModule.rooms.find(room => room.id == id);
           if(room !== undefined ) {
            this.selectPeopleRoom(room);
           }
        })
      }else {
        this.selectPeopleRoom(room);
      }
      
    })
  }

  destroyed() {
    EventBus.$off(EVENTS.PEOPLE_NOTIFICATION_CLICKED)
  }


  deactivated() {
    //EventBus.$off(EVENTS.PEOPLE_NOTIFICATION_CLICKED)
  }

  @Watch('$route.params.roomId')
  async function(roomId) {
      const id = Number(this.$route.params.roomId);
      const room = PeopleRoomsCSModule.rooms.find(room => room.id == id);
      if(room!=undefined && id!=undefined) {
        PeopleRoomsCSModule.setSidebarOpen(true);
        PeopleRoomsCSModule.updateRoomId(id)
        PeopleRoomsCSModule.resetUnreadCount(room);
        await PeopleRoomsCSModule.load();
        (this.$refs.userList as DirectList).onRoomChange({ room, scrollToRoom: true });
      }
       router.push({ name: router.currentRoute.name as (string | undefined) } );
  }

  async activated() {
    await PeopleRoomsCSModule.load();
    PeopleChatCSModule.activate();
    //this.registerNotificationEventBus();
  }

}
</script>

<style lang="scss" scoped>
.direct-container{
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