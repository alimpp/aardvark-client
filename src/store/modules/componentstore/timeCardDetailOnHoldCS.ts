import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import AssignmentDM from '@/datamodels/assignmentDM';
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import store, {
  ApplicationDSModule,
  TimeCardDetailCSModule,
  BadgeCountCSModule,
  AssignmentDSModule,
  TimeCardDSModule,
  TimeCardDetailOnHoldCSModule,
} from "@/store"

@Module({ name: 'timecarddetailonholdcs', namespaced: true })
export class TimeCardDetailOnHoldCS extends VuexModule implements ILifeCycle {
  assignmentDetail: AssignmentDM = new AssignmentDM();

  @Mutation
  setEstimateDetail(estimate: AssignmentDM) {
    this.assignmentDetail = estimate;
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
      function onChange(assignment) {
        TimeCardDetailOnHoldCSModule.updateEstimateDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  async estimate() {
    await AssignmentDSModule.estimate(this.assignmentDetail);
    await TimeCardDSModule.doLoad(ApplicationDSModule.selectedAssignmentID)
    await TimeCardDetailCSModule.assignmentLoad()
    await BadgeCountCSModule.loadAssignment()
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}