import { UserDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'updateprofilepicturecs', namespaced: true })
export class UpdateProfilePictureCS extends VuexModule {
  avatar = "" ;

  @Mutation
  setAvatar(value) {
    this.avatar = value;
  }

  @Action
  async update(): Promise<void> {
    await UserDSModule.UpdateAvatar(this.avatar);
  }

  @Action
  clear(): void {
    this.setAvatar('');
  }

}