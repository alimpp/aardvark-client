import dayjs from 'dayjs';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, {
    ApplicationDSModule,
    NuggetDetailCSModule,
    NuggetDSModule,
    PriorityDSModule,
    ProjectDSModule,
    RelatedNuggetDSModule,
    TagDSModule,
    TypeDSModule,
    SprintDSModule
} from '@/store';
import NuggetDM from '@/datamodels/nuggetDM';
import cloneDeep from 'lodash.clonedeep';
import { Wait, WaitStates } from "@/utils/vuewait";
import { DetailTabName } from "@/store/modules/datastore/applicationDS";
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import { getDifference } from '@/utils/object';
import {NUGGET_STAGES} from '@/utils/constants';
import { dateISOFormat } from '@/utils/date';
export interface INuggetDetailCS {
    nuggetDetail: NuggetDM
    relatedNuggets: NuggetDM[]
    searchedNuggets: NuggetDM[]
}

@Module({ name: 'nuggetdetailcs', namespaced: true, stateFactory: true })
export class NuggetDetailCS extends VuexModule implements ILifeCycle {

    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
    }

    nuggetDetail: NuggetDM = new NuggetDM();
    relatedNuggets: NuggetDM[] = [];
    searchedNuggets: NuggetDM[] = [];
    difference

    @Mutation
    setNuggetDetail(nugget: NuggetDM) {
        this.nuggetDetail = nugget;
    }
    @Mutation
    setRelatedNuggets(nuggets: NuggetDM[]) {
        this.relatedNuggets = nuggets;
    }

    @Mutation
    setSearchedNuggets(nuggets: NuggetDM[]) {
        this.searchedNuggets = nuggets;
    }

    public get currentRelatedNuggets(): NuggetDM[] {
        return this.relatedNuggets || [];
    }

    public get nuggets() {
        return NuggetDSModule.itemsAsArray;
    }

    public get types() {
        return TypeDSModule.types;
    }

    public get priorities() {
        return PriorityDSModule.priorities;
    }

    public get tags() {
        return TagDSModule.sortedItems('title');
    }

    public get projects() {
        const projects = ProjectDSModule.sortedItems('title')?.filter(project => project.status === 'active') || [];
        if(NuggetDSModule.currentNugget?.project) {
            if(projects.some(project => project.id === NuggetDSModule.currentNugget.projectId)) return projects
            else return [NuggetDSModule.currentNugget.project, ...projects];
        } else {
            return projects;
        }
    }

    public get sprints() {
        const sprints = this.nuggetDetail.sprint?.isReleased ? [this.nuggetDetail.sprint] : [];
        return [...sprints, ...(SprintDSModule.items[ApplicationDSModule.selectedProjectID] || [])];
    }

    @Action({ rawError: true })
    async listSprint() {
        if (this.nuggetDetail?.projectId && !SprintDSModule.items[ApplicationDSModule.selectedProjectID]) {
            await SprintDSModule.fetch({ id: ApplicationDSModule.selectedProjectID, params: { sort: 'number', isReleased: false }})
        }
    }

    @Action({ rawError: true })
    async clearSearchedNuggets() {
        this.setSearchedNuggets([]);
    }

    @Action({ rawError: true })
    async updateRelatedNuggetsInCurrent(nuggets: NuggetDM[]) {
        this.setRelatedNuggets(nuggets);
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGET_SEARCH)
    async searchForNuggets(query: string) {
        const nuggets = await NuggetDSModule.searchForNugget({ query });
        this.setSearchedNuggets(nuggets);
    }

    @Action({ rawError: true })
    async subscribeNugget() {
        NuggetDSModule.subscribeNugget(this.nuggetDetail.id);
    }

    @Action({ rawError: true })
    async unsubscribeNugget() {
        NuggetDSModule.unsubscribeNugget(this.nuggetDetail.id);
    }

    @Action({ rawError: true })
    async updateNuggetTags() {
        await NuggetDSModule.updateNuggetTags(this.nuggetDetail);
    }

    @Action({ rawError: true })
    async updateRelatedNuggets() {
        await RelatedNuggetDSModule.updateRelatedNuggets(this.currentRelatedNuggets);
    }

    @Action({ rawError: true })
    async updateNuggetProject() {
        await NuggetDSModule.updateNuggetProject({ id: this.nuggetDetail.id, projectId: this.nuggetDetail.projectId});
    }

    @Action({ rawError: true })
    async updateNugget() {
        const params = { id: this.nuggetDetail.id, showToast: false }
        const difference = getDifference(NuggetDSModule.items[this.nuggetDetail.id], this.nuggetDetail);
        if (difference['sprintId']) {
            if (difference['sprintId'].new !== 0) {
                await this.appendSprint(this.nuggetDetail)
            }
            if (difference['sprintId'].new === 0) {
                await this.removeSprint({projectId: this.nuggetDetail.projectId, nuggetId: this.nuggetDetail.id})
            }
        }
        if (difference['_returntotriagejob'] || difference['_returntotriagejobAt']) {
            if(this.nuggetDetail.returntotriagejob?.at !== '') await this.schedule({returnToTriageJobAt: this.nuggetDetail.returntotriagejob?.at, nuggetId: this.nuggetDetail.id})
        }
        if (difference['stage']) {
            if(difference['stage'].new === NUGGET_STAGES.ARCHIVE) {
                await this.removeSprint({projectId: this.nuggetDetail.projectId, nuggetId: this.nuggetDetail.id})
                await this.archiveNugget({nuggetId: this.nuggetDetail.id})  
            } else if(difference['stage'].new !== NUGGET_STAGES.ARCHIVE) {
                await this.unarchiveNugget({nuggetId: this.nuggetDetail.id})  

            }
            
        }
        for (const key in difference) params[key] = difference[key].new;
        if (Object.keys(params).length > 2) await NuggetDSModule.updateNugget(params)
    }

    @Action({ rawError: true })
    async schedule(params: {returnToTriageJobAt, nuggetId}) {
        await NuggetDSModule.schedule({returnToTriageJobAt: params.returnToTriageJobAt, nuggetId: params.nuggetId})
    }
    @Action({ rawError: true })
    async removeSprint(params: {projectId, nuggetId}) {
        await NuggetDSModule.removeSprint({projectId: params.projectId, nuggetId:params.nuggetId});
    }

    @Action({ rawError: true })
    async archiveNugget(params: {nuggetId}) {
        await NuggetDSModule.archiveNugget({nuggetId:params.nuggetId});
    }

    @Action({ rawError: true })
    async unarchiveNugget(params: {nuggetId}) {
        await NuggetDSModule.unarchiveNugget({nuggetId:params.nuggetId});
    }
    

    @Action({ rawError: true })
    async appendSprint(nugget) {
        await NuggetDSModule.appendSprint([{"sprintId": nugget.sprintId, "nuggetId": nugget.id}]);
    }


    @Action({ rawError: true })
    async updateNuggetDetailFromCache() {
        this.setNuggetDetail(cloneDeep(NuggetDSModule.currentNugget))
    }

    @Action({ rawError: true })
    async updateRelatedNuggetsFromCache() {
        this.setRelatedNuggets(RelatedNuggetDSModule.currentRelatedNuggets);
    }

    @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return { itemWatch: state.nuggetds.itemWatch, selectedNuggetId: state.applicationds.selectedNuggetID };
            },
            async function onChange(newVal, oldVal) {
                if (ApplicationDSModule.selectedDetailTab === DetailTabName.nugget && (NuggetDSModule.currentNugget?.id === newVal.itemWatch?.item?.id || !NuggetDSModule.currentNugget?.id || oldVal.selectedNuggetId === newVal.selectedNuggetId)) {
                    NuggetDetailCSModule.updateNuggetDetailFromCache()
                    NuggetDetailCSModule.listSprint();
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.relatednuggetds.items;
            },
            function onChange() {
                if (ApplicationDSModule.selectedDetailTab === DetailTabName.nugget) {
                    NuggetDetailCSModule.updateRelatedNuggetsFromCache();
                }
            }
        );
    }

    @Action({ rawError: true })
    activate() {
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.nugget) {
            this.updateNuggetDetailFromCache()
            this.updateRelatedNuggetsFromCache()
            this.listSprint()
        }
    }

}
