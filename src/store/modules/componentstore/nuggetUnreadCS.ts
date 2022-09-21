import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import NuggetRow from '@/datamodels/rows/nuggetRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, NuggetDSModule, EntityChatCSModule, NuggetUnreadCSModule, BadgeCountCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import dayjs from "dayjs";

@Module({name:'nuggetunreadcs', namespaced: true, stateFactory: true})
export class NuggetUnreadCS extends TableSubModuleCS<NuggetRow> implements INuggetUnreadCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'subscribe', type: 'checkbox', headerType: 'text', title: 'Follow', path: 'isSubscribedPublic', filterType: TABLE_FILTER_TYPE.NUGGET_SUBSCRIBE, sortField: TABLE_SORT_TYPE.NUGGET_SUBSCRIBE },
        { id: 'id', type: 'text', headerType: 'text', title:'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title:'Stage', path: 'stage', filterType: TABLE_FILTER_TYPE.NUGGET_STAGE, sortField: TABLE_SORT_TYPE.NUGGET_STAGE},
        { id: 'tempo', type: 'tempo', headerType: 'text', title:'Tempo',path: 'boarding', minWidth:'90px', width:'100px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title:'Type', path: 'kind', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'project', type: 'text', headerType: 'text', title:'Project', path: { project: ['title'] }, filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'phase', type: 'text', headerType: 'text', title:'Lead Phase', path: 'phaseTitleStatus', filterType: TABLE_FILTER_TYPE.NUGGET_PHASE, sortField: TABLE_SORT_TYPE.NUGGET_PHASE },
        { id: 'date', type: 'date', headerType: 'text', title:'Received Date', path: 'recentMessageAt', sortField: TABLE_SORT_TYPE.NUGGET_RECEIVED_DATE },
    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_RECEIVED_DATE, direction: TABLE_SORT_DIRECTION.DESC }

    constructor(module: VuexModule<ThisType<NuggetRow>, NuggetRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({sort: 'recentMessageAt', zone: 'unread'}),
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
    async setChatData(data) {
        let roomId = data?.publicRoomId;
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

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.nuggetUnread && nugget?.item?.id) {
                    if(nugget.changes) NuggetUnreadCSModule.doRecalculateRowBadgecount(nugget.changes);
                    NuggetUnreadCSModule.doRefreshRow({rowId: nugget?.item?.id})
                }
            },
            { deep: true }
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
    @Wait(WaitStates.ACTION_NUGGETUNREAD_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, NuggetRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    async doRecalculateRowBadgecount(data: {[key: string]: {old: any, new: any}} | null ) {
        if(!data) return;
        let badgecountDiff = 0;

        if("publicSeenAt" in data) {
            data.publicSeenAt?.new ? badgecountDiff-- : badgecountDiff++;
        } else if ("privateSeenAt" in data) {
            data.privateSeenAt?.new ? badgecountDiff-- : badgecountDiff++;
        }

        const unreadCount = BadgeCountCSModule.inboxNuggetUnread + badgecountDiff;
        BadgeCountCSModule.setInboxNuggetUnread(unreadCount);
        BadgeCountCSModule.setNuggetUnread(unreadCount);
    }

    @Action({rawError: true})
    updateSelectedEntity(data: NuggetRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }
}

export interface INuggetUnreadCS {
    tableData: TableRow[]
}
