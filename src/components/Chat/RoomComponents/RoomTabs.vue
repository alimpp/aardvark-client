<template>
  <div class="room-sidebar" @dblclick="tabClicked">
    <CoreTabsBar
      v-if="tabs.length > 1 || isLoading"
      v-model="activeTab"
      class="chat-tabs w-100"
      :tabs="tabs"
      :noUseAnchor="true"
      :loading="isLoading"
      :showBadgeCount="isShowBadgeCount"
    />
  </div>
</template>

<script lang="ts">
import { Component,Prop  } from "vue-property-decorator";
import CoreTabsBar from "@/components/Core/CoreTabsBar.vue";
import { WaitStates } from "@/utils/vuewait";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";
import ChatRoomMember from '@/components/Form/ChatRoomMember.vue'
import { DialogCSModule } from "@/store";
import { CHAT_LABEL_TYPE } from "@/utils/constants";

@Component({
  name: "RoomTabs",
  components: {CoreTabsBar}
})
export default class RoomTabs extends BaseRoomComponent {
  @Prop({default: true}) public isShowBadgeCount!: boolean;

  get isLoading(): boolean {
    return this.$wait.is(WaitStates.ACTION_CHAT_ROOM_TABS_LOADING);
  }

  get isMentionDisabled() {
    return this.store.tabs.find(tab => tab.id === this.activeTab)?.disableMention || false;
  }

  get activeTab(): number {
    return this.store.roomId;
  }

  set activeTab(value: number) {
    this.store.setRoomId(value)
  }

  get tabs() {
    return this.store.tabs;
  }

  tabClicked(){
    const content = ChatRoomMember
    const width = 900
    let titleContent = ''

    if(this.store.tabs.find(tab => tab.label === CHAT_LABEL_TYPE.PUBLIC)?.id === this.activeTab) titleContent = "Subscribed";
    if(this.store.tabs.find(tab => tab.label === CHAT_LABEL_TYPE.PRIVATE)?.id === this.activeTab) titleContent = "Chat";
    DialogCSModule.load({
      title: `${titleContent} Members`,
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

.room-sidebar{
   ::v-deep .maz-tabs-bar {
    width: 100%;
    background-color: var(--second-color);
    &__item {
      &.active {
          border: 0px;
          background-color: inherit;
      }

      &.disabled {
          color: var(--maz-disabled-color);
          cursor: not-allowed;
      }

      &:hover{
          border-radius: 8px 8px 0px 0px;
          background-color: var(--primary-color);
      }
      &:focus {
          text-decoration: none;
          background-color: inherit;
      }
      }
      .core-btn {
        flex: 1 1;
        border: 0px;
        transition: none;
        i {
            font-size: 21px;
        }
      }
  }
}

::v-deep .chat-tabs{
  .core-btn, .tabs-bar {
    width: 100%;
  }
}

::v-deep .badge-count-round {
  padding: 2px 4px;
  margin-top: 8px;
  margin-right: -3px;
  text-align: center ;
  background-color: #DADDFC;
  border-radius: 5px;
  display: inline-block;
  min-width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1em;
  color: #303030;
}

</style>