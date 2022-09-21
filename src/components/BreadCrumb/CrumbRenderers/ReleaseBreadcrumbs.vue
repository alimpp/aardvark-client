<template>
  <div class="crumb-container">
    <ReleaseCrumbDetail :release="currentRelease" />
  </div>
</template>

<script lang="ts">
import {BreadCrumbsCSModule} from '@/store';
import Vue from 'vue';
import Component from 'vue-class-component';
import ReleaseCrumbDetail from '../CrumbDetails/ReleaseCrumbDetail.vue';

@Component({
  name: 'ReleaseBreadcrumbs',
  components: {ReleaseCrumbDetail}
})
export default class ReleaseBreadcrumbs extends Vue {
  get currentRelease() {
    return BreadCrumbsCSModule.currentRelease;
  }
}
</script>