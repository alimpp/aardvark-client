
import SprintAPI from '@/api/sprintAPI';
import SprintDM from '@/datamodels/sprintDM';
import store, {ApplicationDSModule, PayloadDSModule} from '@/store';
import {Action, Module} from "vuex-module-decorators";
import {Wait, WaitStates} from "@/utils/vuewait";
import BaseItemsDS from './base/baseItemsDS';
import {DetailTabName} from "@/store/modules/datastore/applicationDS";

@Module({name: 'payloadds', namespaced: true, stateFactory: true})
export class PayloadDS extends BaseItemsDS<SprintDM> implements IPayloadDS {

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_PAYLOAD_LOADING)
    async fetch(data: {id: number, params?: any}) {
        const items = await SprintAPI.LIST({releaseId: data.id, params: data.params});
        this.addOrReplaceItems({id: data.id, items});
        return items;
    }

    @Action({rawError: true})
    async doLoad(releaseId) {
        await this.fetch({id: releaseId});
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
          function stateToWatch(state) {
            return {id: state.applicationds.selectedReleaseID, tabName: state.applicationds.selectedDetailTab}
          },
          async function onChange({id, tabName}) {
            if(id > 0 && tabName === DetailTabName.release) {
              await PayloadDSModule.fetch({id});
            }
          }
        );
    }
}
export interface IPayloadDS {
    items: {[key: number]: SprintDM[]}
}
