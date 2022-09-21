<template>
    <div id="AssignmentDetailResources"  v-if="canShowResources" :class="{'active-collapse': isCollapse}" class="container-fluid d-flex flex-column">
      <CoreCollapse @collapse="onCollapseChange">
        <div class="title rounded">
          <span class="name">Resources for </span>
          <span class="pre-title">{{selectedPhase.phaseTitle ? selectedPhase.phaseTitle : selectedPhase.title }}</span>
        </div>
        <CoreTable
          id="table-assignmentdetailresources"
          :datasource="dataSource"
          :loading="$wait.is(waitState.ACTION_RESOURCESUMMARIES_LOADING) || $wait.is(waitState.ACTION_NUGGETASSIGNMENT_LOADING)"
          :isAnimated="true"
          :noResultFoundMessage="'No available resource for phase'"
        />
      </CoreCollapse>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {ApplicationDSModule, AssignmentDetailResourcesCSModule ,AssignmentDetailCSModule, NuggetAssignmentDSModule, AssignmentDetailPhasesCSModule} from "@/store"
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import {WaitStates} from "@/utils/vuewait";
import CoreCollapse from '@/components/Core/CoreCollapse.vue'
import NuggetPhaseDM from '@/datamodels/nuggetPhaseDM';


@Component({
  name: "AssignmentDetailResources",
    components: {CoreTable , CoreCollapse}
})
export default class AssignmentDetailResources extends Vue{
  waitState = WaitStates;
  isCollapse = false;

  onCollapseChange(val: boolean) {
    this.isCollapse = val
  }
  get selectedPhase()  {
    return AssignmentDetailCSModule.selectedPhase
  }
  get dataSource(): TableCS<TableRow> {
    return AssignmentDetailResourcesCSModule
  }

  get canShowResources(): boolean{
    if(ApplicationDSModule.selectedNuggetID){
      if(this.selectedPhase instanceof NuggetPhaseDM){
        return !this.selectedPhase.isSkipped ;
      }
      return true ;
    }
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
  #table-assignmentdetailresources {
    background-color: var(--light-color);
    ::v-deep.table-title {
      min-width: 560px;
      padding: 0;
    }
    ::v-deep.table-line {
      min-width: 560px;
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
