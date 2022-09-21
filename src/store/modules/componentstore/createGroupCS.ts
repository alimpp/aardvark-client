import { GroupDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import {GROUP_TYPE} from '@/utils/constants';

@Module({ name: 'creategroupcs', namespaced: true })
export class CreateGroupCS extends VuexModule {
  title = '';
  description = '';
  type = GROUP_TYPE.PUBLIC

  @Mutation
  setTitle(value: string) {
    this.title = value;
  }

  @Mutation
  setDescription(value: string) {
    this.description = value;
  }

  @Mutation
  setType(value: GROUP_TYPE) {
    this.type = value;
  }

  @Action({ rawError: true })
  async create() {
    await GroupDSModule.create({
      title: this.title,
      description: this.description,
      type: this.type
    });
  }

  @Action
  clear() {
    this.setTitle('');
    this.setDescription('');
  }

}
