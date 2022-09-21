<template>
  <div class="crumb-container">
    <ProjectCrumbDetail :project="nuggetProject" />
    <SprintCrumbDetail :sprint="nuggetSprint" />
    <NuggetCrumbDetail :nugget="currentNugget" />
  </div>
</template>

<script lang="ts">
import {BreadCrumbsCSModule} from '@/store';
import Vue from 'vue';
import Component from 'vue-class-component';
import SprintCrumbDetail from '../CrumbDetails/SprintCrumbDetail.vue';
import ProjectCrumbDetail from '../CrumbDetails/ProjectCrumbDetail.vue';
import NuggetCrumbDetail from '../CrumbDetails/NuggetCrumbDetail.vue';

@Component({
  name: 'NuggetBreadcrumbs',
  components: {ProjectCrumbDetail, SprintCrumbDetail, NuggetCrumbDetail}
})
export default class NuggetBreadcrumbs extends Vue {
  
  get currentNugget() {
    return BreadCrumbsCSModule.currentNugget;
  }
  
  get nuggetSprint() {
    return this.currentNugget.sprint;
  }

  get nuggetProject() {
    return this.currentNugget.project;
  }
  
}
</script>