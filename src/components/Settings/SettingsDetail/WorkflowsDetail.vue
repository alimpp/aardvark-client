<template>
  <SimpleBar class="xeba-scrollbar max-height-moduletab-content">
    <ValidationObserver
      slim
      ref="observer"
      v-slot="{handleSubmit}"
    >
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        class="p-2 d-flex flex-column"
        autocomplete="off"
      >
        <ValidationProvider
          slim
          class="mb-3"
          v-slot="{failed, errors, required}"
        >
          <CoreInput :required="required" 
            v-model="workflowName"
            :error="failed"
            placeholder="Workflow Name"
            class="mb-3"
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
        >
          <CoreInput :required="required" 
            v-model="workflowDescription"
            :error="failed"
            placeholder="Description"
            textarea
            class="mb-3"
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
            v-model="workflowIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Workflow</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled()"
          :loading="$wait.is(waitState.ACTION_WORKFLOW_LOADING)"
        >Save</CoreBtn>
        <CoreDraggableList
          v-model="phaseList"
          v-slot="{item}"
          itemKey="order"
          header
          :headerValue="phaseHeaderValue"
          headerActionButton
          :onHeaderAction="addPhase"
          @input="updatePhases()"
          :disabled="isDisabled"
        >
          <div class="space-between w-100 align-items-center">
            <CoreBtn
              size="mini"
              :loading="$wait.is(waitState.ACTION_DELETE_PHASE_LOADING)"
              @click="deletePhase(item)"
            >X</CoreBtn>
            <p>
              {{ item.order }}
            </p>
            <p>
              {{ item.id }}
            </p>
            <p>
              {{ item.title }}
            </p>
          </div>
        </CoreDraggableList>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";``
import CoreInput from "@/components/Core/CoreInput.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import Vue from "vue";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import WorkflowDM from "@/datamodels/workflowDM";
import { WorkflowDetailCSModule, DialogCSModule, WorkflowDSModule } from "@/store";
import SimpleBar from "simplebar-vue";
import CoreDraggableList from "@/components/Core/CoreDraggableList.vue";
import AddPhaseForm from "@/components/Form/AddPhaseForm.vue";
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "WorkflowsDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    CorePicker,
    SimpleBar,
    CoreDraggableList,
  },
})
export default class WorkflowsDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  @State("workflowDetail", { namespace: "workflowdetailcs" })
  workflowDetail!: WorkflowDM;
  isRemoved = false;
  orderedPhaseList: any = []
  waitState = WaitStates;

  @Watch("workflowDetail")
  onWorkflowDetailChange() {
    this.isRemoved = WorkflowDetailCSModule.workflowDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  public get workflowId(): number {
    return WorkflowDetailCSModule.workflowDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.workflowId;
  }

  public get phaseList() {
    const activePhases = WorkflowDetailCSModule?.workflowDetail?.phases?.filter(workflowPhase => WorkflowDetailCSModule?.phases?.some(phase => !phase.isSystem && phase.removedAt === '' && workflowPhase.id === phase.id)) || [];
    const decoratedPhaseList = activePhases?.map((phase, index) => ({ ...phase, order: index + 1, workflowId: WorkflowDetailCSModule.workflowDetail.id }))
    return decoratedPhaseList || []
    
  }
  public set phaseList(value) {
    this.orderedPhaseList = value.filter(phase => !phase.isSystem).map((value, index) => ({...value, order: index + 1, workflowId: WorkflowDetailCSModule.workflowDetail.id}))
    WorkflowDetailCSModule.workflowDetail.phases = this.orderedPhaseList
  }

  get phaseHeaderValue() {
    return WorkflowDetailCSModule.phaseHeaderValue;
  }

  public get workflowName() {
    return WorkflowDetailCSModule.workflowDetail?.title;
  }
  public set workflowName(value: string) {
    WorkflowDetailCSModule.workflowDetail.title = value;
  }

  public get workflowDescription() {
    return WorkflowDetailCSModule.workflowDetail?.description;
  }
  public set workflowDescription(value: string) {
    WorkflowDetailCSModule.workflowDetail.description = value;
  }

  public get workflowIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set workflowIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      WorkflowDetailCSModule.workflowDetail.removedAt = null;
    }
  }

  async updatePhases() {
    await WorkflowDetailCSModule.removePhases(this.orderedPhaseList);
    await WorkflowDetailCSModule.addPhases(this.orderedPhaseList);
  }

  addPhase() {
    DialogCSModule.load({
      title: "Add Phase To Workflow",
      isShowingDialog: true,
      noClose: true,
      confirmLabel: "Add",
      width: 500,
      content: AddPhaseForm,
      persistent: true,
    });
  }

  @Wait(WaitStates.ACTION_DELETE_PHASE_LOADING)
  async deletePhase(phase) {
    await WorkflowDetailCSModule.removePhases([phase])
  }

  isButtonDisabled() {
    return this.$refs.observer
      ? !this.isRemoved && !this.isFormDirty()
      : true;
  }

  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(
      (key) => this.$refs.observer.fields[key].dirty
    );
  }

  async onSubmit() {
    const workflowIsChange = JSON.stringify(WorkflowDetailCSModule.workflowDetail) !== JSON.stringify(WorkflowDSModule.currentWorkflow)
    if (this.isFormDirty() && (WorkflowDetailCSModule.workflowDetail.removedAt === null || workflowIsChange)) WorkflowDetailCSModule.updateWorkflow();
    if (WorkflowDetailCSModule.workflowDetail.removedAt === '' && this.isRemoved ) WorkflowDetailCSModule.deactivateWorkflow();
  }
}
</script>

<style lang="scss" scoped>
</style>
