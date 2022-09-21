import { Module, VuexModule, Action } from 'vuex-module-decorators'
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import store, {
  ApplicationDSModule,
  TimeCardDetailCSModule,
  TimeCardDSModule,
  BadgeCountCSModule,
  AssignmentDSModule
} from "@/store"

@Module({ name: 'timecarddetailestimatecs', namespaced: true })
export class TimeCardDetailEstimateCS extends VuexModule implements ILifeCycle{

  public get assignmentEstimate() {
    return TimeCardDetailCSModule.estimateDetail
  }

  @Action({ rawError: true })
  async estimate() {
    await AssignmentDSModule.estimate(store.state.timecarddetailcs?.estimateDetail);
    await TimeCardDSModule.doLoad(ApplicationDSModule.selectedAssignmentID)
    await TimeCardDetailCSModule.assignmentLoad()
    await BadgeCountCSModule.loadAssignment()
  }

  @Action({ rawError: true })
  async decline() {
    await AssignmentDSModule.decline(ApplicationDSModule.selectedAssignmentID);
    await TimeCardDetailCSModule.assignmentLoad()
    await BadgeCountCSModule.loadAssignment()
  }

  @Action({rawError: true })
  activate() {
    return
  }

}