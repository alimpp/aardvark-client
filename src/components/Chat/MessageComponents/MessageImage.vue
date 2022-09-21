<template>
  <CoreImage :style="{height, width, minHeight, minWidth}" :src="imagePath" :legend="filename" :noZoom="noZoom" contain />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import CoreImage from "@/components/Core/CoreImage.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";

@Component({
  name: "MessageImage",
  components: {CoreSpinner, CoreImage}
})
export default class MessageImage extends BaseMessageComponent {
  @Prop({ default: false }) noZoom!: boolean;
  @Prop({ default: "250px" }) height!: string;
  @Prop({ default: "250px" }) width!: string;
  @Prop({ default: null }) minHeight!: string;
  @Prop({ default: null }) minWidth!: string;

  public get imagePath() {
    return this.message.attachment;
  }

  public get filename() {
    return this.message.file;
  }

}
</script>