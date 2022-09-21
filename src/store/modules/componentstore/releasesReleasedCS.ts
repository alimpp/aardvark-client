import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { isEmpty } from "@/utils/object";
import ReleasesReleasedRow from "@/datamodels/rows/releasesReleasedRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import { JsonParser } from "@/utils/jsonparser";
import store, { ApplicationDSModule, ReleaseDSModule, BadgeCountCSModule, ReleasesReleasedCSModule } from "@/store";
import { Wait, WaitStates } from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";

@Module({ name: "releasesreleasedcs", namespaced: true, stateFactory: true })
export class ReleasesReleasedCS extends TableSubModuleCS<ReleasesReleasedRow> {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "id", type: "text", headerType: 'text', title: "ID", path: "releaseNumber", sortField: TABLE_SORT_TYPE.RELEASE_NUMBER },
    { id: "name", type: "text", headerType: 'text', title: "Name", path: "title", width: '99%', sortField: TABLE_SORT_TYPE.RELEASE_NAME },
    { id: "alert", type: "alert", headerType: 'text', title:"Alert", path: "alert", sortField: TABLE_SORT_TYPE.RELEASE_ALERT },
    { id: "tempo", type: "tempo", headerType: 'text', title:"Tempo", path: "tempo", minWidth:'90px', filterType: TABLE_FILTER_TYPE.RELEASES_TEMPO, sortField: TABLE_SORT_TYPE.RELEASE_TEMPO },
    { id: "launchDate", type: "date", headerType: 'text', title:"Release Date", path: "launchDate", sortField: TABLE_SORT_TYPE.RELEASE_RELEASE_DATE },
    { id: "cutoff", type: "date", headerType: 'text', title:"Release Cutoff", path: "cutoff", sortField: TABLE_SORT_TYPE.RELEASE_RELEASE_CUTOFF },
    { id: "managerId", type: "profile", headerType: 'text', title:"Release Maestro", path: "managerId", sortField: TABLE_SORT_TYPE.RELEASE_PRIMARY_MAESTRO },
    { id: "secondaryManagerId", type: "profile", headerType: 'text', title:"Secondary Maestro", path: "secondaryManagerId", sortField: TABLE_SORT_TYPE.RELEASE_SECONDARY_MAESTRO }
  ]
  sort = { field: TABLE_SORT_TYPE.RELEASE_RELEASE_DATE, direction: TABLE_SORT_DIRECTION.DESC };

  constructor(module: VuexModule<ThisType<ReleasesReleasedRow>, ReleasesReleasedRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    const badgeCountMethod = (count) => {
      if(!this.hasFilters) {
      BadgeCountCSModule.setReleasesReleased(count)
      }
  }
    return {
      method: ReleaseDSModule.listReleases,
      parameters: () => ({status: "complete", processCount: badgeCountMethod}),
      model: ReleasesReleasedRow
    }
  }

  get refreshOptions() {
    return {
      items: ReleaseDSModule.getItems,
      model: ReleasesReleasedRow
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
        return state.releaseds.itemWatch;
      },
      function onChange(release) {
        if(ApplicationDSModule.selectedModuleTab === ModuleTabName.releasesReleased && release?.item?.id) {
          ReleasesReleasedCSModule.doRefreshRow({rowId: release?.item?.id});
        }
      }
    );
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
  @Wait(WaitStates.ACTION_RELEASERELEASED_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response = await this.fetch({reset: true});
      const data = JsonParser.deserializeArray(response, ReleasesReleasedRow);
      this.doSetRows(data);
    }
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: ReleasesReleasedRow) {
    ApplicationDSModule.setSelectedReleaseId(data?.id);
  }

}

export interface IReleasesReleasedCS {
  tableData: ReleasesReleasedRow[]
}