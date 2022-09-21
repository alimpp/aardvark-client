<template>
  <div
    ref="CoreTabsContentItem"
    class="maz-base-component core-tabs-content-item"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({ name: 'CoreTabsContentItem' })
export default class CoreTabsContentItem extends Vue {}
</script>

<style lang="scss">
  .core-tabs-content-item {
    position: relative;
    overflow-y: hidden;
    width: 100%;
    height: 100%;
    flex: 1 0 100%;

    &.maz-h-0 {
      height: 0;
    }
  }

</style>
