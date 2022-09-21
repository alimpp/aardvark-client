<template>
  <form slot="default" class="mb-3 form" @submit.prevent="onConfirm">
    <ValidationProvider rules="sprints-name" v-slot="{failed, errors, required}">
      <CoreInput
        :required="required"
        :error="failed"
        v-model="name"
        placeholder="Sprint Name"
        autocomplete="create-sprint-name"
        ref="Input"
        clearable
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>
    <div class="backlog">
      <ValidationProvider>
        <CoreCheckBox class="check-box" v-model="isBacklog">Backlog</CoreCheckBox>
      </ValidationProvider>
      <ValidationProvider :rules="{'required': isBacklog}" v-slot="{failed}">
        <CorePicker
          ref="picker"
          v-model="returnToTriageDate"
          placeholder="Return To Triage"
          formatted="L"
          noHeader
          noFooter
          noTime
          autoClose
          :disabled="isDisabled"
          :minDate="minDate"
          :error="failed"
        />
      </ValidationProvider>
    </div>
  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import DialogForm from "./Base/DialogForm.vue";
import {CreateSprintCSModule, DialogCSModule} from "@/store";
import {ValidationProvider} from "vee-validate";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import moment from "moment";
import {EventBus} from "@/utils/eventBus";
import {EVENTS} from "@/utils/constants";
import { Ref } from "vue-property-decorator";
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { dateISOFormat } from "@/utils/date";
import { Wait, WaitStates } from "@/utils/vuewait";

extend('required', required)

@Component({
  name: "CreateSprintForm",
  components: {CoreInput, ValidationProvider, CoreCheckBox, CorePicker},
})
export default class CreateSprintForm extends DialogForm {
  @Ref('picker') picker!: CorePicker;

  public get name(): string {
    return CreateSprintCSModule.name;
  }

  public set name(name: string) {
    CreateSprintCSModule.setName(name);
  }

  public get returnToTriageDate(): string {
    return CreateSprintCSModule.returnToTriage;
  }

  public set returnToTriageDate(date: string) {
    CreateSprintCSModule.setReturnToTriage(dateISOFormat(date));
  }

  get isBacklog() {
    return CreateSprintCSModule.isBacklog
  }
  set isBacklog(val: boolean) {
    CreateSprintCSModule.setIsBacklog(val);
    val ? this.picker.openPicker() : this.picker.closePicker();
  }

  get isDisabled() {
    return !this.isBacklog
  }

  get minDate(): string {
    return moment().startOf('day').add(1, 'day').format("YYYY-MM-DD");
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    try {
      await CreateSprintCSModule.create();
      EventBus.$emit(EVENTS.CREATED_NEW_SPRINT, CreateSprintCSModule.sprint);
    }
    finally{
      this.onBeforeClosed();
    }
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    CreateSprintCSModule.clear();
    DialogCSModule.clear();
    EventBus.$off(EVENTS.CREATED_NEW_SPRINT);

    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-row-gap: 20px;
  .backlog {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }
}
</style>