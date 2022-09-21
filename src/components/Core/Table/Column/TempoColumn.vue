<template>
  <div class="tempo-card" :class="boarding">
    {{ boarding ? boarding.formatText() : "-" }}
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "TempoColumn"
})
export default class TempoColumn extends BaseColumn {
  get boarding() {
    return this.columnValue;
  }
}
</script>

<style lang="scss" scoped>
.tempo-card {
  @import 'src/assets/scss/variables';
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
  color: $tempo-column-font-clor;
  border-radius: $tempo-column-border-radius;
  background-size: cover;
  text-align: center;
  &.frozen {
    background: $tempo-column-frozen-bg;
    border: 1px outset  $tempo-column-frozen-bg;
  }
  &.at-risk {
    background: $tempo-column-at-risk-bg;
    border: 1px outset  $tempo-column-at-risk-bg;
  }
  &.at-rest{
    background: $tempo-column-at-rest-bg;
    border: 1px outset  $tempo-column-at-rest-bg;
  }
  &.on-time {
    background: $tempo-column-on-time-bg;
    border: 1px outset  $tempo-column-on-time-bg;
  }
  &.delayed {
    background: $tempo-column-delayed-bg;
    border: 1px outset  $tempo-column-delayed-bg;
  }
  &.is-done-frozen {
    background: $tempo-column-is-done-frozen-bg;
    border: 1px outset $tempo-column-is-done-border-color;
  }
  &.released {
    background: $tempo-column-is-released-bg;
    border: 1px outset $tempo-column-is-released-border-color;
  }
}
</style>