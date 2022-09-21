<template>
  <div class="specialties">
    <div class="specialty-card" v-for="specialty in specialties" :key="specialty.id">
      {{ specialty.title.formatText() }}
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SpecialtyDM from "@/datamodels/specialtyDM";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "SpecialtyColumn"
})
export default class SpecialtyColumn extends BaseColumn {
  get specialties(): SpecialtyDM[] {
    return this.columnValue;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.specialties {
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  font-size: 14px;
  overflow: hidden;
  justify-content: start;
}
.specialty-card {
    margin: 0;
    box-sizing: border-box;
    display: inline-block;
    padding: 4px 12px;
    text-align: center;
    background: $tag-column-bg;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
    max-width: fit-content;
    box-sizing: border-box;
    color: $text-color;
}
</style>