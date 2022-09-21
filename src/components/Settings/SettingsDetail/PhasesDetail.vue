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
        >
          <CoreInput :required="required" 
            v-model="phaseName"
            :error="failed"
            placeholder="Phase Name"
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
          v-slot="{failed, required}"
        >
          <CoreSelect :required="required" 
            list-width="100%"
            v-model="associatedSkill"
            placeholder="Associated Skill"
            :error="failed"
            :options="skills"
            :config="configs.skills"
            :disabled="isDisabled"
          />
        </ValidationProvider>
        <ValidationProvider slim class="flex-grow-1 mb-3" v-slot="{failed, errors}">
            <CoreInput   class="description" :class="[{'error': failed}]" v-model="description" placeholder="Description" :error="failed" textarea />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>
        <ValidationProvider
          slim
          class="mb-3"
        >
          <CoreCheckBox
            class="mb-3"
            v-model="phaseIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Phase</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled()"
          :loading="$wait.is(waitState.ACTION_PHASE_LOADING)"
        >Save</CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import Vue from "vue";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import { PhaseDetailCSModule, PhaseDSModule } from "@/store";
import PhaseDM from "@/datamodels/phaseDM";
import {Wait, WaitStates} from "@/utils/vuewait";
import SimpleBar from "simplebar-vue";

@Component({
  name: "PhasesDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    CorePicker,
    SimpleBar
  },
})
export default class PhasesDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };

  @State("phaseDetail", { namespace: "phasedetailcs" }) phaseDetail!: PhaseDM;

  @Watch("phaseDetail")
  onPhaseDetailChange() {
    this.isRemoved = PhaseDetailCSModule.phaseDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  isRemoved = false;
  waitState = WaitStates;

  configs = {
    skills: { labelKey: "title", valueKey: "id" },
  };

  public get phaseId(): number {
    return PhaseDetailCSModule.phaseDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.phaseId;
  }


  public get skills() {
    const phaseSkill = PhaseDetailCSModule.skills?.filter(skill => skill.removedAt !== '' && skill.id === PhaseDetailCSModule?.phaseDetail?.skillId)
    const activeSkills = PhaseDetailCSModule.skills?.filter(skill => skill.removedAt === '') || []
    return phaseSkill?.concat(activeSkills)
  }

  public get description(): string {
    if(PhaseDetailCSModule.phaseDetail?.description){
      return PhaseDetailCSModule.phaseDetail?.description.toString();
    }
    return '' ;
  }
  public set description(value: string) {
    PhaseDetailCSModule.phaseDetail.description = value;
  }

  public get phaseName() {
    return PhaseDetailCSModule.phaseDetail?.title;
  }
  public set phaseName(value: string) {
    PhaseDetailCSModule.phaseDetail.title = value;
  }

  public get associatedSkill() {
    return PhaseDetailCSModule.phaseDetail?.skillId || 0;
  }
  public set associatedSkill(value: number) {
    PhaseDetailCSModule.phaseDetail.skillId = value;
  }

  public get phaseIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set phaseIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      PhaseDetailCSModule.phaseDetail.removedAt = null;
    }
  }

  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty() : true
  }
  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_PHASE_LOADING)
  async onSubmit() {
    const phaseIsChange = JSON.stringify(PhaseDetailCSModule.phaseDetail) !== JSON.stringify(PhaseDSModule.currentPhase)
    if (this.isFormDirty() && (PhaseDetailCSModule.phaseDetail.removedAt === null || phaseIsChange)) await PhaseDetailCSModule.updatePhase();
    if (PhaseDetailCSModule.phaseDetail.removedAt === '' && this.isRemoved) await PhaseDetailCSModule.deactivatePhase();
  }
}
</script>

<style lang="scss" scoped>
</style>
