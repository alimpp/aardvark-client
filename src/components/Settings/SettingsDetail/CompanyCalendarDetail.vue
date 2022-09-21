<template>
  <SimpleBar class="xeba-scrollbar max-height-moduletab-content">
    <ValidationObserver
      slim
      ref="observer"
      v-slot="{handleSubmit}"
    >
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        class="d-flex flex-column"
        autocomplete="off"
      >
        <ValidationProvider
          slim
          class="mb-3"
          v-slot="{failed, errors, required}"
          rules="holidays-title"
        >
          <CoreInput 
            :error="failed"  
            :required="required" 
            v-model="holidayTitle"
            placeholder="Name"
            :disabled="isDisabled"
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
            v-model="holidayStartDate"
            placeholder="Start Date"
            formatted='L'
            :minDate="minStartDate"
            noHeader
            noFooter
            noTime
            autoClose
            :disabled="isDisabled"
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
            v-model="holidayEndDate"
            placeholder="End Date"
            formatted='L'
            :minDate="minEndDate"
            noHeader
            noFooter
            noTime
            autoClose
            :disabled="isDisabled"
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
          <CoreSelect :required="required" 
            list-width="100%"
            v-model="holidayRepeat"
            :error="failed"
            placeholder="Repeat"
            :options="RepeatOptions"
            :config="configs.repeat"
            :disabled="isDisabled"
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
          <CoreCheckBox
            class="mb-3"
            v-model="holidayIsDeleted"
            :disabled="isDisabled"
          >Delete This Holiday</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled() || isDisableCreateButton"
          :loading="$wait.is(waitState.ACTION_HOLIDAY_LOADING)"
        >Save</CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { CompanyCalendarDetailCSModule, HolidayDSModule } from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import SimpleBar from "simplebar-vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import { dateISOFormat, today } from "@/utils/date";
import Vue from "vue";
import { State } from "vuex-class";
import HolidayDM from "@/datamodels/holidayDM";
import { Watch } from "vue-property-decorator";
import {DAYS_OF_WEEK} from "@/utils/constants";
import dayjs from "dayjs";
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "CompanyCalendarDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar,
    CorePicker,
  },
})
export default class CompanyCalendarDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  configs = {
    repeat: { labelKey: "label", valueKey: "value" },
  };
  RepeatOptions = [
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
    { label: "Never", value: "never" },
  ];
  isRemoved = false;
  isDisableCreateButton = false;
  waitState = WaitStates;

  @State("holidayDetail", { namespace: "companycalendardetailcs" })
  holidayDetail!: HolidayDM;

  @Watch("holidayDetail")
  onHolidayDetailChange() {
    this.isRemoved = CompanyCalendarDetailCSModule.holidayDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  public get companyCalendarId(): number {
    return CompanyCalendarDetailCSModule.holidayDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.companyCalendarId;
  }

  get moduleName(): SettingsModuleName {
    return SettingsModuleName.companyCalendar;
  }

  public get holidayTitle() {
    return CompanyCalendarDetailCSModule.holidayDetail?.title;
  }
  public set holidayTitle(value: string) {
    CompanyCalendarDetailCSModule.holidayDetail.title = value;
    if (DAYS_OF_WEEK.map(day => `${day.name}-company-wide`.toLowerCase()).indexOf(value.toLowerCase()) > -1) this.isDisableCreateButton= true;
    else this.isDisableCreateButton= false;
  }

  public get holidayStartDate() {
    return CompanyCalendarDetailCSModule.holidayDetail?.startDate;
  }
  public set holidayStartDate(value: string) {
    CompanyCalendarDetailCSModule.holidayDetail.startDate = dateISOFormat(
      value
    );
  }

  public get holidayEndDate() {
    return CompanyCalendarDetailCSModule.holidayDetail?.endDate;
  }
  public set holidayEndDate(value: string) {
    CompanyCalendarDetailCSModule.holidayDetail.endDate = dateISOFormat(value);
  }

  public get holidayRepeat() {
    return CompanyCalendarDetailCSModule.holidayDetail?.repeat || "";
  }
  public set holidayRepeat(value: string) {
    CompanyCalendarDetailCSModule.holidayDetail.repeat = value;
  }

  public get holidayIsDeleted(): boolean {
    return this.isRemoved
  }
  public set holidayIsDeleted(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      CompanyCalendarDetailCSModule.holidayDetail.removedAt = null;
    }
  }

  public get minStartDate(): string {
    return today;
  }

  public get minEndDate(): string {
    return (this.holidayStartDate && dayjs(this.holidayStartDate).isAfter(today)) ? this.holidayStartDate : today; 
  }


  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty() : true
  }

  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_HOLIDAY_LOADING)
  async onSubmit() {
    const holidayIsChange = JSON.stringify(CompanyCalendarDetailCSModule.holidayDetail) !== JSON.stringify(HolidayDSModule.currentHoliday)
    if (this.isFormDirty() && (CompanyCalendarDetailCSModule.holidayDetail.removedAt === null || holidayIsChange)) await CompanyCalendarDetailCSModule.updateHoliday();
    if (!HolidayDSModule.currentHoliday.removedAt && this.isRemoved) await CompanyCalendarDetailCSModule.deleteHoliday();
  }
}
</script>

<style lang="scss" scoped>
</style>
