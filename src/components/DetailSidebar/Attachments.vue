<template>
    <div class="max-height-moduletab-content overflow-hidden">
      <RoomTabs :store="store" :isShowBadgeCount="false"/>
      <CoreTabsBar
        class="tabs"
        v-model="activeTab"
        :tabs="tabs"
        :noUseAnchor="true"
      />

      <CoreTabsContent :activeTab="activeTab" class="attachment-content" :class="{rooms: hasRoomTabs}">
      <CoreTabsContentItem :key="attachmentViewTabs.MEDIA">
        <AttachmentsMedia />
      </CoreTabsContentItem>
      <CoreTabsContentItem :key="attachmentViewTabs.DOCUMENTS">
        <AttachmentsDocuments />
      </CoreTabsContentItem>
      <CoreTabsContentItem :key="attachmentViewTabs.LINKS">
        <AttachmentsLinks />
      </CoreTabsContentItem>
    </CoreTabsContent>

  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import DetailSubModule from "@/components/Base/DetailSubModule.vue";
import {DetailTabName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import RoomTabs from "@/components/Chat/RoomComponents/RoomTabs.vue";
import CoreTabsBar from "@/components/Core/CoreTabsBar.vue";
import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
import { TAB_ATTACHMENT_ID } from '@/utils/constants';
import AttachmentsDocuments from "@/components/DetailSidebar/AttachmentsDocuments.vue";
import AttachmentsLinks from "@/components/DetailSidebar/AttachmentsLinks.vue";
import AttachmentsMedia from "@/components/DetailSidebar/AttachmentsMedia.vue";
import { AttachmentCSModule, EntityChatCSModule } from '@/store';
import SimpleBar from 'simplebar-vue';
import { Prop } from 'vue-property-decorator';
import ChatCS from '@/store/modules/componentstore/base/chatCS';

@Component({
  name: "Attachments",
	components: { RoomTabs, CoreTabsBar, CoreTabsContentItem, CoreTabsContent, AttachmentsDocuments, AttachmentsLinks, AttachmentsMedia, SimpleBar}
})
export default class Attachments extends DetailSubModule {
  @Prop({ default: () => EntityChatCSModule }) readonly store!: ChatCS;

  get hasRoomTabs() {
    return this.store.tabs.length > 1
  }

  get tabs() {
    return AttachmentCSModule.tabs;
  }

  get activeTab() {
    return AttachmentCSModule.selectedAttachmentView
  }

  set activeTab(tab) {
    if(tab) AttachmentCSModule.setSelectedAttachmentView(tab);
  }

  get attachmentViewTabs() {
    return TAB_ATTACHMENT_ID;
  }

  get tabName(): DetailTabName {
    return DetailTabName.attachment
  }

  get dataSources(): ILifeCycle[] {
    return [AttachmentCSModule]

  }

  activated() {
    AttachmentCSModule.activate();
  }

  created() {
    // The detail sidebar is not kept alive so `activated` will never get called
    AttachmentCSModule.activate();
  }

}
</script>

<style lang="scss">
.tabs {
  width: 100%;

   .maz-tabs-bar {
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
    .maz-tabs-bar__item {
      &:focus {
          text-decoration: none;
          background-color: inherit;
      }
      &:hover{
          border-radius: 8px 8px 0px 0px;
          background-color: var(--primary-color);
      }
  }  
    
  }
   .tabs-bar {
    width: 100%;
  }
}
 .core-tabs-content {
  height: 100%;
}
.attachment-content {
  height: calc(100vh - 49px - 1.1rem - 3.5rem) !important;
  &.rooms {
    height: calc(100vh - 98px - 1.1rem - 3.5rem) !important;
  }
}
</style>