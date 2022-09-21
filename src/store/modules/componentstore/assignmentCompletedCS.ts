import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import AssignmentCompletedRow from "@/datamodels/rows/assignmentCompletedRow";
import store, {ApplicationDSModule, AssignmentCompletedCSModule, AssignmentDSModule, BadgeCountCSModule, EntityChatCSModule, MessageDSModule, ProfileDSModule} from "@/store";
import {JsonParser} from "@/utils/jsonparser";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {CHAT_LABEL_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({ name: 'assignmentcompletedcs', namespaced: true, stateFactory: true })
export class AssignmentCompletedCS extends TableSubModuleCS<AssignmentCompletedRow> implements IAssignmentCompletedCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace:'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'startDate', type: 'date', headerType: 'text', title: 'Start Date', path: 'startDate', sortField: TABLE_SORT_TYPE.ASSIGNMENT_MY_START },
        { id: 'endDate', type: 'date', headerType: 'text', title: 'Target Date', path: 'endDate', sortField: TABLE_SORT_TYPE.ASSIGNMENT_MY_TARGET },
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth:'120px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_CADENCE },
        { id: 'status', type: 'text', headerType: 'text', title: 'Status', path: 'status', sortField: TABLE_SORT_TYPE.ASSIGNMENT_STATUS },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT }
    ]

    constructor(module: VuexModule<ThisType<AssignmentCompletedRow>, AssignmentCompletedRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setAssignmentCompleted(count)
            }
        }
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({memberId: ProfileDSModule.identifier, zone: 'complete', processCount: badgeCountMethod}),
            model: AssignmentCompletedRow,

        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: AssignmentCompletedRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentCompleted && assignment?.item?.id) {
                    AssignmentCompletedCSModule.doRefreshRow({rowId: assignment?.item?.id});
                }
            }
        );
    }

    @Action({ rawError: true })
    onRowCellClick() {
        return
    }

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_ASSIGNMENTCOMPLETED_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, AssignmentCompletedRow)
            this.doSetRows(data)
        }
    }

    @Action({ rawError: true })
    async updateSelectedEntity(data: AssignmentCompletedRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.nuggetId);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedAssignmentId(data?.id);
        if(isEmpty(this.tableData)){
            ApplicationDSModule.setSelectedEntityChatRoomID(0)
            ApplicationDSModule.setSelectedMediaRoomID(0);
            ApplicationDSModule.setSelectedDocumentRoomID(0);
            ApplicationDSModule.setSelectedLinkRoomID(0);
            EntityChatCSModule.setChatTabs({tabs: []});
            const tabs = await this.context.dispatch("loadChatTabs") || [];
            EntityChatCSModule.setChatTabs({tabs})
        }
    }

    @Action({rawError: true})
    async loadChatTabs() {
        if(!this.selectedRow) return [];
        const tabs: {id: number, highBadgeCount?: number, label: string, disableMention?: boolean}[] = [{ id: this.selectedRow.publicRoomId, highBadgeCount: 0, label: CHAT_LABEL_TYPE.PUBLIC, disableMention: false }];
        return [{ id: this.selectedRow.privateRoomId,highBadgeCount:0 ,label: CHAT_LABEL_TYPE.PRIVATE, disableMention: false }, ...tabs];
    }

}
export interface IAssignmentCompletedCS {
    tableData: TableRow[]
}
