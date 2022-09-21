<template>
  <div>
    <div class="px-2 pt-2 mb-2 filter_hight scrollbar overflow-auto">
      <CoreCheckbox v-for="option in options" :key="option.id" v-model="currentFilters[option.id]" :value="option.value">{{option.label}}</CoreCheckbox>
    </div>
    <div class="w-100 px-2 pb-2 mb-2 d-flex justify-content-center align-items-center">
      <CoreBtn
        size="sm"
        class="core-button w-100"
        @click="applyFilter"
        > Apply Filter
      </CoreBtn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CoreCheckbox from "@/components/Core/CoreCheckBox.vue";
import { Prop } from 'vue-property-decorator';
import CoreBtn from '@/components/Core/CoreBtn.vue';

@Component({ name: "HeaderOptionsFilter", components: {CoreCheckbox,CoreBtn}})
export default class HeaderOptionsFilter extends Vue {
  @Prop() filters!: {key: string, options: {id: string, value: string, label: string}[]};
  @Prop() currentFilters!: {[key: string]: boolean}[];

  get options() {
    return this.filters?.options;
  }

  applyFilter(){
     this.$emit('filter-updated', {key: this.filters.key, filters: Object.keys(this.currentFilters).filter(key => this.currentFilters[key] === true) } )
  }
}
</script>

<style lang="scss" scoped>
.scrollbar{
  scrollbar-color: rgba(170, 170, 170, 0.5) transparent;
  scrollbar-width: auto;
}
.scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(170, 170, 170, 0.5);
  opacity: 0.5;
  border-radius: 5px;
}
.filter_hight{
  max-height: 60vh !important;
}

</style>