import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty, updateObject} from "@/utils/object";
import GoodNewsNeedApprovalRow from "@/datamodels/rows/goodNewsNeedApprovalRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDSModule, BadgeCountCSModule, GoodNewsNeedApprovalCSModule, NuggetDSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, CHAT_LABEL_TYPE} from '@/utils/constants';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import NuggetDM from '@/datamodels/nuggetDM';

@Module({name: 'goodnewsneedapprovalcs', namespaced: true, stateFactory: true})
export class GoodNewsNeedApprovalCS extends TableSubModuleCS<GoodNewsNeedApprovalRow> implements IGoodNewsNeedApprovalCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_SPRINT },
        { id: 'approve', type: 'checkbox', headerType: 'text', title: 'Approve', path: 'approve', sortField: TABLE_SORT_TYPE.ASSIGNMENT_APPROVE },
        { id: 'needsWork', type: 'checkbox', headerType: 'text', title: 'Needs Work', path: 'needsWork' },
        { id: 'responseTime', type: 'responseTime', headerType: 'text', title: 'Response Time', path: 'responseTime', minWidth: '50px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESPONSE_TIME },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'resource', type: 'profile', headerType: 'text', title: 'Resource', path: 'memberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESOURCE },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PRIORITY },
    ]

    constructor(module: VuexModule<ThisType<GoodNewsNeedApprovalRow>, GoodNewsNeedApprovalRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({zone: 'goodnews-approvaldue'}),
            model: GoodNewsNeedApprovalRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: GoodNewsNeedApprovalRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
        await AssignmentDSModule.patch(data);
        await Promise.allSettled([
            this.updateGoodNewsApprovalCount(data.filter(operation => operation.op === BATCH_OPERATION.ACCOMPLISH).length),
            this.updateAssignmentNeedEstimateCount(data.filter(operation => operation.op === BATCH_OPERATION.WORKON).length)
        ]);
    }

    @Action
    async updateGoodNewsApprovalCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsNeedApproval(BadgeCountCSModule.goodNewsNeedApproval - modifiedRows);
    }

    @Action
    async updateAssignmentNeedEstimateCount(modifiedRows: number) {
        BadgeCountCSModule.setGoodNewsNeedApproval(BadgeCountCSModule.goodNewsNeedApproval - modifiedRows);
        BadgeCountCSModule.setAssignmentNeedEstimate(BadgeCountCSModule.assignmentNeedEstimate + modifiedRows);
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
                const convertedItem = JsonParser.deserializeObject(AssignmentDSModule.getItems[row.id], GoodNewsNeedApprovalRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['sprintId']) {
                    if (difference['sprintId'].new !== 0) {
                        nuggetSprints.push({sprintId: difference['sprintId'].new, nuggetId: row.nuggetId})
                    }
                    if (difference['sprintId'].new === 0) {
                        batchOperation = BATCH_OPERATION.REMOVE;
                        batchPath = `projects/${row.projectId}/sprints`;
                        batch.push({op: batchOperation, path: batchPath, value: {nuggetId: row.nuggetId}})
                    }
                }
                if (difference['approve']) {
                    batch.push({op: BATCH_OPERATION.ACCOMPLISH, path: `assignments/${row.id}`});
                    rowIndexesToRemove.push(index);
                }
                if (difference['needsWork'] && row.needsWork) {
                    batch.push({op: BATCH_OPERATION.WORKON, path: `assignments/${row.id}`});
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
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsNeedApproval && assignment?.item?.id) {
                    const columnsToUpdate = assignment?.changes ? Object.keys(assignment.changes) : [];
                    AssignmentDSModule.itemsAsArray.forEach(item => {
                        if(item.nuggetId === assignment.item?.nuggetId) {
                            GoodNewsNeedApprovalCSModule.doRefreshRow({rowId: item.id, columnsToUpdate});
                        }
                    })

                }
            })
    }

    @Action({rawError: true})
    onRowCellClick(data) {
        switch (data.id) {
            case 'sprint':
                if (data.row.id) {
                    this.tableData.forEach(row => {
                        if (row.id && row.nuggetId === data.row.nuggetId && row.sprintId !== data.row.sprintId) {
                            row.sprintId = data.row.sprintId
                        }
                    });
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
    @Wait(WaitStates.ACTION_GOODNEWSNEEDAPPROVAL_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsNeedApprovalRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsNeedApprovalRow) {
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
export interface IGoodNewsNeedApprovalCS {
    tableData: TableRow[]
}
