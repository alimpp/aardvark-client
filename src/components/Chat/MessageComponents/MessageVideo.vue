<template>
  <CoreVideo :src="videoPath" :legend="filename" v-bind="$attrs" />
</template>
  
<script lang="ts">
import { Component} from "vue-property-decorator";
import CoreVideo from "@/components/Core/CoreVideo.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageVideo",
  components: {CoreVideo}
})
export default class MessageVideo extends BaseMessageComponent {

  public get videoPath() {
    return this.message.attachment;
  }

  public get filename() {
    return this.message.file;
  }

}
</script>