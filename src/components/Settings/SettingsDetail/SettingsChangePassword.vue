<template>
  <div class="change-password-scroll">
    <ValidationObserver
      id="ChangePassword"
      v-slot="{invalid, handleSubmit, dirty}"
      ref="observer"
      slim
    >
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        class="d-flex flex-column"
        autocomplete="off"
      >
        <div class="change-password d-flex flex-column maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid">
          <span class="mb-3">Change Password</span>
          <ValidationProvider
            slim
            class="mb-3"
            v-slot="{failed, errors, required}"
            rules="members-password"
          >
            <CoreInput
              :required="required"
              v-model="currentPassword"
              :class="[{'error': failed}]"
              :error="failed"
              placeholder="Old Password"
              type="password"
            />
            <div class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider
            class="mb-3"
            v-slot="{failed, errors, required}"
            rules="members-password"
            name="confirm"
          >
            <CoreInput
              :required="required"
              :error="failed"
              v-model="password"
              placeholder="New Password"
              type="password"
            />
            <div class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider
            class="mb-3"
            v-slot="{failed, errors, required}"
            rules="members-password|password:@confirm"
          >
            <CoreInput
              :required="required"
              :error="failed"
              v-model="confirmPassword"
              placeholder="Repeat New Password"
              type="password"
            />
            <div class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <CoreBtn
            class="mb-3"
            :disabled="!dirty || invalid"
            @click="changePassword"
            :loading="$wait.is(waitState.ACTION_PASSWORD_LOADING)"
          >Save</CoreBtn>
        </div>
        <div class="mode-box p-2 pb-3 maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid">
            <span class="pb-3">Theme</span>
            <div  class="d-flex ">
              <span class="material-icons"> {{darkMode?  "nights_stay" : "light_mode"}} </span>
              <span class="py-1 px-2"> {{darkMode?  "Dark Mode" : "Light Mode"}}</span>                    
            </div>
            <MazSwitch v-model="darkMode" class="mt-3" />
        </div>       
        <SimpleBar class="xeba-scrollbar user-sessions">
          <span>User Sessions</span>
          <div
            v-for="session in sessions"
            :key="session.id"
            class="d-flex justify-content-between align-items-center"
          >
            <div class="mb-3">
              <p class="m-0">{{session.info.os}} {{session.info.machine}} - {{session.info.remoteAddress}}</p>
              <p class="m-0">{{session.info.agent.substr(0, session.info.agent.indexOf(' '))}} - {{moment(dateISOFormat(session.info.lastActivity)).fromNow()}}</p>
            </div>

            <CoreBtn
              fab
              color="transparent"
              class="shadow-none delete-session"
              @click="deleteSession(session.id)"
            >
              <i class="material-icons">
                close
              </i>
            </CoreBtn>
          </div>
        </SimpleBar>

      </form>
    </ValidationObserver>
  </div>


</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import CoreInput from "@/components/Core/CoreInput.vue";
import { SettingsChangePasswordCSModule, ProfileDSModule } from "@/store";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import moment from "moment";
import SimpleBar from "simplebar-vue";
import { dateISOFormat } from "@/utils/date";
import { extend } from "vee-validate";
import {WaitStates} from "@/utils/vuewait";
import { MazSwitch } from "maz-ui";

extend("password", {
  params: ["target"],
  // @ts-ignore
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match",
});

@Component({
  name: "SettingsChangePassword",
  components: {
    CoreInput,
    CoreBtn,
    ValidationObserver,
    ValidationProvider,
    SimpleBar,
    MazSwitch
  },
})
export default class SettingsChangePassword extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  moment = moment;
  dateISOFormat = dateISOFormat;
  waitState = WaitStates;

  get darkMode() {
    return ProfileDSModule.isDarkMode;
  }
  set darkMode(value: boolean) {
    ProfileDSModule.setDarkMode(value);
  }

  get sessions() {
    return SettingsChangePasswordCSModule.sessions|| [];
  }
  get currentPassword() {
    return SettingsChangePasswordCSModule.currentPassword;
  }
  set currentPassword(value) {
    SettingsChangePasswordCSModule.setCurrentPassword(value);
  }

  get password() {
    return SettingsChangePasswordCSModule.password;
  }
  set password(value) {
    SettingsChangePasswordCSModule.setPassword(value);
  }

  get confirmPassword() {
    return SettingsChangePasswordCSModule.confirmPassword;
  }
  set confirmPassword(value) {
    SettingsChangePasswordCSModule.setConfirmPassword(value);
  }

  async changePassword() {
    await SettingsChangePasswordCSModule.changePassword();
    this.clearForm();
  }

  clearForm() {
    this.$refs.observer.reset();
    SettingsChangePasswordCSModule.setConfirmPassword("");
    SettingsChangePasswordCSModule.setPassword("");
    SettingsChangePasswordCSModule.setCurrentPassword("");
  }

  async beforeMount() {
    await SettingsChangePasswordCSModule.listSessions();
  }

  deleteSession(sessionId: string) {
    SettingsChangePasswordCSModule.deleteSessions(sessionId)
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/scss/variables";
.change-password-scroll {
  height: 100vh;
  .user-sessions {
    max-height: 400px;
    p {
      font-size: 12px;
    }
  }
  .delete-session i {
    font-size: 1.5rem;
    color: var(----maz-text-color);
    cursor: pointer;

    &:hover {
      font-weight: bold;
    }
  }
}
.mode-box{
    display: flex;
    flex-direction: column;
}
</style>