import NuggetAPI from '@/api/nuggetAPI';
import store, { ApplicationDSModule, NuggetDSModule, NuggetPhasesDSModule } from '@/store';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemsDS from './base/baseItemsDS';
import NuggetPhaseDM from '@/datamodels/nuggetPhaseDM';
import {Wait, WaitStates} from "@/utils/vuewait";
import {EntityType} from './applicationDS';
import PhaseAPI from '@/api/phaseAPI';
import {SOCKET_ENTITY_ACTIONS} from '@/utils/constants';
import { isEmpty } from '@/utils/object';

@Module({ name: 'nuggetphasesds', namespaced: true })
export class NuggetPhasesDS extends BaseItemsDS<NuggetPhaseDM> implements INuggetDS {

    public get currentNuggetPhases(): NuggetPhaseDM[] {
        return this.items[ApplicationDSModule.selectedNuggetID] || []
    }
    
    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGETSPHASES_LOADING)
    async listNuggetsPhases(nuggetIds: Array) {
        const take = 100
        let skip = 0
        let response: NuggetPhaseDM[]= []
        let nuggetPhases
        do{
            nuggetPhases = await NuggetAPI.LIST_NUGGETS_PHASES({nuggetIds, take, skip, sort: 'id'})
            response = [...response,...nuggetPhases]
            skip = skip + take
        } while (nuggetPhases.length === take)
        this.updateNuggetPhases({nuggetIds, response})
        return response
    }
    
    @Action({ rawError: true })
    updateNuggetPhases(params: { nuggetIds: number[], response: NuggetPhaseDM[]}) {
        params.nuggetIds.forEach(id => {
            const currentNuggetPhases = params.response.filter(phase => phase.nuggetId === id)
            const currentNugget = NuggetDSModule.items[id]
            if (currentNugget) {
                currentNugget.nuggetPhases = currentNuggetPhases
                NuggetDSModule.addOrReplaceItem(currentNugget)
            }
            if (currentNuggetPhases.length) this.addOrReplaceItem({ id: id, items: currentNuggetPhases });
        })
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGETPHASES_LOADING)
    async listPhases(data: {nuggetId: number , force?: Boolean}) {
        if(isEmpty(this.items[data.nuggetId]) || data.force){
            const response = await NuggetAPI.LIST_PHASES({nuggetId:data.nuggetId})
            this.addOrReplaceItem({id: data.nuggetId, items: response})
            return response
        } else {
            return this.items[data.nuggetId]
        }
    }


    @Action({ rawError: true })
    async readPhase(nuggetPhase: NuggetPhaseDM) {
        const response = await PhaseAPI.READ_NUGGET_PHASE({nuggetPhase})
        this.addOrReplaceItem({id: nuggetPhase.nuggetId, items: this.getItems[nuggetPhase.nuggetId].map(currentNuggetPhase => currentNuggetPhase.id === response.id ? response : currentNuggetPhase)});
        return response
    }

    @Action({ rawError: true })
    doLoad() {
        return
    }

    @Action({rawError: true})
    async processNuggetPhase(nuggetPhase: NuggetPhaseDM) {
        const nuggetIdHasPhases = typeof this.items[nuggetPhase.nuggetId] !== 'undefined';

        if(!nuggetIdHasPhases) {
            // Nugget ID does not have phases, add it.
            this.addOrReplaceItem({ id: nuggetPhase.nuggetId, items: [nuggetPhase] });
        } else {
            const cachedPhaseIndex = this.items[nuggetPhase.nuggetId].findIndex(cachedPhase => cachedPhase.id === nuggetPhase.id);
            if(cachedPhaseIndex === -1) {
                // Nugget Phase does not exist in cache, add it.
                this.addOrReplaceItem({
                    id: nuggetPhase.nuggetId,
                    items: [...this.items[nuggetPhase.nuggetId], nuggetPhase]
                });
            } else {
                const items = [ ...this.items[nuggetPhase.nuggetId] ];
                const cachedPhase = items[cachedPhaseIndex];
                let replaceWithNewPhase = false;

                // Phase does exist, compare autoModifiedAt dates
                if((!cachedPhase.autoModifiedAt && nuggetPhase.autoModifiedAt)) {
                    replaceWithNewPhase = true;
                } else if(nuggetPhase.autoModifiedAt && cachedPhase.autoModifiedAt && nuggetPhase.autoModifiedAt > cachedPhase.autoModifiedAt) {
                    replaceWithNewPhase = true;
                }

                items[cachedPhaseIndex] = replaceWithNewPhase ? nuggetPhase : cachedPhase;
                this.addOrReplaceItem({ id: nuggetPhase.nuggetId, items });
            }
        }
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedNuggetID
            },
            function onChange(id){
                if(id !== 0 && (ApplicationDSModule.selectedEntityType === EntityType.nugget || ApplicationDSModule.selectedEntityType === EntityType.assignment)) {
                    NuggetPhasesDSModule.listPhases({nuggetId:id});
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
              return state.dolphinsocketds.nuggetPhase
            },
            function onChange(socketNuggetPhase) {
                if(socketNuggetPhase.nuggetPhase && socketNuggetPhase.nuggetPhase?.id !== 0) {
                    const nuggetPhase = socketNuggetPhase.nuggetPhase;
                    const id = nuggetPhase.nuggetId;
                    const currentItems = NuggetPhasesDSModule.items[id] || [];
                    switch (socketNuggetPhase.action) {
                        case SOCKET_ENTITY_ACTIONS.DELETE:
                            if(nuggetPhase.isSkipped) {
                                // the phase was skipped, add it
                                NuggetPhasesDSModule.processNuggetPhase(nuggetPhase);
                            } else {
                                // a resource was removed, remove it
                                const items = currentItems.filter(phase => phase.id !== nuggetPhase.id);
                                NuggetPhasesDSModule.addOrReplaceItem({id, items});
                            }
                            break;
                        case SOCKET_ENTITY_ACTIONS.CREATE:
                            if(!nuggetPhase.status) {
                                // the phase was unskipped, remove it
                                const items = currentItems.filter(phase => phase.id !== nuggetPhase.id);
                                NuggetPhasesDSModule.addOrReplaceItem({id, items});
                            } else {
                                // a resource was added, add it
                                NuggetPhasesDSModule.processNuggetPhase(nuggetPhase);
                            }
                            break;
                        case SOCKET_ENTITY_ACTIONS.UPDATE:
                            NuggetPhasesDSModule.processNuggetPhase(nuggetPhase);
                            break;
                        default:
                            break;
                    }
                }
            }
          );
    }

}

export interface INuggetDS {
    items: { [key: number]: NuggetPhaseDM[] }
}
