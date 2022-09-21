import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsCompanyCalendarRow from "@/datamodels/rows/settingsCompanyCalendarRow";
import store, { HolidayDSModule, SettingsDSModule, HolidayTypesDSModule, SettingsCompanyCalendarCSModule, TableFilterCSModule } from "@/store";
import { JsonParser } from "@/utils/jsonparser";
import { EVENTS, HOLIDAY_TYPE, TABLE_SORT_DIRECTION } from "@/utils/constants";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { EventBus } from "@/utils/eventBus";
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE } from '@/utils/constants';
import { isEmpty } from "@/utils/object";
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingscompanycalendarcs", namespaced: true, stateFactory: true })
export class SettingsCompanyCalendarCS extends TableSettingsCS<SettingsCompanyCalendarRow> implements ISettingsCompanyCalendarCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "name", type: "text", headerType: 'text', title: "Name", path: "name", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.COMPANY_CALENDAR_NAME },
    { id: "date", type: "text", headerType: 'text', title: "Date(s)", path: "date", sortField: TABLE_SORT_TYPE.COMPANY_CALENDAR_DATE },
    { id: "type", type: "text", headerType: 'text', title: "Type", path: "type" },
    { id: "repeat", type: "text", headerType: 'text', title: "Repeat", path: "repeat", sortField: TABLE_SORT_TYPE.COMPANY_CALENDAR_REPEAT, filterType: TABLE_FILTER_TYPE.CALENDAR_REPEAT },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.COMPANY_CALENDAR_INACTIVE },
  ]

  sort = { field: TABLE_SORT_TYPE.COMPANY_CALENDAR_ID, direction: TABLE_SORT_DIRECTION.DESC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsCompanyCalendarRow>, SettingsCompanyCalendarRow>) {
    super(module);
  }

  public get weeklyOffDays() {
    return HolidayDSModule.itemsAsArray.filter(holiday => holiday.repeat === 'weekly' && holiday.holidayTypeId === this.companyTypeId && !holiday.removedAt)
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: HolidayDSModule.listHolidays,
      parameters: () => ({ holidayTypeId : this.companyTypeId}),
      model: SettingsCompanyCalendarRow
    }
  }

  get refreshOptions() {
    return {
      items: HolidayDSModule.getItems,
      model: SettingsCompanyCalendarRow
    }
  }

  get holidays() {
    return HolidayDSModule.itemsAsArray
  }

  get decoratedHolidays() {
    return this.holidays?.filter(item => !item.removedAt)?.map((holiday) => {
      return {
        categoryId: holiday.holidayTypeId,
        start: (holiday.startDate),
        end: (holiday.endDate),
        repeat: holiday.repeat,
        title: holiday.title,
      };
    });
  }

  get companyTypeId() {
    return HolidayTypesDSModule.itemsAsArray.find(type => type.title === HOLIDAY_TYPE.COMPANY)?.id || 0
  }

  get hasRemovedAtFilters() {
    return TableFilterCSModule.filters[`removedAt`].options.map(item => item.id).every((value) =>(this.filters?.removedAt?.includes(value)));
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.holidayds.itemWatch;
      },
      function onChange(holiday) {
        if(holiday?.item?.id){
          SettingsCompanyCalendarCSModule.doRefreshRow({rowId: holiday.item.id});
          if(SettingsCompanyCalendarCSModule?.filters?.removedAt &&
            !SettingsCompanyCalendarCSModule.hasRemovedAtFilters &&
            holiday?.changes?.removedAt?.new !== holiday?.changes?.removedAt?.old)
          {
            SettingsCompanyCalendarCSModule.removeRowsById({ids: [holiday.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  async delete(holidayId: number) {
    await HolidayDSModule.delete(holidayId)
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
  @Wait(WaitStates.ACTION_SETTINGSCOMPANYCALENDAR_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const holiday = response.filter(item => item.repeat !== "weekly")
      const data = JsonParser.deserializeArray(holiday, SettingsCompanyCalendarRow)
      this.doSetRows(data)
    }
  }

  //Overriding this to do not show weekly holidays after fetch more
  @Action({rawError: true})
  async fetchMore() {
      if(!this.requestOptions) return [];
      const response = await this.context.dispatch("fetch");
      const data = JsonParser.deserializeArray(response, this.requestOptions.model) as SettingsCompanyCalendarRow[]
      const filteredData = data.filter(item => item.repeat !== 'weekly')
      this.context.dispatch("doSetRows", [...this.tableData, ...filteredData])
  }

  @Action({rawError: true})
  async selectNewCompanyHoliday(){
    await this.selectNewRow(SettingsDSModule.newHolidayId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsCompanyCalendarRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedHolidayId(data.id);
    } else {
      SettingsDSModule.setSelectedHolidayId(0);
    }
  }

  @Action({ rawError: true })
  async onRowClick(data) {
    await this.context.commit("setSelectedRows", [data])
    //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
    //instead of expensive store watch operations that are lower priority.
    window.setTimeout(() => {
      this.context.dispatch("updateSelectedEntity", data)
      EventBus.$emit(EVENTS.CLICK_TABLE_SUBMODULE)
    }, 0)
  }

  //Overriding this to add default row selection behavior
  @Action({ rawError: true })
  async doSetTableData(items: SettingsCompanyCalendarRow[]) {
    await this.context.commit("setTableData", items)
    await this.context.dispatch("doSelectedDefaultRow")
  }

  @Action({ rawError: true })
  async onRowDoubleClick(data) {
    EventBus.$emit(EVENTS.CLICK_DBL_TABLE_SUBMODULE)
  }


}

export interface ISettingsCompanyCalendarCS {
  tableData: TableRow[]
}
