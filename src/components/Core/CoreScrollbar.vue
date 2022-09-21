<template>
  <component
      :is="tag"
      v-bind="$attrs"
      class="scrollbar"
      :class="[size, {
        'overflow-auto': !showOnHover,
        'hover': showOnHover,
        'inactive--y': suppressScrollY,
        'inactive--x': suppressScrollX
      }]">
        <slot />
  </component>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({name: "CoreScrollbar"})
export default class CoreScrollbar extends Vue {
  @Prop({type: String, default: 'div'}) readonly tag!: string;
  @Prop({type: String, default: 'regular'}) readonly size!: 'thin' | 'regular';
  @Prop({type: Boolean, default: false}) readonly suppressScrollY!: boolean;
  @Prop({type: Boolean, default: false}) readonly suppressScrollX!: boolean;
  @Prop({type: Boolean, default: false}) readonly showOnHover!: boolean;
}
</script>

<style lang="scss" scoped>
.scrollbar{
  scrollbar-color: rgba(170, 170, 170, 0.5) transparent;
  scrollbar-width: auto;
  &.thin{
    &::-webkit-scrollbar{
      width: 4px;
      height: 4px;
    }
  }
  &.regular{
    &::-webkit-scrollbar{
      width: 8px;
      height: 8px;
    }
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(170, 170, 170, 0.5);
    opacity: 0.5;
    border-radius: 5px;
  }
  &.hover{
    overflow: hidden;
    &:hover{
      overflow: auto;
    }
  }
  &.inactive--y{
    overflow-y: hidden !important;
  }
  &.inactive--x{
    overflow-x: hidden !important;
  }
}
</style>