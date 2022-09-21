import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import MemberAPI from "@/api/membersAPI"
import { SessionDSModule } from '@/store'
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: 'settingschangepasswordcs', namespaced: true, stateFactory: true })
export class SettingsChangePasswordCS extends VuexModule {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }
  currentPassword = ''
  password = ''
  confirmPassword = ''

  get sessions() {
    return SessionDSModule.itemsAsArray
  }

  @Mutation
  setPassword(password) {
    this.password = password;
  }

  @Mutation
  setCurrentPassword(currentPassword) {
    this.currentPassword = currentPassword;
  }

  @Mutation
  setConfirmPassword(confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_PASSWORD_LOADING)
  async changePassword() {
    await MemberAPI.CHANGE_PASSWORD({currentPassword: this.currentPassword, newPassword: this.confirmPassword})
  }

  @Action({ rawError: true })
  listSessions() {
    SessionDSModule.doLoad()
  }

  @Action({ rawError: true })
  async deleteSessions(sessionsId: string) {
    await SessionDSModule.deleteSessions(sessionsId)
  }
}
