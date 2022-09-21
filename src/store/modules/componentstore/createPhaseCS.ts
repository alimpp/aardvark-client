import { PhaseDSModule } from '@/store';
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'createphasecs', namespaced: true })
export class CreatePhaseCS extends VuexModule {
  title = '';
  description = '';
  skillId = 0

  @Mutation
  setTitle(value: string) {
    this.title = value;
  }

  @Mutation
  setDescription(value: string) {
    this.description = value;
  }

  @Mutation
  setSkill(value: number) {
    this.skillId = value;
  }

  @Action({ rawError: true })
  async create() {
    await PhaseDSModule.create({
      title: this.title,
      description: this.description,
      skillId: this.skillId
    });
  }

  @Action
  clear() {
    this.setTitle('');
    this.setDescription('');
  }

}
