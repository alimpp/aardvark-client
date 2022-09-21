import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { getDifference, isEmpty } from "@/utils/object";
import BadNewsOverdueTriageRow from "@/datamodels/rows/badNewsOverdueTriageRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, BadgeCountCSModule, BadNewsOverdueTriageCSModule, NuggetDSModule, NuggetPhasesDSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import { ModuleTabName } from "@/store/modules/datastore/applicationDS";
import { BATCH_OPERATION, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { TABLE_FILTER_TYPE, TABLE_SORT_TYPE } from '@/utils/constants';
import { ITableColumnSchema } from '../interfaces/ITableColumnSchema';
import { NUGGET_STAGES } from "@/utils/constants"
import { dateISOFormat, today } from "@/utils/date";
import dayjs from "dayjs"

@Module({ name: 'badnewsoverduetriagecs', namespaced: true, stateFactory: true })
export class BadNewsOverdueTriageCS extends TableSubModuleCS<BadNewsOverdueTriageRow> implements IBadNewsOverdueTriageCS {
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
        { id: 'assignmentLevel', type: 'text', headerType: 'text', title: 'Assigned', path: 'assignmentLevel', filterType:TABLE_FILTER_TYPE.ASSIGNMENT_LEVEL, sortField: TABLE_SORT_TYPE.ASSIGNMENT_LEVEL},
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'priority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY },
        { id: 'responseTime', type: 'responseTime', headerType: 'text', title: 'Due In Hrs', path: 'responseTime', minWidth: '50px', sortField: TABLE_SORT_TYPE.NUGGET_RESPONSE_TIME },
        { id: 'origin', type: 'text', headerType: 'text', title: 'Origin', path: 'origin', filterType: TABLE_FILTER_TYPE.NUGGET_ORIGIN, sortField: TABLE_SORT_TYPE.NUGGET_ORIGIN },
        { id: 'creator', type: 'profile', headerType: 'text', title: 'Created By', path: 'creatorMemberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.NUGGET_CREATED_BY },
        { id: 'tag', type: 'tag', headerType: 'text', title: 'Tag', path: 'tags', filterType: TABLE_FILTER_TYPE.TAGS, },
    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_RESPONSE_TIME, direction: TABLE_SORT_DIRECTION.ASC }

    constructor(module: VuexModule<ThisType<BadNewsOverdueTriageRow>, BadNewsOverdueTriageRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setBadNewsOverdueTriage(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({ zone: 'badnews-overduetriage', processCount: badgeCountMethod }),
            model: BadNewsOverdueTriageRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: BadNewsOverdueTriageRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: { op: BATCH_OPERATION, path: string, value: any }[]) {
        await NuggetDSModule.patch(data);
        await Promise.allSettled([
            this.updateGoodNewsBacklogCount(data.filter(operation => operation.op === BATCH_OPERATION.SCHEDULE).length),
            this.updateBadNewsOverdueTriageCount(data.filter(operation => operation.op === BATCH_OPERATION.REMOVE).length),
            this.updateGoodNewsArchiveCount(data.filter(operation => operation.op === BATCH_OPERATION.UPDATE).length)
        ]);
    }

    @Action
    async updateGoodNewsBacklogCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsBacklog(BadgeCountCSModule.goodNewsBacklog + modifiedRows);
        this.updateBadNewsOverdueTriageCount(modifiedRows)
    }

    @Action
    async updateBadNewsOverdueTriageCount(modifiedRows: number) {
        BadgeCountCSModule.setBadNewsOverdueTriage(BadgeCountCSModule.badNewsOverdueTriage - modifiedRows);
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
                const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], BadNewsOverdueTriageRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['sprintId']) {
                    if (difference['sprintId'].new !== 0) {
                        nuggetSprints.push({ sprintId: difference['sprintId'].new, nuggetId: row.id })
                    }
                    if (difference['sprintId'].new === 0) {
                        batchOperation = BATCH_OPERATION.REMOVE;
                        batchPath = `projects/${row.projectId}/sprints`;
                        batch.push({ op: batchOperation, path: batchPath, value: { nuggetId: row.id } })
                    }
                }
                if (difference['_moveToBacklog'] && difference['_returntotriagejobAt']) {
                    batch.push({ op: BATCH_OPERATION.SCHEDULE, path: `nuggets/${row.id}/jobs`, value: { at: dateISOFormat(difference['_returntotriagejobAt'].new) } })
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
            batch.push({ op: batchOperation, path: batchPath, value: nuggetSprints })
        }
        return batch.length !== 0 ? { batch, rowIndexesToRemove } : undefined;
    }

    @Action
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            async function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.badNewsOverdueTriage && nugget?.item?.id) {
                    const columnsToUpdate = nugget?.changes ? Object.keys(nugget.changes) : [];
                    BadNewsOverdueTriageCSModule.doRefreshRow({ rowId: nugget?.item?.id, columnsToUpdate });
                    const isBacklogged= dayjs(nugget.item.returntotriagejob.at).isAfter(today)
                    if((nugget.changes && Object.keys(nugget.changes).includes('stage') && nugget.changes?.stage?.new === NUGGET_STAGES.BACKLOG) || isBacklogged) {
                        await BadNewsOverdueTriageCSModule.removeRowsById({ids: [nugget?.item?.id]})
                    }
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.nuggetphasesds.items;
            },
            async function onChange() {
                if (ApplicationDSModule.selectedNuggetID && NuggetPhasesDSModule.items[ApplicationDSModule.selectedNuggetID] && ApplicationDSModule.selectedModuleTab === ModuleTabName.badNewsOverdueTriage) {
                    const selectedNuggetPhase = NuggetPhasesDSModule.items[ApplicationDSModule.selectedNuggetID]?.find(phase => phase.isSystem && phase.status === 'to-do')
                    if (selectedNuggetPhase) await NuggetPhasesDSModule.readPhase(selectedNuggetPhase)
                }
            }
        );
    }

    @Action({ rawError: true })
    onRowCellClick(data: { id: string, row: BadNewsOverdueTriageRow }) {
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

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_BADNEWSOVERDUETRIAGE_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({ reset: true });
            const data = JsonParser.deserializeArray(response!, BadNewsOverdueTriageRow)
            this.doSetRows(data)
        }
    }

    // @Action({ rawError: true })
    // async doSetTableData(items: BadNewsOverdueTriageRow[]) {
    //     this.context.commit("setTableData", items)
    // }

    @Action({ rawError: true })
    updateSelectedEntity(data: BadNewsOverdueTriageRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }

}
export interface IBadNewsOverdueTriageCS {
    tableData: TableRow[]
}
