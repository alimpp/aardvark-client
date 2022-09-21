import { UserDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'invitationcs', namespaced: true })
export class InvitationCS extends VuexModule {
  email = '';

  @Mutation
  setEmail(value: string) {
    this.email = value.trim();
  }

  @Action
  async invite() {
    await UserDSModule.invite(this.email);
  }

  @Action
  clear() {
    this.setEmail('');
  }
}
