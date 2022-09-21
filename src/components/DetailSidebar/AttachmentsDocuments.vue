<template>
  <AttachmentDocumentRoom />
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AttachmentDocumentRoom from "@/components/Chat/Rooms/AttachmentDocumentRoom.vue";
import { AttachmentDocumentsCSModule } from '@/store';

@Component({
  name: "AttachmentsDocuments",
  components: {AttachmentDocumentRoom}
})
export default class AttachmentsDocuments extends Vue {
  activated() {
    AttachmentDocumentsCSModule.activate();
  }
}
</script>