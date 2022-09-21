<template>
  <div
    id="TimeCardDetailTimeCards"
    class="border-top m-2"
    v-if="canShowingTimecardTable"
  >
    <div class="header rounded">
      <span class="title">Journal Log</span>
      
      <div class="btn-box d-flex flex-row justify-content-start align-content-center">
        <CoreBtn
        class="button delete-btn"
        type="button"
        size="mini"
        :disabled="!hasEmptyTimeCard || disabledButton" 
        @click="deleteEmptyTimeCard"
      >
        <img
          src="@/assets/icons/delete.svg"
      >
        </CoreBtn>

        <CoreBtn
        class="button"
        type="button"
        size="mini"
        @click="toggleTimecardPicker"
        :disabled="disabledButton"
      >
        <img
          class="plus-icon"
          src="@/assets/icons/plus.svg"
        >
        </CoreBtn>
      </div>

      <CorePicker
        class="core-picker"
        noHeader
        noFooter
        noTime
        inline
        autoClose
        v-if="canShowPicker"
        v-click-outside="closePicker"
        :minDate="minDate"
        :maxDate="maxDate"
        @input="createTimecard($event)"
      />
    </div>
    <CoreTable
      class="maz-flex-1 table"
      :datasource="dataSource"
      :isSimple="true"
      :loading="$wait.is(waitState.ACTION_TIMECARDS_LOADING)"
      :isAnimated="true"
    />
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {ApplicationDSModule, AssignmentDSModule, TimeCardDetailTimeCardsCSModule, DialogCSModule, TimeCardDSModule, TimeCardDetailEstimateCSModule} from "@/store";
  import TableCS from "@/store/modules/componentstore/base/tableCS";
  import TableRow from "@/datamodels/base/tableRow";
  import CoreTable from "@/components/Core/Table/CoreTable.vue";
  import {WaitStates} from "@/utils/vuewait";
  import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
  import CoreBtn from "@/components/Core/CoreBtn.vue";
  import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
  import vClickOutside from 'v-click-outside'
  import DeleteEmptyTimeCardPopup from '@/components/DeleteEmptyTimeCardPopup.vue'
  import { dateISOFormat } from "@/utils/date";

  @Component({
  name: "TimeCardDetailTimeCards",
  components: { CoreTable, CoreBtn, CorePicker },
  directives: { clickOutside: vClickOutside.directive}
})
export default class TimeCardDetailTimeCards extends Vue {
  waitState = WaitStates;
  canShowPicker = false;
  get dataSource(): TableCS<TableRow> {
    return TimeCardDetailTimeCardsCSModule;
  }

  get canShowingTimecardTable() {
    return (
      ApplicationDSModule.selectedAssignmentID &&
      ApplicationDSModule.selectedModuleTab !==
        ModuleTabName.assignmentNeedEstimate &&
      ApplicationDSModule.selectedModuleTab !==
        ModuleTabName.assignmentUpcomingEstimates
    );
  }

  get disabledButton() {
    return (
      ApplicationDSModule.selectedModuleTab !== ModuleTabName.assignmentInProgress
    );
  }

  get hasEmptyTimeCard() {
    return (TimeCardDSModule.currentTimeCards.some(item => !item.note || item.note === ''))
  }

  get minDate() {
    return AssignmentDSModule.currentAssignment.startDate;
  }

  get maxDate() {
    return AssignmentDSModule.currentAssignment.endDate;
  }

  async createTimecard(date) {
    await TimeCardDetailTimeCardsCSModule.createTimecard(dateISOFormat(date));
    this.toggleTimecardPicker();
  }

  toggleTimecardPicker() {
    this.canShowPicker = !this.canShowPicker;
  }

  closePicker() {
    this.canShowPicker = false;
  }

  async deleteEmptyTimeCard(){      
     DialogCSModule.load({
        title: ``,
        isShowingDialog: true,
        noClose: false,
        confirmLabel: "ok",
        cancelLabel: "Cancel",
        width: 500,
        specificButton: true,
        content: DeleteEmptyTimeCardPopup
      });
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

.header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 8px;
  justify-content: start;
  color: $brand-color;
  padding: 8px 0;
  .title {
    justify-self: start;
    align-self: center;
  }
  .button {
    justify-self: end;

    .plus-icon {
      width: 14px;
    }
  }
  .core-picker {
    right: 10px;
    top: 240px;
    z-index: 5;
    position: absolute;
  }
}
  .btn-box{
    gap: 5%;
    margin-left: 120px;  
    .delete-btn{
      width: 44px;
    }
  }
.table {
  border-radius: 0.25rem;
  background-color: var(--light-color);
  height: 240px;
  ::v-deep .table-title {
    border-radius: 0.25rem;
    min-width: inherit;
    padding: 0;
  }
  ::v-deep .table-line {
    border-radius: 0.25rem;
    min-width: inherit;
  }
}
</style>
