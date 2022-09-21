<template>
  <div
    id="TimeCardDetailOnHold"
    v-if="canShowingOnHoldForm"
    class="border-top m-2"
  >
    <div class="title rounded">
      <span class="pre-title">{{selectedNuggetNumber}}</span>
      <span>{{ selectedAssignmentTitle }}</span>
    </div>
    <ValidationObserver
      slim
      v-slot="{invalid, changed, handleSubmit}"
      ref="observer"
    >
      <form
        action=""
        autocomplete="off"
        class="estimate-form"
        @submit.prevent="handleSubmit(onSubmit)"
      >

        <div class="inputs">

          <!-- Start Date Input -->

          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors}"
            ref="validation"
            rules="assignments-startDate"
          >
            <!-- TODO: minDate must be add -->
            <CorePicker
              v-model="assignmentReStartDate"
              placeholder="Re-start Date"
              noHeader
              noFooter
              noTime
              formatted='L'
              @is-hidden="focusOnTargetDateInput"
              autoClose
              :disabled="isDisabled"
              ref="startDate"
              :minDate="minStartDate"
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
            <!-- TODO: minDate must be add -->
            <CorePicker
              v-model="assignmentNewTargetDate"
              placeholder="New Target Date"
              noHeader
              noFooter
              noTime
              formatted='L'
              ref="targetDate"
              @is-hidden="focusOnEstimateInput"
              autoClose
              :disabled="isDisabled"
              :minDate="minTargetDate"
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
            v-slot="{failed, errors, required}"
            :rules="{isBigger: dayDifference, 'assignments-estimatedHours': 'assignments-estimatedHours'}"
          >
            <CoreInput
              :required="required"
              v-model="assignmentEstimatedHours"
              :error="failed"
              placeholder="Estimated Hours"
              ref="estimate"
              :disabled="isDisabled"
              type="number"
            />
            <div
              v-if="failed"
              class="text-danger text-left mt-2"
            >{{errors[0]}}</div>
          </ValidationProvider>
        </div>

        <!-- Checkbox -->

        <ValidationProvider
          slim
          class="mb-3"
          v-slot="{failed}"
        >
          <CoreCheckBox
            v-model="isStatusOnHold"
            :error="failed"
          >Freeze</CoreCheckBox>
        </ValidationProvider>

        <div class=" save-button">
          <!-- Button -->

          <CoreBtn
            class="mb-2 save-button"
            type="submit"
            block
            :disabled="!changed || invalid || estimateGreaterThanDayDiff"
            :loading="$wait.is(waitState.ACTION_ESTIMATE_SAVING)"
            size="md"
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
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import {ApplicationDSModule, NuggetDSModule, TimeCardDetailCSModule, TimeCardDetailOnHoldCSModule,} from "@/store";
  import CoreInput from "@/components/Core/CoreInput.vue";
  import {MazCheckbox} from "maz-ui";
  import {Watch} from "vue-property-decorator";
  import {State} from "vuex-class";
  import AssignmentDM from "@/datamodels/assignmentDM";
  import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
  import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
  import { dateISOFormat } from '@/utils/date';
  import { Wait, WaitStates } from "@/utils/vuewait";
  import { extend } from 'vee-validate';
  import moment from "moment";
  import { today } from "@/utils/date";

extend("isBigger", {
  params: ["dayDifference"],
  // @ts-ignore
  validate: (value, { dayDifference }) => {
    if (value > dayDifference || value <=0) {
      return false
    }
    return true
  },
  message:
    "Estimated hours out of range 0-{dayDifference}"
});

  @Component({
  name: "TimeCardDetailOnHold",
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
export default class TimeCardDetailOnHold extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
    estimate
    targetDate
    startDate
  };

  @State("estimateDetail", { namespace: "timecarddetailcs" })
  estimateDetail!: AssignmentDM;
  waitState = WaitStates;

  @Watch("estimateDetail")
  onEstimateDetailChange() {
    this.$refs.observer?.reset();
  }

  public get minTargetDate(): string {
    return this.assignmentReStartDate
      ? this.assignmentReStartDate
      : this.minStartDate;
  }

  public get minStartDate(): string {
    return today;
  }

  get isStatusOnHold() {
    return TimeCardDetailCSModule.canShowingOnHoldForm;
  }

  set isStatusOnHold(value) {
    TimeCardDetailCSModule.setShowingOnHoldForm(value);
  }

  get canShowingOnHoldForm() {
    return (
      ApplicationDSModule.selectedModuleTab ===
        ModuleTabName.assignmentInProgress &&
      TimeCardDetailCSModule.canShowingOnHoldForm
    );
  }

  get selectedNuggetNumber(): string {
    return NuggetDSModule.currentNugget?.nuggetNumber || 'No nugget Selected';
  }

  async focusOnTargetDateInput() {
    await this.getTargetDateInput()
      ?.getElementsByTagName("input")
      .item(0)
      ?.focus();
  }

  async focusOnStartDateInput() {
    await this.getStartDateInput()
      ?.getElementsByTagName("input")
      .item(0)
      ?.focus();
  }

  async focusOnEstimateInput() {
    await this.getEstimateInput().focus();
  }

  getEstimateInput() {
    return (this.$refs.estimate as Vue).$refs.MazInput as HTMLElement;
  }

  getTargetDateInput() {
    return (this.$refs.targetDate as Vue).$refs.MazPicker as HTMLElement;
  }

  getStartDateInput() {
    return (this.$refs.startDate as Vue)?.$refs.MazPicker as HTMLElement;
  }

  public get selectedAssignmentTitle(): string {
    return TimeCardDetailOnHoldCSModule.assignmentDetail?.nuggetTitle || "";
  }

  public get assignmentReStartDate(): string {
    return TimeCardDetailOnHoldCSModule.assignmentDetail?.startDate;
  }
  public set assignmentReStartDate(value: string) {
    TimeCardDetailOnHoldCSModule.assignmentDetail.startDate = dateISOFormat(value);
  }

  public get assignmentNewTargetDate(): string {
    return TimeCardDetailOnHoldCSModule.assignmentDetail?.endDate;
  }

  public set assignmentNewTargetDate(value: string) {
    TimeCardDetailOnHoldCSModule.assignmentDetail.endDate = dateISOFormat(value);
  }

  public get assignmentEstimatedHours(): number {
    return TimeCardDetailOnHoldCSModule.assignmentDetail?.estimatedHours;
  }
  public set assignmentEstimatedHours(value: number) {
    TimeCardDetailOnHoldCSModule.assignmentDetail.estimatedHours = value;
  }

  get dayDifference() {
    const targetDate = moment(this.assignmentNewTargetDate);
    const startDate = moment(this.assignmentReStartDate);
    if(!targetDate.diff(startDate, 'days')) {
      return 24
    } else {
      return targetDate.diff(startDate, 'days') * 24
    }
  }

  get estimateGreaterThanDayDiff() {
    return !(this.dayDifference >= this.assignmentEstimatedHours) || this.assignmentEstimatedHours <= 0
  }

  @Wait(WaitStates.ACTION_ESTIMATE_SAVING)
  async onSubmit() {
    await TimeCardDetailOnHoldCSModule.estimate();
  }

  updated() {
    if (TimeCardDetailOnHoldCSModule.assignmentDetail.startDate === "") {
      this.focusOnStartDateInput();
    }
  }

  get isDisabled(): boolean {
    return !ApplicationDSModule.selectedAssignmentID;
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

#TimeCardDetailOnHold {
  display: grid;
  align-content: start;

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
