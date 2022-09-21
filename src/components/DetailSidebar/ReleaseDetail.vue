<template>
  <SimpleBar class="xeba-scrollbar core-scrollbar">
    <ValidationObserver slim ref="observer" v-slot="{invalid, dirty, handleSubmit}">
      <form @submit.prevent="handleSubmit(onSubmit)" class="p-2 max-height-moduletab-content d-flex flex-column overflow-y-auto"
            autocomplete="off">

        <ValidationProvider v-if="canReadTitle" slim class="mb-3" rules="releases-title" v-slot="{failed, errors, required}">
          <CoreInput :required="required" v-model="releaseTitle" :error="failed" placeholder="Name"  :disabled="isDisabled || !canEditTitle"/>
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider v-if="canReadReleaseDate" slim class="mb-3" rules="releases-launchDate" v-slot="{failed, errors}">
          <CorePicker v-model="releaseLaunchDate" placeholder="Release Date" formatted='L' noHeader noFooter noTime autoClose :disabled="isDisabled || !canEditReleaseDate" :minDate="minReleaseDate"/>
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider v-if="canReadReleaseCutoff" slim class="mb-3" rules="releases-cutoff" v-slot="{failed, errors}">
          <CorePicker v-model="releaseCutoff" placeholder="Release Cutoff" formatted='L' noHeader noFooter noTime autoClose :disabled="isDisabled || !canEditReleaseCutoff" :minDate="minCutoffDate" :maxDate="maxCutoffDate" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider v-if="canReadPrimaryMaestro" slim class="mb-3" rules="releases-managerId" v-slot="{failed, errors, required}">
          <CoreSelect :required="required" list-width="100%" v-model="releaseManagerId" placeholder="Release Maestro" :error="failed" :options="primaryUsers" :config="configs.user" :disabled="isDisabled || !canEditPrimaryMaestro" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider v-if="canReadSecondaryMaestro" slim class="mb-3" rules="releases-secondaryManagerId" v-slot="{failed, errors, required}">
          <CoreSelect :required="required" list-width="100%" v-model="releaseSecondaryManagerId" placeholder="Secondary Maestro" :error="failed" :options="secondaryUsers" :config="configs.user" :disabled="isDisabled || !canEditSecondaryMaestro" :clearable="isSecondaryClearable" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider v-if="canReadDescription" slim class="mb-3 flex-grow-1" rules="releases-description" v-slot="{failed, errors, required}">
          <CoreInput :required="required" class="description" :class="[{'error': failed}]"  v-model="releaseDescription" placeholder="Description" :error="failed" textarea :disabled="isDisabled || !canEditDescription" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <Payload v-if="canReadPayload && !isDisabled" class="payload-table mb-3" :disabled="!canEditPayload || isDisabled"/>

        <div class="complete-actions align-items-center mb-3" v-if="isActiveRelease">
          <CoreCheckBox v-if="canReadComplete && canShowingCompleteCheckbox" v-model="isCompleted" :disabled="isDisabled || !canEditComplete">Complete</CoreCheckBox>
          <CoreBtn v-if="canReadPreflight" class="preflight" size="sm"   @click="preflight"  :disabled="isDisabled || !canEditPreflight" :loading="$wait.is(waitState.ACTION_RELEASE_PREFLIGHT)">Preflight</CoreBtn>
        </div>

        <CoreBtn v-if="isSavable" class="mb-3 flex-shrink-0 flex-grow-0" type="submit" block :disabled="!dirty || invalid || isEqualReleaseAndSecondary " :loading="$wait.is(waitState.ACTION_RELEASE_SAVING)">Save</CoreBtn>

      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import {MazCheckbox} from 'maz-ui'
  import {ApplicationDSModule, ReleaseDetailCSModule, DialogCSModule, PermissionDSModule, UserDSModule} from '@/store';
  import CoreInput from '@/components/Core/CoreInput.vue';
  import {ValidationObserver, ValidationProvider} from 'vee-validate';
  import {Wait, WaitStates} from '@/utils/vuewait';
  import {Watch} from 'vue-property-decorator'
  import SimpleBar from 'simplebar-vue';
  import {State} from 'vuex-class';
  import ReleaseDM from '@/datamodels/releaseDM';
  import CorePicker from '@/components/Core/CorePicker/CorePicker.vue';
  import CoreBtn from '@/components/Core/CoreBtn.vue';
  import CoreSelect from '@/components/Core/CoreSelect.vue';
  import {todayIsSameOrAfter} from '@/utils/date';
  import DetailSubModule from "@/components/Base/DetailSubModule.vue";
  import {DetailTabName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
  import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
  import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
  import { dateISOFormat } from '@/utils/date';
  import PreflightForm from "@/components/Form/PreflightForm.vue";
  import { Actions, Subjects, Roles } from '@/store/modules/datastore/permissionDS';
  import { today } from "@/utils/date";
  import Payload from "@/components/DetailSidebar/Payload.vue";
  import UserDM from '@/datamodels/userDM';

  @Component({
    name: "ReleaseDetail",
    components: {
      CoreCheckBox, CoreSelect, CoreBtn, CoreInput, ValidationProvider, ValidationObserver,
      SimpleBar, CorePicker, MazCheckbox, Payload}
  })
  export default class ReleaseDetail extends DetailSubModule {
    isCompleted = false;
    today = today
    $refs!: {
      observer: InstanceType<typeof ValidationObserver>
    };
    configs = {
      user: {labelKey: 'fullName', valueKey: 'id'}
    }
    @State('releaseDetail', {namespace: 'releasedetailcs'}) releaseDetail!: ReleaseDM;
    waitState = WaitStates;

    @Watch('releaseDetail')
    onReleaseDetailChange() {
      this.$refs.observer.reset()
    }

    @Watch('isCompleted')
    async onTagUpdate(value: boolean) {
      if(value) {
        await this.preflight()
        await ReleaseDetailCSModule.completeRelease()
        this.isCompleted = false
      }
    }

    async preflight() {
      await ReleaseDetailCSModule.preflight()
      await this.showingPreflightDialog()
    }

    async showingPreflightDialog() {
      DialogCSModule.load({
            title: '',
            content: PreflightForm,
            isShowingDialog: true,
            noClose: true,
            confirmLabel: "OK",
            width: 800,
            persistent: true
      });
    }

    get tabName(): DetailTabName{
      return DetailTabName.release
    }

    get dataSources(): ILifeCycle[] {
      return [ReleaseDetailCSModule]
    }

    get isSecondaryClearable(): boolean  {
      return !this.isDisabled && this.canEditSecondaryMaestro;
    }

    get minReleaseDate() {
      return this.today
    }

    get minCutoffDate() {
      return this.today
    }

    get maxCutoffDate() {
      if (this.releaseLaunchDate < this.today) {
        return ''
      } else {
        return this.releaseLaunchDate
      }
    }

    @Wait(WaitStates.ACTION_RELEASE_SAVING)
    async onSubmit() {
      await ReleaseDetailCSModule.updateRelease()
    }

    public get canShowingCompleteCheckbox(): boolean {
      const launchDate = ReleaseDetailCSModule.releaseDetail?.launchDate
      return todayIsSameOrAfter(launchDate)
    }
    
    public get isActiveRelease(): boolean {
      return ApplicationDSModule.selectedModuleTabReleases === ModuleTabName.releasesActive
    }

    public get releaseId(): number {
      return ReleaseDetailCSModule.releaseDetail?.id
    }

    public get releaseTitle(): string {
      return ReleaseDetailCSModule.releaseDetail?.title || ''
    }
    public set releaseTitle(value: string) {
      ReleaseDetailCSModule.releaseDetail.title = value;
    }

    public get releaseManagerId(): number {
      return ReleaseDetailCSModule.releaseDetail?.managerId || 0
    }
    public set releaseManagerId(value: number) {
      ReleaseDetailCSModule.releaseDetail.managerId = value;
    }

    public get releaseSecondaryManagerId(): number {
      return ReleaseDetailCSModule.releaseDetail?.secondaryManagerId || 0
    }
    public set releaseSecondaryManagerId(value: number) {
      ReleaseDetailCSModule.releaseDetail.secondaryManagerId = value;
    }

    public get releaseDescription(): string {
      return ReleaseDetailCSModule.releaseDetail?.description || ''
    }
    public set releaseDescription(value: string) {
      ReleaseDetailCSModule.releaseDetail.description = value;
    }

    public get isEqualReleaseAndSecondary() {
      return this.releaseManagerId === this.releaseSecondaryManagerId
    }

    public get activeUsers() {
      return ReleaseDetailCSModule.users?.filter(user => user.removedAt === '' && user.organizationRoles.includes(Roles.RELEASE_MAESTRO)) || []
    }

    public get primaryUsers() {
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.releaseSecondaryManagerId !== user.id) ?? [];
    }

    public get secondaryUsers() {
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.PROJECT_MAESTRO) && user.removedAt === '' && this.releaseManagerId !== user.id) ?? [];
    }

    public get releaseLaunchDate(): string {
      return ReleaseDetailCSModule.releaseDetail?.launchDate
    }
    public set releaseLaunchDate(value: string) {
      ReleaseDetailCSModule.releaseDetail.launchDate = dateISOFormat(value);
    }

    public get releaseCutoff(): string {
      return ReleaseDetailCSModule.releaseDetail?.cutoff
    }
    public set releaseCutoff(value: string) {
      ReleaseDetailCSModule.releaseDetail.cutoff = dateISOFormat(value);
    }

    public get isDisabled(): boolean {
      return !this.releaseId
    }

    get currentSubject() {
      return `${ApplicationDSModule.selectedModule}_${ApplicationDSModule.selectedModuleTab}_release` as Subjects;
    }

    get canEditTitle() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_name` as Subjects);
    }

    get canReadTitle() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_name` as Subjects) || this.canEditTitle;
    }

    get canEditReleaseDate() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_releasedate` as Subjects) && this.$route.name !== "ReleasesReleased";
    }

    get canReadReleaseDate() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_releasedate` as Subjects) || this.canEditReleaseDate;
    }

    get canEditReleaseCutoff() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_releasecutoff` as Subjects) && this.$route.name !== "ReleasesReleased";
    }

    get canReadReleaseCutoff() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_releasecutoff` as Subjects) || this.canEditReleaseCutoff;
    }

    get canEditGroups() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_groups` as Subjects);
    }

    get canReadGroups() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_groups` as Subjects) || this.canEditGroups;
    }

    get canEditPrimaryMaestro() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_primarymaestro` as Subjects);
    }

    get canReadPrimaryMaestro() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_primarymaestro` as Subjects) || this.canEditPrimaryMaestro;
    }

    get canEditSecondaryMaestro() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_secondarymaestro` as Subjects);
    }

    get canReadSecondaryMaestro() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_secondarymaestro` as Subjects) || this.canEditSecondaryMaestro;
    }

    get canEditDescription() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_description` as Subjects);
    }

    get canReadDescription() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_description` as Subjects) || this.canEditDescription;
    }
  
    get canReadPayload() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_payload` as Subjects) || this.canEditPayload;
    }

    get canEditPayload() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_payload` as Subjects);
    }

    get canEditComplete() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_complete` as Subjects);
    }

    get canReadComplete() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_complete` as Subjects) || this.canEditComplete;
    }

    get canEditPreflight() {
      return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_preflight` as Subjects);
    }

    get canReadPreflight() {
      return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_preflight` as Subjects) || this.canEditPreflight;
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
  .complete-actions{
    display: flex;
    flex-flow: row;

    .preflight{
      margin-left: auto;
    }
  }
  .description{
    height: 100%;
    &.error{
      height: calc(100% - 30px);
    }
    ::v-deep textarea{
      resize: none;
    }
  }
</style>
