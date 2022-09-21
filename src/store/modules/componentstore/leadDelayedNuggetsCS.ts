import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {getDifference, isEmpty} from "@/utils/object";
import LeadDelayedNuggetsRow from "@/datamodels/rows/leadDelayedNuggetsRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, BadgeCountCSModule, AssignmentDSModule, LeadDelayedNuggetsCSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {BATCH_OPERATION, CHAT_LABEL_TYPE, TABLE_SORT_DIRECTION} from '@/utils/constants';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'leaddelayednuggetscs', namespaced: true, stateFactory: true})
export class LeadDelayedNuggetsCS extends TableSubModuleCS<LeadDelayedNuggetsRow> implements ILeadDelayedNuggetsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title: 'Stage', path: 'nuggetStage', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_NUGGET_STAGE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_STAGE },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'sprint', type: 'text', headerType: 'text', title: 'Sprint', path: 'sprintName', minWidth: '125px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_SPRINT },
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth: '120px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_CADENCE },
        { id: 'responseTime', type: 'responseTime', headerType: 'text', title: 'Response Time', path: 'responseTime', minWidth: '50px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESPONSE_TIME },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'resource', type: 'profile', headerType: 'text', title: 'Resource', path: 'memberId', whiteSpace: 'normal', minWidth: '130px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESOURCE }
    ]
    sort = { field: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO, direction: TABLE_SORT_DIRECTION.ASC };

    constructor(module: VuexModule<ThisType<LeadDelayedNuggetsRow>, LeadDelayedNuggetsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setLeadDelayedNuggets(count)
            }
        }
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({zone: 'teamlead-delayednuggets', processCount: badgeCountMethod}),
            model: LeadDelayedNuggetsRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: LeadDelayedNuggetsRow
        }
    }

    @Mutation
    setTableSchema(value: ITableColumnSchema[]): void {
        this._tableSchema = value;
    }

    @Action
    async saveMethod(data: {op: BATCH_OPERATION, path: string, value: any}[]): Promise<void> {
        await AssignmentDSModule.patch(data);
        await this.updateLeadDelayedNuggetCount(data.filter(operation => operation.op === BATCH_OPERATION.APPROVE).length);
    }

    @Action
    async updateLeadDelayedNuggetCount(modifiedRows: number) {
        BadgeCountCSModule.setLeadDelayedNuggets(BadgeCountCSModule.leadDelayedNuggets - modifiedRows);
    }

    @Action
    async compareForSave() {
        const batch: any[] = []
        for (const row of this.tableData) {
            if (row?.id) {
                const convertedItem = JsonParser.deserializeObject(AssignmentDSModule.getItems[row.id], LeadDelayedNuggetsRow)
                const difference = getDifference(convertedItem, row);
                if (Object.keys(difference).length === 0) continue;
                if (difference['approve']) {
                    batch.push({op: BATCH_OPERATION.APPROVE, path: `assignments/${row.id}`})
                }
            }
        }
        return batch.length !== 0 ? {batch} : undefined;
    }

    @Action
    onInitialization(): void {
        store.watch(
            function stateToWatch(state) {
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.leadDelayedNuggets && assignment?.item?.id) {
                    const columnsToUpdate = assignment?.changes ? Object.keys(assignment.changes) : [];
                    AssignmentDSModule.itemsAsArray.forEach(item => {
                        if(item.nuggetId === assignment.item?.nuggetId) {
                            LeadDelayedNuggetsCSModule.doRefreshRow({rowId: item.id, columnsToUpdate});
                        }
                    })

                }
            })
    }

    @Action({rawError: true})
    onRowCellClick(): void {
        return
    }

    @Action({rawError: true})
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_LEADDELAYEDNUGGETS_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, LeadDelayedNuggetsRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: LeadDelayedNuggetsRow) {
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

export interface ILeadDelayedNuggetsCS {
    tableData: TableRow[]
}
