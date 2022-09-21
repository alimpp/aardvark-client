<template>
  <nav id="SettingsHeader">
    <!-- <CoreCheckBox
      v-if="canShowingCheckBox"
      class="check-box"
      v-model="isInactive"
    >Show Inactive</CoreCheckBox> -->
    <div class="button-container text-right">
      <CoreBtn
        v-if="canShowingButton"
        class="button"
        @click="SettingsDSModule.selectedSettingsModule !== SettingsModuleName.userProfile ? loadDialog() : updateProfile()"
        :disabled="isButtonDisabled"
      >{{buttonName}}</CoreBtn>

    </div>
  </nav>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { SettingsDSModule, DialogCSModule, ApplicationDSModule, SettingsUserProfileCSModule, SettingsHeaderCSModule } from "@/store";
import {} from "@/store/modules/datastore/applicationDS";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import InvitationForm from "@/components/Form/InvitationForm.vue";
import CreateHolidayForm from "@/components/Form/CreateHolidayForm.vue";
import CreateGroupForm from "@/components/Form/CreateGroupForm.vue";
import CreateTagForm from "@/components/Form/CreateTagForm.vue";
import CreateWorkflowForm from "@/components/Form/CreateWorkflowForm.vue";
import CreateDepartmentForm from "@/components/Form/CreateDepartmentForm.vue";
import CreateSkillForm from "@/components/Form/CreateSkillForm.vue";
import CreatePhaseForm from "@/components/Form/CreatePhaseForm.vue";
import {EventBus} from "@/utils/eventBus";
import {EVENTS} from "@/utils/constants";

@Component({
  name: "SettingsHeader",
  components: {
    CoreCheckBox,
    CoreBtn,
    InvitationForm,
    CreateHolidayForm,
    CreateGroupForm,
    CreateTagForm,
    CreateWorkflowForm,
    CreateDepartmentForm,
    CreateSkillForm,
    CreatePhaseForm,
  },
})
export default class SettingsHeader extends Vue {
  userProfileIsChanged = false;
  SettingsDSModule = SettingsDSModule
  SettingsModuleName = SettingsModuleName

  get profileDetail() {
    return SettingsUserProfileCSModule.profileDetail;
  }

  get isMobile() {
    return ApplicationDSModule.isMobileScreenSize;
  }


  get canShowingButton() {
    return (
      SettingsDSModule.selectedSettingsModule !==
        SettingsModuleName.dateAndTime &&
      SettingsDSModule.selectedSettingsModule !== SettingsModuleName.releaseNote
    );
  }

  get currentSettingsModule() {
    switch (SettingsDSModule.selectedSettingsModule) {
      case SettingsModuleName.personalCalendar:
        return "Event";
      case SettingsModuleName.defaultSettings:
        return "Company Profile";
      case SettingsModuleName.users:
        return "Users";
      case SettingsModuleName.departments:
        return "Department";
      case SettingsModuleName.groups:
        return "Channel";
      case SettingsModuleName.phases:
        return "Phase";
      case SettingsModuleName.skills:
        return "Skill";
      case SettingsModuleName.workflows:
        return "Workflow";
      case SettingsModuleName.tags:
        return "Tag";
      case SettingsModuleName.companyCalendar:
        return "Event";
      case SettingsModuleName.userProfile:
        return "Profile";
      default:
        return "";
    }
  }

  get buttonName() {
    if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.userProfile || SettingsDSModule.selectedSettingsModule === SettingsModuleName.defaultSettings) {
      return `Update ${this.currentSettingsModule}`;
    } else if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.users) {
      return `Invite New ${this.currentSettingsModule}`;
    } else {
      return `New ${this.currentSettingsModule}`;
    }
  }

  get isButtonDisabled() {
    if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.userProfile) {
      return !SettingsHeaderCSModule.formIsDirty
    }

    return false;    
  }

  updateProfile() {
    SettingsUserProfileCSModule.updateProfile()
    EventBus.$emit(EVENTS.USER_PROFILE_UPDATED, true)
    SettingsHeaderCSModule.setFormIsDirty(false)
  }

  loadDialog() {
    let content;
    let width;
    let title;
    let confirmLabel;
    switch (this.currentSettingsModule) {
      case "Users":
        content = InvitationForm;
        width = 500;
        title = "Invite New User";
        confirmLabel = "Done";
        break;
      case "Event":
        content = CreateHolidayForm;
        width = 500;
        title = "Create New Event";
        confirmLabel = "Create";
        break;
      case "Channel":
        content = CreateGroupForm;
        title = "Create New Channel";
        width = 500;
        confirmLabel = "Create";
        break;
      case "Tag":
        content = CreateTagForm;
        width = 500;
        title = "Create New Tag";
        confirmLabel = "Create";
        break;
      case "Workflow":
        content = CreateWorkflowForm;
        width = 500;
        title = "Create New Workflow";
        confirmLabel = "Create";
        break;
      case "Department":
        content = CreateDepartmentForm;
        width = 500;
        title = "Create New Department";
        confirmLabel = "Create";
        break;
      case "Skill":
        content = CreateSkillForm;
        width = 500;
        title = "Create New Skill";
        confirmLabel = "Create";
        break;
      case "Phase":
        content = CreatePhaseForm;
        width = 500;
        title = "Create New Phase";
        confirmLabel = "Create";
        break;
    }

    DialogCSModule.load({
      title: title,
      isShowingDialog: true,
      noClose: true,
      confirmLabel: confirmLabel,
      width: width,
      content,
    });
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#SettingsHeader {
  border-bottom: solid 2px $grey-color-light;
  height: 40px;
  padding: 0.5rem;
  .check-box {
    justify-self: end;
    align-self: center;
  }
  .button-container {
    justify-self: end;
    grid-column: 2;
    .button {
      height: 36px;
    }
  }
}
</style>
