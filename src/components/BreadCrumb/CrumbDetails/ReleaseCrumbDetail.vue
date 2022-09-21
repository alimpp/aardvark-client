<template>
  <div v-if="currentReleaseTitle" class="crumb px-2 d-flex align-items-center position-relative overflow-hidden">
    <ReleasesIcon width="23px" height="23px" customClassName="navbar-logo-img icon mx-0" />
    <CrumbTitle :title="currentReleaseTitle" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ReleaseDM from '@/datamodels/releaseDM';
import ReleasesIcon from '@/components/Icons/ReleasesIcon.vue';
import CrumbTitle from '../CrumbComponents/CrumbTitle.vue'

@Component({
  name: 'ReleaseCrumbDetail',
  components: {ReleasesIcon, CrumbTitle}
})
export default class ReleaseCrumbDetail extends Vue {
  @Prop({required: true}) readonly release!: ReleaseDM;

  get currentReleaseTitle() {
    return this.release?.title || "";
  }

}
</script>