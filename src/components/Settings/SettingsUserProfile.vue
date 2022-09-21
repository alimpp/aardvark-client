<template>
  <ValidationObserver
    id="UserProfile"
    slim
    ref="observer"
  >
    <div class="main-container">
      <CoreScrollbar size="thin" suppressScrollX showOnHover>
      <form
        class="content h-100"
        autocomplete="off"
        @input="onFormChange"
      >
        <div class="user-avatar">
          <ProfilePictureEditor class="d-flex justify-content-center"></ProfilePictureEditor>
          <label
            for=""
            class="align-self-end"
          >Date of birth</label>
          <div class="user-birth">
            <ValidationProvider
              slim
              v-slot="{failed, errors, required}"
            >
              <CoreSelect
                :required="required"
                list-width="100%"
                :options="dayOptions"
                v-model="day"
                :config="configs.dayOptions"
                :error="failed"
                placeholder="Date"
                @input="onFormChange"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              v-slot="{failed, errors, required}"
            >
              <CoreSelect
                :required="required"
                list-width="100%"
                :options="monthOptions"
                :config="configs.monthOptions"
                v-model="month"
                :error="failed"
                placeholder="Month"
                @input="onFormChange"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              v-slot="{failed, errors, required}"
            >
              <CoreSelect
                :required="required"
                list-width="100%"
                :error="failed"
                :options="yearOptions"
                v-model="year"
                :config="configs.yearOptions"
                placeholder="Year"
                @input="onFormChange"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
          </div>
        </div>
        <div class="user-information">
          <div class="left-side d-flex flex-column">
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
              rules="members-firstName"
            >
              <CoreInput
                :required="required"
                v-model="firstName"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="First Name"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
            >
              <CoreInput
                :required="required"
                v-model="userId"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="User Name"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors}"
            >
              <CoreTagsInput
                value=''
                :tags="department"
                placeholder="Department"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
            >
              <CoreInput
                :required="required"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="Social Media"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
            >
              <CoreTagsInput
                value=''
                :tags="roles"
                placeholder="Roles"
                disabled
              />
            </ValidationProvider>
          </div>
          <div class="right-side d-flex flex-column">
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
              rules="members-lastName"
            >
              <CoreInput
                :required="required"
                v-model="lastName"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="Last Name"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
            >
              <CoreInput
                :required="required"
                v-model="email"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="Email"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
              rules="members-phone"
            >
              <MazPhoneNumberInput
                :required="required"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="phone"
                noExample
                @update="updatedPhone = $event"
                v-model="phone"
                :default-country-code="countryCode"
                :default-phone-number="phoneNumber"
                class="phone"
                noValidation
                @input="onFormChange"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors, required}"
            >
              <CoreInput
                :required="required"
                :class="[{'error': failed}]"
                :error="failed"
                placeholder="City"
                disabled
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>

            <ValidationProvider
              slim
              class="mb-3"
              v-slot="{failed, errors}"
            >
              <CoreTagsInput
                value=""
                :tags="groups"
                placeholder="Channels"
                disabled
                class="group-input"
              />
              <div
                v-if="failed"
                class="text-danger text-left mt-2"
              >{{errors[0]}}</div>
            </ValidationProvider>
          </div>
        </div>
        <div class="user-table">
          <UserSkills />
        </div>
      </form>
      </CoreScrollbar>

      <ChangePasswordForm class="form"/>

    </div>
  </ValidationObserver>

</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Getter } from "vuex-class";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import {
  SettingsUserProfileCSModule,
  UserSkillsCSModule,
  SettingsDSModule,
  SettingsHeaderCSModule,
  AccountDSModule,
  UserGroupDSModule
} from "@/store";
import { MazPhoneNumberInput } from "maz-ui";
import CoreTagsInput from "@/components/Core/CoreTagsInput.vue";
import { MazInputTags } from "maz-ui";
import { Watch } from "vue-property-decorator";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import ChangePasswordForm from "@/components/Settings/SettingsDetail/SettingsChangePassword.vue";
import ProfilePictureEditor from "@/components/Settings/ProfilePictureEditor.vue";
import UserSkills from "@/components/Settings/UserSkills.vue";
import { EventBus } from "@/utils/eventBus";
import { EVENTS } from "@/utils/constants";
import { State } from "vuex-class";
import UserDM from "@/datamodels/userDM";
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";
import { dateISOFormat } from "@/utils/date";

