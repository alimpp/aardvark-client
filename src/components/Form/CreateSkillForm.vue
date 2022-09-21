<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="skills-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        :error="failed"
        v-model.lazy="title"
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
      rules="skills-description"
      v-slot="{failed,  errors, required}"
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
import { CreateSkillCSModule, DialogCSModule, SettingsSkillsCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import { Wait, WaitStates } from "@/utils/vuewait";


@Component({
  name: "CreateSkillForm",
  components: { CoreInput, ValidationProvider },
})
export default class CreateSkillForm extends DialogForm {
  get title(): string {
    return CreateSkillCSModule.title;
  }
  set title(value: string) {
    CreateSkillCSModule.setTitle(value);
  }

  get description(): string {
    return CreateSkillCSModule.description;
  }
  set description(value: string) {
    CreateSkillCSModule.setDescription(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreateSkillCSModule.create();
    CreateSkillCSModule.clear();
    DialogCSModule.clear();
    await SettingsSkillsCSModule.doLoad(true)
    await SettingsSkillsCSModule.selectNewSkillRow()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateSkillCSModule.clear();

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