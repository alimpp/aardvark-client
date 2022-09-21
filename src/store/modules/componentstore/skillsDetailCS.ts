import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import SkillDM from '@/datamodels/skillDM';
import store, {SkillDetailCSModule, SkillDSModule} from '@/store';
import { Wait, WaitStates } from '@/utils/vuewait';


@Module({ name: 'skilldetailcs', namespaced: true, stateFactory: true })
export class SkillDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  skillDetail: SkillDM = new SkillDM();

  @Mutation
  setSkillDetail(skill: SkillDM) {
    this.skillDetail = skill;
  }

  @Action({ rawError: true })
  async updateSkillDetailFromCache() {
    this.setSkillDetail(cloneDeep(SkillDSModule.currentSkill))
  }

  @Action({ rawError: true })
  async updateSkill() {
    await SkillDSModule.updateSkill(this.skillDetail)
  }

  @Action({ rawError: true })
  async deactivateSkill() {
    await SkillDSModule.deactivateSkill(this.skillDetail.id);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedSkillID;
      },
      function onChange(skills) {
        SkillDetailCSModule.updateSkillDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.skillds.itemWatch;
      },
      function onChange(skills) {
        SkillDetailCSModule.updateSkillDetailFromCache();
      },
      { deep: true }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
