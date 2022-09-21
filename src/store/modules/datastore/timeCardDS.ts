
import TimeCardAPI from '@/api/timeCardAPI';
import TimeCardDM from '@/datamodels/timeCardDM';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemsDS from './base/baseItemsDS';
import store, { ApplicationDSModule, AssignmentDetailTimeCardsCSModule, AssignmentDSModule, TimeCardDSModule } from '@/store';
import { Wait, WaitStates } from "@/utils/vuewait";
import { DetailTabName } from './applicationDS';
import cloneDeep from 'lodash.clonedeep';

@Module({ name: 'timecardds', namespaced: true , stateFactory: true})
export class TimeCardDS extends BaseItemsDS<TimeCardDM> implements ITimecardDS {

  public get currentTimeCards(): TimeCardDM[] {
    return this.items[ApplicationDSModule.selectedAssignmentID] || [];
  }

  public get currentSelectedTimeCard() {
    return this.currentTimeCards?.find(timecard => timecard.id === AssignmentDetailTimeCardsCSModule.selectedTimecardId)
  }


  public get selectedResourceTimeCards(): TimeCardDM[] {
    return this.items[ApplicationDSModule.selectedAssignmentID] || {};
  }

  @Action({ rawError: true })
  async doLoad(assignmentId) {
    await this.listTimeCards(assignmentId)
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return {id: state.assignmentdetailtimecardscs.resourceAssignmentId, tabName: state.applicationds.selectedDetailTab}
      },
      async function onChange({id, tabName}) {
        if(id > 0 && ApplicationDSModule.selectedDetailTab === DetailTabName.assigned) {
          await TimeCardDSModule.doLoad(id);
        }
      }
    );
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_TIMECARDS_LOADING)
  async listTimeCards(assignmentId: number) {
    const timeCards = await TimeCardAPI.LIST({assignmentId: assignmentId, sort:'date'});
    this.replaceItems({ id: assignmentId, items: timeCards });
    return timeCards;
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_TIMECARD_SAVING)
  async updateTimecard(data: { assignmentId: number, hours: number, note: string, timecardId: number }) {
    const currentAssignment = cloneDeep(AssignmentDSModule.items[data.assignmentId]);
    const id = ApplicationDSModule.selectedAssignmentID;
    const updatedTimecard = await TimeCardAPI.UPDATE({assignmentId: data.assignmentId, hours: data.hours, note: data.note, timecardId: data.timecardId});
    const items = this.getItems[data.assignmentId].map(item => item.id === updatedTimecard.id ? updatedTimecard : item);
    await this.addOrReplaceItems({ id, items });

    let sum = 0
    this.getItems[data.assignmentId].forEach(timeCard => sum += timeCard.hours);
    currentAssignment.remainingHours = currentAssignment.estimatedHours - sum
    AssignmentDSModule.addOrReplaceItem(currentAssignment)
    return updatedTimecard
  }

  @Action({ rawError: true })
  async createTimecard(data: { assignmentId: number, hours: number, note: string, date: string }) {
    const  assignmentID = ApplicationDSModule.selectedAssignmentID
    const createdTimecard = await TimeCardAPI.CREATE({assignmentId:data.assignmentId, hours:data.hours, note:data.note, date:data.date})
    this.addOrReplaceItem({id: assignmentID, items: [...this.selectedResourceTimeCards, createdTimecard].sort((x, y) => new Date(y.date).valueOf() - new Date(x.date).valueOf()) })
    return createdTimecard
  }

  @Action({rawError: true})
  async deleteZeroTimeCard(data: {assignmentId: number, date?: string}){
    await TimeCardAPI.CLEAR_ZERO_TIMECARD({assignmentId: data.assignmentId,date: data.date})
    this.doLoad(data.assignmentId)
  }


}

interface ITimecardDS {
  items: { [key: number]: TimeCardDM[] }
}