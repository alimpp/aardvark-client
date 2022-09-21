import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsGroupsRow from "@/datamodels/rows/settingsGroupsRow";
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import store, { GroupDSModule, SettingsDSModule, SettingsGroupsCSModule,TableFilterCSModule } from '@/store';
import { JsonParser } from "@/utils/jsonparser";
import { isEmpty } from "@/utils/object";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingsgroupscs", namespaced: true, stateFactory: true })
export class SettingsGroupsCS extends TableSettingsCS<SettingsGroupsRow> implements ISettingsGroupsCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "name", type: "text", headerType: 'text', title: "Channel Name", path: "title", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.GROUP_NAME },
    { id: "type", type: "text", headerType: 'text', title: "Type", path: "type", filterType: TABLE_FILTER_TYPE.GROUP_TYPE},
    { id: "description", type: "text", headerType: 'text', title: "Description", path: "description" },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.GROUP_INACTIVE },
  ]
  sort = { field: TABLE_SORT_TYPE.GROUP_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsGroupsRow>, SettingsGroupsRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: GroupDSModule.listGroups,
      parameters: () => ({}),
      model: SettingsGroupsRow
    }
  }

  get refreshOptions() {
    return {
      items: GroupDSModule.getItems,
      model: SettingsGroupsRow
    }
  }

  get hasRemovedAtFilters() {
    return TableFilterCSModule.filters[`removedAt`].options.map(item => item.id).every(value => { return this.filters?.removedAt?.includes(value); });
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.groupds.itemWatch;
      },
      function onChange(group) {
        if(group?.item?.id){
          SettingsGroupsCSModule.doRefreshRow({rowId: group.item.id});
          if(SettingsGroupsCSModule?.filters?.removedAt &&
            !SettingsGroupsCSModule.hasRemovedAtFilters &&
            group?.changes?.removedAt?.new !== group?.changes?.removedAt?.old)
          {
            SettingsGroupsCSModule.removeRowsById({ids: [group.item.id]})
          }
        }
      }
    )
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSGROUPS_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsGroupsRow)
      this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  async selectNewGroupRow(){
    await this.selectNewRow(SettingsDSModule.newGroupId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsGroupsRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedGroupId(data.id);
    } else {
      SettingsDSModule.setSelectedGroupId(0);
    }
  }

  @Action({ rawError: true })
  onRowCellClick() {
    return;
  }

  @Action({ rawError: true })
  onHeaderCellClick() {
    return
  }


}

export interface ISettingsGroupsCS {
  tableData: TableRow[]
}
