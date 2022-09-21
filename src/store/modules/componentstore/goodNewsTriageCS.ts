import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty, updateObject} from "@/utils/object";
import GoodNewsTriageRow from "@/datamodels/rows/goodNewsTriageRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, BadgeCountCSModule, GoodNewsTriageCSModule, NuggetDSModule, NuggetPhasesDSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import { TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE, BATCH_OPERATION} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import { NUGGET_STAGES } from "@/utils/constants"
import { dateISOFormat, today } from "@/utils/date";
import dayjs from "dayjs"


@Module({name: 'goodnewstriagecs', namespaced: true, stateFactory: true})
export class GoodNewsTriageCS extends TableSubModuleCS<GoodNewsTriageRow> implements IGoodNewsTriageCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT },
        { id: 'archive', type: 'checkbox', headerType: 'text', title: 'Archive', path: 'moveToArchive' },
        { id: 'moveToBacklog', type: 'checkbox', headerType: 'text', title: 'Backlog', path: 'moveToBacklog' },
        { id: 'returntotriagejob', type: 'returnToTriage', headerType: 'text', title: 'Return To Triage', path: 'returnToTriageAt', minWidth: '130px', sortField: TABLE_SORT_TYPE.NUGGET_RETURN_TO_TRIAGE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'assignmentLevel', type: 'text', headerType: 'text', title: 'Assigned', path: 'assignmentLevel', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_LEVEL, sortField: TABLE_SORT_TYPE.ASSIGNMENT_LEVEL },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'priority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY },
        { id: 'responseTime', type: 'text', headerType: 'text', title: 'Due In Hrs', path: 'responseTime', minWidth: '50px', sortField: TABLE_SORT_TYPE.NUGGET_RESPONSE_TIME },
        { id: 'origin', type: 'text', headerType: 'text', title: 'Origin', path: 'origin', filterType: TABLE_FILTER_TYPE.NUGGET_ORIGIN, sortField: TABLE_SORT_TYPE.NUGGET_ORIGIN },
        { id: 'creator', type: 'profile', headerType: 'text', title: 'Created By', path: 'creatorMemberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.NUGGET_CREATED_BY },
        { id: 'tag', type: 'tag', headerType: 'text', title: 'Tag', path: 'tags' }

    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_RESPONSE_TIME, direction: TABLE_SORT_DIRECTION.DESC }

    constructor(module: VuexModule<ThisType<GoodNewsTriageRow>, GoodNewsTriageRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setGoodNewsTriage(count)
            }
        }

        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({zone: 'goodnews-triage', processCount: badgeCountMethod}),
            model: GoodNewsTriageRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: GoodNewsTriageRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
        await NuggetDSModule.patch(data);
        await Promise.all([
            this.updateBacklogCount(data.filter(operation => operation.op === BATCH_OPERATION.SCHEDULE).length),
            this.updateGoodNewsTriageCount(data.filter(operation => operation.op === BATCH_OPERATION.REMOVE).length),
            this.updateGoodNewsArchiveCount(data.filter(operation => operation.op === BATCH_OPERATION.UPDATE).length)
        ]);
    }

    @Action
    async updateBacklogCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsBacklog(BadgeCountCSModule.goodNewsBacklog + modifiedRows);
        this.updateGoodNewsTriageCount(modifiedRows);
    }

    @Action
    async updateGoodNewsTriageCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsTriage(BadgeCountCSModule.goodNewsTriage - modifiedRows);
    }

    @Action
    async updateGoodNewsArchiveCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsArchive(BadgeCountCSModule.goodNewsArchive + modifiedRows);
    }

    @Action
    async compareForSave() {
        const rowIndexesToRemove: number[] = [];
        const batch: any[] = []
        const nuggetSprints: any[] = []
        let batchOperation: string
        let batchPath: string
        for (const [index, row] of this.tableData.entries()) {
            if (row.id) {
                const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], GoodNewsTriageRow)
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
                if (difference['_moveToBacklog'] && difference['_returntotriagejobAt']) {
                    batch.push({op: BATCH_OPERATION.SCHEDULE, path: `nuggets/${row.id}/jobs`, value: {at: dateISOFormat(difference['_returntotriagejobAt'].new)}})
                    rowIndexesToRemove.push(index);
                }
                if (difference['_moveToArchive'] || difference['stage']) {
                    if(difference['stage']?.new === NUGGET_STAGES.ARCHIVE || difference['_moveToArchive']?.new === true) {
                        batch.push({ op: BATCH_OPERATION.REMOVE, path: `projects/${row.projectId}/sprints`, value: { nuggetId: row.id } })
                        batch.push({ op: BATCH_OPERATION.ARCHIVE, path: `nuggets/${row.id}`})
                        rowIndexesToRemove.push(index);
                    } else if ((difference['stage']?.new === NUGGET_STAGES.TRIAGE && difference['stage']?.old === NUGGET_STAGES.ARCHIVE) || difference['_moveToArchive']?.new === false) {
                        batch.push({ op: BATCH_OPERATION.UNARCHIVE, path: `nuggets/${row.id}`})
                    }
                }
            }
        }
        if (nuggetSprints.length) {
            batchOperation = BATCH_OPERATION.APPEND;
            batchPath = 'nuggetsprints';
            batch.push({op: batchOperation, path: batchPath, value: nuggetSprints})
        }
        return batch.length !== 0 ? {batch, rowIndexesToRemove} : undefined;
    }

    @Action
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            async function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsTriage && nugget?.item?.id) {
                    const columnsToUpdate = nugget?.changes ? Object.keys(nugget.changes) : [];
                    GoodNewsTriageCSModule.doRefreshRow({ rowId: nugget?.item?.id, columnsToUpdate });
                    const isBacklogged= dayjs(nugget.item.returntotriagejob.at).isAfter(today)
                    if((nugget.changes && Object.keys(nugget.changes).includes('stage') && nugget.changes?.stage?.new === NUGGET_STAGES.BACKLOG) || isBacklogged) {
                        await GoodNewsTriageCSModule.removeRowsById({ids: [nugget?.item?.id]})
                    }
                }
            }
        );


        store.watch(
            function stateToWatch(state) {
                return state.nuggetphasesds.items;
            },
            async function onChange(id) {
                if (ApplicationDSModule.selectedNuggetID && NuggetPhasesDSModule.items[ApplicationDSModule.selectedNuggetID] && ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsTriage) {
                    const selectedNuggetPhase = NuggetPhasesDSModule.items[ApplicationDSModule.selectedNuggetID]?.find(phase => phase.isSystem && phase.status === 'to-do')
                    if (selectedNuggetPhase) await NuggetPhasesDSModule.readPhase(selectedNuggetPhase)
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick(data: {id: string, row: GoodNewsTriageRow}) {
        switch (data.id) {
            case 'moveToBacklog':
                if (data.row.id && data.row.moveToBacklog) {
                    data.row._returntotriagejobAt = data.row.returntotriagejob ? data.row.returntotriagejob.at : null
                }
                break;
            case 'archive':
                if (data.row.id && data.row.moveToArchive) {
                    data.row.stage = NUGGET_STAGES.TRIAGE
                    data.row.moveToArchive = false
                } else {
                    data.row.stage = NUGGET_STAGES.ARCHIVE
                    data.row.moveToArchive = true
                }
                break;
            default:
                break;
        }
    }

    @Action({rawError: true})
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_GOODNEWSTRIAGE_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsTriageRow)
            this.doSetRows(data)
        }
    }

    // @Action({rawError: true})
    // async doSetTableData(items: GoodNewsTriageRow[]) {
    //     this.context.commit("setTableData", items)
    // }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsTriageRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }

}
export interface IGoodNewsTriageCS {
    tableData: TableRow[]
}
