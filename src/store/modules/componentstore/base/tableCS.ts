import {Action, Mutation, VuexModule} from 'vuex-module-decorators';
import {ITableColumnSchema} from '@/store/modules/interfaces/ITableColumnSchema';
import TableRow from "@/datamodels/base/tableRow";
import {isEmpty} from "@/utils/object"
import {JsonParser} from '@/utils/jsonparser';
import {TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';

interface TableSort {
    field?: TABLE_SORT_TYPE
    direction?: TABLE_SORT_DIRECTION
}

export default abstract class TableCS<Row extends TableRow> extends VuexModule {
    tableData: Row[] = []
    _selectedRows: Row[] = []
    sort: TableSort = {};
    filters: {[key: string]: (string| number)[]} = {};
    take = 25;
    skip = 0;
    canShowLoadMore = false;

    // Unfortunately due to the way vuex-module-decorator works, we have not been able to send initializations in constructor and
    // are instead relying on developers to implement a onInitialization @Action function in the child class that will be called a single time.

    constructor(module: VuexModule<ThisType<Row>, Row>) {
        super(module);
    }

    abstract get tableSchema(): ITableColumnSchema[];
    abstract get requestOptions(): void | {
        method(...args: any[]): Promise<any>
        parameters: () => {[key: string]: any}
        model: new () => Row
    }

    abstract get refreshOptions(): void | {
        items: { [key: number]: any }
        model: new () => Row
    }

    @Mutation
    setShowLoadMore(value: boolean) {
        this.canShowLoadMore = value;
    }

    @Mutation
    setSkip(value: number) {
        this.skip = value;
    }

    @Mutation
    setSelectedRows(rows: Row[]) {
        this._selectedRows = rows;
    }

    get rowCount() {
        return this.tableData.length
    }

    get selectedRow() {
        return this._selectedRows[0]
    }

    get selectedRows() {
        return this._selectedRows;
    }

    get hasFilters(): boolean {
        return Object.keys(this.filters).length !== 0;
    }

    @Mutation
    setTableData(data: Row[]) {
        this.tableData = data
    }

    @Mutation
    clearSortAndFilter() {
        this.sort = {};
        this.filters = {};
    }

    @Mutation
    setSort(data: TableSort) {
        this.sort = data;
    }

    @Mutation
    setFilter(data: {[key: string]: (string| number)[]}) {
        this.filters = data;
    }

    @Action({rawError: true})
    async filterBy(data: {[key: string]: (string| number)[]}) {
        const updatedFilters = {...this.filters};
        for(const key in data) {
            if(data[key].length === 0) delete updatedFilters[key]
            else updatedFilters[key] = data[key];
        }
        this.context.dispatch("clear");
        this.context.commit('setFilter', updatedFilters);
        this.context.dispatch('doLoad', true);
    }

    @Action({rawError: true})
    async sortBy(data: { field: string, direction: "ASC" | "DESC" }) {
        this.context.dispatch("clear");
        this.context.commit('setSort', data);
        this.context.dispatch('doLoad', true);
    }

    @Action({rawError: true})
    async resetPagination() {
        this.context.commit("setShowLoadMore", false);
            this.context.commit("setSkip", 0);
    }

    @Action({rawError: true})
    async fetch<T>(data?: { reset?: boolean, direction?: "ASC" | "DESC", sort?: string, take?: number, skip?: number, filters?: {[key: string]: (string | number)[]} }): Promise<T[]> {
        if(!this.requestOptions) return [];
        if (data?.reset) {
            this.context.dispatch("resetPagination");
        }
        const items = await this.requestOptions.method.call(this, {
            ...this.requestOptions.parameters(),
            direction: data?.direction !== undefined ? data?.direction : this.sort.direction,
            sort: data?.sort !== undefined ? data?.sort : this.sort.field,
            filters: data?.filters !== undefined ? data?.filters : this.filters,
            take: data?.take !== undefined ? data?.take : this.take,
            skip: data?.skip !== undefined ? data?.skip : this.skip
        })
        this.context.commit("setShowLoadMore", items.length === (data?.take ? data.take : this.take));
        this.context.commit("setSkip", (data?.skip || this.skip) + (data?.take || this.take));
        return items;
    }

    @Action({rawError: true})
    async fetchMore() {
        if(!this.requestOptions) return [];
        const response = await this.context.dispatch("fetch");
        const data = JsonParser.deserializeArray(response, this.requestOptions.model) as Row[]
        const rows = [...this.tableData];
        data.forEach(row => {
            const index = this.tableData.findIndex(tableRow => tableRow.id === row.id)
            if(index === -1) rows.push(row);
        });
        this.context.dispatch("doSetRows", rows)
    }

    @Action({rawError: true})
    async doReorderTableColumn(action: { from: number, to: number }) {
        this.setTableSchema([...this.tableSchema].move(action.from, action.to))
    }

    @Action({rawError: true})
    async doUpdateRow(params: { item: Row, replaceRowId?: number }) {
        const index = this.tableData.findIndex(rowData => rowData.id === params.item.id);
        if (index !== -1) {
            const newState = [...this.tableData]
            newState[index] = params.item
            await this.context.dispatch("doSetTableData", newState)

        } else if (index === -1 && params.replaceRowId) {
            const previousRowIndex = this.tableData.findIndex(rowData => rowData.id === params.replaceRowId);
            const newState = [...this.tableData]
            newState.splice(previousRowIndex, 1, params.item);
            await this.context.dispatch("clear")
            await this.context.dispatch("onRowClick", newState[previousRowIndex])
            await this.context.dispatch("doSetTableData", newState)
            await this.context.commit("setSelectedRows", [newState[previousRowIndex]])
        } else {
            await this.context.dispatch("doSetTableData", [params.item, ...this.tableData ])
        }
    }

    @Action({rawError: true})
    async doSetTableData(items: Row[]) {
        await this.context.commit("setTableData", items)
    }

    @Action({rawError: true})
    async doSelectedDefaultRow() {
        const items = this.tableData
        if (items && items.length === 0) {
            await this.context.commit("setSelectedRows", [])
        } else if (isEmpty(this.selectedRow) && items.length > 0) {
            await this.context.commit("setSelectedRows", [items[0]])
            await this.context.dispatch("onRowClick", items[0])
        } else if (!this.tableData.find(rowData => rowData.id === this.selectedRow!.id)) {
            if (items.length === 0) {
                await this.context.commit("setSelectedRows", [])
            } else {
                await this.context.dispatch("onRowClick", items[0])
            }
        }
    }

    @Action({rawError: true})
    async doSetRows(items: Row[]) {
        await this.context.dispatch("doSetTableData", items)
    }

    @Action({rawError: true})
    async clear() {
        await this.context.commit("setSelectedRows", [])
        await this.context.dispatch("doSetTableData", [])
    }

    @Action({rawError: true})
    async compareForSave(): Promise<{batch: object[], rowIndexesToRemove?: number[]} | undefined> {
        throw new Error('compareForSave() method not overriden!')
    }

    @Action({rawError: true})
    async saveMethod(data: object[]) {
        throw new Error('saveMethod() method not overriden!')
    }

    @Action({rawError: true})
    async onSave(): Promise<void> {
        const data = await this.context.dispatch('compareForSave');
        if(typeof data !== 'undefined' && data.batch.length !== 0 && this.requestOptions) {
            await this.context.dispatch('saveMethod', data.batch);
            if(data.rowIndexesToRemove?.length) await this.context.dispatch('removeRowsByIndex', {indexes: data.rowIndexesToRemove});
        }
    }

    @Action({rawError: true})
    async removeRowsByIndex(data: {indexes: number[]}): Promise<void> {
        if(!data.indexes?.length) return;
        const rows = [...this.tableData];

        // Loop through array from right to left as to not mess up index order when removing items.
        for (let index = rows.length - 1; index >= 0; index--) {
            if(data.indexes.includes(index)) {
                if(index === rows.length - 1) rows.pop();
                else rows.splice(index, 1);
            }
        }

        this.context.dispatch("doSetRows", rows);
    }

    @Action({rawError: true})
    async removeRowsById(data: {ids: number[]}): Promise<void> {
        const rows = this.tableData.filter(row => row.id && !data.ids.includes(row.id));
        this.context.dispatch("doSetRows", rows);
    }

    @Action({ rawError: true })
    async doRefreshTable() {
        if(typeof this.refreshOptions !== 'object') return;
        const latestRows: Row[] = []

        for(const row of this.tableData) {
            if(!row.id) continue;
            const freshItem = this.refreshOptions.items[row.id]
            const freshRow = JsonParser.deserializeObject(freshItem, this.refreshOptions.model)
            latestRows.push(freshRow)
        }

        this.context.dispatch("doSetRows", latestRows);
    }

    @Action({rawError: true})
    async doRefreshRow(data: { rowId: any, columnsToUpdate?: string[] }) {
        if(typeof this.refreshOptions !== 'object') return;
        const index = this.tableData.findIndex(row => row.id === data.rowId);
        if(index !== -1) {
            const rows = [...this.tableData];
            const freshItem = this.refreshOptions.items[data.rowId];
            const freshRow = JsonParser.deserializeObject(freshItem, this.refreshOptions.model);
            if(data.columnsToUpdate?.length) {
                data.columnsToUpdate.forEach(column => this.tableData[index][column] = freshRow[column])
            } else {
                rows[index] = freshRow;
            }
            this.context.dispatch("doSetRows", rows);
        }
    }

    public get getHeaderColumnValue() {return function(columnSchema: ITableColumnSchema) {
        return columnSchema.title
    }}

    public get isLoadingColumn() {return function(columnSchema: ITableColumnSchema, rowData) {
        const isLoading = {}
        isLoading[columnSchema.title] = false
        return isLoading
    }}

    //@Action({rawError: true})
    abstract onRowDoubleClick(data: Row);

    //@Action({rawError: true})
    abstract onRowClick(data: Row | null);

    //@Action({rawError: true})
    abstract onRowCellClick(data: { id: string, row: Row })

    //@Action({rawError: true})
    abstract onHeaderCellClick(data: { id: string, value: object })

    //@Action({rawError: true})
    abstract doLoad(force: boolean)

    abstract setTableSchema(value: ITableColumnSchema[]);
    
}
