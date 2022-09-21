import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDSModule, EntityChatCSModule, ReportEstimatesCSModule} from "@/store";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import ReportEstimatesRow from '@/datamodels/rows/reportEstimatesRow';

@Module({name:'reportestimatescs', namespaced: true, stateFactory: true})
export class ReportEstimatesCS extends TableSubModuleCS<ReportEstimatesRow> implements IReportEstimatesCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace:'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_PRIORITY, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PRIORITY },
        { id: 'responseTime', type: 'responseTime', headerType: 'text', title: 'Due In (Hrs)', path: 'responseTime', minWidth:'75px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_DUE_IN_HRS }
    ]
    sort = { field: TABLE_SORT_TYPE.ASSIGNMENT_DUE_IN_HRS, direction: TABLE_SORT_DIRECTION.ASC };

    constructor(module: VuexModule<ThisType<ReportEstimatesRow>, ReportEstimatesRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({memberId: ApplicationDSModule.selectedUserID, zone: 'report-estimatesdue'}),
            model: ReportEstimatesRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: ReportEstimatesRow
        }
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state){
                 return state.applicationds.selectedUserID
            },
            function onChange(id){
                 if(ApplicationDSModule.selectedModule === ModuleName.report && ApplicationDSModule.selectedModuleTab === ModuleTabName.reportEstimates) {
                    ReportEstimatesCSModule.doLoad(true)
                 }
            }
         )
    }

    @Action({rawError: true})
    onRowCellClick() {
        return
    }

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_REPORT_NEEDESTIMATEDUE_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ReportEstimatesRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    async doRefresh() {
        const latestRows: ReportEstimatesRow[] = []

        this.tableData.map( reportestimatesrow => {
            if(reportestimatesrow.id) {
                const freshItem = AssignmentDSModule.getItems[reportestimatesrow.id]
                const freshRow = JsonParser.deserializeObject(freshItem, ReportEstimatesRow)
                latestRows.push(freshRow)
            }
        })

        this.doSetRows(latestRows)
    }

    @Action({rawError: true})
    async updateSelectedEntity(data: ReportEstimatesRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.nuggetId);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedAssignmentId(data?.id);

        if(isEmpty(this.tableData)){
            ApplicationDSModule.setSelectedEntityChatRoomID(0)
            ApplicationDSModule.setSelectedMediaRoomID(0);
            ApplicationDSModule.setSelectedDocumentRoomID(0);
            ApplicationDSModule.setSelectedLinkRoomID(0);
            EntityChatCSModule.setChatTabs({tabs: []});
        }

    }

}

export interface IReportEstimatesCS {
    tableData: TableRow[]
}