import { SettingsDSModule } from "@/store"
import { Module, Action } from "vuex-module-decorators"
import HolidayDM from "@/datamodels/holidayDM"
import HolidayAPI from "@/api/holidayAPI"
import BaseItemDS from './base/baseItemDS';
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: "holidayds", namespaced: true })
export class HolidayDS extends BaseItemDS<HolidayDM> {

  public get currentHoliday(): HolidayDM {
    return this.items[SettingsDSModule.selectedHolidayID] || {}
  }

  @Action({ rawError: true })
  async listHolidays(params: { sort?: keyof HolidayDM, direction?: "ASC" | "DESC", holidayTypeId?: number}) {
    const holidays = await HolidayAPI.LIST(params)
    this.addOrReplaceItems(holidays)
    return holidays
  }

  @Action({ rawError: true })
  async updateHoliday(holiday: HolidayDM) {
    const updatedHoliday = await HolidayAPI.UPDATE({holiday})
    this.addOrReplaceItem(updatedHoliday)
    return updatedHoliday
  }

  @Action({ rawError: true })
  async create(params: { title: string, startDate: string, endDate: string, repeat: string, holidayTypeId: number}) {
    const holiday = await HolidayAPI.CREATE({title: params.title, startDate: params.startDate, endDate: params.endDate, repeat: params.repeat, holidayTypeId: params.holidayTypeId});
    SettingsDSModule.setNewHolidayId(holiday.id)
    this.addOrReplaceItem(holiday);
  }

  @Action({ rawError: true })
  async delete(holidayId: number) {
    const deletedHoliday = await HolidayAPI.DELETE({holidayId});
    this.addOrReplaceItem(deletedHoliday);
  }

  @Action({ rawError: true })
  async doLoad() {
    return
  }
}
