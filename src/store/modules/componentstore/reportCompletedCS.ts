import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import store, {ApplicationDSModule, AssignmentDSModule, BadgeCountCSModule, EntityChatCSModule,ReportCompletedCSModule} from "@/store";
import {JsonParser} from "@/utils/jsonparser";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import ReportCompletedRow from '@/datamodels/rows/reportCompletedRow';

@Module({ name: 'reportcompletedcs', namespaced: true, stateFactory: true })
export class ReportCompletedCS extends TableSubModuleCS<ReportCompletedRow> implements IAssignmentCompletedCS {
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
    sort = { field: TABLE_SORT_TYPE.ASSIGNMENT_MY_TARGET, direction: TABLE_SORT_DIRECTION.DESC };

    constructor(module: VuexModule<ThisType<ReportCompletedRow>, ReportCompletedRow>) {
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
            parameters: () => ({memberId: ApplicationDSModule.selectedUserID, zone: 'complete', processCount: badgeCountMethod}),
            model: ReportCompletedRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: ReportCompletedRow
        }
    }

    @Mutation
    clearSortAndFilter() {
        this.sort = {
            field: TABLE_SORT_TYPE.ASSIGNMENT_MY_TARGET,
            direction: TABLE_SORT_DIRECTION.DESC
        };
        this.filters = {};
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state){
                 return state.applicationds.selectedUserID
            },
            function onChange(id){
                 if(ApplicationDSModule.selectedModule === ModuleName.report && ApplicationDSModule.selectedModuleTab === ModuleTabName.reportCompleted) {
                        ReportCompletedCSModule.doLoad(true)
                 }
            }
         )
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
    @Wait(WaitStates.ACTION_REPORT_COMPLETED_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ReportCompletedRow)
            this.doSetRows(data)
        }
    }

    @Action({ rawError: true })
    async updateSelectedEntity(data: ReportCompletedRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.nuggetId);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedAssignmentId(data?.id);
        if(isEmpty(this.tableData)){
            ApplicationDSModule.setSelectedEntityChatRoomID(0)
            ApplicationDSModule.setSelectedMediaRoomID(0);
            ApplicationDSModule.setSelectedDocumentRoomID(0);
            ApplicationDSModule.setSelectedLinkRoomID(0);
            EntityChatCSModule.setChatTabs({tabs: []});
            const tabs = await this.context.dispatch('loadChatTabs') || [];
            EntityChatCSModule.setChatTabs({tabs});
        }
    }

}
export interface IAssignmentCompletedCS {
    tableData: TableRow[]
}
