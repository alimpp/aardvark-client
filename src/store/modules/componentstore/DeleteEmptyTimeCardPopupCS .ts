import { DialogCSModule, TimeCardDSModule, ApplicationDSModule, AssignmentDSModule, TimeCardDetailTimeCardsCSModule } from '@/store'
import { VuexModule, Action, Module } from 'vuex-module-decorators'
import moment from "moment";
import { dateISOFormat } from '@/utils/date';

@Module({ name: 'deleteemptytimecardcs', namespaced: true })
export class DeleteEmptyTimeCardPopupCS extends VuexModule {

  get maxDate() {
      return AssignmentDSModule.currentAssignment.endDate;
    }  

  @Action
  DeleteEmptyTimeCard() {
      const date = dateISOFormat(moment(this.maxDate).format("YYYY-MM-DD"))

      TimeCardDSModule.deleteZeroTimeCard({
        assignmentId: ApplicationDSModule.selectedAssignmentID,
        date: date
      })
  }

  @Action
  clear() {
    DialogCSModule.clear(); 
  }

}
