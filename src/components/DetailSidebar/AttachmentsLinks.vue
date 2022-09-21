<template>
  <AttachmentLinkRoom />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AttachmentLinkRoom from "@/components/Chat/Rooms/AttachmentLinkRoom.vue";
import { AttachmentLinkCSModule } from '@/store';

@Component({
  name: "AttachmentsLinks",
  components: {AttachmentLinkRoom}
})
export default class AttachmentsLinks extends Vue {
  activated() {
    AttachmentLinkCSModule.activate();
  }
}
</script>