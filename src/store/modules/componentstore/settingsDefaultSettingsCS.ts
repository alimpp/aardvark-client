import {  Module, VuexModule } from 'vuex-module-decorators'
import { DateAndTimeDSModule } from '@/store';

@Module({ name: 'settingsdefaultsettingscs', namespaced: true, stateFactory: true })
export class SettingsDefaultSettingsCS extends VuexModule {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }


  public get dateFormats() {
    return DateAndTimeDSModule.dateFormats;
  }

  public get timeFormats() {
    return DateAndTimeDSModule.timeFormats;
  }

  public get timeZones() {
    return DateAndTimeDSModule.timeZones;
  }

}