
<template>
  <div class="projects">
    <div class="project-card" v-for="project in projects" :key="project.id">
      {{ project.title.formatText() }}
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import ProjectDM from "@/datamodels/projectDM";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "ProjectColumn",
})
export default class ProjectColumn extends BaseColumn {
  get projects(): ProjectDM[] {
    return this.columnValue;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.projects {
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  font-size: 14px;
  overflow: hidden;
  justify-content: start;
}
.project-card {
    margin: 0;
    box-sizing: border-box;
    display: inline-block;
    padding: 4px 12px;
    text-align: center;
    background: $tag-column-bg;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
    width: fit-content;
    box-sizing: border-box;
    color: $text-color;
}
</style>