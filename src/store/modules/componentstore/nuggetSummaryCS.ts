import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { NuggetDSModule } from '@/store';
import { Wait, WaitStates } from "@/utils/vuewait";

@Module({ name: 'nuggetsummarycs', namespaced: true, stateFactory: true })
export class NuggetSummaryCS extends VuexModule {

    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
    }

    public get nuggets() {
        return NuggetDSModule.itemsAsArray;
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGET_SUMMARY_LOADING)
    async findNugget(nuggetNumber: number) {
        if(typeof this.nuggets.find(nugget => nugget.number === nuggetNumber) === 'undefined') {
            return await NuggetDSModule.listNuggets({ filters: {number: [nuggetNumber]} });
        }
    }

}
