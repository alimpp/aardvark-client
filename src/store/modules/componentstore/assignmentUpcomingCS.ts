import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import AssignmentUpcomingRow from "@/datamodels/rows/assignmentUpcomingRow";
import store, {ApplicationDSModule, AssignmentDSModule, AssignmentUpcomingCSModule, BadgeCountCSModule, EntityChatCSModule, MessageDSModule} from "@/store";
import {JsonParser} from "@/utils/jsonparser";
import {ProfileDSModule} from "@/store"
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import { ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {CHAT_LABEL_TYPE,TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name:'assignmentupcomingcs', namespaced: true, stateFactory: true})
export class AssignmentUpcomingCS extends TableSubModuleCS<AssignmentUpcomingRow> implements IAssignmentUpcomingCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'nuggetTitle', whiteSpace:'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_TYPE, sortField: TABLE_SORT_TYPE.ASSIGNMENT_TYPE },
        { id: 'startsIn', type: 'text', headerType: 'text', title: 'Starts In', path: 'startsIn', sortField: TABLE_SORT_TYPE.ASSIGNMENT_STARTS_IN},
        { id: 'startDate', type: 'date', headerType: 'text', title: 'Start Date', path: 'startDate', sortField: TABLE_SORT_TYPE.ASSIGNMENT_MY_START},
        { id: 'endDate', type: 'date', headerType: 'text', title: 'Target Date', path: 'endDate', sortField: TABLE_SORT_TYPE.ASSIGNMENT_MY_TARGET},
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth:'120px', sortField: TABLE_SORT_TYPE.ASSIGNMENT_CADENCE },
        { id: 'phaseTitle', type: 'text', headerType: 'text', title: 'Assigned Phase', path: 'phaseTitle', sortField: TABLE_SORT_TYPE.ASSIGNMENT_PHASE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PROJECT },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'nuggetPriority', filterType: TABLE_FILTER_TYPE.ASSIGNMENT_PRIORITY, sortField: TABLE_SORT_TYPE.ASSIGNMENT_PRIORITY }
    ]

    constructor(module: VuexModule<ThisType<AssignmentUpcomingRow>, AssignmentUpcomingRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setAssignmentUpcoming(count)
            }
        }
        return {
            method: AssignmentDSModule.listAssignments,
            parameters: () => ({memberId: ProfileDSModule.identifier, zone: 'upcomingNuggets', processCount: badgeCountMethod}),
            model: AssignmentUpcomingRow
        }
    }

    get refreshOptions() {
        return {
            items: AssignmentDSModule.getItems,
            model: AssignmentUpcomingRow
        }
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.assignmentds.itemWatch;
            },
            function onChange(assignment) {
                if(ApplicationDSModule.selectedModuleTab === ModuleTabName.assignmentUpcoming && assignment?.item?.id) {
                    AssignmentUpcomingCSModule.doRefreshRow({rowId: assignment?.item?.id});
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
    @Wait(WaitStates.ACTION_ASSIGNMENTUPCOMING_LOADING)
    async doLoad(force = true) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, AssignmentUpcomingRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    async updateSelectedEntity(data: AssignmentUpcomingRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.nuggetId);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedAssignmentId(data?.id);

        if(isEmpty(this.tableData)){
            EntityChatCSModule.updateMessagesFromCache({roomID: 0, messages: MessageDSModule.items[0]})
            ApplicationDSModule.setSelectedEntityChatRoomID(0)
            ApplicationDSModule.setSelectedMediaRoomID(0);
            ApplicationDSModule.setSelectedDocumentRoomID(0);
            ApplicationDSModule.setSelectedLinkRoomID(0);
            EntityChatCSModule.setChatTabs({tabs: []});
            const tabs = await this.context.dispatch('loadChatTabs') || [];
            EntityChatCSModule.setChatTabs({tabs});
        }

    }

    @Action({rawError: true})
    async loadChatTabs() {
        if(!this.selectedRow) return [];
        const tabs: {id: number, highBadgeCount?: number, label: string, disableMention?: boolean}[] = [{ id: this.selectedRow.publicRoomId, highBadgeCount: 0, label: CHAT_LABEL_TYPE.PUBLIC, disableMention: false }];
        return [{ id: this.selectedRow.privateRoomId, label: CHAT_LABEL_TYPE.PRIVATE, disableMention: false }, ...tabs];
    }
}
export interface IAssignmentUpcomingCS {
    tableData: TableRow[]
}
