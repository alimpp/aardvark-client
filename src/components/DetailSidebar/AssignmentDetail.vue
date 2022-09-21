<template>
  <div class="assignment-detail-grid max-height-moduletab-content">
    <AssignmentDetailPhases ref="AssignmentDetailPhases" />
    <AssignmentDetailResources />
    <AssignmentDetailTimeCards />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import DetailSubModule from "@/components/Base/DetailSubModule.vue";
import {DetailTabName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {AssignmentDetailCSModule, AssignmentDetailPhasesCSModule, AssignmentDetailResourcesCSModule, AssignmentDetailTimeCardsCSModule} from "@/store"
import AssignmentDetailPhases from '@/components/DetailSidebar/AssignmentDetailPhases.vue'
import AssignmentDetailResources from '@/components/DetailSidebar/AssignmentDetailResources.vue'
import AssignmentDetailTimeCards from "@/components/DetailSidebar/AssignmentDetailTimeCards.vue";
import SimpleBar from 'simplebar-vue';
import { Ref } from 'vue-property-decorator';

@Component({
  name: "AssignmentDetail",
  components: {
    SimpleBar,AssignmentDetailPhases, AssignmentDetailResources, AssignmentDetailTimeCards
  }
})
export default class AssignmentDetail extends DetailSubModule {
  @Ref('AssignmentDetailPhases') AssignmentDetailPhases!: AssignmentDetailPhases;

  public getTableWidth() {
    return this.AssignmentDetailPhases.getTableWidth();
  }

  get tabName(): DetailTabName{
    return DetailTabName.assigned
  }

  get dataSources(): ILifeCycle[] {
    return [AssignmentDetailCSModule, AssignmentDetailPhasesCSModule, AssignmentDetailResourcesCSModule, AssignmentDetailTimeCardsCSModule]
  }

}
</script>

<style lang="scss" scoped>
.assignment-detail-grid{
  display: grid;
  grid-auto-rows: minmax(0px, max-content);
}
</style>
