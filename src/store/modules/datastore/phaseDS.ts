import PhaseAPI from "@/api/phaseAPI";
import PhaseDM from "@/datamodels/phaseDM";
import { isEmpty } from "@/utils/object";
import { Action, Module } from "vuex-module-decorators";
import BaseItemDS from './base/baseItemDS';
import { SettingsDSModule, WorkflowDSModule } from '@/store';
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: "phaseds", namespaced: true })
export class PhaseDS extends BaseItemDS<PhaseDM> {

  public get phases() {
    return this.items;
  }

  public get currentPhase(): PhaseDM {
    return this.items[SettingsDSModule.selectedPhaseID] || {};
  }

  @Action({ rawError: true })
  async listPhases(params?: { sort?: keyof PhaseDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const phases = await PhaseAPI.LIST(params)
    this.addOrReplaceItems(phases)
    return phases
  }

  @Action({rawError: true})
  async listProjectPhases(params: {projectId: number, sort?: keyof PhaseDM, direction?: "ASC" | "DESC"}) {
    const phases = await PhaseAPI.LIST_PROJECT_PHASES({projectId: params.projectId, sort:params.sort, direction: params.direction})
    this.addOrReplaceItems(phases)
    return phases
  }

  @Action({ rawError: true })
  async updatePhase(phase: PhaseDM) {
    const updatedPhase = await PhaseAPI.UPDATE({phase});
    this.addOrReplaceItem(updatedPhase);
  }

  @Action({ rawError: true })
  async deactivatePhase(phaseId: number) {
    const deletedPhase = await PhaseAPI.DELETE({phaseId});
    const workflows = WorkflowDSModule.itemsAsArray.filter(item => item.phases.some(phase => phase.id === deletedPhase.id))
    workflows.forEach(workflow => {
        const index = workflow.phases.findIndex(phase => phase.id === deletedPhase.id)
        if (index !== -1) {
          workflow.phases.splice(index, 1)
          WorkflowDSModule.addOrReplaceItem(workflow)
        }
      })
    this.addOrReplaceItem(deletedPhase);
    return deletedPhase
  }


  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const phases = await PhaseAPI.LIST()
      this.addOrReplaceItems(phases);
    }
  }

  @Action({ rawError: true })
  async create(params: {title: string, description: string, skillId: number}) {
    const phase = await PhaseAPI.CREATE({title: params.title, description: params.description, skillId: params.skillId});
    SettingsDSModule.setNewPhaseId(phase.id)
    this.addOrReplaceItem(phase);
    return phase
  }

}
