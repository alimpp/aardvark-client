import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsDepartmentsRow from "@/datamodels/rows/settingsDepartmentsRow";
import store, { DepartmentDSModule, SettingsDepartmentsCSModule, SettingsDSModule, TableFilterCSModule } from '@/store';
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import { JsonParser } from "@/utils/jsonparser";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE } from '@/utils/constants';
import { isEmpty } from "@/utils/object";
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingsdepartmentscs", namespaced: true, stateFactory: true })
export class SettingsDepartmentsCS extends TableSettingsCS<SettingsDepartmentsRow> implements ISettingsDepartmentsCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "name", type: "text", headerType: 'text', title: "Department Name", path: "name", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.DEPARTMENT_NAME },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.DEPARTMENT_INACTIVE},
  ]
  sort = { field: TABLE_SORT_TYPE.DEPARTMENT_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active']};

  constructor(module: VuexModule<ThisType<SettingsDepartmentsRow>, SettingsDepartmentsRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: DepartmentDSModule.listDepartments,
      parameters: () => ({}),
      model: SettingsDepartmentsRow
    }
  }

  get refreshOptions() {
    return {
      items: DepartmentDSModule.getItems,
      model: SettingsDepartmentsRow
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
        return state.departmentds.itemWatch;
      },
      function onChange(department) {
        if(department?.item?.id){
          SettingsDepartmentsCSModule.doRefreshRow({rowId: department.item.id});
          if(SettingsDepartmentsCSModule?.filters?.removedAt &&
            !SettingsDepartmentsCSModule.hasRemovedAtFilters &&
            department?.changes?.removedAt?.new !== department?.changes?.removedAt?.old)
          {
            SettingsDepartmentsCSModule.removeRowsById({ids: [department.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSDEPARTMENT_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsDepartmentsRow)
      this.doSetRows(data)
    }
  }

  @Action({ rawError: true })
  async selectNewDepartment(){
    await this.selectNewRow(SettingsDSModule.newDepartmentId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsDepartmentsRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedDepartmentId(data.id);
    } else {
      SettingsDSModule.setSelectedDepartmentId(0);
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

export interface ISettingsDepartmentsCS {
  tableData: TableRow[]
}
