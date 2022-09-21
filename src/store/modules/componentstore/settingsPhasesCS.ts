import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsPhasesRow from '@/datamodels/rows/settingsPhasesRow';
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import store, { PhaseDSModule, SettingsDSModule, SettingsPhasesCSModule,TableFilterCSModule } from '@/store';
import { isEmpty } from "@/utils/object";
import { JsonParser } from "@/utils/jsonparser";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: 'settingsphasescs', namespaced: true, stateFactory: true })
export class SettingsPhasesCS extends TableSettingsCS<SettingsPhasesRow> implements ISettingsPhasesCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "phase", type: "text", headerType: 'text', title: "Phase", path: "title", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.PHASE_NAME },
    { id: "description", type: "text", headerType: 'text', title: "Description", path: "description", width: '30%' },
    { id: "skill", type: "text", headerType: 'text', title: "Associated Skills", path: "skillTitle", filterType: TABLE_FILTER_TYPE.PHASE_SKILL },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.PHASE_INACTIVE  },
  ]
  sort = { field: TABLE_SORT_TYPE.PHASE_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsPhasesRow>, SettingsPhasesRow>) {
    super(module);
  }
  
  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: PhaseDSModule.listPhases,
      parameters: () => ({}),
      model: SettingsPhasesRow
    }
  }

  get refreshOptions() {
    return {
      items: PhaseDSModule.getItems,
      model: SettingsPhasesRow
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
        return state.phaseds.itemWatch;
      },
      function onChange(phase) {
        if(phase?.item?.id){
          SettingsPhasesCSModule.doRefreshRow({rowId: phase.item.id});
          if(SettingsPhasesCSModule?.filters?.removedAt &&
            !SettingsPhasesCSModule.hasRemovedAtFilters &&
            phase?.changes?.removedAt?.new !== phase?.changes?.removedAt?.old)
          {
            SettingsPhasesCSModule.removeRowsById({ids: [phase.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSPHASES_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsPhasesRow)
      this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  async selectNewPhaseRow(){
    await this.selectNewRow(SettingsDSModule.newPhaseId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsPhasesRow | null) {
    if (data?.id) {
      SettingsDSModule.setSelectedPhaseId(data.id);
    } else {
      SettingsDSModule.setSelectedPhaseId(0);
    }
  }

  @Action({ rawError: true })
  async doSetRows(items: SettingsPhasesRow[]) {
    const newItems = items.filter(row=> !row.isSystem )
    await this.setTableData(newItems)
    await this.doSelectedDefaultRow()
    if (!items.length) this.updateSelectedEntity(null)
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

export interface ISettingsPhasesCS {
  tableData: TableRow[]
}
