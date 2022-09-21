import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import store, { GroupDSModule, UserDSModule, SettingsUserProfileCSModule, UserDepartmentDSModule } from '@/store';
import cloneDeep from 'lodash.clonedeep';
import UserDM from "@/datamodels/userDM";
import {callingCountries} from 'country-data';

@Module({ name: 'settingsuserprofilecs', namespaced: true, stateFactory: true })
export class SettingsUserProfileCS extends VuexModule implements ILifeCycle {
  profileDetail: UserDM = new UserDM()

  // @ts-ignore
  constructor(module: Mod<ThisType<any>, any>) {
    super(module);
  }

  @Mutation
  setProfileDetail(profile: UserDM) {
    this.profileDetail = profile;
  }

  public get me() {
    return UserDSModule.me
  }

  get countries() {
    return callingCountries.all.map(country => {
      return {
        ...country,
        countryCallingCodes: country.countryCallingCodes[0]
      }
    })
  }

  get requestOptions() {
    return
  }

  get refreshOptions() {
    return
  }

  get months() {
    return [
      {
        id: '01',
        title: 'Jan'
      },
      {
        id: '02',
        title: 'Feb'
      },
      {
        id: '03',
        title: 'Mar'
      },
      {
        id: '04',
        title: 'Apr'
      },
      {
        id: '05',
        title: 'May'
      },
      {
        id: '06',
        title: 'June'
      },
      {
        id: '07',
        title: 'July'
      },
      {
        id: '08',
        title: 'Aug'
      },
      {
        id: '09',
        title: 'Sept'
      },
      {
        id: '10',
        title: 'Oct'
      },
      {
        id: '11',
        title: 'Nov'
      },
      {
        id: '12',
        title: 'Dec'
      }
    ]
  }

  public get days() {
    const days: any[] = []
    const endDay = 31
    let startDay = 1
    while (startDay <= endDay) {
      days.push({ label: ('0' + startDay++).slice(-2) })
    }
    return days
  }

  public get years() {
    const years: any[] = []
    let endDate = new Date().getFullYear();
    const startDate = 1900;
    while (startDate <= endDate) {
      years.push({ label: (endDate--).toString() });
    }
    return years
  }

  get groups() {
    return GroupDSModule.itemsAsArray;
  }

  get userDepartment() {
    return UserDSModule?.me ? UserDepartmentDSModule.items[UserDSModule?.me?.id] : undefined
  }

  @Action({ rawError: true })
  async updateProfileDetailFromCache() {
    if(this.me) this.setProfileDetail(cloneDeep(this.me))
  }

  @Action({ rawError: true })
  updateProfile() {
    UserDSModule.UpdateProfile(this.profileDetail)
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.userds.itemWatch
      },
      async function onChange() {
        await SettingsUserProfileCSModule.updateProfileDetailFromCache();
      },
      {deep: true}
    );
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
  async doLoad() {
    await this.updateProfileDetailFromCache()
    if (this.me && !UserDepartmentDSModule.items[this.me?.id]) UserDepartmentDSModule.doLoad(SettingsUserProfileCSModule?.me?.id)
  }

  @Action({ rawError: true })
  async onRowDoubleClick() {
    return
  }

  @Action({ rawError: true })
  async onRowClick() {
    return
  }

  @Action({ rawError: true })
  async activate() {
    return
  }

}
