import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import NuggetRow from '@/datamodels/rows/nuggetRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, NuggetDSModule, EntityChatCSModule, InboxNuggetCSModule, BadgeCountCSModule, ProfileDSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import dayjs from "dayjs";
import {SOCKET_NUGGET_ZONES, SUBSCRIBABLE_TYPE, TABLE_FILTER_TYPE} from '@/utils/constants';

@Module({name:'inboxnuggetcs', namespaced: true, stateFactory: true})
export class InboxNuggetCS extends TableSubModuleCS<NuggetRow> implements IInboxNuggetCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'subscribe', type: 'checkbox', headerType: 'text', title: 'Follow', path: 'isSubscribedPublic' },
        { id: 'id', type: 'text', headerType: 'text', title:'ID', path: 'nuggetNumber'},
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '350px'},
        { id: "alert", type: "alert", headerType: 'text', title:"Alert", path: "isBold", filterType: TABLE_FILTER_TYPE.IS_UNREAD} ,
        { id: 'stage', type: 'text', headerType: 'text', title:'Stage', path: 'stage'},
        { id: 'tempo', type: 'tempo', headerType: 'text', title:'Tempo',path: 'boarding', minWidth:'90px', width:'100px' },
        { id: 'type', type: 'text', headerType: 'text', title:'Type', path: 'kind'},
        { id: 'project', type: 'text', headerType: 'text', title:'Project', path: { project: ['title'] } },
        { id: 'phase', type: 'text', headerType: 'text', title:'Lead Phase', path: 'phaseTitleStatus' },
        { id: 'date', type: 'date', headerType: 'text', title:'Received Date', path: 'recentMessageAt' },
    ]
    notificationSelectNuggetByRoomId = 0;

    constructor(module: VuexModule<ThisType<NuggetRow>, NuggetRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({zone: 'inbox'}),
            model: NuggetRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: NuggetRow
        }
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_CHAT_ROOM_TABS_LOADING)
    async setChatData(data) {
        let roomId = this.notificationSelectNuggetByRoomId
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
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Mutation
    setNotificationSelectNuggetByRoomId(value) {
        this.notificationSelectNuggetByRoomId = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            function onChange(nugget) {
                if(nugget?.item?.id) {
                    if(!ApplicationDSModule.dolphinSocket?.isOnline) {
                        BadgeCountCSModule.loadInbox();
                    }
                    if(ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxNugget) {
                        InboxNuggetCSModule.doRefreshRow({rowId: nugget?.item?.id});
                    }
                }
            },
            { deep: true }
        );
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.nugget
            },
            function onChange(socketNugget) {
                if(socketNugget.nugget && socketNugget.zones.includes(SOCKET_NUGGET_ZONES.INBOX)) {
                    BadgeCountCSModule.loadInbox();
                    const nuggetRow = JsonParser.deserializeObject(socketNugget.nugget, NuggetRow);
                    const rows = [nuggetRow, ...InboxNuggetCSModule.tableData.filter(row => row.id !== nuggetRow.id)]
                    InboxNuggetCSModule.doSetTableData(rows);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
            function onChange(message) {
                if(message.subscribableType !== SUBSCRIBABLE_TYPE.NUGGET) return;

                if(message.seenByMemberReferenceId === ProfileDSModule?.id) {
                    BadgeCountCSModule.loadInbox();
                }
            }
        );
    }

    @Action({ rawError: true })
    async doSetTableData(items: NuggetRow[]) {
        this.context.commit("setTableData", items)
    }

    @Action({rawError: true})
    async onRowCellClick(data: { id: string, row: NuggetRow}) {
        switch (data.id) {
            case 'subscribe':
                if(data.row.id) {
                    if(data.row.isSubscribedPublic) {
                        const nugget = await NuggetDSModule.unsubscribeNugget(data.row.id)
                        const nuggetRow = JsonParser.deserializeObject<NuggetRow>(nugget, NuggetRow);
                        this.doUpdateRow({ item: nuggetRow})
                    } else {
                        const nugget = await NuggetDSModule.subscribeNugget(data.row.id);
                        const nuggetRow = JsonParser.deserializeObject<NuggetRow>(nugget, NuggetRow);
                        this.doUpdateRow({ item: nuggetRow})
                    }
                }
                break;
            default:
                break;
        }
    }

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_INBOX_NUGGET_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, NuggetRow)
            this.doSetRows(data)
            if(this.notificationSelectNuggetByRoomId !== 0 ){
                const row = this.tableData.find(row => row.privateRoomId === this.notificationSelectNuggetByRoomId || row.publicRoomId === this.notificationSelectNuggetByRoomId );
                await this.onRowClick(row)
                this.setNotificationSelectNuggetByRoomId(0);
            }
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: NuggetRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }
}

export interface IInboxNuggetCS {
    tableData: TableRow[]
}
