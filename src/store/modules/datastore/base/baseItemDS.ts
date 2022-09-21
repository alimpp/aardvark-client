import { Action, Mutation, VuexModule } from 'vuex-module-decorators'
import Datamodel from '@/datamodels/base/datamodel';
import cloneDeep from 'lodash.clonedeep';
import {getDifference} from '@/utils/object';

interface ItemWatch<T> {
    item: T | undefined
    changes: {[key: string]: {old: any, new: any}} | null
}

export default abstract class BaseItemDS<Item extends Datamodel> extends VuexModule {
    private _items: { [key: number]: Item[] } = {};
    insertionKey: string | number = 'id';
    itemWatch: ItemWatch<Item> | undefined = undefined;

    // Unfortunately due to the way vuex-module-decorator works, we have not been able to send initializations in constructor and
    // are instead relying on developers to implement a onInitialization @Action function in the child class that will be called a single time.
    constructor(module: VuexModule<ThisType<Item>, Item>) {
        super(module);
    }

    public get items(): { [key: number]: Item } {
        const tmpObj: { [key: number]: Item } = {};
        Object.keys(this._items).map(key => tmpObj[key] = this._items[key][0]);
        return tmpObj;
    }

    public get itemsAsArray(): Item[] {
        return Object.values(this.items);
    }

    public get getItems(): { [key: number]: Item } {
        return this.items;
    }

    public get sortedItems() {
        return (field) => {
            if (this.itemsAsArray.length) {
                const type = typeof this.itemsAsArray[0][field]
                if (type === 'string') {
                    this.itemsAsArray.sort((first, second) => {
                        const lowerCaseFirst = first[field].toLowerCase(), lowerCaseSecond = second[field].toLowerCase();
                        if (lowerCaseFirst < lowerCaseSecond) return -1;
                        if (lowerCaseFirst > lowerCaseSecond) return 1;
                        return 0;
                    });
                } else if (type === 'number') {
                    this.itemsAsArray.sort((first, second) => { return second[field] -  first[field] });
                }
                return this.itemsAsArray
            } else {
                return
            }
        }
    }

    @Mutation
    addOrReplaceItem(item: Item) {
        const itemClone = cloneDeep(item);

        const itemFromCache = this._items[item[this.insertionKey]]?.length ? this._items[item[this.insertionKey]][0] : null;
        const itemDiffersFromCache = itemFromCache && JSON.stringify(item) !== JSON.stringify(itemFromCache);
        this.itemWatch = {item: itemClone, changes: itemDiffersFromCache ? getDifference(itemFromCache, itemClone) : null};

        this._items = { ...this._items, [itemClone[this.insertionKey]]: [itemClone] };
    }

    @Mutation
    removeItem(id: number | string) {
        const items = Object.assign({}, this._items);
        delete items[id];
        this._items = items;
    }

    @Action({ rawError: true })
    async addOrReplaceItems(items: Item[] = []) {
        if (!items.isEmpty()) {
            for (const item of items) {
                this.context.commit('addOrReplaceItem', item)
            }
        }
    }

    @Action({rawError: true})
    async removeItemById(id: number | string) {
        this.context.commit('removeItem', id);
    }

    abstract doLoad(force: boolean)
}
