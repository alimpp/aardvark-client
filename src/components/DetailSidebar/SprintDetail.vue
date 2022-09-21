<template>
  <SimpleBar class="xeba-scrollbar core-scrollbar">
    <ValidationObserver slim ref="observer" v-slot="{invalid, handleSubmit}">
      <form @submit.prevent="handleSubmit(onSubmit)"
        class="p-2 max-height-moduletab-content d-flex flex-column overflow-y-auto" autocomplete="off">
        <ValidationProvider v-if="canReadName" slim class="mb-3 " rules="sprintdetails-name"
          v-slot="{failed, errors, required}">
          <CoreInput :required="required" v-model="sprintName" :error="failed" placeholder="Sprint Name"
            :disabled="isDisabled|| !isSprintProjectMaestro || !canEditName" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>
        <ValidationProvider v-if="canReadReturnToTriageDate" slim class="mb-3"
          rules="sprintdetails-returnToTriageJobDate" v-slot="{failed, errors, required}">
          <CorePicker v-model="sprintReturnToTriageDate" placeholder="Return To Triage Date"
            :disabled="isDisabled|| !isSprintProjectMaestro  || isReleased || !isBacklogged || !canEditReturnToTriageDate"
            :required="required" formatted='L' noHeader noFooter noTime autoClose
            :minDate="minSprintReturnToTriageDate" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <div class="details mb-3">
          <ValidationProvider v-if="canReadPeriod" slim rules="sprintdetails-period" v-slot="{failed, errors,required}">
            <CoreSelect :required="required" list-width="100%" v-model="sprintPeriod" placeholder="Period"
              :error="failed" :options="periodOptions" :config="configs.periods"
              :disabled="isDisabled|| !isSprintProjectMaestro || !canEditPeriod || isReleased" />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider v-if="canReadStatus" rules="sprintdetails-status" slim>
            <CoreSelect list-width="100%" v-model="SprintStatus" :options="sprintStatusOptions" placeholder="Status"
              :disabled="true" />
          </ValidationProvider>
          <ValidationProvider v-if="canReadRelease" slim rules="" v-slot="{failed, errors}">
            <CoreSelect list-width="120%" v-model="sprintRelease" placeholder="Release" clearable :error="failed"
              :options="sprintReleaseOptions" :config="configs.releases"
              :disabled="isDisabled|| !isSprintProjectMaestro || !canEditRelease || isReleased" />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider v-if="canReadReleaseDate" slim>
            <CorePicker placeholder="Release Date" position="bottom right" v-model="sprintReleaseDate"
              format="YYYY-MM-DD" noHeader noFooter noTime formatted='L' autoClose :disabled="true" />
          </ValidationProvider>
        </div>

        <ValidationProvider v-if="canReadDescription" slim class="mb-3 flex-grow-1" rules="sprintdetails-description"
          v-slot="{failed, errors, required}">
          <CoreInput :required="required" class="description" :class="[{'error': failed}]" v-model="description"
            placeholder="Description" :error="failed" textarea
            :disabled="isDisabled || !isSprintProjectMaestro ||!canEditDescription" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <div v-if="!isDisabled" class="profile text-secondary text-left mb-2">
          Created on {{createdByDate}} by
          <CorePopper tag="span" trigger="hover">
            <span slot="popper" @click.stop @dblclick.stop>
              <UserProfile :userId="createdByUserId" />
            </span>
            <span slot="reference" class="username text-truncate text-primary"> {{createdByUser}} </span>
          </CorePopper>
        </div>

        <div v-if="!isDisabled && isSprintUpdated" class="profile text-secondary text-left mb-2">
          Updated on {{updatedByDate}} by
          <CorePopper tag="span" trigger="hover">
            <span slot="reference" class="username text-truncate text-primary">{{ updatedByUser }}</span>
            <span slot="popper" @click.stop @dblclick.stop>
              <UserProfile :userId="updatedByUserId" />
            </span>
          </CorePopper>
        </div>
        <!-- Save button -->

        <CoreBtn v-if="isSavable" class="mt-3 mb-3 btn flex-shrink-0 flex-grow-0" type="submit" block
          :disabled="invalid || isSprintDetailChanged" :loading="$wait.is(waitState.ACTION_SPRINT_SAVING)">Save
        </CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import {ApplicationDSModule, PermissionDSModule, SprintDetailCSModule, ProfileDSModule, SprintsViewDSModule, UserDSModule} from "@/store";
  import CoreInput from "@/components/Core/CoreInput.vue";
  import {ValidationObserver, ValidationProvider} from "vee-validate";
  import {WaitStates} from "@/utils/vuewait";
  import {Watch} from "vue-property-decorator";
  import SimpleBar from 'simplebar-vue';
  import {State} from "vuex-class";
  import {DetailTabName} from "@/store/modules/datastore/applicationDS";
  import DetailSubModule from "@/components/Base/DetailSubModule.vue";
  import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
  import CoreSelect from '@/components/Core/CoreSelect.vue';
  import CoreBtn from '@/components/Core/CoreBtn.vue';
  import { Actions, Subjects } from "@/store/modules/datastore/permissionDS";
  import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
  import dayjs from "dayjs";
  import { today } from "@/utils/date";
  import {RELEASE_STATUS} from "@/utils/constants"
  import SprintDM from "@/datamodels/sprintDM";
  import CorePopper from "@/components/Core/CorePopper.vue";
  import UserProfile from "@/components/UserProfile.vue";

  @Component({
  name: "SprintDetail",
  components: {
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    CorePicker,
    SimpleBar,
    UserProfile,
    CorePopper
  },
})
export default class SprintDetail extends DetailSubModule {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };
  configs = {
    periods: { labelKey: "label", valueKey: "value" },
    releases: { labelKey: "title", valueKey: "id" }
  };
  @State("sprintDetail", { namespace: "sprintdetailcs" })sprintDetail!: SprintDM;

  waitState = WaitStates;

  get tabName(): DetailTabName{
    return DetailTabName.sprintDetails
  }

  get dataSources(): ILifeCycle[] {
    return [SprintDetailCSModule]
  }

  get isSprintDetailChanged(): boolean{
    const currentSprintView = {...SprintsViewDSModule.currentSprintView}
    const sprintDetail = {...SprintDetailCSModule.sprintDetail}
    return JSON.stringify(currentSprintView) === JSON.stringify(sprintDetail)

  }

  @Watch('sprintDetail',{deep:true})
  onSprintDetailChange() {
    this.$refs.observer.reset();
  }

  async onSubmit() {
    await SprintDetailCSModule.handelUpdateSprint();
    this.$refs.observer.reset();
  }


  public get sprintName(): string {
    return SprintDetailCSModule.sprintDetail.name || "";
  }
  public set sprintName(value: string) {
    SprintDetailCSModule.sprintDetail.name = value;
  }

  public get sprintReturnToTriageDate(){
    return SprintDetailCSModule.sprintDetail?.returnToTriageJobDate || ''
  }

  public set sprintReturnToTriageDate(value){
     SprintDetailCSModule.sprintDetail.returnToTriageJobDate = value
  }

  get minSprintReturnToTriageDate() {
    return today
  }

  public get SprintStatus(): string {
    return SprintDetailCSModule.sprintDetail?.status || "";
  }
  public set SprintStatus(value: string) {
    SprintDetailCSModule.sprintDetail.status = value;
  }

  public get sprintStatusOptions() {
    return SprintDetailCSModule.statuses;
  }

  public get sprintPeriod(){
    return SprintDetailCSModule.sprintDetail?.period || "";
  }
  public set sprintPeriod(value){
    SprintDetailCSModule.sprintDetail.period = value
  }

  public get periodOptions() {
    return SprintDetailCSModule.periods ;
  }

  public get sprintRelease(){
    return SprintDetailCSModule.sprintDetail?.releaseId || 0
  }

  public set sprintRelease(value: number){
    const calcValue = value? value : 0
    SprintDetailCSModule.sprintDetail.releaseId = calcValue;
  }

  public get sprintReleaseOptions() {
    return SprintDetailCSModule.releases.filter(release => release.status !== RELEASE_STATUS.COMPLETE ) || [];
  }

  public get sprintReleaseDate(){
    return SprintDetailCSModule.sprintDetail?.launchDate || "";
  }

  public set sprintReleaseDate(value){
    SprintDetailCSModule.sprintDetail.launchDate = value
  }

  public get description(): string {
    return SprintDetailCSModule.sprintDetail?.description || "";
  }

  public set description(value: string) {
    SprintDetailCSModule.sprintDetail.description = value;
  }

  get createdByUserId() {
    return UserDSModule.users[SprintDetailCSModule.sprintDetail.createdByMemberId]?.referenceId
  }

  get updatedByUserId() {
    return UserDSModule.users[SprintDetailCSModule.sprintDetail.modifiedByMemberId]?.referenceId
  }

  public get createdByUser() {
    return SprintDetailCSModule.sprintDetail.createdByMember || "";
  }

  public get createdByDate(){
    const date = dayjs(SprintDetailCSModule.sprintDetail.createdAt).format("L");
    return date;
  }

  public get updatedByUser(): string {
    return UserDSModule.users[SprintsViewDSModule.currentSprintView.modifiedByMemberId]?.fullName || "";
  }

  public get updatedByDate() {
    const date = dayjs(SprintDetailCSModule.sprintDetail.modifiedAt).format("L");
    return date;
  }

  public get isSprintUpdated(){
    return SprintDetailCSModule.sprintDetail.modifiedAt && this.updatedByUser
  }

  public get isReleased(){
    return SprintDetailCSModule.sprintDetail.isReleased
  }
  public get isBacklogged(){
    return SprintDetailCSModule.sprintDetail.hasBackloggedNuggets
  }

  public get isSprintProjectMaestro(): boolean{
    const currentUserId = ProfileDSModule.identifier
    return (currentUserId === SprintDetailCSModule.sprintDetail.projectSecondaryManagerId) || (currentUserId === SprintDetailCSModule.sprintDetail.projectManagerId)
  }

  public get projectID(): number {
    return SprintDetailCSModule.sprintDetail?.projectId
  }

  public get isDisabled(): boolean {
    return !this.projectID
  }

  get currentSubject() {
    return `${ApplicationDSModule.selectedModule}_${ApplicationDSModule.selectedModuleTab}_sprintDetails` as Subjects;
  }

  get canEditName() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_name` as Subjects);
  }

  get canReadName() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_name` as Subjects) || this.canEditName;
  }

  get canEditReturnToTriageDate() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_returntotriagedate` as Subjects);
  }

  get canReadReturnToTriageDate() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_returntotriagedate` as Subjects) || this.canEditReturnToTriageDate;
  }

  get canEditPeriod() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_period` as Subjects)
  }
  get canReadPeriod() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_period` as Subjects) || this.canEditPeriod;
  }
  get canReadStatus() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_status` as Subjects)
  }

  get canEditRelease() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_release` as Subjects);
  }

  get canReadRelease() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_release` as Subjects) || this.canEditRelease
  }

  get canReadReleaseDate() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_release_date` as Subjects)
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

.f-50-left{
  flex-grow: 0.5;
  padding-right: 5px;
}
.f-50-right{
  flex-grow: 0.5;
  padding-left: 5px;
}

.username{
  color: var(--brand-color);
}
.profile {
  cursor: pointer;
}

::v-deep .information {
  max-width: 260px;
}

.details{
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
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
  
::v-deep .information {
  max-width: 260px;
}

.username{
  color: var(--brand-color);
}

.profile {
  cursor: pointer;
}
</style>
