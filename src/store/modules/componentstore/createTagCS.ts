import { TagDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'createtagcs', namespaced: true })
export class CreateTagCS extends VuexModule {
  title = '';
  description = '';

  @Mutation
  setTitle(value: string) {
    this.title = value;
  }

  @Mutation
  setDescription(value: string) {
    this.description = value;
  }

  @Action({ rawError: true })
  async create() {
    TagDSModule.create({title: this.title, description: this.description});
  }

  @Action
  clear() {
    this.setTitle('');
    this.setDescription('');
  }

}