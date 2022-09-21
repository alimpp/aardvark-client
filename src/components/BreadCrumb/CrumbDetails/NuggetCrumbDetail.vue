<template>
  <div v-if="currentNuggetTitle" class="crumb px-2 d-flex align-items-center position-relative overflow-hidden">
    <div class="navbar-logo-img icon mx-0">
      <i class="material-icons">{{ icon }}</i>
    </div>
    <CrumbTitle :title="currentNuggetTitle" />
  </div>
</template>

<script lang="ts">
import NuggetDM from '@/datamodels/nuggetDM';
import {BREADCRUMB_ICON} from '@/utils/constants';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import CrumbTitle from '../CrumbComponents/CrumbTitle.vue'

@Component({
  name: 'NuggetCrumbDetail',
  components: {CrumbTitle}
})
export default class NuggetCrumbDetail extends Vue {
  @Prop({required: true}) readonly nugget!: NuggetDM;
  readonly icon: Readonly<BREADCRUMB_ICON> = BREADCRUMB_ICON.nugget;

  get currentNuggetTitle() {
    return this.nugget?.title || "";
  }

}
</script>