<template>
  <div class="tags" v-if="columnValue">
    <div
      class="tag-card single-card"
      v-if="valueIsString"
    >
      {{ columnValue.formatText() }}
    </div>
    <div v-else-if="!valueIsArray">
      {{columnValue.title}}
    </div>
    <div
      v-else
      class="tag-card"
      v-for="tag in tags"
      :key="tag.id"
    >
      {{ tag.title.formatText() }}
    </div>

  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";

@Component({
  name: "TagColumn",
})
export default class TagColumn extends BaseColumn {
  get tags() {
    return this.columnValue
  }

  get valueIsString() {
    return typeof this.tags === 'string'
  }

  get valueIsArray() {
    return Array.isArray(this.tags)
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.tags {
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  font-size: 14px;
  overflow: hidden;
  justify-content: start;
}
.tag-card {
  margin: 0;
  box-sizing: border-box;
  display: inline-block;
  padding: 4px 12px;
  text-align: center;
  background: $tag-column-bg;
  border-radius: 5px;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  color: $text-color;
  width: max-content;
  &:not(.single-card:defined) {
    width: auto;
  }
}
</style>