<template>
  <ValidationObserver
    id="DefaultSettings"
    slim
  >
    <form
      @submit.prevent="handleSubmit(onSubmit)"
      autocomplete="off"
      class="main-container"
    >
      <div class="content d-flex">
        <div class="maestro-setting mr-5">
          <h5 class="mb-3">Maestro Default Settings</h5>
          <div>
            <label for="">Average Working Hours Per Day</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
            </div>

          </div>
          <div>
            <label for="">[Good News]Triage-Response Time</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>

            </div>

          </div>
          <div>
            <label for="">[Bad News]Overdue Triage-Response Time</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
                <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
                <span class="hours ml-2">Hours</span>
              </ValidationProvider>
            </div>

          </div>
          <div>
            <label for="">[Bad News]Delayed Nuggets-Response Time</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
            </div>

          </div>
          <div>
            <label for="">[Bad News]Overdue Estimate-Response Time</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
            </div>

          </div>
          <div class="mt-5">
            <label for="">Average Working Hours Per Day</label>
            <div class="d-flex mt-1">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Min"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Max"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{failed, errors, required}"
              >
                <CoreInput
                  :required="required"
                  :error="failed"
                  placeholder="Default"
                  type="number"
                />
                <div
                  v-if="failed"
                  class="text-danger text-left mt-2"
                >{{errors[0]}}</div>
              <span class="hours ml-2">Hours</span>
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div class="date-setting ml-5">
          <h5 class="mb-4">Date & Time Settings</h5>
          <div class="d-flex">
            <ValidationProvider
              slim
              class="mr-5"
              v-slot="{required}"
            >
              <CoreSelect
                :required="required"
                class="time-zone"
                v-model="timeZone"
                placeholder="Time Zone"
                :options="timeZones"
                :config="configs.timeZones"
              />
            </ValidationProvider>
            <div class="d-flex flex-column">
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{required}"
              >
                <CoreSelect
                  :required="required"
                  v-model="dateFormat"
                  placeholder="Date Format"
                  :options="dateFormats"
                  :config="configs.dateFormats"
                />
              </ValidationProvider>
              <ValidationProvider
                slim
                class="mb-3 d-flex align-items-center"
                v-slot="{required}"
              >
                <CoreSelect
                  :required="required"
                  v-model="timeFormat"
                  placeholder="Time Format"
                  :options="timeFormats"
                  :config="configs.timeFormats"
                />
              </ValidationProvider>
            </div>
          </div>

        </div>
      </div>
        <SimpleBar class="xeba-scrollbar form">
          <h5 class="mb-3">Company Profile</h5>
          <div class="d-flex mb-3">
            <CoreAvatar
              :src="profileUrl"
              :username="accountName"
              :size="100"
              class="avatar mr-3"
            />
            <ValidationProvider
              slim
              v-slot="{failed, required}"
            >
              <CoreInput
                :required="required"
                :error="failed"
                placeholder="Company Name"
                ref="estimate"
              />
            </ValidationProvider>
          </div>
          <ValidationProvider
            slim
                class="mb-3 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="Address"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="City"
              ref="estimate"
            />
          </ValidationProvider>
          <div class="d-flex mb-3">
            <ValidationProvider
              slim
              class="mr-3"
              v-slot="{failed, required}"
            >
              <CoreInput
                :required="required"
                :error="failed"
                placeholder="Country/Region"
                ref="estimate"
              />
            </ValidationProvider>
            <ValidationProvider
              slim
              v-slot="{failed, required}"
            >
              <CoreInput
                :required="required"
                :error="failed"
                placeholder="Postal Code"
                ref="estimate"
              />
            </ValidationProvider>
          </div>
          <ValidationProvider
            slim
            class="mb-3 mt-5 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="Billing Contact Name"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="Maestro UserID"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="E-mail"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="Phone"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 mt-5 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              placeholder="Billing Method"
              ref="estimate"
            />
          </ValidationProvider>
          <ValidationProvider
            slim
            class="mb-3 mt-5 d-flex align-items-center"
            v-slot="{failed, required}"
          >
            <CoreInput
              :required="required"
              :error="failed"
              ref="estimate"
            />
          </ValidationProvider>
        </SimpleBar>
    </form>
  </ValidationObserver>

</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CoreInput from "@/components/Core/CoreInput.vue";
import { SettingsDefaultSettingsCSModule, AccountDSModule, ProfileDSModule } from "@/store";
import SimpleBar from "simplebar-vue";

@Component({
  name: "SettingsDefaultSettings",
  components: {
    CoreAvatar,
    CoreSelect,
    ValidationObserver,
    ValidationProvider,
    CoreInput,
    SimpleBar
  },
})
export default class SettingsDefaultSettings extends Vue {
  date = "";
  zone = 0;
  time = "";
  configs = {
    timeZones: { labelKey: "label", valueKey: "label" },
    timeFormats: { labelKey: "label", valueKey: "value" },
    dateFormats: { labelKey: "label", valueKey: "value" },
  };

  get profileUrl() {
    return ProfileDSModule.profileUrl
  }

  get accountName() {
    return AccountDSModule.selectedAccount.name;
  }

  public get dateFormats() {
    return SettingsDefaultSettingsCSModule.dateFormats;
  }

  public get timeFormats() {
    return SettingsDefaultSettingsCSModule.timeFormats;
  }

  public get timeZones() {
    return SettingsDefaultSettingsCSModule.timeZones;
  }

  public get timeZone() {
    return this.zone;
  }
  public set timeZone(value) {
    this.zone = value;
  }

  public get timeFormat() {
    return this.time;
  }
  public set timeFormat(value) {
    this.time = value;
  }

  public get dateFormat() {
    return this.date;
  }
  public set dateFormat(value) {
    this.date = value;
  }
}
</script>
<style lang="scss" scoped>
.maestro-setting {
  ::v-deep input {
    width: 70px;
  }
  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .hours {
    display: flex;
    align-items: center;
    height: 50px;
    align-self: center;
    margin-right: 50px;
    margin-left: 5px;
  }
}
.date-setting {
  .time-zone {
    max-height: 45.7px;
  }
}
.avatar {
  border-radius: 5px;
  justify-self: center;
  ::v-deep .vue-avatar--wrapper {
    border-radius: 0 !important;
    width: 100px !important;
    height: 100px !important;
  }
}
</style>
