import { HolidayDSModule, SettingsDSModule, HolidayTypesDSModule } from '@/store';
import {HOLIDAY_TYPE} from '@/utils/constants';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import { SettingsModuleName } from '@/store/modules/datastore/settingsDS'

@Module({ name: 'createholidaycs', namespaced: true })
export class CreateHolidayCS extends VuexModule {
  title = '';
  startDate = '';
  endDate = ''
  repeat = ''

  @Mutation
  setTitle(value: string) {
    this.title = value;
  }

  @Mutation
  setStartDate(value: string) {
    this.startDate = value;
  }

  @Mutation
  setEndDate(value: string) {
    this.endDate = value;
  }

  @Mutation
  setRepeat(value: string) {
    this.repeat = value;
  }

  get holidayTypeId() {
    const personalTypeId = HolidayTypesDSModule.itemsAsArray.find(type => type.title === HOLIDAY_TYPE.PERSONAL)?.id || 0
    const companyTypeId = HolidayTypesDSModule.itemsAsArray.find(type => type.title === HOLIDAY_TYPE.COMPANY)?.id || 0
    const holidayTypeId = SettingsDSModule.selectedSettingsModule === SettingsModuleName.personalCalendar ? personalTypeId  : companyTypeId
    return holidayTypeId
  }

  @Action
  async create() {
    await HolidayDSModule.create({
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      repeat: this.repeat,
      holidayTypeId: this.holidayTypeId
    });
  }

  @Action
  clear() {
    this.setTitle('');
    this.setStartDate('');
    this.setEndDate('');
  }
}
