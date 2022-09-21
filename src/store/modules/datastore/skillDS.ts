import SkillsAPI from '@/api/skillsAPI';
import SkillDM from '@/datamodels/skillDM';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import { SettingsDSModule } from '@/store';
import SpecialtiesAPI from '@/api/specialtiesAPI';
import { isEmpty } from '@/utils/object';
import { Wait, WaitStates } from '@/utils/vuewait';
import cloneDeep from 'lodash.clonedeep';

@Module({ name: 'skillds', namespaced: true })
export class SkillDS extends BaseItemDS<SkillDM> {

  public get currentSkill(): SkillDM {
    return this.items[SettingsDSModule.selectedSkillID] || {};
  }

  @Action({ rawError: true })
  async listSkills(params?: { sort?: keyof SkillDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const skills = await SkillsAPI.LIST(params)
    this.addOrReplaceItems(skills)
    return skills
  }

  @Action({ rawError: true })
  async updateSkill(skill: SkillDM) {
    const updatedSkill = await SkillsAPI.UPDATE({skill});
    this.addOrReplaceItem(updatedSkill);
  }

  @Action({ rawError: true })
  async create(params: { title: string, description: string }) {
    const skill = await SkillsAPI.CREATE({title:params.title, description:params.description});
    SettingsDSModule.setNewSkillId(skill.id)
    this.addOrReplaceItem(skill);
    return skill
  }


  @Action({ rawError: true })
  async createSpecialty({ title, skillId }: {title: string, skillId: number}) {
    const response = await SpecialtiesAPI.CREATE({title, skillId});
    const currentSkill = this.getItems[response.skillId]
    currentSkill.specialties.push(response)
    this.addOrReplaceItem(currentSkill);
    return response
  }

  @Action({ rawError: true })
  async deleteSpecialty(specialtyId: number) {
    const response = await SpecialtiesAPI.DELETE({specialtyId});
    const currentSkill = cloneDeep(this.getItems[response.skillId]);
    currentSkill.specialties = currentSkill.specialties.filter(specialty => specialty.id !== response.id)
    this.addOrReplaceItem(currentSkill);
    return response
  }

  @Action({ rawError: true })
  async deactivateSkill(skillId: number) {
    const deleteSkill = await SkillsAPI.DELETE({skillId});
    this.addOrReplaceItem(deleteSkill);
    return deleteSkill
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const skills = await SkillsAPI.LIST();
      this.addOrReplaceItems(skills);
    }
  }
}
