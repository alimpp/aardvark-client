import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsPersonalCalendarRow from "@/datamodels/rows/settingsPersonalCalendarRow";
import store, { HolidayDSModule, SettingsDSModule, HolidayTypesDSModule, SettingsPersonalCalendarCSModule, TableFilterCSModule } from "@/store";
import { JsonParser } from "@/utils/jsonparser";
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";
import { HOLIDAY_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { isEmpty } from "@/utils/object";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingspersonalcalendarcs", namespaced: true, stateFactory: true })
export class SettingsPersonalCalendarCS extends TableSettingsCS<SettingsPersonalCalendarRow> implements ISettingsPersonalCalendarCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "name", type: "text", headerType: 'text', title: "Name", path: "title", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.PERSONAL_CALENDAR_NAME },
    { id: "date", type: "text", headerType: 'text', title: "Date(s)", path: "date", sortField: TABLE_SORT_TYPE.PERSONAL_CALENDAR_DATE },
    { id: "type", type: "text", headerType: 'text', title: "Type", path: "holidayTypeTitle" },
    { id: "repeat", type: "text", headerType: 'text', title: "Repeat", path: "repeat", sortField: TABLE_SORT_TYPE.PERSONAL_CALENDAR_REPEAT, filterType: TABLE_FILTER_TYPE.CALENDAR_REPEAT },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.PERSONAL_CALENDAR_INACTIVE },

  ]
  sort = { field: TABLE_SORT_TYPE.PERSONAL_CALENDAR_ID, direction: TABLE_SORT_DIRECTION.DESC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsPersonalCalendarRow>, SettingsPersonalCalendarRow>) {
    super(module);
  }

  public get weeklyOffDays() {
    return HolidayDSModule.itemsAsArray.filter(holiday => holiday.repeat === 'weekly' && holiday.holidayTypeId === this.personalTypeId && !holiday.removedAt)
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: HolidayDSModule.listHolidays,
      parameters: () => ({ holidayTypeId: this.personalTypeId }),
      model: SettingsPersonalCalendarRow
    }
  }

  get refreshOptions() {
    return {
      items: HolidayDSModule.getItems,
      model: SettingsPersonalCalendarRow
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

  get personalTypeId() {
    return HolidayTypesDSModule.itemsAsArray.find(type => type.title === HOLIDAY_TYPE.PERSONAL)?.id || 0
  }

  get hasRemovedAtFilters() {
    return TableFilterCSModule.filters[`removedAt`].options.map(item => item.id).every((value) => (this.filters?.removedAt?.includes(value)));
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
          SettingsPersonalCalendarCSModule.doRefreshRow({rowId: holiday.item.id});
          if(SettingsPersonalCalendarCSModule?.filters?.removedAt &&
            !SettingsPersonalCalendarCSModule.hasRemovedAtFilters &&
            holiday?.changes?.removedAt?.new !== holiday?.changes?.removedAt?.old)
          {
            SettingsPersonalCalendarCSModule.removeRowsById({ids: [holiday.item.id]})
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
  @Wait(WaitStates.ACTION_SETTINGSPERSONALCALENDAR_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const holiday = response.filter(item => item.repeat !== "weekly")
      const data = JsonParser.deserializeArray(holiday, SettingsPersonalCalendarRow)
      this.doSetRows(data)

    }
  }

  //Overriding this to do not show weekly holidays after fetch more
  @Action({rawError: true})
  async fetchMore() {
      if(!this.requestOptions) return [];
      const response = await this.context.dispatch("fetch");
      const data = JsonParser.deserializeArray(response, this.requestOptions.model) as SettingsPersonalCalendarRow[]
      const filteredData = data.filter(item => item.repeat !== 'weekly')
      this.context.dispatch("doSetRows", [...this.tableData, ...filteredData])
  }

  @Action({ rawError: true })
  async selectNewPersonalHoliday(){
    await this.selectNewRow(SettingsDSModule.newHolidayId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsPersonalCalendarRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedHolidayId(data.id);
    } else {
      SettingsDSModule.setSelectedHolidayId(0);
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

export interface ISettingsPersonalCalendarCS {
  tableData: TableRow[]
}
