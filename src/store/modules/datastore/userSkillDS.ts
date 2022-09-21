import UserAPI from "@/api/userAPI"
import SkillDM from "@/datamodels/skillDM";
import { UserDSModule, PhaseDSModule, PhaseResourceDSModule, SettingsDSModule } from "@/store";
import { Action, Module, VuexModule } from "vuex-module-decorators";
import BaseItemsDS from './base/baseItemsDS';
import SkillsAPI from '@/api/skillsAPI';
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: "userskillds", namespaced: true, stateFactory: true})
export class UserSkillDS extends BaseItemsDS<SkillDM> implements IUserSkillDS {

  constructor(module: VuexModule<ThisType<SkillDM>, SkillDM>) {
    super(module);
  }

  @Action({ rawError: true })
  async deny(params: {skillId: number, userId: number}) {
    const skill = await SkillsAPI.DENY({ memberId: params.userId, skillId: params.skillId });
    const items = this.items[params.userId].filter(item => item.id !== skill.id);
    this.addOrReplaceItem({id: params.userId, items});
    await this.removeFromPhaseUsers({skillId: params.skillId, user: params.userId});
    return skill;
  }

  @Action({ rawError: true })
  async removeFromPhaseUsers(params: {skillId: number, user: number}) {
    PhaseDSModule.itemsAsArray.filter(phase => phase.skillId == params.skillId)?.map(phase => {
      if (PhaseResourceDSModule.items[phase.id]) {
        const items = PhaseResourceDSModule.items[phase.id].filter(item => item.id !== params.user);
        PhaseResourceDSModule.addOrReplaceItems({id: phase.id, items});
      }
    });
  }
  
  @Action({ rawError: true })
  async doLoad() {
      return
  }

  @Action({ rawError: true })
  async addToPhaseUsers(params: {skillId, user}) {
    const phasesId = PhaseDSModule.itemsAsArray.filter(phase => phase.skillId == params.skillId)?.map(phase => phase.id) || [];
    if (phasesId.length) {
      phasesId.forEach(phaseId => {
        if (PhaseResourceDSModule.items[phaseId]) {
          const phaseResources = PhaseResourceDSModule.items[phaseId]
          phaseResources.push(UserDSModule.items[params.user])
          PhaseResourceDSModule.addOrReplaceItems({id: phaseId, items: phaseResources})
        }
      })
    }
  }

  @Action({ rawError: true })
  async grant(params: {skillId: number, userId: number}) {
    const skill = await SkillsAPI.GRANT({ memberId: params.userId, skillId: params.skillId });
    const newState = this.items[params.userId]
    newState.push(skill)
    this.addOrReplaceItem({id: params.userId, items: newState})
    await this.addToPhaseUsers({skillId: params.skillId, user: params.userId})
    return skill
  }

  @Action({ rawError: true })
  async updateSkill(params) {
    const oldSkill = await SkillsAPI.DENY({ memberId: SettingsDSModule.selectedUserID, skillId: params.oldSkillId })
    const newSkill = await SkillsAPI.GRANT({ memberId: SettingsDSModule.selectedUserID, skillId: params.newSkillId })
    const items = this.items[SettingsDSModule.selectedUserID].map(item => item.id === oldSkill.id ? newSkill : item);
    this.addOrReplaceItem({id: SettingsDSModule.selectedUserID, items});
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_MESSAGE_INFO)
  async listSkills(userId) {
    if (userId) {
      const skills = await UserAPI.LIST_SKILLS({userId: userId});
      this.addOrReplaceItem({id: userId, items: skills})
      return skills
    }
  }
}

export interface IUserSkillDS {
  items: { [key: number]: SkillDM[] }
}