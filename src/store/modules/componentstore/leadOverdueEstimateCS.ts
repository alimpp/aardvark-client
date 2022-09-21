import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty, updateObject} from "@/utils/object";
import LeadOverdueEstimateRow from "@/datamodels/rows/leadOverdueEstimateRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDSModule, ProfileDSModule, BadgeCountCSModule, LeadOverdueEstimateCSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, CHAT_LABEL_TYPE} from '@/utils/constants';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'leadoverdueestimatecs', namespaced: true, stateFactory: true})
export class LeadOverdueEstimateCS extends TableSubModuleCS<LeadOverdueEstimateRow> implements ILeadOverdueEstimateCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title: 'Stage', path: 'nuggetStage', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_NUGGET_STAGE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_STAGE },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'sprint', type: 'text', headerType: 'text', title: 'Sprint', path: 'sprintName', minWidth: '125px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_SPRINT },
        { id: 'responseTime', type: 'responseTime', headerType: 'text', title: 'Due In Hrs', path: 'responseTime', minWidth: '50px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESPONSE_TIME },
        { id: 'extend', type: 'checkbox', headerType: 'text', title: 'Extend', path: 'extend' },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_PRIORITY, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PRIORITY },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'resource', type: 'profile', headerType: 'text', title: 'Resource', path: 'memberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESOURCE },
        { id: 'reason', type: 'text', headerType: 'text', title: 'Reason', path: 'reason' }
    ]

    constructor(module: VuexModule<ThisType<LeadOverdueEstimateRow>, LeadOverdueEstimateRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setLeadOverdueEstimate(count)
            }
        }
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({zone: 'teamlead-overdueestimates', memberId: `!${ProfileDSModule.identifier}`, processCount: badgeCountMethod}),
            model: LeadOverdueEstimateRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: LeadOverdueEstimateRow
        }
    }

    @Mutation
    setTableSchema(value: ITableColumnSchema[]) {
        this._tableSchema = value;
    }

    @Action({rawError: true})
    async saveMethod(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
        await AssignmentDSModule.patch(data);
        await this.updateLeadOverdueEstimateCount(data.filter(operation => operation.op === BATCH_OPERATION.REMOVE || BATCH_OPERATION.EXTEND).length);
    }

    @Action({rawError: true})
    async updateLeadOverdueEstimateCount(modifiedRows: number) {
        BadgeCountCSModule.setLeadOverdueEstimate(BadgeCountCSModule.leadOverdueEstimate - modifiedRows);
    }

    @Action({rawError: true})
    async compareForSave() {
        const rowIndexesToRemove: number[] = [];
        const batch: any[] = []
        for (const [index, row] of this.tableData.entries()) {
            if (row.id) {
                const convertedItem = JsonParser.deserializeObject(AssignmentDSModule.getItems[row.id], LeadOverdueEstimateRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['extend']) {
                    batch.push({op: BATCH_OPERATION.EXTEND, path: `assignments/${row.id}`})
                    rowIndexesToRemove.push(index);
                }
            }
        }
        return batch.length !== 0 ? {batch, rowIndexesToRemove} : undefined;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.leadOverDueEstimate && assignment?.item?.id) {
                    const columnsToUpdate = assignment?.changes ? Object.keys(assignment.changes) : [];
                    AssignmentDSModule.itemsAsArray.forEach(item => {
                        if(item.nuggetId === assignment.item?.nuggetId) {
                            LeadOverdueEstimateCSModule.doRefreshRow({rowId: item.id, columnsToUpdate});
                        }
                    })

                }
            })
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
    @Wait(WaitStates.ACTION_LEADOVERDUEESTIMATE_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray<LeadOverdueEstimateRow>(response!, LeadOverdueEstimateRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: LeadOverdueEstimateRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.nuggetId);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedAssignmentId(data?.id);
    }

    @Action({rawError: true})
    async loadChatTabs() {
        if(!this.selectedRow) return [];
        const tabs = [{ id: this.selectedRow.publicRoomId, highBadgeCount: 0, label: CHAT_LABEL_TYPE.PUBLIC, disableMention: false }];
        return [{ id: this.selectedRow.privateRoomId,highBadgeCount:0 ,label: CHAT_LABEL_TYPE.PRIVATE, disableMention: false }, ...tabs];
    }

}
interface ILeadOverdueEstimateCS {
    tableData: TableRow[]
}
