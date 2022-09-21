<template>
  <div class="phases">
    <div class="phase-card" v-for="phase in phases" :key="phase.id">
      {{ phase.title.formatText() }}
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "PhaseColumn",
})
export default class PhaseColumn extends BaseColumn {
    get phases() {
      return this.columnValue
    }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.phases {
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  font-size: 14px;
  overflow: hidden;
  justify-content: start;
}
.phase-card {
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
