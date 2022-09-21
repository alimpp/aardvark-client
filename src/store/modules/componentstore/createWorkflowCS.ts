import { WorkflowDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'createworkflowcs', namespaced: true })
export class CreateWorkflowCS extends VuexModule {
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
    await WorkflowDSModule.create({
      title: this.title,
      description: this.description
    });
  }

  @Action
  clear() {
    this.setTitle('');
    this.setDescription('');
  }

}
