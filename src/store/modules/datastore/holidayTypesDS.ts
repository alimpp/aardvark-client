import HolidayAPI from '@/api/holidayAPI';
import HolidayTypeDM from '@/datamodels/holidayTypesDM';
import { isEmpty } from '@/utils/object';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';

@Module({ name: 'holidaytypesds', namespaced: true })
export class HolidayTypesDS extends BaseItemDS<HolidayTypeDM> {

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const holidayTypes = await HolidayAPI.TYPES();
      this.addOrReplaceItems(holidayTypes);
    }
  }
}