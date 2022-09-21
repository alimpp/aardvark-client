<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="holidays-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput :required="required"
        :error="failed"
        v-model="title"
        placeholder="Name"
        ref="Input"
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
      rules="holidays-startDate"
    >
      <CorePicker
        v-model="startDate"
        placeholder="Start Date"
        formatted='L'
        :minDate="minStartDate"
        noHeader
        noFooter
        noTime
        autoClose
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
      rules="holidays-endDate"
    >
      <CorePicker
        v-model="endDate"
        placeholder="End Date"
        formatted='L'
        :minDate="minEndDate"
        noHeader
        noFooter
        noTime
        autoClose
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
      rules="holidays-repeat"
    >
      <CoreSelect
        :required="required"
        :error="failed"
        list-width="100%"
        v-model="repeat"
        placeholder="Repeat"
        :options="RepeatOptions"
        :config="configs.repeat"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { ApplicationDSModule, CreateHolidayCSModule, DialogCSModule, SettingsCompanyCalendarCSModule, SettingsDSModule, SettingsPersonalCalendarCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import { dateISOFormat } from "@/utils/date";
import {DAYS_OF_WEEK} from "@/utils/constants";
import { SettingsModuleName } from '@/store/modules/datastore/settingsDS'
import { today } from "@/utils/date";
import { ModuleName } from "@/store/modules/datastore/applicationDS";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "CreateHolidayForm",
  components: { CoreInput, CoreSelect, ValidationProvider, CorePicker },
})
export default class CreateHolidayForm extends DialogForm {
  RepeatOptions = [
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Never", value: "never" },
  ];

  configs = {
    repeat: { labelKey: "label", valueKey: "value" },
  };

  get title(): string {
    return CreateHolidayCSModule.title;
  }
  set title(value: string) {
    CreateHolidayCSModule.setTitle(value);
    if (DAYS_OF_WEEK.map(day => SettingsDSModule.selectedSettingsModule === SettingsModuleName.personalCalendar ? `${day.name}-personal-wide`.toLowerCase() : `${day.name}-company-wide`.toLowerCase()).indexOf(value.toLowerCase()) > -1) {
      DialogCSModule.setDisableConfirmButton(true);
    } else {
      DialogCSModule.setDisableConfirmButton(false);
    }
  }

  get startDate(): string {
    return CreateHolidayCSModule.startDate;
  }
  set startDate(value: string) {
    CreateHolidayCSModule.setStartDate(dateISOFormat(value));
  }

  get endDate(): string {
    return CreateHolidayCSModule.endDate;
  }
  set endDate(value: string) {
    CreateHolidayCSModule.setEndDate(dateISOFormat(value));
  }

  public get minEndDate(): string {
    return this.startDate
      ? this.startDate
      : this.minStartDate;
  }

  public get minStartDate(): string {
    return today;
  }

  get repeat(): string {
    return CreateHolidayCSModule.repeat;
  }
  set repeat(value: string) {
    CreateHolidayCSModule.setRepeat(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreateHolidayCSModule.create();
    CreateHolidayCSModule.clear();
    DialogCSModule.clear();

    if(ApplicationDSModule.selectedModule === ModuleName.settings){
      if(this.$route.name === "PersonalCalendar"){
        await SettingsPersonalCalendarCSModule.doLoad(true)
        await SettingsPersonalCalendarCSModule.selectNewPersonalHoliday()
      }else if(this.$route.name === "CompanyCalendar"){
        await SettingsCompanyCalendarCSModule.doLoad(true)
        await SettingsCompanyCalendarCSModule.selectNewCompanyHoliday()
      }
    }
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    CreateHolidayCSModule.clear();
    DialogCSModule.clear();

    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-column-gap: 8px;
}
</style>
