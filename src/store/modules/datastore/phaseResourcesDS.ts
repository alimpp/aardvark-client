import UserAPI from "@/api/userAPI"
import UserDM from '@/datamodels/userDM';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import store, {ApplicationDSModule, AssignmentDetailPhasesCSModule, PhaseResourceDSModule} from '@/store';
import {DetailTabName} from './applicationDS';
import BaseItemsDS from './base/baseItemsDS';
import {Wait, WaitStates} from "@/utils/vuewait";
import cloneDeep from 'lodash.clonedeep';

@Module({name:'phaseresourcesds', namespaced: true, stateFactory: true})
export class PhaseResourceDS extends BaseItemsDS<UserDM> implements IPhaseResourceDS {

    constructor(module: VuexModule<ThisType<UserDM>, UserDM>) {
        super(module);
    }

    public get currentPhaseResource(): UserDM[] {
        return cloneDeep(this.items[AssignmentDetailPhasesCSModule.selectedPhaseId] || []);
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_RESOURCESUMMARIES_LOADING)
    async doLoad() {
        const id = AssignmentDetailPhasesCSModule.selectedPhaseId
        const resources = await UserAPI.LIST_PHASE_MEMBERS({PhaseId: id , sort: 'firstName', direction: 'ASC'})
        await this.replaceItems({id: id, items: resources})
        return resources
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return AssignmentDetailPhasesCSModule.selectedPhaseId
            },
            async function onChange(phaseId) {
                if(ApplicationDSModule.selectedDetailTab === DetailTabName.assigned && phaseId !==0 && !PhaseResourceDSModule.items[phaseId]) {
                    await PhaseResourceDSModule.doLoad();
                }
            }
        );
    }
}

export interface IPhaseResourceDS {
    items: { [key: number]: UserDM[] }
  }
