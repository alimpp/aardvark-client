<template>
  <div class="p-2">
    <CoreRadio v-model="sort" radio-value="ASC">Ascending</CoreRadio>
    <CoreRadio v-model="sort" radio-value="DESC">Descending</CoreRadio>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CoreRadio from "@/components/Core/CoreRadio.vue";
import { Prop } from 'vue-property-decorator';

@Component({ name: "HeaderOptionsSort", components: {CoreRadio}})
export default class HeaderOptionsSort extends Vue {
  @Prop() currentDirection!: "ASC" | "DESC";
  @Prop() isActiveSort!: "ASC" | "DESC";

  get sort() {
    return this.isActiveSort ? this.currentDirection : "";
  }

  set sort(value) {
    this.$emit('sort-update', value);
  }
  
}
</script>