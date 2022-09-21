<template>
  <div class="perspective" :class="columnValue.toLowerCase()">
    {{ columnValue ? columnValue.formatText() : "-" }}
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "PerspectiveColumn",
})
export default class PerspectiveColumn extends BaseColumn {}
</script>

<style lang="scss" scoped>
.perspective{
  @import 'src/assets/scss/variables';
  color: $text-color;
  &.due{
    color: $perspective-column-due-color;
  }
  &.expired {
    color: $perspective-column-expired-overdue-color;
  }
  &.overdue {
    color: $perspective-column-expired-overdue-color;
  }  
  &.submitted {
    color: $perspective-column-submitted-color;
  }
}
</style>