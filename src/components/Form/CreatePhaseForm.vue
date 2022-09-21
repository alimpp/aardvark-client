<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="phases-title"
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
      v-slot="{failed, required}"
    >
      <CoreSelect :required="required"
        list-width="100%"
        v-model="skill"
        placeholder="Associated Skill"
        :error="failed"
        :options="skills"
        :config="configs.skills"
      />
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 flex-grow-1 description"
      rules="phases-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        :error="failed"
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
import { CreatePhaseCSModule, DialogCSModule, PhaseDetailCSModule, SettingsPhasesCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "CreatePhaseForm",
  components: { CoreInput, ValidationProvider, CoreSelect },
})
export default class CreatePhaseForm extends DialogForm {
  configs = {
    skills: { labelKey: "title", valueKey: "id" },
  };

  public get skills() {
    return PhaseDetailCSModule.skills?.filter(skill => skill.removedAt === '');
  }

  get title(): string {
    return CreatePhaseCSModule.title;
  }
  set title(value: string) {
    CreatePhaseCSModule.setTitle(value);
  }

  get skill(): number {
    return CreatePhaseCSModule.skillId;
  }
  set skill(value: number) {
    CreatePhaseCSModule.setSkill(value);
  }

  get description(): string {
    return CreatePhaseCSModule.description;
  }
  set description(value: string) {
    CreatePhaseCSModule.setDescription(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreatePhaseCSModule.create();
    CreatePhaseCSModule.clear();
    DialogCSModule.clear();
    await SettingsPhasesCSModule.doLoad(true)
    await SettingsPhasesCSModule.selectNewPhaseRow()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreatePhaseCSModule.clear();

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
