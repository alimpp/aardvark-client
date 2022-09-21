<template>
  <div v-if="currentSprintName" class="crumb px-2 d-flex align-items-center position-relative overflow-hidden">
    <div class="navbar-logo-img icon mx-0 pl-1">
      <i class="material-icons">{{ icon }}</i>
    </div>
    <CrumbTitle :title="currentSprintName" />
  </div>
</template>

<script lang="ts">
import SprintDM from '@/datamodels/sprintDM';
import {BREADCRUMB_ICON} from '@/utils/constants';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import CrumbTitle from '../CrumbComponents/CrumbTitle.vue'

@Component({
  name: 'SprintCrumbDetail',
  components: {CrumbTitle}
})
export default class SprintCrumbDetail extends Vue {
  @Prop({required: true}) readonly sprint!: SprintDM;
  readonly icon: Readonly<BREADCRUMB_ICON> = BREADCRUMB_ICON.sprint;

  get currentSprintName() {
    if(this.sprint){
      return this.sprint?.name || "None";
    }else {
      return ""
    }
  }

}
</script>