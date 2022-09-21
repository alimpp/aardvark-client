import store, {NuggetDSModule, ProjectDSModule, ProjectPhaseDSModule} from "@/store"
import { Module, Action, VuexModule } from "vuex-module-decorators"
import PhaseDM from "@/datamodels/phaseDM"
import PhaseAPI from "@/api/phaseAPI"
import BaseItemsDS from './base/baseItemsDS';
import {Wait, WaitStates} from "@/utils/vuewait";
import {isEmpty} from "@/utils/object";
import NuggetDM from '@/datamodels/nuggetDM';
import WorkflowDM from "@/datamodels/workflowDM";

@Module({ name: "projectphaseds", namespaced: true, stateFactory: true})
export class ProjectPhaseDS extends BaseItemsDS<PhaseDM> implements IProjectPhaseDS {

    constructor(module: VuexModule<ThisType<PhaseDM>, PhaseDM>) {
        super(module);
    }

    public get currentProjectPhases(): PhaseDM[] {
        return this.items[this.projectId] || [];
    }

    public get projectId() {
        const nugget = NuggetDSModule.currentNugget
        const projectId = nugget.projectId
        return projectId
    }

  @Action({ rawError: true })
  async doLoad() {
        if(isEmpty(this.currentProjectPhases) && this.projectId) {
            await this.listProjectPhases()
        }
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_PROJECTPHASES_LOADING)
  async listProjectPhases() {
    const id = this.projectId
    const phases = await PhaseAPI.LIST_PROJECT_PHASES({ projectId: id })
    await this.addOrReplaceItems({id: id, items: phases})
    return phases
  }

  @Action({ rawError: true })
  async updateProjectPhasesFromWorkflow(workflow: WorkflowDM) {
    const projects = ProjectDSModule.itemsAsArray.filter(project  => project.workflowId === workflow.id ) ;
    projects.forEach(project => {
        if (ProjectPhaseDSModule.items[project.id] && workflow) {
            ProjectPhaseDSModule.addOrReplaceItem({id: project.id, items: workflow.phases});
        }
    });
  }


  @Action({rawError: true})
  onInitialization() {

    store.watch(
        function stateToWatch(state, getter) {
            return getter['nuggetds/currentNugget'] as NuggetDM
        },
        async function onChange(nugget) {
            if(nugget?.projectId!== 0) {
                await ProjectPhaseDSModule.doLoad();
            }
        }
    );
    
  }
}

export interface IProjectPhaseDS {
  items: { [key: number]: PhaseDM[] }
}
