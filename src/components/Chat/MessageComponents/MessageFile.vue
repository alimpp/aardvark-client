<template>
  <div class="d-flex align-items-center">
    <div class="svg-button icon-file mr-1" @click.stop="openFile">
      <i class="material-icons">file_download</i>
    </div>
    <span>{{ message.file }}</span>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageFile"
})
export default class MessageFile extends BaseMessageComponent {
  openFile() {
    if(this.message.attachment) window.open(this.message.attachment, '_blank');
  }
}
</script>