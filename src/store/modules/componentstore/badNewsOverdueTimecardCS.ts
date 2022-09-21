import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import { isEmpty } from "@/utils/object";
import BadNewsOverdueTimecardRow from "@/datamodels/rows/badNewsOverdueTimecardRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDSModule, BadgeCountCSModule, BadNewsOverdueTimecardCSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {CHAT_LABEL_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name:'badnewsoverduetimecardcs', namespaced: true, stateFactory: true})
export class BadNewsOverdueTimecardCS extends TableSubModuleCS<BadNewsOverdueTimecardRow> implements IBadNewsOverdueTimecardCS{
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace:'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title:'Stage', path: 'nuggetStage', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_NUGGET_STAGE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_STAGE},
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_PRIORITY, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PRIORITY },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'resource', type: 'profile', headerType: 'text', title: 'Resource', path: 'memberId', whiteSpace:'normal', minWidth:'130px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_RESOURCE },
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth:'120px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_CADENCE }
    ]

    constructor(module: VuexModule<ThisType<BadNewsOverdueTimecardRow>, BadNewsOverdueTimecardRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setBadNewsOverdueTimecard(count)
            }
        }
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({zone: 'badnews-overduejournals', processCount: badgeCountMethod}),
            model: BadNewsOverdueTimecardRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: BadNewsOverdueTimecardRow
        }
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
    }

    @Action
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if(ApplicationDSModule.selectedModuleTab === ModuleTabName.badNewsOverdueTimecard && assignment?.item?.id) {
                    BadNewsOverdueTimecardCSModule.doRefreshRow({rowId: assignment?.item?.id})
                }
            }
        );
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
    @Wait(WaitStates.ACTION_BADNEWSOVERDUETIMECARD_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, BadNewsOverdueTimecardRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: BadNewsOverdueTimecardRow) {
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
export interface IBadNewsOverdueTimecardCS {
    tableData: TableRow[]
}
