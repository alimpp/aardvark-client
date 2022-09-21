import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import WorkflowDM from '@/datamodels/workflowDM';
import store, {WorkflowDSModule, PhaseDSModule, WorkflowDetailCSModule} from '@/store';


@Module({ name: 'workflowdetailcs', namespaced: true, stateFactory: true })
export class WorkflowDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  workflowDetail: WorkflowDM = new WorkflowDM();
  phaseHeaderValue = ['Del', 'Order', 'ID', 'Name']

  get phases() {
    return PhaseDSModule.sortedItems('title')
  }

  @Mutation
  setWorkflowDetail(workflow: WorkflowDM) {
    this.workflowDetail = workflow;
  }

  @Action({ rawError: true })
  async updateWorkflowDetailFromCache() {
    this.setWorkflowDetail(cloneDeep(WorkflowDSModule.currentWorkflow))
  }

  @Action({ rawError: true })
  async updateWorkflow() {
    await WorkflowDSModule.updateWorkflow(this.workflowDetail)
  }

  @Action({ rawError: true })
  async deactivateWorkflow() {
    WorkflowDSModule.deactivateWorkflow(this.workflowDetail.id);
  }

  @Action({ rawError: true })
  async addPhases(phases) {
    await WorkflowDSModule.addPhases(phases);
  }

  @Action({ rawError: true })
  async removePhases(phases) {
    await WorkflowDSModule.removePhases(phases);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedWorkflowID;
      },
      function onChange(workflow) {
        WorkflowDetailCSModule.updateWorkflowDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return { workflow: state.workflowds.itemWatch, workflowPhases: state.workflowds.itemWatch?.item?.phases };
      },
      function onChange(workflow) {
        WorkflowDetailCSModule.updateWorkflowDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
