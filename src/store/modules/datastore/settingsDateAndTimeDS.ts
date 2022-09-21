import { Module, VuexModule } from 'vuex-module-decorators'
import timezones from 'timezones-list'

@Module({ name: 'dateandtimeds', namespaced: true })
export class DateAndTimeDS extends VuexModule {
  dateFormats: any[] = [
    { label: "09/04/1986", value: "L" },
    { label: "9/4/1986", value: "l" },
    { label: "September 4, 1986", value: "LL" },
    { label: "Sep 4, 1986", value: "ll" },
    { label: "September 4, 1986 8:30 PM", value: "LLL" },
    { label: "Sep 4, 1986 8:30 PM", value: "lll" },
    { label: "Thursday, September 4, 1986 8:30 PM", value: "LLLL" },
    { label: "Thu, Sep 4, 1986 8:30 PM", value: "lll" },
  ];

  timeFormats: any[] = [
    { label: "8:30 PM", value: "LT" },
    { label: "8:30:25 PM", value: "LTS" }
  ];

  timeZones: any[] = timezones;
}