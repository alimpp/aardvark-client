<template>
  <div class="message-file position-relative">
    <div v-if="!editedMessage && !isSendingMessage" class="remove-file" @click="removeFile">
      <i class="material-icons">cancel</i>
    </div>
    <CoreImage v-if="isImage" class="h-100 w-100" contain :src="url" />
    <div v-else @click="openFile" class="d-flex align-items-center flex-column overflow-hidden h-100" :title="name">
      <div class="h-100 w-100 d-flex align-items-center justify-content-center file-icon-container">
        <i class="material-icons file-icon">insert_drive_file</i>
      </div>
      <div class="w-100 text-truncate file-name">{{name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { WaitStates } from "@/utils/vuewait";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import CoreImage from "@/components/Core/CoreImage.vue";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({
  name: "RoomFooterFile",
  components: {CoreImage}
})
export default class RoomFooterFile extends BaseRoomComponent {
  @Prop({ required: true }) fileUrl!: {url: string, name: string, type: string};
  
  public get isSendingMessage() {
    return this.$wait.is(WaitStates.ACTION_CHAT_SENDING_MESSAGE)
  }

  public get editedMessage() {
    return this.store.editMessage;
  }

  public get isImage() {
    return this.fileUrl.type.includes('image');
  }

  public get url() {
    return this.fileUrl.url;
  }

  public get name() {
    return this.fileUrl.name;
  }

  removeFile() {
    this.$emit('removeFile', this.fileUrl)
  }

  openFile() {
    window.open(this.url, '_blank');
  }

}
</script>

<style lang="scss" scoped>
.message-file{
  cursor: pointer;
  height: 75px;
  width: 75px;
  min-height: 75px;
  min-width: 75px;
  margin: 0 10px 10px 0;
  padding: 10px 0 0 10px;
  &:hover{
    .remove-file{
      display: block !important;
    }
  }
}
.remove-file{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  height: 20px;
  width: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease-in-out;
  &:hover{
    opacity: 1;
  }
}
.file-name{
  flex: 1;
}
.file-icon-container{
  flex: 2;
}
.file-icon {
  font-size: 2.5em;

}
</style>