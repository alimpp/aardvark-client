import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import PhaseDM from '@/datamodels/phaseDM';
import store, {PhaseDetailCSModule, PhaseDSModule, SkillDSModule} from '@/store';


@Module({ name: 'phasedetailcs', namespaced: true, stateFactory: true })
export class PhaseDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  phaseDetail: PhaseDM = new PhaseDM();

  get skills() {
    return SkillDSModule.sortedItems('title')
  }

  @Mutation
  setPhaseDetail(phase: PhaseDM) {
    this.phaseDetail = phase;
  }

  @Action({ rawError: true })
  async updatePhaseDetailFromCache() {
    this.setPhaseDetail(cloneDeep(PhaseDSModule.currentPhase))
  }

  @Action({ rawError: true })
  async updatePhase() {
    await PhaseDSModule.updatePhase(this.phaseDetail)
  }

  @Action({ rawError: true })
  async deactivatePhase() {
    await PhaseDSModule.deactivatePhase(this.phaseDetail.id);
  }


  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedPhaseID;
      },
      function onChange(phases) {
        PhaseDetailCSModule.updatePhaseDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.phaseds.itemWatch;
      },
      function onChange(phases) {
        PhaseDetailCSModule.updatePhaseDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
