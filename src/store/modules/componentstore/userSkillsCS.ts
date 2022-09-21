import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import UsersSkillsRow from '@/datamodels/rows/usersSkillsRow';
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import { isEmpty } from "@/utils/object";
import store, {UserSkillDSModule, UserDSModule, SkillDSModule, SettingsDSModule, UserSpecialtyDSModule, UserSkillsCSModule} from '@/store';
import { JsonParser } from "@/utils/jsonparser";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";

@Module({ name: 'userskillscs', namespaced: true, stateFactory: true })
export class UserSkillsCS extends TableSettingsCS<UsersSkillsRow>{
  isEditable: Boolean = true
  _tableSchema = [
    { id: "lead", type: "checkbox", headerType: 'text', title: "Lead", path: "lead" },
    { id: "del", type: "button", headerType: 'text', title: "Del", path: "del" },
    { id: "skill", type: "skillDropdown", headerType: 'text', title: "Skill", path: "skill", minWidth: '100px' },
    { id: "specialties", type: "skillDropdown", headerType: 'text', title: "Specialties", path: "specialties", width: '99%' },
  ]

  declare tableData: any[];
  unEditableTableSchema = [
    { id: "skill", type: "tag", headerType: 'text', title: "Skill", path: "skill", minWidth: '100px' },
    { id: "specialties", type: "tag", headerType: 'text', title: "Specialties", path: "specialties", width: '99%' },
  ]

  constructor(module: VuexModule<ThisType<UsersSkillsRow>, UsersSkillsRow>) {
    super(module);
  }
  
  get tableSchema() {
    if (this.isEditable) {
      return this._tableSchema;
    } else {
      return this.unEditableTableSchema
    }
  }

  get requestOptions() {
    return
  }

  get refreshOptions() {
    return
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Mutation
  setIsEditable(value) {
    this.isEditable = value;
  }
  @Mutation
  setDecoratedTableData(value) {
    this.tableData = value
  }

  get skills() {
    return SkillDSModule.itemsAsArray
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return { selectedUserId: state.settingsds.selectedUserID, isEditable: state.userskillscs.isEditable }
      },
      async function onChange(item) {
        const userId = item.isEditable ? item.selectedUserId : store.getters['userds/me']?.id
        await UserSkillDSModule.listSkills(userId);
        await UserSpecialtyDSModule.listSpecialties(userId);
        await UserSkillsCSModule.doLoad(true);
      }
    );

    store.watch(
      function stateToWatch(state) {
        return { user: state.userskillds.items};
      },
      async function onChange() {
        if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.users || SettingsDSModule.selectedSettingsModule === SettingsModuleName.userProfile) {
          await UserSkillsCSModule.doLoad(true)
        }
      },
      { deep: true }
    );
  }


  @Action({ rawError: true })
  async onRowCellClick(data: { id: string, row: UsersSkillsRow }) {
    switch (data.id) {
      case 'specialties':
        if (data.row.id) {
          const newSpecialtyIds = data.row.specialties;
          this.generateTableData()
          const previousTableData = this.context.state["tableData"]
          const row = previousTableData.find(x => x.id === data.row.id)
          const previousSpecialtyIds = row?.specialties?.map(specialty => specialty.id) || [];
          // @ts-ignore
          const removedSpecialties = previousSpecialtyIds?.filter(id => !newSpecialtyIds?.includes(id));
          const addedSpecialties = newSpecialtyIds?.filter(id => !previousSpecialtyIds.includes(id));
          if (addedSpecialties?.length && JSON.stringify(newSpecialtyIds) !== JSON.stringify(previousSpecialtyIds)) {
            await UserSpecialtyDSModule.grant({ specialtyID: addedSpecialties[0], userID: SettingsDSModule.selectedUserID })
          }
          if (removedSpecialties?.length && JSON.stringify(newSpecialtyIds) !== JSON.stringify(previousSpecialtyIds)) {
            await UserSpecialtyDSModule.deny({ specialtyID: removedSpecialties[0], userID: SettingsDSModule.selectedUserID })
          }
          await this.generateTableData()
        }
        break;
      case 'skill':
        if(data.row.id) {
          if ( data.row.oldSkillId && data.row?.id !== data.row.oldSkillId) {
            UserSkillsCSModule.updateSkill({newSkillId: data.row.id, oldSkillId: data.row.oldSkillId})
          }
          else if (UserSkillDSModule.items[SettingsDSModule.selectedUserID]?.find(userSkill => userSkill.id === data.row.id)) {
            this.generateTableData() 
          } else {
            UserSkillDSModule.grant({skillId: data.row.id, userId: SettingsDSModule.selectedUserID})
            this.generateTableData()
        }
      }
        break;
      case 'del':
        if (data.row.id) {
          const userId = SettingsDSModule.selectedUserID
          const skill = await UserSkillDSModule.deny({ skillId: data.row.id, userId: userId })
          if (skill) {
            const specialties = UserSpecialtyDSModule.items[userId]
            const currentSpecialties = specialties.filter(item => item.skillId === skill.id)
            currentSpecialties.forEach(specialty => {
              const index = specialties.findIndex(item => item.id === specialty.id)
              if (index !== -1) {
                specialties.splice(index, 1)
              }
            })
            UserSpecialtyDSModule.addOrReplaceItem({ id: userId, items: specialties })
          }
          this.generateTableData()
        }
        break;
      default:
        break;
    }
  }


  @Action({ rawError: true })
  onHeaderCellClick() {
    return
  }

  @Action({ rawError: true })
  private generateTableData() {
    const skills = UserSkillDSModule.items[UserDSModule.currentUser.id]
    const specialties = UserSpecialtyDSModule.items[UserDSModule.currentUser.id]
    const decoratedObject = skills?.map(skill => {
      // @ts-ignore
      const currentSpecialties = specialties?.filter(specialty => specialty.skillId === skill.id)
      return {
        // @ts-ignore
        id: skill.id,
        del: '',
        skill: skill,
        specialties: currentSpecialties
      }
    })
    if (this.isEditable) {
      // @ts-ignore
      decoratedObject?.push({ id: 0, del: '', skill: { id: 0 }, specialties: [] })
    }
    const data = JsonParser.deserializeArray(decoratedObject || [], UsersSkillsRow)
    this.setDecoratedTableData(data)
  }


  @Action({ rawError: true })
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      await this.generateTableData()
      const decoratedList = this.context.state["tableData"]
      const data = JsonParser.deserializeArray(decoratedList, UsersSkillsRow)
      this.doSetRows(data)
    }
  }

  @Action({ rawError: true })
  async updateSkill(data) {
    await UserSkillDSModule.updateSkill(data)
  }

  @Action({ rawError: true })
  updateSelectedEntity() {
    return
  }

}
