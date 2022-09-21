import SpecialtyDM from '@/datamodels/specialtyDM';
import { Action, Module, VuexModule } from 'vuex-module-decorators'
import BaseItemsDS from './base/baseItemsDS';
import SpecialtiesAPI from '@/api/specialtiesAPI';
import UserAPI from "@/api/userAPI"
import { Wait, WaitStates } from "@/utils/vuewait"

@Module({ name: 'userspecialtyds', namespaced: true })
export class UserSpecialtyDS extends BaseItemsDS<SpecialtyDM> implements IUserSpecialtyDS {

    constructor(module: VuexModule<ThisType<SpecialtyDM>, SpecialtyDM>) {
        super(module);
    }

  @Action({ rawError: true })
  async grant(params: {specialtyID: number, userID: number}) {
    const specialty = await SpecialtiesAPI.GRANT({memberId:params.userID, specialtyId:params.specialtyID});
    const newState = this.items[params.userID]
    newState.push(specialty)
    this.addOrReplaceItem({id: params.userID, items: newState})
  }

  @Action({ rawError: true })
  async deny(params: {specialtyID: number, userID: number}) {
    const specialty = await SpecialtiesAPI.DENY({memberId:params.userID, specialtyId:params.specialtyID});
    const items = this.items[params.userID].filter(item => item.id !== specialty.id);
    this.addOrReplaceItem({id: params.userID, items});
  }

  @Action({ rawError: true })
  async doLoad() {
      return
  }


  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_MESSAGE_INFO)
  async listSpecialties(userId) {
    if (userId) {
      const specialties = await UserAPI.LIST_SPECIALTIES({ userId: userId })
      this.addOrReplaceItem({ id: userId, items: specialties })
    }
  }
}

export interface IUserSpecialtyDS {
  items: { [key: number]: SpecialtyDM[] }
}
