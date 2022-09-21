<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="workflows-title"
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
      class="mb-3 flex-grow-1 description"
      rules="workflows-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput :required="required"
        class="description"
        v-model="description"
        placeholder="Description"
        textarea
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
import { CreateWorkflowCSModule, DialogCSModule, SettingsWorkflowsCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "CreateWorkflowForm",
  components: { CoreInput, ValidationProvider },
})
export default class CreateWorkflowForm extends DialogForm {
  get title(): string {
    return CreateWorkflowCSModule.title;
  }
  set title(value: string) {
    CreateWorkflowCSModule.setTitle(value);
  }

  get description(): string {
    return CreateWorkflowCSModule.description;
  }
  set description(value: string) {
    CreateWorkflowCSModule.setDescription(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreateWorkflowCSModule.create();
    CreateWorkflowCSModule.clear();
    DialogCSModule.clear();
    await SettingsWorkflowsCSModule.doLoad(true)
    await SettingsWorkflowsCSModule.selectNewWorkFlowRow()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateWorkflowCSModule.clear();

    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 8px;
}
</style>
