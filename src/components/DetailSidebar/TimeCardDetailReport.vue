<template>
  <div id="timecard-detail-report" v-show="canShowDetailReport" class="border-top m-2">
    <div class="title rounded">
      <span>Journal</span>
      <CoreCheckBox v-if="canShowCompleteCheckbox" v-model="showingPopup" :disabled="disabledCheckbox">Mark as Complete</CoreCheckBox>
    </div>
    <ValidationObserver slim v-slot="{invalid, dirty, handleSubmit}" ref="observer">
      <form action="" autocomplete="off" @submit.prevent="handleSubmit(onSubmit)" class="report-form">
        <!-- Report date Input -->

        <ValidationProvider slim class="mb-3 date" v-slot="{required}">
          <CoreInput :required="required" disabled :value="date" placeholder="Report Date" />
        </ValidationProvider>

        <!-- Hours Input -->

        <ValidationProvider
          slim
          class="mb-3 hours"
          v-slot="{failed, errors, required}"
          rules="timecards-hours"
        >
          <CoreInput :required="required"
            v-model.lazy.trim="hours"
            :error="failed"
            placeholder="Hours"
            :disabled="isDisabled"
            @keyup="hourKeyUp"
            ref="hoursInput"
            type="number"
          />
          <div v-if="failed" class="text-danger text-left mt-2">{{ errors[0] }}</div>
        </ValidationProvider>

        <!-- Note textarea -->

        <ValidationProvider
          slim
          class="mb-3 note"
          v-slot="{failed, errors, required}"
          rules="timecards-note"
        >
          <CoreInput :required="required"
            v-model.lazy="note"
            placeholder="Note"
            :error="failed"
            :disabled="isDisabled"
            @keyup="noteKeyUp"
            textarea
          />
          <div v-if="failed" class="text-danger text-left mt-2">{{ errors[0] }}</div>
        </ValidationProvider>

        <!-- Button -->

        <CoreBtn
          class="mb-2 submit-button"
          type="submit"
          block
          :disabled="!dirty || invalid"
          :loading="isLoading"
          size="md"
        >Submit Journal</CoreBtn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Ref, Watch } from "vue-property-decorator";
import { Getter, State } from "vuex-class";
import { ModuleTabName } from "@/store/modules/datastore/applicationDS";
import { dateISOFormat, isAfter, fixedPointHours, maxDate, formattedDate, formatDateBy, DateFormatOption } from "@/utils/date";
import { JOURNAL_SUBMIT_STATE, JOURNAL_DIALOG_TITLE } from "@/utils/constants";
import { WaitStates } from "@/utils/vuewait";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { SweetAlertResult } from "sweetalert2";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreInput from "@/components/Core/CoreInput.vue";
import AssignmentDM from "@/datamodels/assignmentDM";
import TimeCardDM from "@/datamodels/timeCardDM";
import { ApplicationDSModule, TimeCardDetailReportCSModule, TimeCardDSModule, DialogCSModule, CompleteNuggetPopupCSModule} from "@/store";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import CompleteNuggetPopup from '@/components/CompleteNuggetPopup.vue'
import { isSame, today } from "@/utils/date";

type Validator = InstanceType<typeof ValidationObserver>;

@Component({
  name: "TimeCardDetailReport",
  components: {
    ValidationObserver,
    ValidationProvider,
    CoreInput,
    CoreBtn,
    CoreCheckBox
  },
})

