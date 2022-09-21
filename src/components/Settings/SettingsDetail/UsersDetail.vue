<template>
  <SimpleBar class="xeba-scrollbar">
    <div class="max-height-moduletab-content">
      <ValidationObserver
        slim
        ref="observer"
        v-slot="{invalid, handleSubmit, dirty}"
      >
        <form
          class="form d-flex flex-column"
          @submit.prevent="handleSubmit(onSubmit)"
          autocomplete="off"
        >
          <div class="user-info d-flex flex-row">
            <div class="user-avatar d-flex flex-column mr-2">
              <CoreAvatar
                :username="fullName"
                :src="profileUrl"
                :size="100"
                class="avatar mb-4"
              />
              <ValidationProvider
                slim
                class="mb-3"
                v-slot="{failed, errors, required}"
              >
                <CoreInput :required="required"
                  list-width="100%"
                  :error="failed"
                  placeholder="Birthday"
                  :value="birth"
                  readonly
                  :disabled="isDisabled"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left"
                >{{errors[0]}}</div>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3"
                v-slot="{failed, errors, required}"
              >
                <CoreInput :required="required"
                  :error="failed"
                  placeholder="User Since"
                  :value="createdAt"
                  readonly
                  :disabled="isDisabled"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left"
                >{{errors[0]}}</div>
              </ValidationProvider>
            </div>
            <div class="inputs d-flex flex-row">
              <div class="d-flex flex-column mr-2">
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="User Id"
                    :value="username"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="First Name"
                    :value="firstName"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="Social Media"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreSelect :required="required"
                    :error="failed"
                    placeholder="Department"
                    list-width="100%"
                    :options="departmentOptions"
                    v-model="currentDepartment"
                    :config="configs.departmentOptions"
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
              </div>
              <div class="d-flex flex-column">
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="Email"
                    :value="email"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="Last Name"
                    :value="lastName"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="Location"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
                <ValidationProvider
                  slim
                  class="mb-3"
                  v-slot="{failed, errors, required}"
                >
                  <CoreInput :required="required"
                    :error="failed"
                    placeholder="Phone"
                    :value="phone"
                    readonly
                    :disabled="isDisabled"
                  />
                  <div
                    v-if="failed"
                    class="text-danger text-left"
                  >{{errors[0]}}</div>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors, required}"
          >
            <CoreSelect :required="required"
              list-width="100%"
              :options="roleOptions"
              :config="configs.roleOptions"
              v-model="roles"
              :error="failed"
              placeholder="Roles"
              multiple
              clearable
              :disabled="isDisabled"
            />
            <div
              v-if="failed"
              class="text-danger text-left"
            >{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-5"
            v-slot="{failed, errors, required}"
          >
            <CoreSelect :required="required"
              list-width="100%"
              :options="groupOptions"
              :config="configs.groupOptions"
              v-model="groups"
              :error="failed"
              placeholder="Private Channels"
              multiple
              clearable
              :disabled="isDisabled"
            />
            <div
              v-if="failed"
              class="text-danger text-left"
            >{{errors[0]}}</div>
          </ValidationProvider>
          <CoreBtn
            type="submit"
            block
            :disabled="!dirty || invalid"
            :loading="$wait.is(waitState.ACTION_USER_LOADING)"
          >Save</CoreBtn>
        </form>
      </ValidationObserver>
      <div class="user-table">
        <UserSkills />
      </div>
    </div>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {
  UserDetailCSModule,
  AccountDSModule,
  UserSkillsCSModule,
  SettingsDSModule,
  UserGroupDSModule,
  GroupDSModule
} from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import Vue from "vue";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import GroupDM from "@/datamodels/groupDM";
import UserDM from "@/datamodels/userDM";
import SimpleBar from "simplebar-vue";
import { Roles } from '@/store/modules/datastore/permissionDS';
import UserSkills from "@/components/Settings/UserSkills.vue";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import dayjs from "dayjs";
import { GROUP_TYPE } from '@/utils/constants';
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "UsersDetail",
  components: {
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar,
    CoreAvatar,
    UserSkills,
  },
})
export default class UsersDetail extends Vue {
  @State("userDetail", { namespace: "userdetailcs" }) userDetail!: UserDM;
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  configs = {
    groupOptions: { valueKey: "id", labelKey: "title" },
    roleOptions: { valueKey: "id", labelKey: "title" },
    departmentOptions: {valueKey: "id", labelKey: "name"}
  };

