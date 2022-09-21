<template>
    <div v-if="showTimecards" id="AssignmentDetailTimeCards" :class="{'active-collapse': isCollapse}" class="container-fluid d-flex flex-column">
      <CoreCollapse  @collapse="onCollapseChange" :height="82">
        <div class="title rounded">
          <span class="name">Journal for </span>
          <span class="pre-title">{{selectedResourcefullName }}</span>
        </div>
        <CoreTable
          id="table-assignmentdetailjournals"
          :datasource="dataSource"
          :loading="$wait.is(waitState.ACTION_TIMECARDS_LOADING)"
          :isAnimated="true"
          :noResultFoundMessage="'No available journals for this resource'"
        />
      </CoreCollapse>

    </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { AssignmentDetailTimeCardsCSModule, ApplicationDSModule, AssignmentDetailCSModule, AssignmentDetailResourcesCSModule, TimeCardDSModule } from "@/store";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import { WaitStates } from "@/utils/vuewait";
import CoreCollapse from '@/components/Core/CoreCollapse.vue'
import { TimeCardDS } from "@/store/modules/datastore/timeCardDS";
import { isEmpty } from "@/utils/object";
import NuggetPhaseDM from "@/datamodels/nuggetPhaseDM";

@Component({
  name: "AssignmentDetailTimeCards",
  components: { CoreTable ,CoreCollapse},
})
export default class AssignmentDetailTimeCards extends Vue {
  waitState = WaitStates;
  isCollapse = false;

  onCollapseChange(val: boolean) {
    this.isCollapse = val
  }
  get dataSource(): TableCS<TableRow> {
    return AssignmentDetailTimeCardsCSModule;
  }
   get selectedResourcefullName()  {
    return AssignmentDetailResourcesCSModule.selectedResourceFullName
  }
  get showTimecards() {
      const selectedPhase = AssignmentDetailCSModule.selectedPhase
      const isDeletedPhaseSelected = (selectedPhase instanceof NuggetPhaseDM && selectedPhase.isSkipped)

       if(ApplicationDSModule.selectedNuggetID && !AssignmentDetailResourcesCSModule.isEditMode && !isDeletedPhaseSelected ){
         return (ApplicationDSModule.selectedNuggetID || ApplicationDSModule.selectedAssignmentID || AssignmentDetailCSModule.selectedAssignmentId)
      }else{
          return false
      }
  }
  get hasNeverLoadedBefore() {
    return AssignmentDetailTimeCardsCSModule.rowCount === 0 && isEmpty(TimeCardDSModule.items[AssignmentDetailTimeCardsCSModule.resourceAssignmentId])
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
  #table-assignmentdetailjournals {
    background-color: var(--light-color);
    ::v-deep.table-title {
      min-width: 480px;
      padding: 0;
    }
    ::v-deep.table-line {
      min-width: 480px;
    }
    ::v-deep.tableBody-enter-active{
        transition: all 0.35s;
    }
    ::v-deep.tableBody-leave-active{
        transition: all 0s;
    }    
  }
.active-collapse{
    min-height: 100px !important;
  }
  .title {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    justify-content: start;
    color: $grey-color;
    padding: 8px;
    .pre-title {
      color: $brand-color;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis
    }
  }

</style>
