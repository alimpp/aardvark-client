import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {AssignmentInProgressCSModule, AssignmentUpcomingCSModule, AssignmentCompletedCSModule, AssignmentNeedEstimateCSModule, AssignmentUpcomingEstimatesCSModule, ApplicationDSModule, TimeCardDetailCSModule} from '@/store';
import AssignmentDM from '@/datamodels/assignmentDM';
import cloneDeep from 'lodash.clonedeep';
import store, { AssignmentDSModule } from '@/store';

@Module({ name: 'timecarddetailcs', namespaced: true })
export class TimeCardDetailCS extends VuexModule implements ILifeCycle{
  estimateDetail: AssignmentDM = new AssignmentDM();
  canShowingOnHoldForm = false

  @Mutation
  setEstimateDetail(estimate: AssignmentDM) {
    this.estimateDetail = estimate;
  }
  
  @Mutation
  setShowingOnHoldForm(value: boolean) {
    this.canShowingOnHoldForm = value;
  }

  @Action({ rawError: true })
  async updateEstimateDetailFromCache() {
    this.setEstimateDetail(cloneDeep(AssignmentDSModule.currentAssignment))
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedAssignmentID
      },
      async function onChange(assignment) {
        await TimeCardDetailCSModule.updateEstimateDetailFromCache();
        await TimeCardDetailCSModule.toggleOnHoldForm();

      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.assignmentds.itemWatch
      },
      function onChange(assignment) {
        TimeCardDetailCSModule.updateEstimateDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  async assignmentLoad() {
    switch (ApplicationDSModule.selectedModuleTab) {
      case "assignmentInProgress":
        await AssignmentInProgressCSModule.doLoad(true);
        break;
      case "assignmentCompleted":
        await AssignmentCompletedCSModule.doLoad(true);
        break;
      case "assignmentNeedEstimate":
        await AssignmentNeedEstimateCSModule.doLoad(true);
        break;
      case "assignmentUpcomingEstimates":
        await AssignmentUpcomingEstimatesCSModule.doLoad(true);
        break;
      case "assignmentUpcoming":
        await AssignmentUpcomingCSModule.doLoad(true)
        break;
      default:
        break;
    }
  }

  @Action({ rawError: true })
  toggleOnHoldForm() {
    if (this.estimateDetail.status !== "on-hold") {
      this.setShowingOnHoldForm(false);
    } else {
      this.setShowingOnHoldForm(true);
    }
  }

  @Action({ rawError: true })
  async activate() {
    return
  }

}
