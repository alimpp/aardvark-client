<template>
  <EntityChatRoom ref="chat" class="chatroom max-height-moduletab-content" />
</template>

<script lang="ts">
import Component from "vue-class-component";
import EntityChatRoom from "@/components/Chat/Rooms/EntityChatRoom.vue";
import { DetailTabName } from "@/store/modules/datastore/applicationDS";
import { EntityChatCSModule, ApplicationDSModule } from "@/store";
import DetailSubModule from "@/components/Base/DetailSubModule.vue";
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import { Ref } from "vue-property-decorator";

@Component({
  name: "Chat",
  components: { EntityChatRoom },
})
export default class Chat extends DetailSubModule {
  @Ref('chat') chat!: EntityChatRoom;
  
  get tabName(): DetailTabName {
    return DetailTabName.chat;
  }

  get dataSources(): ILifeCycle[] {
    return [EntityChatCSModule];
  }

  onTabActivate() {
    ApplicationDSModule.setSelectedDetailTabName(this.tabName);
    this.dataSources.forEach(datasource => window.setTimeout(() => datasource.activate && datasource.activate()));
    this.chat.input.focusInput();
  }

}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.chatroom {
  min-width: #{$chat-sidebar-width};
}
</style>