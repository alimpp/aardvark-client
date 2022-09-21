import { ProjectDSModule, ProjectsAllProjectsCSModule, StatusDSModule, WorkflowDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import {Nullable} from '@/utils/generics';

@Module({name:'createprojectcs', namespaced: true})
export class CreateProjectCS extends VuexModule {
    title = '';
    workflowId: Nullable<number> = null;
    status = '';
    primaryMaestro: Nullable<number> = null;
    secondaryMaestro: Nullable<number> = null;
    description = '';

    get workflows() {
        return WorkflowDSModule.itemsAsArray;
    }

    get statuses() {
        return StatusDSModule.statuses;
    }

    @Mutation
    setTitle(value: string) {
        this.title = value;
    }

    @Mutation
    setWorkflowId(value: Nullable<number> = null) {
        this.workflowId = value;
    }

    @Mutation
    setStatus(value: string) {
        this.status = value;
    }

    @Mutation
    setPrimaryMaestro(value: Nullable<number> = null) {
        this.primaryMaestro = value;
    }

    @Mutation
    setSecondaryMaestro(value: Nullable<number> = null) {
        this.secondaryMaestro = value;
    }

    @Mutation
    setDescription(value: string) {
        this.description = value;
    }

    @Action({rawError: true})
    async create() {
        if (this.primaryMaestro && this.workflowId) {
            const project = await ProjectDSModule.create({
                title: this.title,
                workflowId: this.workflowId,
                status: this.status,
                managerId: this.primaryMaestro,
                description: this.description,
                secondaryManagerId: this.secondaryMaestro
            });
            const allProjectRow = await ProjectsAllProjectsCSModule.addProject(project);
            ProjectsAllProjectsCSModule.onRowClick(allProjectRow);
        }
    }

    @Action
    async clear() {
        this.setTitle('');
        this.setWorkflowId();
        this.setStatus('');
        this.setPrimaryMaestro();
        this.setSecondaryMaestro();
        this.setDescription('');
    }

}
