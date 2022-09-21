import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty, updateObject} from "@/utils/object";
import GoodNewsProductionRow from "@/datamodels/rows/goodNewsProductionRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {NuggetPhasesDSModule, ApplicationDSModule, BadgeCountCSModule, GoodNewsProductionCSModule, NuggetDSModule, ProjectPhaseDSModule} from "@/store";
import {Wait, WaitStates, wait} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'goodnewsproductioncs', namespaced: true, stateFactory: true})
export class GoodNewsProductionCS extends TableSubModuleCS<GoodNewsProductionRow> implements IGoodNewsProductionCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT }
    ]

    constructor(module: VuexModule<ThisType<GoodNewsProductionRow>, GoodNewsProductionRow>) {
        super(module);
    }

    
    get dynamicColumns() {
        if (!this.tableData.length || !ApplicationDSModule.selectedProjectID || !ProjectPhaseDSModule.items[ApplicationDSModule.selectedProjectID]) return [];
        return ProjectPhaseDSModule.items[ApplicationDSModule.selectedProjectID].filter(phase => !phase.isSystem).map(projectPhase => {
            return {id: `cadence-${projectPhase.title}`, type: 'cadence', headerType: 'text', title: projectPhase.title,
            path: { cadences: [`cadence-${projectPhase.title}`, 'cadence']}, minWidth:'130px'}
        })
    }

    get tableSchema() {
        return [
            ...this._tableSchema,
            ...this.dynamicColumns
        ];
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setGoodNewsProduction(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({ zone: 'goodnews-production', projectId: ApplicationDSModule.selectedProjectID, processCount: badgeCountMethod}),
            model: GoodNewsProductionRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: GoodNewsProductionRow
        }
    }

    get isLoadingColumn() {return (columnSchema: ITableColumnSchema, rowData) => {
        const isLoading = {}
        if(columnSchema.type === 'cadence') {
            if(rowData.id && !NuggetPhasesDSModule.items[rowData.id] && wait.is(WaitStates.ACTION_NUGGETSPHASES_LOADING)) {
            isLoading[columnSchema.title] = true
            } else {
            isLoading[columnSchema.title] = false
            }
        }
        return isLoading
    }}

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action
    async saveMethod(data: { op: BATCH_OPERATION, path: string, value: any }[]) {
        await NuggetDSModule.patch(data);
    }

    @Action
    async compareForSave() {
        const batch: any[] = []
        const nuggetSprints: any[] = []
        let batchOperation: string
        let batchPath: string
        for (const row of this.tableData) {
            if (row.id) {
                const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], GoodNewsProductionRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['sprintId']) {
                    if (difference['sprintId'].new !== 0) {
                        nuggetSprints.push({sprintId: difference['sprintId'].new, nuggetId: row.id})
                    }
                    if (difference['sprintId'].new === 0) {
                        batchOperation = BATCH_OPERATION.REMOVE;
                        batchPath = `projects/${row.projectId}/sprints`;
                        batch.push({op: batchOperation, path: batchPath, value: {nuggetId: row.id}})
                    }
                }
            }
        }
        if (nuggetSprints.length) {
            batchOperation = BATCH_OPERATION.APPEND;
            batchPath = 'nuggetsprints';
            batch.push({op: batchOperation, path: batchPath, value: nuggetSprints})
        }
        return batch.length !== 0 ? {batch} : undefined;
    }

    @Action
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch
            },
            function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsProduction && nugget?.item?.id) {
                    const columnsToUpdate = nugget?.changes ? Object.keys(nugget.changes) : [];
                    GoodNewsProductionCSModule.doRefreshRow({rowId: nugget?.item?.id, columnsToUpdate});
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.nuggetphasesds.items
            },
            function onChange(phases) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsProduction) {
                GoodNewsProductionCSModule.doRefreshTable();
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick() {
        return
    }

    @Action({rawError: true})
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_GOODNEWSPRODUCTION_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsProductionRow)
            const nuggetIds = data.map(nugget => { return nugget.id })
            NuggetPhasesDSModule.listNuggetsPhases(nuggetIds)
            this.doSetRows(data)
        }
    }

    //Overriding this to get nuggets phases after fetch more
    @Action({rawError: true})
    async fetchMore() {
        if(!this.requestOptions) return [];
        const response = await this.context.dispatch("fetch");
        const data = JsonParser.deserializeArray(response, this.requestOptions.model) as GoodNewsProductionRow[]
        const rows = [...this.tableData];
        data.forEach(row => {
            const index = this.tableData.findIndex(tableRow => tableRow.id === row.id)
            if(index === -1) rows.push(row);
        });
        const nuggetIds = data.map(nugget => { return nugget.id })
        NuggetPhasesDSModule.listNuggetsPhases(nuggetIds)
        this.context.dispatch("doSetRows", rows)
    }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsProductionRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
    }

}
export interface IGoodNewsProductionCS {
    tableData: TableRow[]
}
