import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import PayloadRow from '@/datamodels/rows/payloadRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, PayloadDSModule, PayloadCSModule} from '@/store';
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import TableCS from "./base/tableCS";
import SprintDM from '@/datamodels/sprintDM';
import { DetailTabName } from "@/store/modules/datastore/applicationDS";
import { TABLE_SORT_DIRECTION, TABLE_SORT_TYPE } from '@/utils/constants';

@Module({name: 'payloadcs', namespaced: true, stateFactory: true})
export class PayloadCS extends TableCS<PayloadRow> implements IPayloadCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'projectSprint', type: 'text', headerType: 'text', title: 'Project-Sprint', path: 'projectSprint', whiteSpace: 'normal', width: '99%'},
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px'}
    ]
    sort = { field: TABLE_SORT_TYPE.RELEASE_TEMPO, direction: TABLE_SORT_DIRECTION.ASC }
    sprints: SprintDM[]= []

    constructor(module: VuexModule<ThisType<PayloadRow>, PayloadRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        return
    }

    get refreshOptions() {
        return
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Mutation
    setSprints(value) {
        this.sprints = value;
    }

    @Action({rawError: true})
    async loadChatTabs() {
        return [];
    }

    @Action({ rawError: true })
    async updateSprintsFromCache() {
      const sprints = PayloadDSModule.items[ApplicationDSModule.selectedReleaseID] || []
      this.setSprints(sprints)
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.payloadds.items;
            },
            async function onChange() {
                if (ApplicationDSModule.selectedDetailTab === DetailTabName.release) {
                    await PayloadCSModule.updateSprintsFromCache();
                    await PayloadCSModule.doLoad();
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick() {
        return
    }

    @Action({rawError: true})
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_PAYLOAD_LOADING)
    async doLoad() {
        const sprints = this.sprints
        this.doSetRows(JsonParser.deserializeArray(sprints, PayloadRow));
    }
   
    @Action({rawError: true})
    async doRefreshRow(data: { rowId: number }) {
        const index = this.tableData.findIndex(row => row.id === data.rowId);
        if(index !== -1) {
            const rows = [...this.tableData];
            const freshItem = PayloadDSModule.items[ApplicationDSModule.selectedReleaseID].find(sprint => sprint.id === data.rowId);
            const freshRow = JsonParser.deserializeObject(freshItem, PayloadRow);
            rows[index] = freshRow;
            this.doSetRows(rows);
        }
    }

    @Action({rawError: true})
    updateSelectedEntity() {
        return
    }

    @Action({rawError: true})
    async onRowClick(data: PayloadRow) {
      return
    }

    @Action({rawError: true})
    async onRowDoubleClick(data) {
      return
    }

    @Action({ rawError: true })
    async activate() {
      if (ApplicationDSModule.selectedDetailTab === DetailTabName.release) {
        await PayloadCSModule.updateSprintsFromCache();
        await PayloadCSModule.doLoad();
        if (ApplicationDSModule.selectedReleaseID > 0) {
          await PayloadDSModule.doLoad(ApplicationDSModule.selectedReleaseID);
        }
      }
    }


}

export interface IPayloadCS {
    tableData: TableRow[]
}
