import Datamodel from '@/datamodels/base/datamodel';
import cloneDeep from 'lodash.clonedeep';
import { Action, Mutation, VuexModule } from 'vuex-module-decorators';

export default abstract class BaseItemsDS<Item extends Datamodel> extends VuexModule {
    items: { [key: string]: Item[] } = {};
    itemWatch: {[key: string]: Item[]} = {};

    // Unfortunately due to the way vuex-module-decorator works, we have not been able to send initializations in constructor and
    // are instead relying on developers to implement a onInitialization @Action function in the child class that will be called a single time.
    constructor(module: VuexModule<ThisType<Item>, Item>) {
        super(module);
    }

    public get getItems() {
        return this.items;
    }

    @Mutation
    appendItems(data: {id: any, items: Item[]}) {
        const itemsClone = cloneDeep(data.items);
        this.items = {...this.items, [data.id]: [...this.items[data.id], ...itemsClone]};
        this.itemWatch = { [data.id]: [...this.items[data.id], ...itemsClone] };
    }

    @Mutation
    unshiftItems(data: {id: any, items: Item[]}) {
        const itemsClone = cloneDeep(data.items);
        this.items = {...this.items, [data.id]: [...itemsClone, ...this.items[data.id]]};
        this.itemWatch = { [data.id]: [...itemsClone, ...this.items[data.id]] };
    }

    @Mutation
    addOrReplaceItem(data: {id: any, items: Item[]}) {
        const itemsClone = cloneDeep(data.items);
        this.items = { ...this.items, [data.id]: itemsClone };
        this.itemWatch = { [data.id]: itemsClone };
    }

    @Action({rawError: true})
    async addOrReplaceItems(data: {id: any, items: Item[]}) {
        if (Array.isArray(data.items)) {
            this.context.commit('addOrReplaceItem', { id: data.id, items: data.items })
        }
    }

    @Action({ rawError: true })
    async replaceItems(data: { id: any, items: Item[] }) {
        this.context.commit('addOrReplaceItem', { id: data.id, items: data.items })
    }

    abstract doLoad(force: boolean)
}
