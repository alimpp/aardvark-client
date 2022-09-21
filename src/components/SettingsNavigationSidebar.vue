<template>
  <div id="SettingsNavigationSidebar">
    <CoreSidebar
      :width="180"
      :no-close-btn="!isMobileScreenSize"
      v-model.lazy="isSidebarOpen"
      id="SettingsSidebar"
    >
      <CoreScrollbar id="core-scrollbar" class="maz-py-1 maz-flex maz-direction-column" size="thin" suppressScrollX showOnHover>
        <div
          v-if="canViewUserSettings"
          class="maz-flex maz-align-center maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid"
        >
          <b>User Settings</b>
        </div>
        <CoreBtn
          v-if="canViewUserSettingsUserProfile"
          color="transparent"
          justify-start
          @click="userProfileClick"
          :active="userProfileSelected"
          no-shadow
        >
          User Profile
        </CoreBtn>
        <CoreBtn
          v-if="canViewUserSettingsDateAndTimeSettings"
          color="transparent"
          justify-start
          @click="dateAndTimeClick"
          :active="dateAndTimeSelected"
          no-shadow
        >
          Date & time Settings
        </CoreBtn>
        <CoreBtn
          v-if="canViewUserSettingsPersonalCalendar"
          color="transparent"
          justify-start
          @click="personalCalendarClick"
          :active="personalCalendarSelected"
          no-shadow
        >
          Personal Calendar
        </CoreBtn>
        <div
          v-if="canViewAccountSettings"
          class="maz-flex maz-align-center maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid"
        >
          <b>Account Settings</b>
        </div>
        <CoreBtn
          v-if="canViewAccountSettingsDefaultSettings"
          color="transparent"
          justify-start
          @click="defaultSettingsClick"
          :active="defaultSettingsSelected"
          no-shadow
        >Default Settings</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsCompanyCalendar"
          color="transparent"
          justify-start
          @click="companyCalendarClick"
          :active="companyCalendarSelected"
          no-shadow
        >Company Calendar</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsUsers"
          color="transparent"
          justify-start
          @click="usersClick"
          :active="usersSelected"
          no-shadow
        >Users</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsDepartments"
          color="transparent"
          justify-start
          @click="departmentsClick"
          :active="departmentsSelected"
          no-shadow
        >Departments</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsGroups"
          color="transparent"
          justify-start
          @click="groupsClick"
          :active="groupsSelected"
          no-shadow
        >Channels</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsPhases"
          color="transparent"
          justify-start
          @click="phasesClick"
          :active="phasesSelected"
          no-shadow
        >Phases</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsSkills"
          color="transparent"
          justify-start
          @click="skillsClick"
          :active="skillsSelected"
          no-shadow
        >Skills</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsWorkflows"
          color="transparent"
          justify-start
          @click="workflowsClick"
          :active="workflowsSelected"
          no-shadow
        >Workflows</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsTags"
          color="transparent"
          justify-start
          @click="tagsClick"
          :active="tagsSelected"
          no-shadow
        >Tags</CoreBtn>
        <CoreBtn
          v-if="canViewAccountSettingsReleaseNote"
          color="transparent"
          justify-start
          @click="releaseNoteClick"
          :active="releaseNoteSelected"
          no-shadow
        >Release Note
        </CoreBtn>
      </CoreScrollbar>
    </CoreSidebar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { PermissionDSModule, SettingsDSModule } from "@/store";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { State } from "vuex-class";
import CoreSidebar from "@/components/Core/CoreSidebar.vue";
import { Actions, Subjects } from "@/store/modules/datastore/permissionDS";
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";

@Component({
  name: "SettingsNavigationSidebar",
  components: { CoreSidebar, CoreBtn, CoreScrollbar },
})
export default class SettingsNavigationSidebar extends Vue {
  @State("isMobileScreenSize", { namespace: "applicationds" })
  isMobileScreenSize!: boolean;
  isSidebarOpen = true;

  @Watch("isMobileScreenSize")
  onMobileScreenSizeChange(newState: boolean, oldState: boolean): void {
    if (typeof oldState === "undefined") { 
      return;
    }
    if (!newState && oldState) {
      this.isSidebarOpen = true
    }
  }

  userProfileClick() {
    if (
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.userProfile
    ) {
      this.$router.push({ path: "user-profile" });
    }
  }

  dateAndTimeClick() {
    if (
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.dateAndTime
    ) {
      this.$router.push({ name: "DateAndTime" });
    }
  }

  personalCalendarClick() {
    if (
      SettingsDSModule.selectedSettingsModule !==
      SettingsModuleName.personalCalendar
    ) {
      this.$router.push({ name: "PersonalCalendar" });
    }
  }

  defaultSettingsClick() {
    if (
      SettingsDSModule.selectedSettingsModule !==
      SettingsModuleName.defaultSettings
    ) {
      this.$router.push({ name: "DefaultSettings" });
    }
  }

  companyCalendarClick() {
    if (
      SettingsDSModule.selectedSettingsModule !==
      SettingsModuleName.companyCalendar
    ) {
      this.$router.push({ name: "CompanyCalendar" });
    }
  }

