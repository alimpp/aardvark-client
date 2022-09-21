<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >
    <ValidationProvider
      slim
      class="mb-3"
      rules="required"
      v-slot="{failed, errors, required}"
      name="Phase"
    >
      <CoreSelect :required="required"
        list-width="100%"
        :error="failed"
        v-model="phase"
        placeholder="Phases"
        :options="phases"
        :config="phaseConfig"
        multiple
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
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { DialogCSModule, WorkflowDetailCSModule,AddPhaseCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import PhaseDM from "@/datamodels/phaseDM";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "AddPhaseForm",
  components: { ValidationProvider, CoreSelect },
})
export default class AddPhaseForm extends DialogForm {
  phaseConfig = { labelKey: "title", valueKey: "id" };

  get phase() {
    const activePhase = AddPhaseCSModule?.workflowDetail?.phases?.filter(workflowPhase =>  AddPhaseCSModule?.phases?.some(phase => !phase.isSystem && phase.removedAt === '' && workflowPhase.id === phase.id));
    return activePhase.map(phase => phase.id) || []

  }
  set phase(values: number[]) {
    const newPhases: PhaseDM[] = [];
    if(values !== null) {
      for(const value of values) {
        for(const phase of AddPhaseCSModule.phases!){
          if(value === phase.id) {
            newPhases.push(phase);
          }
        }
      }
    }
    AddPhaseCSModule.workflowDetail.phases = newPhases;
  }

  get phases() {
    return AddPhaseCSModule.phases?.filter(phase => !phase.isSystem && phase.removedAt === '') || []
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    const phases = AddPhaseCSModule.workflowDetail.phases.map((phase, index) => ({ ...phase, order: index + 1, workflowId: AddPhaseCSModule.workflowDetail.id }))
    await AddPhaseCSModule.addPhases(phases);
    DialogCSModule.clear();
  }

  onOpened() {
    this.phase = WorkflowDetailCSModule.workflowDetail?.phases.map(phase => phase.id)
  }

  onBeforeClosed() {
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
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 8px;
  ::v-deep.maz-select__tags {
    .material-icons {
      display: none;
    }
  }
}
</style>