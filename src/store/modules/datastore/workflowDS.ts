import WorkflowAPI from "@/api/workflowAPI";
import WorkflowDM from "@/datamodels/workflowDM";
import { isEmpty } from "@/utils/object";
import { Action, Module } from "vuex-module-decorators";
import BaseItemDS from './base/baseItemDS';
import store, { ProjectDSModule, ProjectPhaseDSModule, SettingsDSModule, WorkflowDSModule } from '@/store'
import { Wait, WaitStates } from '@/utils/vuewait';
import cloneDeep from "lodash.clonedeep";
import { SOCKET_ENTITY_ACTIONS } from "@/utils/constants";

@Module({ name: "workflowds", namespaced: true })
export class WorkflowDS extends BaseItemDS<WorkflowDM> {

  public get workflows() {
    return this.items;
  }

  public get currentWorkflow(): WorkflowDM {
    return this.items[SettingsDSModule.selectedWorkflowID] || {};
  }

  @Action({ rawError: true })
  async listWorkflows(params?: { sort?: keyof WorkflowDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const workflows = await WorkflowAPI.LIST(params)
    this.addOrReplaceItems(workflows)
    return workflows
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const workflows = await WorkflowAPI.LIST()
      this.addOrReplaceItems(workflows);
    }
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_WORKFLOW_LOADING)
  async updateWorkflow(workflow: WorkflowDM) {
    const updatedWorkflow = await WorkflowAPI.UPDATE({workflow})
    this.addOrReplaceItem(updatedWorkflow)
    return updatedWorkflow
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_WORKFLOW_LOADING)
  async deactivateWorkflow(workflowId: number) {
    const deletedWorkflow = await WorkflowAPI.DELETE({ workflowId });
    this.addOrReplaceItem(deletedWorkflow);
    return deletedWorkflow
  }

  @Action({ rawError: true })
  async create(params: { title: string, description: string }) {
    const workflow = await WorkflowAPI.CREATE({title:params.title, description:params.description});
    SettingsDSModule.setNewWorkflowId(workflow.id)
    this.addOrReplaceItem(workflow);
    return workflow
  }

  @Action({ rawError: true })
  async addPhases(newPhases) {
    const previousPhaseIds = this.currentWorkflow.phases.map(phase => phase.id);
    const addedPhases = newPhases.filter(phase => !previousPhaseIds.includes(phase.id));

    const phases = await WorkflowAPI.ADD_PHASES({addedPhases:addedPhases});
    const currentWorkflow = this.items[newPhases[0].workflowId]
    phases.forEach(phase => currentWorkflow.phases.push(phase))
    this.addOrReplaceItem(currentWorkflow)
  }

  @Action({ rawError: true })
  async removePhases(phases) {
    const removedPhases = await WorkflowAPI.REMOVE_PHASES({removedPhases:phases});
    const currentWorkflow = cloneDeep(this.items[phases[0].workflowId]);
    removedPhases.forEach(removedPhase => currentWorkflow.phases = currentWorkflow.phases.filter(phase => phase.id !== removedPhase.id));
    this.addOrReplaceItem(currentWorkflow);
  }
  
  @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.workflow
            },
            function onChange(socketWorkflow) {
                if(socketWorkflow.workflow && socketWorkflow.workflow?.id){
                  if( socketWorkflow.action === SOCKET_ENTITY_ACTIONS.DELETE){
                    WorkflowDSModule.removeItem(socketWorkflow.workflow.id);
                  }else {
                    WorkflowDSModule.addOrReplaceItem(socketWorkflow.workflow);
                    ProjectPhaseDSModule.updateProjectPhasesFromWorkflow(socketWorkflow.workflow);
                  }
                }
            }
        );
    }

}

export interface IWorkflowDS {
  itemWatch: WorkflowDM | undefined
}
