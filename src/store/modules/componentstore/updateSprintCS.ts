
import SprintDM from '@/datamodels/sprintDM';
import {SprintDSModule, NuggetDSModule, DialogCSModule} from '@/store';
import {VuexModule, Mutation, Action, Module} from 'vuex-module-decorators'

@Module({name: 'updatesprintcs', namespaced: true})
export class UpdateSprintCS extends VuexModule {

    sprint: SprintDM = new SprintDM();
    moveNugget = false

    @Mutation
    setName(sprintName: string) {
        this.sprint.name = sprintName;
    }

    @Mutation
    setSprint(sprint: SprintDM) {
        this.sprint = sprint;
    }

    @Mutation
    setSprintId(sprintId: number) {
        this.sprint.id = sprintId;
    }

    @Mutation
    setReturnToTriage(returnToTriage: string) {
        this.sprint.returnToTriageJobDate = returnToTriage;
    }

    @Mutation
    setMoveNugget(moveNugget: boolean) {
        this.moveNugget = moveNugget;
    }

    @Action({rawError: true})
    async update() {
        const response = await SprintDSModule.update({sprintId: this.sprint.id, sprintName: this.sprint.name, projectID: this.sprint.projectId});
        DialogCSModule.clear()
        return response
    }

    @Action({rawError: true})
    async rescheduleSprint() {
        if (this.sprint.returnToTriageJobDate) await SprintDSModule.rescheduleSprint({sprintId: this.sprint.id, returnToTriage: this.sprint.returnToTriageJobDate, moveNugget: this.moveNugget});
    }

    @Action
    async listNuggets(sprintId: number) {
        let nuggets: any = []
        nuggets = await NuggetDSModule.listNuggets({ take: 100, skip: 0, sprintId: sprintId});
        return nuggets
    }

    @Action({rawError: true})
    clear() {
        this.setSprint(new SprintDM);
    }

}

export interface IUpdateSprintCS {
    projectId: number
    name: string
}