export default class TimeCardDetailReport extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
    hoursInput
  };

  private currentIndex = -1;
  hours = 0;
  note = '';

  @Ref()
  private readonly observer!: Validator;

  @Getter('currentAssignment', { namespace: 'assignmentds' })
  readonly selectedAssignment!: AssignmentDM;

  @Getter('estimateDetail', { namespace: 'timecarddetailreportcs'})
  private readonly estimateDetail!: AssignmentDM;

  @Getter('estimatedHours', { namespace: 'timecarddetailreportcs'})
  private readonly estimatedHours!: number;

  @State('timeCards', { namespace: 'timecarddetailreportcs'})
  private readonly timeCards!: TimeCardDM[];

  @State('selectedTimeCard', { namespace: 'timecarddetailreportcs'})
  readonly currentTimeCard!: TimeCardDM;

  selectedNoteChanged = false;
  selectedHourChanged = false;

  @Watch("currentTimeCard")
  async onTimecardChange(timecard: TimeCardDM){
    this.observer?.reset();
    this.selectedNoteChanged = false;
    this.selectedHourChanged = false;
    this.hoursInput?.focus()
    if (timecard.id)
      this.updateState(timecard);
  }

  get showingPopup(){
    return CompleteNuggetPopupCSModule.showingPopup
  }

  set showingPopup(value){
    CompleteNuggetPopupCSModule.setShowingPopup(value)
    if(value) {
      this.loadDialog()
    }
  }

  noteKeyUp() {
    this.selectedNoteChanged = true;
  }

  hourKeyUp() {
    this.selectedHourChanged = true;
  }

  get hoursInput() {
    return (this.$refs?.hoursInput as Vue).$refs.MazInput as HTMLElement;
  }

  get isLoading(): boolean {
    return this.$wait.is(WaitStates.ACTION_TIMECARD_SAVING) || this.$wait.is(WaitStates.ACTION_UPDATE_JOURNAL_REPORT);
  }

  get canShowDetailReport() {
    return (
      ApplicationDSModule.selectedAssignmentID &&
      TimeCardDSModule.currentTimeCards.length &&
      ApplicationDSModule.selectedModuleTab !==
        ModuleTabName.assignmentNeedEstimate &&
      ApplicationDSModule.selectedModuleTab !==
        ModuleTabName.assignmentUpcomingEstimates
    );
  }

  get canShowCompleteCheckbox() {
    return ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentInProgress
  }


  get date() {
    return formatDateBy(this.currentTimeCard.date, DateFormatOption.MONTH_WISE);
  }

  get isDisabled(): boolean  {
    return !TimeCardDetailReportCSModule.moduleActive;
  }
  loadDialog() {
    DialogCSModule.load({
      title: "",
      isShowingDialog: true,
      confirmLabel: "Submit",
      width: 500,
      noClose: false,
      specificButton: true,
      content: CompleteNuggetPopup
    });
    this.completeNuggetState()
  }

  completeNuggetState() {
    if (this.workedHours < this.estimatedHours && this.canUpdateTargetDate ) {
      CompleteNuggetPopupCSModule.setEstimate({endDate: today, estimatedHours: this.workedHours})
    }
    else if (this.workedHours < this.estimatedHours){
      CompleteNuggetPopupCSModule.setEstimate({estimatedHours: this.workedHours})
    }
    else if(this.canUpdateTargetDate){
      CompleteNuggetPopupCSModule.setEstimate({endDate: dateISOFormat(this.estimateDetail.endDate)})
    } else return

  }

  get canUpdateTargetDate() {
    const isToday = isSame(today, this.estimateDetail.endDate)
    if(isToday) return false
    else return true
  }

  async onSubmit(): Promise<void> {
    const { submitState, note, hours, workedHours, currentTimeCard } = this;
    let newEstimate = {} as Partial<AssignmentDM>;
    let newTimeCard = {} as Partial<TimeCardDM>;
    if (submitState === JOURNAL_SUBMIT_STATE.SUBMIT)
      newTimeCard = { note, hours: Number(hours) };
    else {
      const { isDismissed } = await this.showDialog(this.popupTitle);
      if (isDismissed)
        return this.reset(currentTimeCard);
      switch (submitState) {
        case JOURNAL_SUBMIT_STATE.EXTEND_HOURS:
          newEstimate = { estimatedHours: workedHours }
          newTimeCard = { hours: Number(hours), note };
          break;
        default:
          newEstimate = { endDate: dateISOFormat(this.endDate)}
          newTimeCard = { note, hours: Number(hours) };
          break;
      }
    }
      await this.updateReport({ assignment: newEstimate, timeCard: newTimeCard });
  }

  private updateState(timecard: TimeCardDM): void {
      this.hours = timecard.hours;
      this.note = timecard.note;
      this.currentIndex = this.timeCards.findIndex((tc: TimeCardDM) => tc.id === timecard.id);
  }

  private get targetDateNeedsExtension() {
    const [dates, estimateEndDate]  = [this.timeCards.map(t => formattedDate(t.date)), formattedDate(this.estimateDetail.endDate)];
    if (!dates.includes(estimateEndDate))
      return true;
    return isAfter(this.endDate, estimateEndDate);
  }

  private get popupTitle(): JOURNAL_DIALOG_TITLE | string {
    const { submitState } = this;
    switch (submitState) {
      case JOURNAL_SUBMIT_STATE.EXTEND_HOURS:
        return JOURNAL_DIALOG_TITLE.EXTEND_HOURS + `${this.workedHours}?`;
      case JOURNAL_SUBMIT_STATE.EXTEND_DATE:
        return JOURNAL_DIALOG_TITLE.EXTEND_DATE + `${this.endDate}?`;
      default:
        return JOURNAL_DIALOG_TITLE.SUBMIT
    }
  }

  private async showDialog(title: string): Promise<SweetAlertResult<{ isConfirmed: boolean, isDismissed: boolean, dismiss?: any, value?: any } | unknown>> {
      const { isConfirmed = false, isDismissed = false, value, dismiss } = await this.$swal({
        title,
        showConfirmButton: true,
        showCancelButton: true,
        heightAuto: true,
        grow: false
      });
    return { isConfirmed, isDismissed, value, dismiss };
  }

  private get workedHours(): number {
    const timecards = this.timeCards;
      timecards[this.currentIndex].hours = fixedPointHours(this.hours)
      const hours = timecards.map(tc => tc.hours).reduce((hours, hour) => {
        return hours + Number(hour)
        }, 0)
        return fixedPointHours(hours);
  }

  private get submitState(): JOURNAL_SUBMIT_STATE {
    if (this.workedHours > this.estimatedHours)
      return JOURNAL_SUBMIT_STATE.EXTEND_HOURS;
    if (this.workedHours === this.estimatedHours)
      return this.targetDateNeedsExtension ? JOURNAL_SUBMIT_STATE.EXTEND_DATE : JOURNAL_SUBMIT_STATE.SUBMIT;
    return JOURNAL_SUBMIT_STATE.SUBMIT;
  }

  get disabledCheckbox() {
    return this.timeCards?.find(timecard => timecard.hours > 0) ? false : true
  }

  private reset(currentTimeCard: TimeCardDM): void {
    this.note = currentTimeCard.note.trim();
    this.hours = Number(currentTimeCard.hours);
  }

  private get endDate() {
    const dates = this.timeCards.filter(tc => tc.hours > 0).map(t => formattedDate(t.date));
    return maxDate(dates);
  }

  private async updateReport({ assignment, timeCard }: { assignment: Partial<AssignmentDM>, timeCard: Partial<TimeCardDM> }): Promise<void> {
    TimeCardDetailReportCSModule.updateJournalReport({ assignment, timeCard });
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

#timecard-detail-report {
  display: grid;
  align-content: start;
  box-sizing: border-box;
  ::v-deep div.text-danger.text-left.mt-2 {
    float: left;
    white-space: pre-wrap;
  }
  .title {
    display: grid;
    justify-items: start;
    grid-template-columns: 1fr auto;
    color: $brand-color;
    padding: 8px;
  }

  .report-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 5px;

    .date {
      grid-area: 1 / 1 / 1 / 3;
    }

    .hours {
      grid-area: 1 / 3 / 1 / 5;
    }

    .note {
      grid-area: 2 / 1 / 2 / 5;
    }

    .submit-button {
      grid-area: 3 / 2 / 3 / 4;
    }
  }
}
</style>