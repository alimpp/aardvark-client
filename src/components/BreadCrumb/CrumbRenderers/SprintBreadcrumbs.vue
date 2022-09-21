<template>
  <div class="crumb-container">
    <ProjectCrumbDetail :project="sprintProject" />
    <SprintCrumbDetail :sprint="currentSprint" /> 
  </div>
</template>

<script lang="ts">
import {BreadCrumbsCSModule} from '@/store';
import Vue from 'vue';
import Component from 'vue-class-component';
import SprintCrumbDetail from '../CrumbDetails/SprintCrumbDetail.vue';
import ProjectCrumbDetail from '../CrumbDetails/ProjectCrumbDetail.vue';
import SprintDM from '@/datamodels/sprintDM';

@Component({
  name: 'SprintBreadcrumbs',
  components: {SprintCrumbDetail, ProjectCrumbDetail}
})
export default class SprintBreadcrumbs extends Vue {

  get currentSprint(): SprintDM | null {
    const sprint = BreadCrumbsCSModule.currentSprint;
    const isSprintEmpty = Object.keys(sprint).length === 0 && sprint.constructor === Object;

    if(!isSprintEmpty){
      return sprint;
    }else {
      return null
    }
    
  }

  get sprintProject() {
    return this.currentSprint?.project;
  }

}
</script>