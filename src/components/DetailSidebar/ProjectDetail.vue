<template>
  <SimpleBar class="xeba-scrollbar core-scrollbar">
    <ValidationObserver
      slim
      ref="observer"
      v-slot="{invalid, handleSubmit, dirty}"
    >
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        class="p-2 max-height-moduletab-content d-flex flex-column overflow-y-auto"
        autocomplete="off"
      >
      <!-- Name input -->

        <ValidationProvider
          v-if="canReadTitle"
          slim
          class="mb-3"
          rules="projects-title"
          v-slot="{failed, errors, required}"
        >
          <CoreInput
            :required="required"
            v-model="projectTitle"
            :error="failed"
            placeholder="Name"
            :disabled="isDisabled || !canEditTitle"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>

        <!-- Release input -->

        <ValidationProvider
          v-if="canReadRelease"
          slim
          class="mb-3"
          v-slot="{failed, required}"
        >
          <CoreSelect
            :required="required"
            v-if="isProjectsActive"
            list-width="100%"
            v-model="currentReleaseId"
            placeholder="Release"
            :error="failed"
            :options="releases"
            :config="configs.releases"
            clearable
            :disabled="isDisabled || !canEditRelease"
          />
        </ValidationProvider>

        <!-- Status input -->

        <ValidationProvider
          v-if="canReadStatus"
          slim
          class="mb-3"
          rules="projects-status"
          v-slot="{failed, errors, required}"
        >
          <CoreSelect
            :required="required"
            list-width="100%"
            v-model="projectStatus"
            placeholder="Status"
            :error="failed"
            :options="statuses"
            :disabled="isDisabled || !canEditStatus"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>

        <!-- Primary manager input -->

        <ValidationProvider
          v-if="canReadPrimaryProjectmMestro"
          slim
          class="mb-3"
          rules="projects-managerId"
          v-slot="{failed, errors, required}"
        >
          <CoreSelect
            :required="required"
            list-width="100%"
            v-model="projectPrimaryMaestro"
            placeholder="Project Maestro"
            :options="primaryUsers"
            :config="configs.users"
            :error="failed"
            :disabled="isDisabled || !canEditPrimaryProjectmMestro"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>

        <!-- Secondary manager input -->

        <ValidationProvider
          v-if="canReadSecondaryProjectMaestro"
          slim
          class="mb-3"
          rules="projects-secondaryManagerId"
          v-slot="{failed, errors, required}"
        >
          <CoreSelect
            :required="required"
            list-width="100%"
            v-model="projectSecondaryMaestro"
            placeholder="Secondary Maestro"
            :error="failed"
            :options="secondaryUsers"
            :config="configs.users"
            :disabled="isDisabled || !canEditSecondaryProjectMaestro"
            :clearable="isSecondaryClearable"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>

        <!-- Description textarea -->

        <ValidationProvider
          v-if="canReadDescription"
          slim
          class="mb-3 flex-grow-1"
          rules="projects-description"
          v-slot="{failed, errors, required}"
        >
          <CoreInput
            :required="required"
            class="description"
            :class="[{'error': failed}]"
            v-model="projectDescription"
            placeholder="Description"
            :error="failed"
            textarea
            :disabled="isDisabled || !canEditDescription"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>

        <!-- Save button -->

        <CoreBtn
          v-if="isSavable"
          class="mb-3 flex-shrink-0 flex-grow-0"
          type="submit"
          block
          :disabled="!dirty || invalid"
          :loading="$wait.is(waitState.ACTION_PROJECT_SAVING)"
        >
          Save
        </CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import {ProjectDetailCSModule, ApplicationDSModule, ProjectsActiveSprintsCSModule, PermissionDSModule, UserDSModule} from "@/store";
  import CoreInput from "@/components/Core/CoreInput.vue";
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import {Wait, WaitStates} from "@/utils/vuewait";
  import {Watch} from "vue-property-decorator";
  import SimpleBar from 'simplebar-vue';
  import {State} from "vuex-class";
  import ProjectDM from "@/datamodels/projectDM";
  import {DetailTabName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
  import DetailSubModule from "@/components/Base/DetailSubModule.vue";
  import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
  import CoreSelect from '@/components/Core/CoreSelect.vue';
  import CoreBtn from '@/components/Core/CoreBtn.vue';
  import { Actions, Subjects, Roles } from "@/store/modules/datastore/permissionDS";
import UserDM from "@/datamodels/userDM";

  @Component({
  name: "ProjectDetail",
  components: {
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar
  },
})
export default class ProjectDetail extends DetailSubModule {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  configs = {
    users: { labelKey: "fullName", valueKey: "id" },
    releases: { labelKey: "title", valueKey: "id" }
  };
  @State("projectDetail", { namespace: "projectdetailcs" })
  projectDetail!: ProjectDM;
  waitState = WaitStates;
  initialReleaseId: number | null = null;
  currentReleaseId: number | null = null;

  get tabName(): DetailTabName{
    return DetailTabName.project
  }

  get dataSources(): ILifeCycle[] {
    return [ProjectDetailCSModule]
  }

  @Watch("projectDetail")
  onProjectDetailChange() {
    this.$refs.observer.reset();
  }

  @Watch("selectedSprintsViewId", {immediate: true})
  onsprintIdChange() {
    this.initialReleaseId = ProjectDetailCSModule.sprintsView[ApplicationDSModule.selectedSprintsViewID]?.releaseId || null;
    this.currentReleaseId = ProjectDetailCSModule.sprintsView[ApplicationDSModule.selectedSprintsViewID]?.releaseId || null;
  }

  @Wait(WaitStates.ACTION_PROJECT_SAVING)
  async onSubmit() {
    const initialReleaseId = this.initialReleaseId;
    const currentReleaseId = this.currentReleaseId;
    const sprintId = this.selectedSprintsViewId;
    await ProjectDetailCSModule.updateProject();
    if (this.isProjectsActive) {
      const hasReleaseChanged = initialReleaseId !== currentReleaseId;
      if(initialReleaseId && hasReleaseChanged) await ProjectDetailCSModule.removeReleaseSprint({releaseId: initialReleaseId, sprintId})
      if(currentReleaseId && hasReleaseChanged) await ProjectDetailCSModule.appendReleaseSprint({releaseId: currentReleaseId, sprintId})
      await ProjectsActiveSprintsCSModule.doLoad(true);
      this.onsprintIdChange();
    }
  }

  public get projects() {
    return ProjectDetailCSModule.projects;
  }

  public get selectedSprintsViewId() {
    return ApplicationDSModule.selectedSprintsViewID

  }

  public get releases() {
    return ProjectDetailCSModule.releases?.filter(release => release.status !== "complete") || [];
  }

  public get activeUsers() {
    return ProjectDetailCSModule.users?.filter(user => user.removedAt === '' && user.organizationRoles.includes(Roles.PROJECT_MAESTRO)) || []
  }

  public get primaryUsers() {
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.projectSecondaryMaestro !== user.id) ?? [];
  }

  public get secondaryUsers() {
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.projectPrimaryMaestro !== user.id) ?? [];
  }

  get isSecondaryClearable(): boolean  {
    return !this.isDisabled && this.canEditSecondaryProjectMaestro;
  }

  public get statuses() {
    return ProjectDetailCSModule.statuses;
  }

  public get projectID(): number {
    return ProjectDetailCSModule.projectDetail?.id
  }

  public get projectTitle(): string {
    return ProjectDetailCSModule.projectDetail?.title || "";
  }
  public set projectTitle(value: string) {
    ProjectDetailCSModule.projectDetail.title = value;
  }

  public get projectStatus(): string {
    return ProjectDetailCSModule.projectDetail?.status || "";
  }
  public set projectStatus(value: string) {
    ProjectDetailCSModule.projectDetail.status = value;
  }

  public get projectPrimaryMaestro(): number {
    return ProjectDetailCSModule.projectDetail?.managerId || 0;
  }
  public set projectPrimaryMaestro(value: number) {
    ProjectDetailCSModule.projectDetail.managerId = value;
  }

  public get projectSecondaryMaestro(): number {
    return ProjectDetailCSModule.projectDetail?.secondaryManagerId || 0;
  }
  public set projectSecondaryMaestro(value: number) {
    ProjectDetailCSModule.projectDetail.secondaryManagerId = value;
  }

  public get projectDescription(): string {
    return ProjectDetailCSModule.projectDetail?.description || "";
  }
  public set projectDescription(value: string) {
    ProjectDetailCSModule.projectDetail.description = value;
  }
  public get isProjectsActive(): boolean {
    return ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsActiveSprints;
  }

  public get isDisabled(): boolean {
    return !this.projectID
  }

  get currentSubject() {
    return `${ApplicationDSModule.selectedModule}_${ApplicationDSModule.selectedModuleTab}_project` as Subjects;
  }

  get canEditTitle() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_name` as Subjects);
  }

  get canReadTitle() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_name` as Subjects) || this.canEditTitle;
  }

  get canEditRelease() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_release` as Subjects);
  }

  get canReadRelease() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_release` as Subjects) || this.canEditRelease;
  }

  get canEditGroup() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_group` as Subjects);
  }

  get canReadGroup() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_group` as Subjects) || this.canEditGroup;
  }

  get canEditStatus() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_status` as Subjects);
  }

  get canReadStatus() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_status` as Subjects) || this.canEditStatus;
  }

  get canEditPrimaryProjectmMestro() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_primaryprojectmaestro` as Subjects);
  }

  get canReadPrimaryProjectmMestro() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_primaryprojectmaestro` as Subjects) || this.canEditPrimaryProjectmMestro;
  }

  get canEditSecondaryProjectMaestro() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_secondaryprojectmaestro` as Subjects);
  }

  get canReadSecondaryProjectMaestro() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_secondaryprojectmaestro` as Subjects) || this.canEditSecondaryProjectMaestro;
  }

  get canEditDescription() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_description` as Subjects);
  }

  get canReadDescription() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_description` as Subjects) || this.canEditDescription;
  }

  get isSavable() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_save` as Subjects);
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/core-scrollbar';
.overflow-y-auto {
  overflow-y: auto !important;
}
.description {
  height: 100%;
  &.error {
    height: calc(100% - 30px);
  }
  ::v-deep textarea {
    resize: none;
  }
}
</style>
