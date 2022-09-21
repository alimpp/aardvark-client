import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ name: "settingsds", namespaced: true })
export class SettingsDS extends VuexModule implements ISettingsDS {
  selectedSettingsModule = "";
  selectedHolidayID = 0;
  selectedTagID = 0;
  selectedSkillID = 0;
  selectedWorkflowID = 0;
  selectedPhaseID = 0;
  selectedGroupID = 0
  selectedUserID = 0;
  selectedDepartmentID = 0
  newTagId = 0;
  newWorkflowId = 0;
  newSkillId = 0;
  newGroupId = 0; 
  newDepartmentId = 0;
  newPhaseId = 0;
  newHolidayId = 0

  @Mutation
  setSelectedSettingsModule(value: SettingsModuleName) {
    this.selectedSettingsModule = value;
  }

  @Mutation
  setSelectedHolidayId(value: number) {
    this.selectedHolidayID = value
  }

  @Mutation
  setSelectedTagId(value: number) {
    this.selectedTagID = value
  }

  @Mutation
  setSelectedSkillId(value: number) {
    this.selectedSkillID = value
  }

  @Mutation
  setSelectedWorkflowId(value: number) {
    this.selectedWorkflowID = value
  }

  @Mutation
  setSelectedPhaseId(value: number) {
    this.selectedPhaseID = value
  }

  @Mutation
  setSelectedUserId(value = 0) {
    this.selectedUserID = value
  }

  @Mutation
  setSelectedGroupId(value: number) {
    this.selectedGroupID = value
  }

  @Mutation
  setSelectedDepartmentId(value: number) {
    this.selectedDepartmentID = value
  }

  @Mutation
  setNewTagId(value: number) {
    this.newTagId = value
  }

  @Mutation
  setNewWorkflowId(value: number) {
    this.newWorkflowId = value
  }  
  
  @Mutation
  setNewSkillId(value: number) {
    this.newSkillId = value
  }  
  
  @Mutation
  setNewGroupId(value: number) {
    this.newGroupId = value
  }

  @Mutation
  setNewDepartmentId(value: number) {
    this.newDepartmentId = value
  }

  @Mutation
  setNewPhaseId(value: number) {
    this.newPhaseId = value
  }  
  
  @Mutation
  setNewHolidayId(value: number) {
    this.newHolidayId = value
  }

}

export enum SettingsModuleName {
  userProfile = "userProfile",
  dateAndTime = "dateAndTime",
  personalCalendar = "personalCalendar",
  defaultSettings = "defaultSettings",
  users = "users",
  departments = "departments",
  groups = "groups",
  phases = "phases",
  skills = "skills",
  workflows = "workflows",
  tags = "tags",
  companyCalendar = "companyCalendar",
  releaseNote = "Release Note"
}

export interface ISettingsDS {
  selectedSettingsModule: string
  selectedHolidayID: number
  selectedTagID: number
  selectedSkillID: number
  selectedWorkflowID: number
  selectedPhaseID: number
  selectedGroupID: number
  selectedDepartmentID: number
  selectedUserID: number
}
