<template>
  <div
    id="TimeCardDetailEstimate"
    v-if="showingEstimateForm"
    class="border-top m-2"
  >
    <div class="title rounded">
      <span class="pre-title">{{selectedNuggetNumber}}</span>
      <span class="name">{{ selectedAssignmentTitle }}</span>
    </div>
    <ValidationObserver
      slim
      ref="observer"
    >
      <form
        action=""
        autocomplete="off"
        class="estimate-form"
        @submit.prevent="onSubmit()"
      >

        <div class="inputs">
          <!-- Start Date Input -->

          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors}"
            rules="assignments-startDate"
          >
            <CorePicker
              v-model="assignmentStartDate"
              placeholder="Start Date"
              noHeader
              noFooter
              noTime
              formatted='L'
              @is-hidden="focusOnTargetDateInput"
              autoClose
              :minDate="minStartDate"
              :disabled="isDisabled || !canChangeStartDate"
            />
            <div
              v-if="failed"
              class="text-danger text-left mt-2"
            >{{errors[0]}}</div>
          </ValidationProvider>

          <!-- Target Date Input -->

          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors}"
            rules="assignments-endDate"
          >
            <CorePicker
              v-model="assignmentTargetDate"
              placeholder="Target Date"
              noHeader
              noFooter
              noTime
              formatted='L'
              ref="targetDate"
              @is-hidden="focusOnEstimateInput"
              autoClose
              :minDate="minTargetDate"
              :disabled="isDisabled || !canChangeTargetDate"
            />
            <div
              v-if="failed"
              class="text-danger text-left mt-2"
            >{{errors[0]}}</div>
          </ValidationProvider>

          <!-- Estimate Hours Input -->

          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors}"
            :rules="{isBigger: dayDifference, 'assignments-estimatedHours': 'assignments-estimatedHours'}"
          >
            <CoreInput
              v-model="assignmentEstimatedHours"
              :error="failed"
              placeholder="Estimated Hours"
              ref="estimate"
              :disabled="isDisabled || !canChangeEstimatedHours"
              type="number"
            />
            <div
              v-if="failed && !isStatusDeclined"
              class="text-danger text-left mt-2"
            >{{errors[0]}}</div>
          </ValidationProvider>
        </div>

        <!-- Checkbox -->
        <ValidationProvider
          slim
          class="mb-3"
        >

          <CoreCheckBox
            v-model="isStatusOnHold"
            v-if="isFreezable"
          >Freeze</CoreCheckBox>
        </ValidationProvider>

        <!-- Checkbox -->
        <ValidationProvider
          slim
          class="mb-3"
        >
          <CoreCheckBox
            class="mb-3"
            v-model="isStatusDeclined"
            v-if="canDecline"
          >Decline</CoreCheckBox>
        </ValidationProvider>

        <!-- Button -->

        <div class="save-button">

          <CoreBtn
            class="mb-2"
            type="submit"
            block
            :disabled="isButtonDisabled()"
            size="md"
            :loading="$wait.is(waitState.ACTION_ESTIMATE_SAVING)"
          >Submit Estimate</CoreBtn>
        </div>
      </form>

    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import {
  ApplicationDSModule,
  TimeCardDetailEstimateCSModule,
  TimeCardDetailCSModule,
  TimeCardDetailOnHoldCSModule,
  NuggetDSModule,
  AssignmentDSModule
} from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import { MazCheckbox } from "maz-ui";
import { Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import AssignmentDM from "@/datamodels/assignmentDM";
import { ModuleTabName } from "@/store/modules/datastore/applicationDS";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import { dateISOFormat } from "@/utils/date";
import moment from "moment";
import { Wait, WaitStates } from "@/utils/vuewait";
import { extend } from 'vee-validate';
import { today } from "@/utils/date";
import dayjs from "dayjs";

extend("isBigger", {
  params: ["dayDifference"],
  // @ts-ignore
  validate: (value, { dayDifference }) => {
    if (value > dayDifference || value <= 0) {
      return false
    }
    return true
  },
  message:
    "Estimated hours out of range 0-{dayDifference}"
});

@Component({
  name: "TimeCardDetailEstimate",
  components: {
    CoreCheckBox,
    ValidationObserver,
    ValidationProvider,
    CorePicker,
    CoreInput,
    MazCheckbox,
    CoreBtn,
  },
})
export default class TimeCardDetailEstimate extends Vue {

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
    estimate
    targetDate
  };

  @State("estimateDetail", { namespace: "timecarddetailcs" })
  estimateDetail!: AssignmentDM;
  isStatusChanged = false;
  isStatusDeclined = false;
  waitState = WaitStates;
  AssignmentDSModule;

  @Watch("estimateDetail")
  onEstimateDetailChange() {
    this.$refs.observer?.reset();
    if (this.estimateDetail.status !== "declined") this.isStatusDeclined = false;
  }

  @Watch("isStatusOnHold")
  onStatusUpdate(value: boolean) {
    if (
      value && TimeCardDetailOnHoldCSModule.assignmentDetail.status !== "on-hold") {
      TimeCardDetailOnHoldCSModule.assignmentDetail.status = "on-hold";
      const onHoldAssignment = TimeCardDetailOnHoldCSModule.assignmentDetail;
      onHoldAssignment.startDate = "";
      onHoldAssignment.endDate = "";
      TimeCardDetailOnHoldCSModule.setEstimateDetail(onHoldAssignment);
    } else if(value === false && TimeCardDetailOnHoldCSModule.assignmentDetail.status === "on-hold") {
      TimeCardDetailEstimateCSModule.assignmentEstimate.status = "in-progress";
      this.isStatusChanged = true;
    }
  }

  get dayDifference() {
    const targetDate = moment(this.assignmentTargetDate);
    const startDate = moment(this.assignmentStartDate);
    if(!targetDate.diff(startDate, 'days')) {
      return 24
    } else {
      return targetDate.diff(startDate, 'days') * 24
    }
  }

  get estimateGreaterThanDayDiff() {
    return !(this.dayDifference >= this.assignmentEstimatedHours) || this.assignmentEstimatedHours <= 0
  }

  setEstimateStatus(value: string) {
    TimeCardDetailEstimateCSModule.assignmentEstimate.status = value;
  }

  isButtonDisabled() {
   return this.$refs.observer ? !(this.canDecline && this.isStatusDeclined)  && ((!this.isStatusChanged && !this.isFormDirty()) || this.estimateGreaterThanDayDiff): true
  }
  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  getEstimateInput() {
    return (this.$refs.estimate as Vue).$refs.MazInput as HTMLElement;
  }

  getTargetDateInput() {
    return (this.$refs.targetDate as Vue).$refs.MazPicker as HTMLElement;
  }
  get isStatusOnHold() {
    return TimeCardDetailCSModule.canShowingOnHoldForm;
  }

  set isStatusOnHold(value) {
    TimeCardDetailCSModule.setShowingOnHoldForm(value);
  }

  get selectedNuggetNumber(): string {
    return NuggetDSModule.currentNugget.nuggetNumber || "No Nugget Selected";
  }

  public get minTargetDate(): string {
    return (this.assignmentStartDate && dayjs(this.assignmentStartDate).isAfter(today)) ? this.assignmentStartDate : today;
  }

  public get minStartDate(): string {
    return today;
  }

  public get selectedAssignmentTitle(): string {
    return TimeCardDetailEstimateCSModule.assignmentEstimate?.nuggetTitle || "";
  }

  public get selectedAssignmentStatus(): string {
    return TimeCardDetailEstimateCSModule.assignmentEstimate?.status;
  }

  public get isFreezable(): boolean {
    const currentStatus = this.selectedAssignmentStatus;
    if (
      ApplicationDSModule.selectedModuleTab ===
        ModuleTabName.assignmentInProgress &&
      currentStatus !== "to-do" &&
      ApplicationDSModule.selectedAssignmentID
    ) {
      return true;
    } else {
      return false;
    }
  }

  public get canDecline(): boolean {
    if((ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentUpcomingEstimates || ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentNeedEstimate)&&ApplicationDSModule.selectedAssignmentID){
      return true
    }else {
      return false
    }
  }

  public get assignmentStartDate(): string {
    return TimeCardDetailEstimateCSModule.assignmentEstimate?.startDate;
  }
  public set assignmentStartDate(value: string) {
    TimeCardDetailEstimateCSModule.assignmentEstimate.startDate =
      dateISOFormat(value);
  }

  public get assignmentTargetDate(): string {
    return TimeCardDetailEstimateCSModule.assignmentEstimate?.endDate;
  }
  public set assignmentTargetDate(value: string) {
    TimeCardDetailEstimateCSModule.assignmentEstimate.endDate =
      dateISOFormat(value);
  }

  get canChangeStartDate() {
    if (ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentCompleted) return false;
    else return true;
  }

  get canChangeTargetDate() {
    if(ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentCompleted) {
      const value = TimeCardDetailEstimateCSModule.assignmentEstimate.estimatedHours !== AssignmentDSModule.currentAssignment.estimatedHours
      return value
    } else {
      return true;
    }
  }

  public get assignmentEstimatedHours(): number {
    return TimeCardDetailEstimateCSModule.assignmentEstimate?.estimatedHours;
  }
  public set assignmentEstimatedHours(value: number) {
    TimeCardDetailEstimateCSModule.assignmentEstimate.estimatedHours = value;
  }

  get showingEstimateForm() {
    return (
      !TimeCardDetailCSModule.canShowingOnHoldForm ||
      ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentUpcoming
    );
  }

  get isDisabled(): boolean {
    return !ApplicationDSModule.selectedAssignmentID || this.isStatusDeclined;
  }

  get canChangeEstimatedHours() {
    return this.assignmentStartDate && this.assignmentTargetDate
  }

  async focusOnTargetDateInput() {
    await this.getTargetDateInput()
      ?.getElementsByTagName("input")
      .item(0)
      ?.focus();
  }

  async focusOnEstimateInput() {
    await this.getEstimateInput().focus();
  }

  @Wait(WaitStates.ACTION_ESTIMATE_SAVING)
  async onSubmit() {
    const isValid = await this.$refs.observer.validate();
    if (this.isStatusDeclined) {
      await TimeCardDetailEstimateCSModule.decline();
    } else if (isValid){
      await TimeCardDetailEstimateCSModule.estimate();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

#TimeCardDetailEstimate {
  display: grid;
  align-content: start;

  .title {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    justify-content: start;
    color: $grey-color;
    padding: 8px;
    white-space: nowrap;
    max-width: fit-content;
    .pre-title {
      color: $brand-color;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .estimate-form {
    display: grid;
    grid-template-rows: auto 1fr 1fr;
    .inputs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 5px;
      ::v-deep.text-danger {
        width: 100%;
        white-space: normal;
        overflow-wrap: break-word;
      }
    }

    .save-button {
      display: grid;
      justify-content: center;
      grid-row: 3;
    }

    ::v-deep.maz-input__input {
      font-size: 14px;
    }
  }
}
</style>