  usersClick() {
    if (SettingsDSModule.selectedSettingsModule !== SettingsModuleName.users) {
      this.$router.push({ name: "Users" });
    }
  }

  departmentsClick() {
    if (
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.departments
    ) {
      this.$router.push({ name: "Departments" });
    }
  }

  groupsClick() {
    if (SettingsDSModule.selectedSettingsModule !== SettingsModuleName.groups) {
      this.$router.push({ name: "Groups" });
    }
  }

  phasesClick() {
    if (SettingsDSModule.selectedSettingsModule !== SettingsModuleName.phases) {
      this.$router.push({ name: "Phases" });
    }
  }

  skillsClick() {
    if (SettingsDSModule.selectedSettingsModule !== SettingsModuleName.skills) {
      this.$router.push({ name: "Skills" });
    }
  }

  workflowsClick() {
    if (
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.workflows
    ) {
      this.$router.push({ name: "Workflows" });
    }
  }

  tagsClick() {
    if (SettingsDSModule.selectedSettingsModule !== SettingsModuleName.tags) {
      this.$router.push({ name: "Tags" });
    }
  }

  releaseNoteClick() {
    if (
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.releaseNote
    ) {
      this.$router.push({ name: "ReleaseNote" });
    }
  }

  get userProfileSelected() {
    return (
      SettingsDSModule.selectedSettingsModule == SettingsModuleName.userProfile
    );
  }

  get departmentsSelected() {
    return (
      SettingsDSModule.selectedSettingsModule == SettingsModuleName.departments
    );
  }

  get dateAndTimeSelected() {
    return (
      SettingsDSModule.selectedSettingsModule == SettingsModuleName.dateAndTime
    );
  }

  get personalCalendarSelected() {
    return (
      SettingsDSModule.selectedSettingsModule ==
      SettingsModuleName.personalCalendar
    );
  }

  get defaultSettingsSelected() {
    return (
      SettingsDSModule.selectedSettingsModule ==
      SettingsModuleName.defaultSettings
    );
  }

  get companyCalendarSelected() {
    return (
      SettingsDSModule.selectedSettingsModule ==
      SettingsModuleName.companyCalendar
    );
  }

  get usersSelected() {
    return SettingsDSModule.selectedSettingsModule == SettingsModuleName.users;
  }

  get groupsSelected() {
    return SettingsDSModule.selectedSettingsModule == SettingsModuleName.groups;
  }

  get phasesSelected() {
    return SettingsDSModule.selectedSettingsModule == SettingsModuleName.phases;
  }

  get skillsSelected() {
    return SettingsDSModule.selectedSettingsModule == SettingsModuleName.skills;
  }

  get workflowsSelected() {
    return (
      SettingsDSModule.selectedSettingsModule == SettingsModuleName.workflows
    );
  }

  get tagsSelected() {
    return SettingsDSModule.selectedSettingsModule == SettingsModuleName.tags;
  }

  get releaseNoteSelected() {
    return (
      SettingsDSModule.selectedSettingsModule == SettingsModuleName.releaseNote
    );
  }

  get canViewUserSettings() {
    return PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_USER);
  }

  get canViewAccountSettings() {
    return PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT);
  }

  get canViewUserSettingsUserProfile() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_USER_USERPROFILE
      ) && this.canViewUserSettings
    );
  }

  get canViewUserSettingsDateAndTimeSettings() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_USER_DATEANDTIMESETTINGS
      ) && this.canViewUserSettings
    );
  }

  get canViewUserSettingsPersonalCalendar() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_USER_PERSONALCALENDAR
      ) && this.canViewUserSettings
    );
  }

  get canViewAccountSettingsDefaultSettings() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_ACCOUNT_DEFAULTSETTINGS
      ) && this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsCompanyCalendar() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_ACCOUNT_COMPANYCALENDAR
      ) && this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsUsers() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_USERS) &&
      this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsDepartments() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_ACCOUNT_DEPARTMENTS
      ) && this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsGroups() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_GROUPS) &&
      this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsPhases() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_PHASES) &&
      this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsSkills() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_SKILLS) &&
      this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsWorkflows() {
    return (
      PermissionDSModule.can(
        Actions.VIEW,
        Subjects.SETTINGS_ACCOUNT_WORKFLOWS
      ) && this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsTags() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_TAGS) &&
      this.canViewAccountSettings
    );
  }

  get canViewAccountSettingsReleaseNote() {
    return (
      PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS_ACCOUNT_RELEASENOTE) &&
      this.canViewAccountSettings
    );
  }
}
</script>

<style lang="scss">
@import "src/assets/scss/variables";
#SettingsSidebar {
    z-index: 1020 !important;
    transition-timing-function: linear;
    transition-duration: 0.2s;
    background-color: var(--light-color);
    b {
      color: $brand-color;
      padding: 10px;
    }
    div#core-scrollbar > button[type="button"].maz-btn[id^="CoreBtn-"] {
      margin: 8px 8px 0 8px;
      padding: 4px 2px;
      &:hover {
        background-color: var(--primary-color);
      }
    }
    .maz-active {
      box-shadow: var(--navigation-sidebar-btn-selected-border);
      background-color: var(--primary-color);
    }
  }
</style>
