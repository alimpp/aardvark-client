import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import InboxProjectsRow from '@/datamodels/rows/inboxProjectsRow'
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, BadgeCountCSModule, EntityChatCSModule, InboxProjectsCSModule, ProfileDSModule, ProjectDSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, SOCKET_PROJECT_ZONES, SUBSCRIBABLE_TYPE} from "@/utils/constants";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import dayjs from 'dayjs';

@Module({name:'inboxprojectscs', namespaced: true, stateFactory: true})
export class InboxProjectsCS extends TableSubModuleCS<InboxProjectsRow> implements IInboxProjectsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'projectNumber' },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '310px' },
        { id: 'alert', type: 'alert', headerType: 'text', title:'Alert', path: 'isBold' },
        { id: 'status', type: 'text', headerType: 'text', title:'Status', path: 'status' },
        { id: 'boarding', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px'},
        { id: 'workflow', type: 'text', headerType: 'text', title:'Workflow', path: 'workflowTitle' },
        { id: "managerId", type: "profile", headerType: 'text', title:"Project Maestro", path: "managerId" },
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title:"Secondary Maestro", path: "secondaryManagerId"},
        { id: 'date', type: 'date', headerType: 'text', title:'Received Date', path: 'recentMessageAt'},
    ]
    notificationSelectProjectByRoomId = 0;

    constructor(module: VuexModule<ThisType<InboxProjectsRow>, InboxProjectsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method: ProjectDSModule.listProjectsDetails,
            parameters: () => ({zone: 'inbox'}),
            model: InboxProjectsRow
        }
    }

    get refreshOptions() {
        return {
            items: ProjectDSModule.getItems,
            model: InboxProjectsRow
        }
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    async loadChatTabs() {
        return [];
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_CHAT_ROOM_TABS_LOADING)
    async setChatData(data) {
        let roomId = this.notificationSelectProjectByRoomId
        if(roomId === 0 ){
            roomId = data?.publicRoomId;
            if(data?.isSubscribedPrivate === true){
                if(!data?.publicSeenAt && !data?.privateSeenAt) {
                    roomId = data?.privateRoomId;
                } else if (!data?.publicSeenAt) {
                    roomId = data?.publicRoomId;
                } else if (!data?.privateSeenAt) {
                    roomId = data?.privateRoomId;
                } else {
                    if (dayjs(data?.publicSeenAt).isAfter(data?.privateSeenAt)) {
                        roomId = data?.publicRoomId;
                    } else {
                        roomId = data?.privateRoomId;
                    }
                }
            }
            const currentChatRoomId = ApplicationDSModule.selectedEntityChatRoomID;
            const selectedRowPublicChatRoomId = data?.publicRoomId;
            const selectedRowProvateChatRoomId = data?.privateRoomId;
            if(currentChatRoomId === selectedRowPublicChatRoomId || currentChatRoomId === selectedRowProvateChatRoomId) {
                roomId=currentChatRoomId;
            }
        }

        ApplicationDSModule.setSelectedEntityChatRoomID(roomId)
        ApplicationDSModule.setSelectedMediaRoomID(roomId);
        ApplicationDSModule.setSelectedDocumentRoomID(roomId);
        ApplicationDSModule.setSelectedLinkRoomID(roomId);
        EntityChatCSModule.updateLatestSeenMessageId(data);
        EntityChatCSModule.setChatTabs({tabs: []});
        const tabs = await this.context.dispatch('loadChatTabs') || [];
        EntityChatCSModule.setChatTabs({tabs});
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.projectds.itemWatch
            },
            function onChange(project) {
                if(project?.item?.id) {
                    if(!ApplicationDSModule.dolphinSocket?.isOnline) {
                        BadgeCountCSModule.loadInbox();
                    }
                    if(ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxProjects) {
                        InboxProjectsCSModule.doRefreshRow({rowId: project?.item?.id});
                    }
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.project
            },
            function onChange(socketProject) {
                if(socketProject.project && socketProject.zones.includes(SOCKET_PROJECT_ZONES.INBOX)) {
                    BadgeCountCSModule.loadInbox();
                    const projectRow = JsonParser.deserializeObject(socketProject.project, InboxProjectsRow);
                    const rows = [projectRow, ...InboxProjectsCSModule.tableData.filter(row => row.id !== projectRow.id)]
                    InboxProjectsCSModule.doSetTableData(rows);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
            function onChange(message) {
                if(message.subscribableType !== SUBSCRIBABLE_TYPE.PROJECT) return;

                if(message.seenByMemberReferenceId === ProfileDSModule?.id) {
                    BadgeCountCSModule.loadInbox();
                }
            }
        );
    }

    @Mutation
    setNotificationSelectProjectByRoomId(value) {
        this.notificationSelectProjectByRoomId = value;
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
    @Wait(WaitStates.ACTION_INBOX_PROJECTS_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, InboxProjectsRow)
            this.doSetRows(data)
            if(this.notificationSelectProjectByRoomId !== 0 ){
                const row = this.tableData.find(row => row.privateRoomId === this.notificationSelectProjectByRoomId || row.publicRoomId === this.notificationSelectProjectByRoomId );
                await this.onRowClick(row)
                this.setNotificationSelectProjectByRoomId(0);
            }
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: InboxProjectsRow) {
        ApplicationDSModule.setSelectedProjectId(data?.id);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: InboxProjectsRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_INBOX_PROJECT_NUGGETS, {projectId: data.id})
    }

    @Action({ rawError: true })
    async doSetTableData(items: InboxProjectsRow[]) {
        this.context.commit("setTableData", items)
    }
}

export interface IInboxProjectsCS {
    tableData: TableRow[]
}
