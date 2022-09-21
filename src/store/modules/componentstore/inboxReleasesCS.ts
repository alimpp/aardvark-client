import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { isEmpty } from "@/utils/object";
import InboxReleasesRow from "@/datamodels/rows/inboxReleasesRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import { JsonParser } from "@/utils/jsonparser";
import store, {ApplicationDSModule, ReleaseDSModule, EntityChatCSModule, InboxReleasesCSModule, ProfileDSModule, BadgeCountCSModule} from "@/store";
import { Wait, WaitStates } from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";
import dayjs from "dayjs";
import {EVENTS, SOCKET_RELEASE_ZONES, SUBSCRIBABLE_TYPE} from "@/utils/constants";
import { EventBus } from "@/utils/eventBus";

@Module({ name: "inboxreleasescs", namespaced: true, stateFactory: true })
export class InboxReleasesCS extends TableSubModuleCS<InboxReleasesRow> {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "id", type: "text", headerType: 'text', title: "ID", path: "releaseNumber" },
    { id: "name", type: "text", headerType: 'text', title: "Name", path: "title", width: '99%' },
    { id: "alert", type: "alert", headerType: 'text', title:"Alert", path: "isBold"},
    { id: "tempo", type: "tempo", headerType: 'text', title:"Tempo", path: "tempo", minWidth:'90px'},
    { id: "launchDate", type: "date", headerType: 'text', title:"Release Date", path: "launchDate"},
    { id: "cutoff", type: "date", headerType: 'text', title:"Release Cutoff", path: "cutoff" },
    { id: "managerId", type: "profile", headerType: 'text', title:"Release Maestro", path: "managerId"},
    { id: "secondaryManagerId", type: "profile", headerType: 'text', title:"Secondary Maestro", path: "secondaryManagerId"},
    { id: 'date', type: 'date', headerType: 'text', title:'Received Date', path: 'recentMessageAt' },
  ]
  notificationSelectReleaseByRoomId = 0 ; 

  constructor(module: VuexModule<ThisType<InboxReleasesRow>, InboxReleasesRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: ReleaseDSModule.inboxReleases,
      parameters: () => ({zone:'inbox'}),
      model: InboxReleasesRow
    }
  }

  get refreshOptions() {
    return {
      items: ReleaseDSModule.getItems,
      model: InboxReleasesRow
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
        return  state.releaseds.itemWatch
      },
      function onChange(release) {
        if(release?.item?.id) {
          if(!ApplicationDSModule.dolphinSocket?.isOnline) {
            BadgeCountCSModule.loadInbox();
          }
          if(ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxReleases) {
            InboxReleasesCSModule.doRefreshRow({rowId: release?.item?.id});
          }
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.dolphinsocketds.release
      },
      function onChange(socketRelease) {
        if(socketRelease.release && socketRelease.zones.includes(SOCKET_RELEASE_ZONES.INBOX)) {
          BadgeCountCSModule.loadInbox();
          const releaseRow = JsonParser.deserializeObject(socketRelease.release, InboxReleasesRow);
          const rows = [releaseRow, ...InboxReleasesCSModule.tableData.filter(row => row.id !== releaseRow.id)]
          InboxReleasesCSModule.doSetTableData(rows);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.RELEASE) return;

        if(message.seenByMemberReferenceId === ProfileDSModule?.id) {
          BadgeCountCSModule.loadInbox();
        }
      }
    );
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_CHAT_ROOM_TABS_LOADING)
  async setChatData(data) {
    let roomId = this.notificationSelectReleaseByRoomId
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

  @Mutation
  setNotificationSelectReleaseByRoomId(value) {
      this.notificationSelectReleaseByRoomId = value;
  }

  @Action({ rawError: true })
  onRowCellClick() {
    return;
  }

  @Action({ rawError: true })
  onHeaderCellClick() {
      return
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_INBOX_RELEASES_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response = await this.fetch({reset: true});
      const data = JsonParser.deserializeArray(response, InboxReleasesRow);
      this.doSetRows(data);
      if(this.notificationSelectReleaseByRoomId !== 0 ){
        const row = this.tableData.find(row => row.privateRoomId === this.notificationSelectReleaseByRoomId || row.publicRoomId === this.notificationSelectReleaseByRoomId );
        await this.onRowClick(row)
        this.setNotificationSelectReleaseByRoomId(0);
      }
    }
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: InboxReleasesRow) {
    ApplicationDSModule.setSelectedReleaseId(data?.id);
  }

  @Action({rawError: true})
    async onRowDoubleClick(data: InboxReleasesRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_INBOX_RELEASE_NUGGETS, {releaseId: data.id})
  }

  @Action({ rawError: true })
  async doSetTableData(items: InboxReleasesRow[]) {
      this.context.commit("setTableData", items)
  }
}

export interface IInboxReleasesCS {
  tableData: InboxReleasesRow[]
}