<template>
    <div id="AssignmentDetailPhases"  v-if="showPhases" :class="{'active-collapse': isCollapse}" class="container-fluid d-flex flex-column ">
      <CoreCollapse @collapse="onCollapseChange">
        <div class="title rounded">
         <span class="pre-title">{{selectedNuggetNumber}}</span>
         <span class="name">{{ selectedNuggetTitle }}</span>
        </div>
        <CoreTable
          id="table-assignmentdetailphases"
          :datasource="dataSource"
          :isSimple="true"
          :loading="$wait.is(waitState.ACTION_PROJECTPHASES_LOADING) || $wait.is(waitState.ACTION_NUGGETPHASES_LOADING) || !selectedNugget "
          :isAnimated="true"
        />
      </CoreCollapse>

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {ApplicationDSModule, AssignmentDetailPhasesCSModule, NuggetDSModule} from "@/store"
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import CoreCollapse from '@/components/Core/CoreCollapse.vue'
import {WaitStates} from "@/utils/vuewait";

@Component({
  name: "AssignmentDetailPhases",
    components: {CoreTable , CoreCollapse}
})
export default class AssignmentDetailPhases extends Vue {
  waitState = WaitStates;
  isCollapse = false;

  onCollapseChange(val: boolean) {
    this.isCollapse = val
  }

  get selectedNuggetNumber(): string {
    return this.selectedNugget?.nuggetNumber || 'No Nugget Selected';
  }

  public getTableWidth() {
    return 616
  }
  public get selectedNugget() {
    return NuggetDSModule.currentNugget
  }


  public get selectedNuggetTitle(): string {
    return NuggetDSModule.getItems[ApplicationDSModule.selectedNuggetID]?.title || ''
  }

  get dataSource(): TableCS<TableRow> {
    return AssignmentDetailPhasesCSModule
  }

  get showPhases(): number {
    return ApplicationDSModule?.selectedNuggetID
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';

  #table-assignmentdetailphases {
    border-radius: 0.25rem;
    background-color: var(--light-color);
    ::v-deep.table-title {
      min-width: 550px;
      padding: 0;
    }
    ::v-deep.table-line {
      min-width: 550px;
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
