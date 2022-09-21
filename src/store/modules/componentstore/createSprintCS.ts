import {SprintDSModule} from '@/store';
import {VuexModule, Mutation, Action, Module} from 'vuex-module-decorators'
import {Nullable} from '@/utils/generics';
import SprintDM from '@/datamodels/sprintDM';

@Module({name:'createsprintcs', namespaced: true})
export class CreateSprintCS extends VuexModule {

    projectId: Nullable<number> = null;
    name = '';
    returnToTriage = ''
    isBacklog = false
    sprint: Nullable<SprintDM> = null;

    @Mutation
    setName(name: string) {
        this.name = name;
    }

    @Mutation
    setProjectId(projectId: Nullable<number> = null) {
        this.projectId = projectId;
    }

    @Mutation
    setReturnToTriage(returnToTriage: string) {
        this.returnToTriage = returnToTriage;
    }

    @Mutation
    setIsBacklog(backlog: boolean) {
        this.isBacklog = backlog;
    }

    @Mutation
    setCreatedSprint(sprint: Nullable<SprintDM>) {
        this.sprint = sprint;
    }

    @Action({rawError: true})
    async create(): Promise<SprintDM | null> {
        if (this.projectId) {
            const createdSprint = await SprintDSModule.create({projectId: this.projectId, name: this.name});
            if (this.returnToTriage) {
                await SprintDSModule.rescheduleSprint({sprintId: createdSprint.id, returnToTriage: this.returnToTriage});
            }
            if (createdSprint) {
                this.updateSprintState(createdSprint);
                return createdSprint;
            }
        }
        this.clear();
        return null;
    }

    @Action({rawError: true})
    async updateSprintState(sprint: SprintDM) {
        this.setIsBacklog(sprint.hasBackloggedNuggets);
        this.setProjectId(sprint.projectId);
        this.setCreatedSprint(sprint);
    }

    @Action({rawError: true})
    clear() {
        this.setName('');
        this.setProjectId();
        this.setCreatedSprint(null);
        this.setReturnToTriage('')
        this.setIsBacklog(false)
    }

}

export interface ICreateSprintCS {
    projectId: number
    name: string
    returnToTriage: string
    isBacklog: boolean
    sprint?: Nullable<SprintDM>
}
