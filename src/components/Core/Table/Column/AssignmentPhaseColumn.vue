<template>
  <div class="assignment-phase">
    <div :class="{'epxire': isExpired, 'strike-out': isSkipped}">{{phase.title}}</div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";

@Component({ 
  name: "AssignmentPhaseColumn",
})
export default class AssignmentPhaseColumn extends BaseColumn {
  get phase() {
    return this.columnValue;
  }
  get isExpired() {
    return this.phase?.isDelayed || (this.phase?.cadenceTempo && this.phase.cadenceTempo === 'at-risk')
  }
  
  get isSkipped() {
    return this.phase?.isSkipped === true;
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/assets/scss/variables';
.assignment-phase{
  white-space: nowrap;
  text-align: left;
  .epxire {
    color: $resource-full-name-column-expire-color;
  }
  .strike-out {
    text-decoration: line-through;
  }
  div {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