  initialDepartment = 0;
  currentDepartment = 0;
  waitState = WaitStates;

  @Watch("userDetail")
  onUserDetailChange() {
    this.$refs.observer.reset();
    if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.users) {
      this.initialDepartment = UserDetailCSModule.userDepartment?.department  ? UserDetailCSModule.userDepartment.department.id : 0;
      this.currentDepartment = UserDetailCSModule.userDepartment?.department  ? UserDetailCSModule.userDepartment.department.id : 0;
    }
  }

  public get userId(): number {
    return UserDetailCSModule.userDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.userId;
  }

  public get profileUrl() {
    return UserDetailCSModule.userDetail?.profileUrl;
  }

  public get birth() {
    if (UserDetailCSModule.userDetail?.birth !== "") {
      return dayjs(UserDetailCSModule.userDetail?.birth).format("L");
    } else {
      return "";
    }
  }

  public get createdAt() {
    const date = dayjs(UserDetailCSModule.userDetail?.createdAt).format("L");
    return date;
  }

  public get username() {
    return UserDetailCSModule.userDetail?.username;
  }

  public get firstName() {
    return UserDetailCSModule.userDetail?.firstName;
  }

  public get lastName() {
    return UserDetailCSModule.userDetail?.lastName;
  }

   public get fullName(){
    return UserDetailCSModule.userDetail?.fullName;
  }

  public get email() {
    return UserDetailCSModule.userDetail?.email;
  }

  public get phone() {
    return UserDetailCSModule.userDetail?.phone;
  }

  public get groupOptions() {
    const userGroups = UserGroupDSModule.items[UserDetailCSModule.userDetail.referenceId]?.filter(userGroup => UserDetailCSModule?.groups?.some(group => group.removedAt !== '' && userGroup.id === group.id)) || [];
    const activeGroups = UserDetailCSModule.groups?.filter(group => group.removedAt === '') || []
    return userGroups.concat(activeGroups)
  }


  public get departmentOptions() {
    return UserDetailCSModule.departments;
  }

  async setDepartment(value: number) {
    let newDepartment;
    if (value !== null) {
        for (const item of UserDetailCSModule.departments) {
          if (value === item.id) {
            newDepartment = item;
          }
        }
    }
    return newDepartment ;
  }

  public get groups(): number[] {
    const organizationGroups = UserDetailCSModule.userGroups?.filter(
      (group) => group.organizationId === AccountDSModule.selectedAccount.id && group.type !== GROUP_TYPE.PUBLIC
    );
    return organizationGroups?.map((group) => group.id) || [];
  }
  public set groups(values: number[]) {
    const newGroups: GroupDM[] = [];
    if (values !== null) {
      for (const value of values) {
        for (const group of UserDetailCSModule.groups!) {
          if (value === group.id) {
            newGroups.push(group);
          }
        }
      }
    }
    UserDetailCSModule.setUserGroups(newGroups);
  }

  public get roleOptions() {
    return UserDetailCSModule.memberRoles;
  }

  public get roles(): Roles[] {
    return UserDetailCSModule.userDetail?.organizationRoles || [];
  }
  public set roles(values: Roles[]) {
    UserDetailCSModule.userDetail.organizationRoles = values;
  }

  @Wait(WaitStates.ACTION_USER_LOADING)
  async onSubmit() {
    await Promise.all([
      await UserDetailCSModule.updateRoles(),
      await UserDetailCSModule.updateGroups()
    ]);

    if(this.currentDepartment && this.initialDepartment !== this.currentDepartment){
      const department = await this.setDepartment(this.currentDepartment);
      await UserDetailCSModule.updateDepartment(department)
    }
    this.onUserDetailChange();
  }
  activated() {
    UserSkillsCSModule.setIsEditable(true);
  }
}
</script>

<style lang="scss" scoped>

.user-table {
  ::v-deep .scroll-content {
    max-height: 390px;
  }
  ::v-deep .tracking-table__scroll-content {
    min-height: 390px;
  }
}


</style>
