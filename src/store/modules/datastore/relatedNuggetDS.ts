import NuggetAPI from '@/api/nuggetAPI';
import NuggetDM from '@/datamodels/nuggetDM';
import store, {ApplicationDSModule, NuggetDSModule, RelatedNuggetDSModule} from '@/store';
import {Action, Module, VuexModule} from 'vuex-module-decorators'
import {EntityType} from './applicationDS';
import BaseItemsDS from './base/baseItemsDS';

@Module({name:'relatednuggetds', namespaced: true, stateFactory: true})
export class RelatedNuggetDS extends BaseItemsDS<NuggetDM> implements IRelatedNuggetDS {
    
    constructor(module: VuexModule<ThisType<NuggetDM>, NuggetDM>) {
        super(module);
    }

    public get currentRelatedNuggets(): NuggetDM[] {
        return this.items[ApplicationDSModule.selectedNuggetID] || [];
    }

    @Action({rawError: true})
    async updateRelatedNuggets(newNuggets: NuggetDM[]) {
        const id = ApplicationDSModule.selectedNuggetID;
        const newNuggetIds = newNuggets.map(nugget => nugget.id);
        const previousRelatedNuggetIds = [...this.currentRelatedNuggets.map(nugget => nugget.id)];

        const removedNuggets: number[] = previousRelatedNuggetIds.filter(id => !newNuggetIds.includes(id));
        const addedNuggets: number[] = newNuggetIds.filter(id => !previousRelatedNuggetIds.includes(id));

        if(removedNuggets.length || addedNuggets.length) {
            await NuggetAPI.PATCH_RELATED_NUGGETS({nuggetId: id, nuggetIdsToAdd: addedNuggets, nuggetIdsToRemove: removedNuggets})
            // nuggets returned in the API above is reference to nugget being updated not a list of related nuggets unfortunately.
            this.addOrReplaceItems({id, items: newNuggets});

            addedNuggets.forEach(addedNuggetId => {
                this.addOrReplaceItems({id: addedNuggetId, items: [...this.items[addedNuggetId], NuggetDSModule.items[id]]});
            })
            removedNuggets.forEach(removedNuggetId => {
                this.addOrReplaceItems({id: removedNuggetId, items: this.items[removedNuggetId].filter(nuggetId => nuggetId.id !== id)});
            })
        }

    }

    @Action({rawError: true})
    async doLoad(force = false) {
        const id = ApplicationDSModule.selectedNuggetID;

        if(this.items[ApplicationDSModule.selectedNuggetID] === undefined || force) {
            const nuggets = await NuggetAPI.LIST_RELATED_NUGGETS(id);
            this.addOrReplaceItems({id, items: nuggets});
            NuggetDSModule.addOrReplaceItems(nuggets);
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
                    RelatedNuggetDSModule.doLoad();
                }
            }
        );
    }

}

export interface IRelatedNuggetDS {
    items: { [key: number]: NuggetDM[] }
}
