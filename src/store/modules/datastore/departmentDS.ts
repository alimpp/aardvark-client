import DepartmentsAPI from '@/api/departmentsAPI';
import DepartmentDM from '@/datamodels/departmentDM';
import { isEmpty } from '@/utils/object';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import store, { DepartmentDSModule, SettingsDSModule } from '@/store';
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({ name: 'departmentds', namespaced: true })
export class DepartmentDS extends BaseItemDS<DepartmentDM> {

  public get currentDepartment(): DepartmentDM {
    return this.items[SettingsDSModule.selectedDepartmentID] || {};
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const departments = await DepartmentsAPI.LIST();
      this.addOrReplaceItems(departments);
    }
  }

  @Action({ rawError: true })
  async listDepartments(params?: { sort?: keyof DepartmentDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: { [key: string]: (string | number)[] } }) {
    const departments = await DepartmentsAPI.LIST(params)
    this.addOrReplaceItems(departments)
    return departments
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedSettingsModule
      },
      async function onChange() {
        if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.users) {
          await DepartmentDSModule.doLoad();
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return { departmentId: state.settingsds.selectedDepartmentID, tabName: state.settingsds.selectedSettingsModule }
      },
      async function onChange({departmentId, tabName}) {
        const selectedDepartmentMembers = DepartmentDSModule.items[SettingsDSModule.selectedDepartmentID]?.members.length
        if (departmentId !== 0 && tabName === SettingsModuleName.departments && !selectedDepartmentMembers) {
          await DepartmentDSModule.listMembers(departmentId);
        }
      }
    );
  }

  @Action({ rawError: true })
  async updateDepartment(department: DepartmentDM) {
    const departmentMembers = department.members
    const updatedDepartment = await DepartmentsAPI.UPDATE({department})
    updatedDepartment.members = departmentMembers
    this.addOrReplaceItem(updatedDepartment)
    return updatedDepartment
  }

  @Action({ rawError: true })
  async deactivateDepartment(departmentId: number) {
    const deletedDepartment = await DepartmentsAPI.DELETE({departmentId});
    const departmentMembers = this.items[SettingsDSModule.selectedDepartmentID].members
    deletedDepartment.members = departmentMembers
    this.addOrReplaceItem(deletedDepartment);
    return deletedDepartment
  }

  @Action({ rawError: true })
  async create(title: string) {
    const department = await DepartmentsAPI.CREATE({name: title});
    SettingsDSModule.setNewDepartmentId(department.id)
    this.addOrReplaceItem(department);
    return department
  }

  @Action({ rawError: true })
  async listMembers(departmentId: number) {
    const members = await DepartmentsAPI.LIST_MEMBERS({departmentId});
    const newDepartment = this.items[departmentId]
    newDepartment.members = members
    this.addOrReplaceItem(newDepartment)
  }

  @Action({ rawError: true })
  async updateMembers(department: DepartmentDM) {
    const newMemberIds = department.members.map(member => member.id);
    const previousMemberIds = this.currentDepartment.members.map(member => member.id);

    const removedMembers: number[] = previousMemberIds.filter(id => !newMemberIds.includes(id));
    const addedMembers: number[] = newMemberIds.filter(id => !previousMemberIds.includes(id));

    if (addedMembers.length || removedMembers.length) {
      await DepartmentsAPI.PATCH_MEMBERS({departmentId: department.id, memberIdsToAdd: addedMembers, memberIdsToRemove: removedMembers});
    }
  }

}
