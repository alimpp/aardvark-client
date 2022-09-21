import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import InboxSprintsRow from '@/datamodels/rows/inboxSprintsRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, SprintsViewDSModule, EntityChatCSModule, InboxSprintCSModule, ProfileDSModule, BadgeCountCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, SOCKET_SPRINT_ZONES, SUBSCRIBABLE_TYPE} from "@/utils/constants";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import dayjs from 'dayjs';

@Module({name:'inboxsprintscs', namespaced: true, stateFactory: true})
export class InboxSprintsCS extends TableSubModuleCS<InboxSprintsRow> implements IInboxSprintsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title:'ID', path: 'projectSprintNumber'},
        { id: 'projectBatch', type: 'text', headerType: 'text', title: 'Project-Sprint', path: 'projectSprint', width: '99%', minWidth: '350px'},
        { id: "alert", type: "alert", headerType: 'text', title:"Alert", path: "isBold"},
        { id: 'tempo', type: 'tempo', headerType: 'text', title:'Tempo',path: 'boarding', minWidth:'90px'},
        { id: "managerFullName", type: "profile", headerType: 'text', title:"Project Maestro", path: "managerId"},
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title:"Secondary Maestro", path: "secondaryManagerId"},
        { id: 'date', type: 'date', headerType: 'text', title:'Received Date', path: 'recentMessageAt'},
    ]
    notificationSelectSprintByRoomId = 0;

    constructor(module: VuexModule<ThisType<InboxSprintsRow>, InboxSprintsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method:  SprintsViewDSModule.listSprintViews,
            parameters: () => ({zone:"inbox"}),
            model: InboxSprintsRow
        }
    }

    get refreshOptions() {
        return {
            items: SprintsViewDSModule.getItems,
            model: InboxSprintsRow
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
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.sprintsviewds.itemWatch;
            },
            function onChange(sprintDetail) {
                if(sprintDetail?.item?.id) {
                    if(!ApplicationDSModule.dolphinSocket?.isOnline) {
                      BadgeCountCSModule.loadInbox();
                    }
                    if(ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxSprints) {
                        InboxSprintCSModule.doRefreshRow({rowId: sprintDetail?.item?.id});
                    }
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.sprint
            },
            async function onChange(socketSprint) {
                if(socketSprint.sprint && socketSprint.zones.includes(SOCKET_SPRINT_ZONES.INBOX)) {
                    BadgeCountCSModule.loadInbox();
                    // Sprint comes through socket as SprintDM, we need a SprintDetailDM. Fetch it instead.
                    const sprintDetail = await SprintsViewDSModule.listSprintDetails({ filters: {id: [socketSprint.sprint.id]} })
                    const sprintRow = JsonParser.deserializeObject(sprintDetail[0], InboxSprintsRow);
                    const rows = [sprintRow, ...InboxSprintCSModule.tableData.filter(row => row.id !== sprintRow.id)]
                    InboxSprintCSModule.doSetTableData(rows);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
          function onChange(message) {
            if(message.subscribableType !== SUBSCRIBABLE_TYPE.SPRINT) return;
    
            if(message.seenByMemberReferenceId === ProfileDSModule?.id) {
                BadgeCountCSModule.loadInbox();
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
    @Wait(WaitStates.ACTION_INBOX_SPRINTS_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, InboxSprintsRow)
            this.doSetRows(data)
            if(this.notificationSelectSprintByRoomId !== 0 ){
                const row = this.tableData.find(row => row.privateRoomId === this.notificationSelectSprintByRoomId || row.publicRoomId === this.notificationSelectSprintByRoomId );
                await this.onRowClick(row)
                this.setNotificationSelectSprintByRoomId(0);
            }
        }
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_CHAT_ROOM_TABS_LOADING)
    async setChatData(data) {
        let roomId = this.notificationSelectSprintByRoomId
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
                roomId = currentChatRoomId;
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

    @Mutation
    setNotificationSelectSprintByRoomId(value) {
        this.notificationSelectSprintByRoomId = value;
    }

    @Action({rawError: true})
    updateSelectedEntity(data: InboxSprintsRow) {
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedSprintsViewId(data?.id);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: InboxSprintsRow) {
        await EventBus.$emit(EVENTS.ROUTER_PUSH_INBOX_SPRINT_NUGGETS, {projectId: data.projectId, sprintId: data.id})
    }

    @Action({ rawError: true })
    async doSetTableData(items: InboxSprintsRow[]) {
        this.context.commit("setTableData", items)
    }
}

export interface IInboxSprintsCS {
    tableData: TableRow[]
}
