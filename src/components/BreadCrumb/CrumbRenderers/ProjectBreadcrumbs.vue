<template>
  <div class="crumb-container">
    <ProjectCrumbDetail :project="currentProject" />
  </div>
</template>

<script lang="ts">
import {BreadCrumbsCSModule} from '@/store';
import Vue from 'vue';
import Component from 'vue-class-component';
import ProjectCrumbDetail from '../CrumbDetails/ProjectCrumbDetail.vue';

@Component({
  name: 'ProjectBreadcrumbs',
  components: {ProjectCrumbDetail}
})
export default class ProjectBreadcrumbs extends Vue {
  get currentProject() {
    return BreadCrumbsCSModule.currentProject;
  }
}
</script>