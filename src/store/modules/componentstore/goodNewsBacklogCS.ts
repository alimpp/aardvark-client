import dayjs from 'dayjs';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty} from "@/utils/object";
import GoodNewsBacklogRow from "@/datamodels/rows/goodNewsBacklogRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, NuggetDSModule, BadgeCountCSModule, GoodNewsBacklogCSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, TABLE_SORT_DIRECTION} from '@/utils/constants';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import { NUGGET_STAGES } from "@/utils/constants"
import { dateISOFormat } from '@/utils/date';

@Module({name: 'goodnewsbacklogcs', namespaced: true, stateFactory: true})
export class GoodNewsBacklogCS extends TableSubModuleCS<GoodNewsBacklogRow> implements IGoodNewsBacklogCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT },
        { id: 'archive', type: 'checkbox', headerType: 'text', title: 'Archive', path: 'moveToArchive' },
        { id: 'returntotriagejob', type: 'date', headerType: 'text', title: 'Return To Triage', path: 'returnToTriageAt', minWidth: '130px', sortField: TABLE_SORT_TYPE.NUGGET_RETURN_TO_TRIAGE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'tag', type: 'tag', headerType: 'text', title: 'Tag', path: 'tags', filterType: TABLE_FILTER_TYPE.TAGS },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'priority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY },
        { id: 'creator', type: 'profile', headerType: 'text', title: 'Created By', path: 'creatorMemberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.NUGGET_CREATED_BY }
    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_SPRINT, direction: TABLE_SORT_DIRECTION.DESC };

    constructor(module: VuexModule<ThisType<GoodNewsBacklogRow>, GoodNewsBacklogRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setGoodNewsBacklog(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({zone: 'goodnews-backlog', processCount: badgeCountMethod}),
            model: GoodNewsBacklogRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: GoodNewsBacklogRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: { op: BATCH_OPERATION, path: string, value: any }[]) {
        await NuggetDSModule.patch(data);
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
                const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], GoodNewsBacklogRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['_returntotriagejobAt']) {
                    batch.push({op: BATCH_OPERATION.SCHEDULE, path: `nuggets/${row.id}/jobs`, value: {at: dateISOFormat(difference['_returntotriagejobAt'].new)}})
                }
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
                return state.nuggetds.itemWatch
            },
            function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsBacklog && nugget?.item?.id) {
                    const columnsToUpdate = nugget?.changes ? Object.keys(nugget.changes) : [];
                    GoodNewsBacklogCSModule.doRefreshRow({rowId: nugget?.item?.id, columnsToUpdate});
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick(data: {id: string, row: GoodNewsBacklogRow}) {
        switch (data.id) {
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
    @Wait(WaitStates.ACTION_GOODNEWSBACKLOG_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsBacklogRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsBacklogRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }
}
export interface IGoodNewsBacklogCS {
    tableData: TableRow[]
}
