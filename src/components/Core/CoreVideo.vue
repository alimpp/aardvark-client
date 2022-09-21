<template>
  <figure class="maz-base-component d-flex flex-column maz-bg-color-light">
    <video v-bind="$attrs">
      <source :src="src">
    </video>
    <figcaption v-if="legend" class="maz-img__legend maz-p-2 text-truncate w-100 text-center" :title="legend">{{ legend }}</figcaption>
  </figure>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({name: "CoreVideo"})
export default class CoreVideo extends Vue {
  @Prop({required: true, validator: prop => ['string'].includes(typeof prop) && prop}) src!: string;
  @Prop({type: String, default: null}) legend!: string;
}
</script>

<style lang="scss" scoped>
figure{
  margin: 0;
}
video {
  height: inherit;
  overflow: hidden;
}
</style>