import { DepartmentDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'createdepartmentcs', namespaced: true })
export class CreateDepartmentCS extends VuexModule {
  title = '';

  @Mutation
  setTitle(value: string) {
    this.title = value;
  }

  @Action({ rawError: true })
  async create() {
    await DepartmentDSModule.create(this.title);
  }

  @Action
  clear() {
    this.setTitle('');
  }

}