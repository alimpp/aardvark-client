<template>
  <div v-if="currentProjectTitle" class="crumb px-2 d-flex align-items-center position-relative overflow-hidden">
    <div class="navbar-logo-img icon mx-0">
      <i class="material-icons">{{ icon }}</i>
    </div>
    <CrumbTitle :title="currentProjectTitle" />
  </div>
</template>

<script lang="ts">
import ProjectDM from '@/datamodels/projectDM';
import {BREADCRUMB_ICON} from '@/utils/constants';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import CrumbTitle from '../CrumbComponents/CrumbTitle.vue'

@Component({
  name: 'ProjectCrumbDetail',
  components: {CrumbTitle}
})
export default class ProjectCrumbDetail extends Vue {
  @Prop({required: true}) readonly project!: ProjectDM;
  readonly icon: Readonly<BREADCRUMB_ICON> = BREADCRUMB_ICON.project;

  get currentProjectTitle() {
    return this.project?.title || "";
  }

}
</script>