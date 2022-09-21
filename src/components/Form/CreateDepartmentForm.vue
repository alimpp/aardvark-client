<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="departments-name"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        v-model="title"
        placeholder="Name"
        :error="failed"
        ref="Input"
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
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { CreateDepartmentCSModule, DialogCSModule, SettingsDepartmentsCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "CreateDepartmentForm",
  components: { CoreInput, ValidationProvider },
})
export default class CreateDepartmentForm extends DialogForm {
  get title(): string {
    return CreateDepartmentCSModule.title;
  }
  set title(value: string) {
    CreateDepartmentCSModule.setTitle(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreateDepartmentCSModule.create();
    CreateDepartmentCSModule.clear();
    DialogCSModule.clear();
    await SettingsDepartmentsCSModule.doLoad(true)
    await SettingsDepartmentsCSModule.selectNewDepartment()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateDepartmentCSModule.clear();
    
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
