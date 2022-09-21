import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, {HolidayDSModule, PersonalCalendarDetailCSModule} from '@/store';
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import HolidayDM from '@/datamodels/holidayDM';


@Module({ name: 'personalcalendardetailcs', namespaced: true, stateFactory: true })
export class PersonalCalendarDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  holidayDetail: HolidayDM = new HolidayDM();

  @Mutation
  setHolidayDetail(holiday: HolidayDM) {
    this.holidayDetail = holiday;
  }

  @Action({ rawError: true })
  async updateHolidayDetailFromCache() {
    this.setHolidayDetail(cloneDeep(HolidayDSModule.currentHoliday))
  }

  @Action({ rawError: true })
  async updateHoliday() {
    await HolidayDSModule.updateHoliday(this.holidayDetail)
  }

  @Action({ rawError: true })
  async deleteHoliday() {
    await HolidayDSModule.delete(this.holidayDetail.id);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedHolidayID;
      },
      function onChange() {
        PersonalCalendarDetailCSModule.updateHolidayDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.holidayds.itemWatch;
      },
      function onChange() {
        PersonalCalendarDetailCSModule.updateHolidayDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
