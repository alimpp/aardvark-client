import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsTagsRow from "@/datamodels/rows/settingsTagsRow";
import store, { TagDSModule, SettingsDSModule, SettingsTagsCSModule,TableFilterCSModule } from '@/store';
import { JsonParser } from "@/utils/jsonparser";
import { isEmpty } from "@/utils/object";
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";
import { TABLE_FILTER_TYPE,TABLE_SORT_DIRECTION,TABLE_SORT_TYPE } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingstagscs", namespaced: true, stateFactory: true })
export class SettingsTagsCS extends TableSettingsCS<SettingsTagsRow> implements ISettingsTagsCS  {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "name", type: "text", headerType: 'text', title: "Name", path: "title", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.TAG_NAME },
    { id: "preview", type: "tag", headerType: 'text', title: "Preview", path: "title"},
    { id: "description", type: "text", headerType: 'text', title: "Description", path: "description" },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.TAG_INACTIVE },
  ]
  sort = { field: TABLE_SORT_TYPE.TAG_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsTagsRow>, SettingsTagsRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: TagDSModule.listTags,
      parameters: () => ({}),
      model: SettingsTagsRow
    }
  }

  get refreshOptions() {
    return {
      items: TagDSModule.getItems,
      model: SettingsTagsRow
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
        return state.tagds.itemWatch;
      },
      function onChange(tag) {
        if(tag?.item?.id){
          SettingsTagsCSModule.doRefreshRow({rowId: tag.item.id});
          if(SettingsTagsCSModule?.filters?.removedAt &&
            !SettingsTagsCSModule.hasRemovedAtFilters &&
            tag?.changes?.removedAt?.new !== tag?.changes?.removedAt?.old)
          {
            SettingsTagsCSModule.removeRowsById({ids: [tag.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGTAGS_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsTagsRow)
        this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  async selectNewTagRow(){
    await this.selectNewRow(SettingsDSModule.newTagId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsTagsRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedTagId(data.id);
    } else {
      SettingsDSModule.setSelectedTagId(0);
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

export interface ISettingsTagsCS {
  tableData: TableRow[]
}
