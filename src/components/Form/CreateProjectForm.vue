<template>
  <form slot="default" class="form" @submit.prevent="onConfirm">
    <ValidationProvider
      slim
      class="mb-3"
      rules="projects-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        v-model.lazy="title"
        :required="required"
        :error="failed"
        placeholder="Title"
        autocomplete="create-project-title"
        ref="Input"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="projects-workflowId"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="workflow"
        :required="required"
        :error="failed"
        :options="workflows"
        placeholder="Workflow"
        listWidth="100%"
        :config="workflowConfig"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="projects-status"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="status"
        :required="required"
        :error="failed"
        :options="statuses"
        placeholder="Status"
        listWidth="100%"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="projects-managerId"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="primaryMaestro"
        :required="required"
        :error="failed"
        :options="primaryUsers"
        placeholder="Project Maestro"
        listWidth="100%"
        :config="userConfig"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="projects-secondaryManagerId"
      v-slot="{required, errors, failed}"
    >
      <CoreSelect
        v-model.lazy.trim="secondaryMaestro"
        :required="required"
        :error="failed"
        clearable
        :options="secondaryUsers"
        placeholder="Secondary Maestro"
        listWidth="100%"
        :config="userConfig"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 description"
      rules="projects-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        v-model.lazy="description"
        :required="required"
        :error="failed"
        placeholder="Description"
        autocomplete="create-project-description"
        textarea
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>
  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import UserDM from "@/datamodels/userDM";
import {CreateProjectCSModule, DialogCSModule, UserDSModule} from "@/store";
import {Roles} from '@/store/modules/datastore/permissionDS';
import {Wait, WaitStates} from "@/utils/vuewait";
import {ValidationProvider} from "vee-validate";
import DialogForm from "./Base/DialogForm.vue";
import {EventBus} from "@/utils/eventBus";
import {ANIMATION_TIMING, EVENTS} from "@/utils/constants";
import {Nullable} from "@/utils/generics";

@Component({ name: "CreateProjectForm", components: { CoreInput, CoreSelect, ValidationProvider } })
export default class CreateProjectForm extends DialogForm {

  workflowConfig = { labelKey: "title", valueKey: "id" };
  groupConfig = { labelKey: "title", valueKey: "id" };
  userConfig = { labelKey: "fullName", valueKey: "id" };

  get primaryUsers(){
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.secondaryMaestro !== user.id) ?? [];
  }
  get secondaryUsers(){
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.primaryMaestro !== user.id) ?? [];
  }

  get statuses() {
    return CreateProjectCSModule.statuses;
  }

  get title(): string {
    return CreateProjectCSModule.title;
  }
  set title(value: string) {
    CreateProjectCSModule.setTitle(value);
  }

  get workflow(): Nullable<number> {
    return CreateProjectCSModule.workflowId;
  }
  set workflow(value: Nullable<number>) {
    CreateProjectCSModule.setWorkflowId(value);
  }

  get status(): string {
    return CreateProjectCSModule.status;
  }
  set status(value: string) {
    CreateProjectCSModule.setStatus(value);
  }

  get description(): string {
    return CreateProjectCSModule.description;
  }
  set description(value: string) {
    CreateProjectCSModule.setDescription(value);
  }

  get primaryMaestro(): Nullable<number> {
    return CreateProjectCSModule.primaryMaestro;
  }
  set primaryMaestro(value: Nullable<number>) {
    CreateProjectCSModule.setPrimaryMaestro(value);
  }

  get secondaryMaestro(): Nullable<number> {
    return CreateProjectCSModule.secondaryMaestro;
  }
  set secondaryMaestro(value: Nullable<number>) {
    CreateProjectCSModule.setSecondaryMaestro(value);
  }

  get workflows() {
    return CreateProjectCSModule.workflows.filter(workflow => workflow.removedAt === '');
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    if(this.$route.name !== "ProjectsAllProjects") await this.$router.push({ name: "ProjectsAllProjects" });
    await CreateProjectCSModule.create();
    await CreateProjectCSModule.clear();
    await DialogCSModule.clear();
    // Run after dialog close animation + row enter animation finishes
    window.setTimeout(async() => EventBus.$emit(EVENTS.CREATED_NEW_PROJECT), ANIMATION_TIMING.DIALOG_CLOSE + ANIMATION_TIMING.TABLE_ROW_ENTER)
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateProjectCSModule.clear();
    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>

.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, auto);
  grid-column-gap: 8px;

  .description {
    grid-column: 2;
    grid-row: 1/7;
    height: 100%;
    &.error{
      height: calc(100% - 30px);
    }
    ::v-deep .maz-input{
      height: calc(100% - 8px);
    }
    ::v-deep textarea{
      resize: none;
      height: calc(100% - 8px);
    }
  }
}
</style>