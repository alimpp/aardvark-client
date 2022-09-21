import { TypeDSModule, PriorityDSModule, ProjectDSModule, TagDSModule, RelatedNuggetDSModule, NuggetDSModule, ApplicationDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import TagDM from '@/datamodels/tagDM';
import NuggetDM from '@/datamodels/nuggetDM';
import {Wait, WaitStates} from "@/utils/vuewait";
import {Nullable} from '@/utils/generics';

@Module({name:'createnuggetcs', namespaced: true, stateFactory: true})
export class CreateNuggetCS extends VuexModule {
    title = '';
    type = 'bug';
    projectId: Nullable<number> = null;
    priority = 'low';
    nuggetTags: TagDM[] = [];
    description = '';
    relatedNuggets: NuggetDM[] = [];
    searchedNuggets: NuggetDM[] = [];
    stage = 'Triage'
    isSubscribed = false

    @Mutation
    setTitle(value: string) {
        this.title = value;
    }

    @Mutation
    setType(value: string) {
        this.type = value;
    }

    @Mutation
    setProjectId(value: Nullable<number> = null) {
        this.projectId = value;
    }

    @Mutation
    setPriority(value: string) {
        this.priority = value;
    }

    @Mutation
    setNuggetTags(value: TagDM[]) {
        this.nuggetTags = value;
    }

    @Mutation
    setDescription(value: string) {
        this.description = value;
    }

    @Mutation
    setRelatedNuggets(cache:  NuggetDM[]) {
        this.relatedNuggets = cache;
    }

    @Mutation
    setSearchedNuggets(nuggets: NuggetDM[]) {
        this.searchedNuggets = nuggets;
    }

    @Mutation
    setNuggetIsSubscribed(value: boolean) {
        this.isSubscribed = value;
    }

    public get types() {
        return TypeDSModule.types;
    }

    public get projects() {
        return ProjectDSModule.sortedItems('title')?.filter(item => item.status === 'active');
    }

    public get priorities() {
        return PriorityDSModule.priorities;
    }

    public get tags() {
        return TagDSModule.itemsAsArray;
    }

    public get currentRelatedNuggets(): NuggetDM[] {
        return this.relatedNuggets || [];
    }

    @Action({rawError: true})
    async updateRelatedNuggets() {
        await RelatedNuggetDSModule.updateRelatedNuggets(this.currentRelatedNuggets);
    }

    @Action({rawError: true})
    async updateRelatedNuggetsInCurrent(nuggets: NuggetDM[]) {
        this.setRelatedNuggets(nuggets);
    }


    @Action({rawError: true})
    @Wait(WaitStates.ACTION_NUGGET_SEARCH)
    async searchForNuggets(query: string) {
        const nuggets = await NuggetDSModule.searchForNugget({query});
        this.setSearchedNuggets(nuggets);
    }

    @Action({rawError: true})
    async create() {
        if (this.projectId) {
            const newNugget = await NuggetDSModule.create({title: this.title, type: this.type, projectId: this.projectId, priority: this.priority, description: this.description, stage: this.stage})
            ApplicationDSModule.setSelectedProjectId(this.projectId)
            return newNugget
        }
    }

    @Action
    clear() {
        this.setTitle('')
        this.setType("bug")
        this.setProjectId()
        this.setPriority("low")
        this.setNuggetTags([])
        this.setDescription('')
        this.setRelatedNuggets([])
        this.setSearchedNuggets([])
    }
}
