<template>
  <CoreAudio
    :src="src"
    :legend="filename"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import CoreAudio from "@/components/Core/CoreAudio.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageAudio",
  components: {CoreAudio}
})
export default class MessageAudio extends BaseMessageComponent {

  public get src() {
    return this.message.attachment;
  }

  public get filename() {
    return this.message.file;
  }
}
</script>