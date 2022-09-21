import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import WorkflowDM from '@/datamodels/workflowDM';
import store, {WorkflowDSModule, PhaseDSModule, AddPhaseCSModule} from '@/store';


@Module({ name: 'addphasecs', namespaced: true, stateFactory: true })
export class AddPhaseCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  workflowDetail: WorkflowDM = new WorkflowDM();

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
  async addPhases(phases) {
    await WorkflowDSModule.addPhases(phases);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedWorkflowID;
      },
      function onChange(workflow) {
        AddPhaseCSModule.updateWorkflowDetailFromCache()
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
