<template>
  <AttachmentMediaRoom />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AttachmentMediaRoom from "@/components/Chat/Rooms/AttachmentMediaRoom.vue";
import SimpleBar from 'simplebar-vue';
import { AttachmentMediaCSModule } from '@/store';

@Component({
  name: "AttachmentsMedia",
  components: {AttachmentMediaRoom, SimpleBar}
})
export default class AttachmentsMedia extends Vue {
  activated() {
    AttachmentMediaCSModule.activate();
  }
}
</script>