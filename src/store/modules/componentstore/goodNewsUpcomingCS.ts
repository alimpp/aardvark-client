import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty} from "@/utils/object";
import GoodNewsUpcomingRow from "@/datamodels/rows/goodNewsUpcomingRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, NuggetDSModule, BadgeCountCSModule, GoodNewsUpcomingCSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, CHAT_LABEL_TYPE, TABLE_SORT_DIRECTION} from '@/utils/constants';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'goodnewsupcomingcs', namespaced: true, stateFactory: true})
export class GoodNewsUpcomingCS extends TableSubModuleCS<GoodNewsUpcomingRow> implements IGoodNewsUpcomingCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title: 'Stage', path: 'stage', filterType: TABLE_FILTER_TYPE.NUGGET_STAGE, sortField: TABLE_SORT_TYPE.NUGGET_STAGE },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'assignmentLevel', type: 'text', headerType: 'text', title: 'Assigned', path: 'assignmentLevel', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_LEVEL, sortField: TABLE_SORT_TYPE.ASSIGNMENT_LEVEL },
        { id: 'estimated', type: 'text', headerType: 'text', title: 'Estimated', path: 'estimated', filterType: TABLE_FILTER_TYPE.ESTIMATED_LEVEL, sortField: TABLE_SORT_TYPE.ESTIMATED_LEVEL },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY }
    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_NUMBER, direction: TABLE_SORT_DIRECTION.DESC };

    constructor(module: VuexModule<ThisType<GoodNewsUpcomingRow>, GoodNewsUpcomingRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setGoodNewsUpcoming(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({zone: 'goodnews-upcoming', processCount: badgeCountMethod}),
            model: GoodNewsUpcomingRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: GoodNewsUpcomingRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
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
                const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], GoodNewsUpcomingRow)
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
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsUpcoming && nugget?.item?.id) {
                    const columnsToUpdate = nugget?.changes ? Object.keys(nugget.changes) : [];
                    GoodNewsUpcomingCSModule.doRefreshRow({rowId: nugget?.item?.id, columnsToUpdate});
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
    @Wait(WaitStates.ACTION_GOODNEWSUPCOMING_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsUpcomingRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsUpcomingRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }

    @Action({rawError: true})
    async loadChatTabs() {
        if(!this.selectedRow) return [];
        const tabs = [{ id: this.selectedRow.publicRoomId, highBadgeCount: 0, label: CHAT_LABEL_TYPE.PUBLIC, disableMention: false }];
        return [{ id: this.selectedRow.privateRoomId,highBadgeCount:0 ,label: CHAT_LABEL_TYPE.PRIVATE, disableMention: false }, ...tabs];
    }

}
export interface IGoodNewsUpcomingCS {
    tableData: TableRow[]
}