@Component({
  name: "SettingsUserProfile",
  components: {
    MazInputTags,
    CoreAvatar,
    CoreSelect,
    ValidationObserver,
    ValidationProvider,
    CoreInput,
    CoreTable,
    MazPhoneNumberInput,
    CoreTagsInput,
    CoreBtn,
    ChangePasswordForm,
    ProfilePictureEditor,
    UserSkills,
    CoreScrollbar
  },
})
export default class SettingsUserProfile extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  day = null;
  month = null;
  year = null;
  updatedPhone;
  SettingsDSModule = SettingsDSModule;

  @Getter("profileUrl", { namespace: "profileds" }) profileUrl:
    | string
    | undefined;
  @Getter("fullName", { namespace: "profileds" }) fullName!: string;
  @State("profileDetail", { namespace: "settingsuserprofilecs" })
  profileDetail!: UserDM;

  @Watch("birth", { immediate: true })
  onBirthChange(newValue) {
    if (newValue) {
      SettingsUserProfileCSModule.profileDetail.birth = dateISOFormat(newValue);
    }
  }

  configs = {
    yearOptions: { labelKey: "label", valueKey: "label" },
    monthOptions: { labelKey: "title", valueKey: "id" },
    dayOptions: { labelKey: "label", valueKey: "label" },
    groupOptions: { valueKey: "id", labelKey: "title" },
  };

  get firstName() {
    return SettingsUserProfileCSModule.profileDetail?.firstName;
  }
  set firstName(value) {
    SettingsUserProfileCSModule.profileDetail.firstName = value;
  }

  get userId() {
    return SettingsUserProfileCSModule.profileDetail?.username;
  }

  get lastName() {
    return SettingsUserProfileCSModule.profileDetail?.lastName;
  }
  set lastName(value) {
    SettingsUserProfileCSModule.profileDetail.lastName = value;
  }

  get email() {
    return SettingsUserProfileCSModule.profileDetail?.email;
  }

  get phoneNumber() {
    if (SettingsUserProfileCSModule.profileDetail?.phone) {
      return SettingsUserProfileCSModule.profileDetail?.phone.toString();
    } else {
      return "";
    }
  }

  get countryCode() {
    return (
      SettingsUserProfileCSModule.countries.find(
        (country) =>
          country.countryCallingCodes ===
          SettingsUserProfileCSModule.profileDetail?.countryCode
      )?.alpha2 || ""
    );
  }

  get phone() {
    if (
      SettingsUserProfileCSModule.profileDetail.countryCode &&
      SettingsUserProfileCSModule.profileDetail.phone
    ) {
      return `${SettingsUserProfileCSModule.profileDetail.countryCode}${SettingsUserProfileCSModule.profileDetail.phone}`;
    } else return "";
  }
  set phone(value) {
    if (value) {
      SettingsUserProfileCSModule.profileDetail.phone =
        this.updatedPhone.nationalNumber;
      SettingsUserProfileCSModule.profileDetail.countryCode = `+${this.updatedPhone.countryCallingCode}`;
    }
  }

  get department() {
    return SettingsUserProfileCSModule.userDepartment?.department ?  [{ text: `${SettingsUserProfileCSModule.userDepartment.department.name}`  }] : []
  }

  public get roles() {
    return SettingsUserProfileCSModule.profileDetail?.organizationRoles.map(
      (role) => ({ text: `${role.removeUnderscore()}` })
    );
  }

  public get groups() {
    return UserGroupDSModule.items[SettingsUserProfileCSModule.profileDetail.referenceId]?.filter(group => group.organizationId === AccountDSModule.selectedAccount.id).map((group) => ({
      text: `${group.title}`,
    }));
  }

  public get yearOptions() {
    return SettingsUserProfileCSModule.years;
  }

  public get monthOptions() {
    return SettingsUserProfileCSModule.months;
  }

  public get dayOptions() {
    return SettingsUserProfileCSModule.days;
  }

  public get groupOptions() {
    return SettingsUserProfileCSModule.groups;
  }

  get birth() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  parseBirth(birth) {
    const pattern = /(\d+)-(\d+)-(\d+)/;
    const matched = birth ? birth.match(pattern) : null;
    if (matched) {
      this.year = matched[1];
      this.month = matched[2];
      this.day = matched[3];
    } else {
      this.year = null;
      this.month = null;
      this.day = null;
    }
  }

  onFormChange() {
    const isFormDirty = Object.keys(this.$refs.observer.fields).some(
      (key) =>
        this.$refs.observer.fields[key].dirty &&
        this.$refs.observer.fields[key].valid
    );
    SettingsHeaderCSModule.setFormIsDirty(isFormDirty);
  }

  async beforeMount() {
    await SettingsUserProfileCSModule.doLoad();
  }

  async activated() {
    SettingsDSModule.setSelectedUserId(
      SettingsUserProfileCSModule.profileDetail.id
    );
    this.parseBirth(SettingsUserProfileCSModule.profileDetail.birth);
    UserSkillsCSModule.setIsEditable(false);
    EventBus.$on(EVENTS.USER_PROFILE_UPDATED, (value) => {
      if (value) {
        this.$refs.observer.reset();
      }
    });
  }

  deactivated() {
    EventBus.$off(EVENTS.USER_PROFILE_UPDATED);
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: calc(100vh - 49px - 1.1rem - 4.5rem) !important;
  grid-template-columns: 3fr 6fr;
  grid-template-rows: 450px auto;
  .user-avatar {
    display: grid;
    grid-template-rows: 170px 40px auto;
    .avatar {
      border-radius: 5px;
      justify-self: center;
      ::v-deep .vue-avatar--wrapper {
        border-radius: 0 !important;
        width: 180px !important;
        height: 180px !important;
      }
    }
    .user-birth {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .user-information {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 0 8px 0 8px;
    column-gap: 10px;
    ::v-deep .ti-tags {
      .ti-actions {
        display: none;
      }
    }
    .group-input {
      z-index: 0;
    }
    .phone {
      ::v-deep .is-disabled {
        .maz-input__input {
          border-color: transparent !important;
          background-color: var(--btn-disabled-background-color) !important;
        }
      }
    }
  }
  .user-table {
    grid-column: 1 / -1;
    max-height: 300px;
    .table {
      ::v-deep .table-title {
        min-width: inherit;
      }
    }
  }
}
</style>