import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {SprintDSModule} from '@/store';
import SprintDM from '../../../datamodels/sprintDM';

@Module({name: 'sprintdropdowncs', namespaced: true})
export class SprintDropdownCS extends VuexModule {

    get lastUpdatedSprints() {
        return SprintDSModule.itemWatch;
    }

    get sprints() {
        return (projectId: number) => SprintDSModule.items[projectId];
    }

    get isProjectSprintsLoaded() {
        return (projectId: number) => typeof SprintDSModule.items[projectId] !== 'undefined';
    }

    @Action({rawError: true})
    async loadSprints(id: number) {
        await SprintDSModule.fetch({id, params: {sort: 'number', isReleased: false}});
    }

    @Action({rawError: true})
    async delete(sprint: SprintDM) {
        await SprintDSModule.delete({sprintId: sprint.id, projectId: sprint.projectId});
    }

}
export interface ISprintDropdownCS {
    sprints: SprintDM[]
}
