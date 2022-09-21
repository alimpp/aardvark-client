import AssignmentDM from '@/datamodels/assignmentDM';
import TimeCardDM from '@/datamodels/timeCardDM';
import {Wait, WaitStates} from '@/utils/vuewait'
import store, { TimeCardDetailTimeCardsCSModule, AssignmentDSModule, AssignmentInProgressCSModule, BadgeCountCSModule, TimeCardDetailCSModule, TimeCardDetailEstimateCSModule, TimeCardDetailReportCSModule, TimeCardDSModule } from '@/store';
import cloneDeep from 'lodash.clonedeep';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { updateObject } from '@/utils/object';
import { ApplicationDSModule } from '../../index';
import { DetailTabName } from '../datastore/applicationDS';
import { ILifeCycle } from './base/interfaces/ILifeCycle';

@Module({name: 'timecarddetailreportcs', namespaced: true, stateFactory: true})
export class TimeCardDetailReportCS extends VuexModule implements ILifeCycle {
  selectedTimeCard: TimeCardDM = new TimeCardDM()
  timeCards: TimeCardDM[] = [];

  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  public get estimateDetail(): AssignmentDM {
    return TimeCardDetailCSModule.estimateDetail
  }

  get estimatedHours(): number {
    return TimeCardDetailCSModule.estimateDetail.estimatedHours;
  }

  get moduleActive(): boolean {
    return ApplicationDSModule.selectedDetailTab === DetailTabName.timecard;
  }

  @Mutation
  setTimeCardReport(value: TimeCardDM | undefined): void {
    if (value)
      this.selectedTimeCard = value
  }

  @Mutation
  setTimeCards(value: TimeCardDM[]): void {
    this.timeCards = value
  }

  @Action({ rawError: true })
  async updateSelectedTimeCardFromCache(): Promise<void> {
    const clonedTimeCard = cloneDeep<TimeCardDM | undefined>(TimeCardDSModule?.currentSelectedTimeCard)
    if (clonedTimeCard)
      this.setTimeCardReport(clonedTimeCard);
  }

  @Action({ rawError: true })
  async updateTimeCardsFromCache(): Promise<void> {
    this.setTimeCards(cloneDeep<TimeCardDM[]>(TimeCardDSModule.currentTimeCards));
  }

  @Action({ rawError: true })
  onInitialization(): void {
    store.watch(
      function stateToWatch(state) {
        return state.timecarddetailreportcs?.selectedTimeCard
      },
      function onChange(id) {
        if (TimeCardDetailReportCSModule.moduleActive) {
          TimeCardDetailReportCSModule.updateTimeCardsFromCache();
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return { id: state.assignmentdetailtimecardscs.selectedTimecardId }
      },
      function onChange(id, timecard) {
        if (TimeCardDetailReportCSModule.moduleActive) {
          TimeCardDetailReportCSModule.updateSelectedTimeCardFromCache();
        }
      }
    );

  }

  @Action({ rawError: true })
  async estimate(): Promise<void> {
    if (store.state.timecarddetailcs?.estimateDetail)
      await AssignmentDSModule.estimate(store.state.timecarddetailcs.estimateDetail)
  }

  @Action({ rawError: true })
  async updateTimecard(): Promise<void> {
    await TimeCardDSModule.updateTimecard({
      assignmentId: this.selectedTimeCard.assignmentId,
      note: this.selectedTimeCard.note,
      hours: this.selectedTimeCard.hours,
      timecardId: this.selectedTimeCard.id
    })
  }

  @Action({ rawError: true })
  async updateAssignmentList(): Promise<void> {
    await AssignmentInProgressCSModule.doLoad(true);
    await BadgeCountCSModule.loadAssignment()
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_UPDATE_JOURNAL_REPORT)
  async updateJournalReport({ assignment, timeCard }: { assignment: Partial<AssignmentDM>, timeCard: Partial<TimeCardDM> }): Promise<void> {
    const [updatedTimeCard, updatedEstimate] = [updateObject(TimeCardDSModule.currentSelectedTimeCard, timeCard), updateObject(TimeCardDetailEstimateCSModule.assignmentEstimate, assignment)];
    TimeCardDetailReportCSModule.setTimeCardReport(updatedTimeCard);
    if(assignment.estimatedHours || assignment.endDate) {
      TimeCardDetailCSModule.setEstimateDetail(updatedEstimate);
      await TimeCardDetailEstimateCSModule.estimate()
    }
    await this.updateTimecard()
    const updatedTimeCardIndex = this.timeCards.findIndex(timecard => timecard.id === updatedTimeCard?.id)
    const nextEmptyTimeCardIndex = this.timeCards.findIndex((timecard, index) => timecard.hours === 0 && index > updatedTimeCardIndex)
    const emptyTimeCardIndex = this.timeCards.findIndex(timecard => timecard.hours === 0)
    nextEmptyTimeCardIndex !== -1 ? TimeCardDetailTimeCardsCSModule.onRowClick(this.timeCards[nextEmptyTimeCardIndex]) : emptyTimeCardIndex !== -1 ? TimeCardDetailTimeCardsCSModule.onRowClick(this.timeCards[emptyTimeCardIndex]) : null
    this.updateAssignmentList()
    await this.updateSelectedTimeCardFromCache()
  }

  @Action({ rawError: true })
  async activate() {
    return
  }
}
