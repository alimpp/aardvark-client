<template>
  <SimpleBar class="xeba-scrollbar core-scrollbar">
    <ValidationObserver slim ref="observer" v-slot="{invalid, handleSubmit}">
      <form @submit.prevent="handleSubmit(onSubmit)"
        class="p-2 max-height-moduletab-content d-flex flex-column overflow-y-auto" autocomplete="off">
        <ValidationProvider slim class="mb-3" rules="nuggets-title" v-slot="{failed, errors, required}">
          <CoreInput :required="required" v-model="nuggetTitle" :error="failed" placeholder="Nugget name"
            :disabled="isDisabled || !canEditTitle" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <ValidationProvider slim class="mb-3" rules="nuggets-projectId" v-slot="{failed, errors, required}">
          <CoreSelect :required="required" list-width="100%" v-model="nuggetProjectId" placeholder="Project"
            :options="projects" :error="failed" :config="configs.projects" :disabled="isDisabled || !canEditProject" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <div class="details mb-3">
          <ValidationProvider slim v-slot="{failed, errors}">
            <CoreInput v-model="nuggetManager" placeholder="Primary Maestro" disabled />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>
          <ValidationProvider slim v-slot="{failed, errors}">
            <CoreInput v-model="nuggetSecondaryManager" placeholder="Secondary Maestro" disabled />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider v-if="canReadType" slim rules="nuggets-kind" v-slot="{failed, errors, required}">
            <CoreSelect :required="required" list-width="100%" v-model="nuggetKind" placeholder="Type" :error="failed"
              :options="types" :disabled="isDisabled || !canEditType" />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider v-if="canReadPriority" slim rules="nuggets-priority" v-slot="{failed, errors, required}">
            <CoreSelect :required="required" list-width="100%" v-model="nuggetPriority" placeholder="Priority"
              :error="failed" :options="priorities" :disabled="isDisabled || !canEditPriority" />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider slim rules="nuggets-stage" v-slot="{failed, errors, required}">
            <CoreInput :required="required" v-model="nuggetStage" :error="failed" placeholder="Stage" disabled />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider slim v-slot="{failed, errors}">
            <CoreInput v-model="nuggetLeadPhase" placeholder="Lead Phase" disabled />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider slim rules="nuggets-sprintId" v-slot="{failed, errors, required}">
            <CoreSelect
              :required="required"
              :headerLabels="sprintDropDownHeaderLabels"
              :action="sprintDropDownOnAction"
              :onMore="sprintDropDownOnMore"
              :hasMoreButton='true'
              :hasActionButton='true'
              @moreActionClick="sprintDropDownMoreOptionAction"
              v-model="nuggetSprintId"
              placeholder="Sprint"
              :error="failed"
              :options="sprints"
              :disabled="isDisabled || moveToArchive || !canEditSprint"
              :config="configs.sprints"
              ref="select"
            />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <ValidationProvider slim v-slot="{failed, errors}">
            <CoreInput v-model="nuggetDueDate" placeholder="Release Date" disabled />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

        </div>

        <ValidationProvider ref="tagProvider" slim class="mb-3" rules="nuggets-tags">
          <CoreTagsInput v-model="tag" :tags="relatedNuggets" :add-only-from-autocomplete="true"
            :autocomplete-items="filteredNuggets" :loading="$wait.is(waitState.ACTION_NUGGET_SEARCH)"
            @tags-changed="updateRelatedNuggets" placeholder="Related Nuggets"
            :disabled="isDisabled || !canEditRelatedNuggets" />
        </ValidationProvider>

        <ValidationProvider slim class="mb-3" rules="nuggets-tags" v-slot="{failed, required}">
          <CoreSelect :required="required" list-width="100%" v-model="nuggetTags" placeholder="Tags" :options="tags"
            :error="failed" :config="configs.tag" multiple clearable :disabled="isDisabled || !canEditTags" />
        </ValidationProvider>

        <ValidationProvider slim class="flex-grow-1 mb-3" rules="nuggets-description"
          v-slot="{failed, errors, required}">
          <CoreInput :required="required" class="description" :class="[{'error': failed}]" v-model="nuggetDescription"
            placeholder="Description" :error="failed" textarea :disabled="isDisabled || !canEditDescription" />
          <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>

        <div class="profile text-secondary text-left" v-if="!isDisabled">
          Created on {{createdByDate}} by
          <CorePopper tag="span" trigger="hover">
            <span slot="reference" class="username text-truncate text-primary">{{ createdByUser }}</span>
            <span slot="popper" @click.stop @dblclick.stop>
              <UserProfile :userId="createdByUserId" />
            </span>
          </CorePopper>
        </div>

        <div class="profile text-secondary text-left" v-if="canShowUpdatedLabel && !isDisabled">
          Updated on {{updatedByDate}} by
          <CorePopper tag="span" trigger="hover">
            <span slot="reference" class="username text-truncate text-primary">{{ updatedByUser }}</span>
            <span slot="popper" @click.stop @dblclick.stop>
              <UserProfile :userId="updatedByUserId" />
            </span>
          </CorePopper>
        </div>

        <div class="action mt-3" v-if="canViewMoveToActions">
          <span class=" text-left">Move to</span>
          <ValidationProvider slim v-slot="{failed, errors}">
            <CoreCheckBox v-model="moveToArchive" @input="onMoveToArchiveChanged()"
              :disabled="!canEditArchive || disableArchiveCheckbox || isDisabled">Archive</CoreCheckBox>
              <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
          </ValidationProvider>

          <CoreCheckBox v-model="moveToBacklog" @input="onMoveToBacklogChanged()"
            :disabled="!canEditBacklog || disableBacklogCheckbox || isDisabled">Backlog</CoreCheckBox>
          <ValidationProvider :rules="{'required': moveToBacklog}" v-slot="{failed}" slim>
            <CorePicker ref="picker" v-model="returnToTriage"
              :disabled="!canEditBacklog || disableReturnToTriage || isDisabled" placeholder="Return to Triage"
              position='top right' formatted='L' noHeader noFooter noTime autoClose :minDate="tomorrow"
              :error="failed" />
          </ValidationProvider>
        </div>

        <CoreCheckBox v-if="canReadSubscribe" class="mt-3 subscribed-checkbox" v-model="nuggetIsSubscribedPublic"
          :disabled="isDisabled || !canEditSubscribed">Follow</CoreCheckBox>
        <CoreBtn v-if="isSavable" class="mb-3 mt-3 flex-grow-0 flex-shrink-0" type="submit" block
          :disabled="isButtonDisabled() || invalid" :loading="$wait.is(waitState.ACTION_NUGGET_SAVING)">Save</CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
  import {SprintDropdownCSModule, UpdateSprintCSModule, CreateSprintCSModule, DialogCSModule, ApplicationDSModule, NuggetDetailCSModule, NuggetDSModule, PermissionDSModule, UserDSModule, SprintDSModule} from '@/store';
  import Component from 'vue-class-component';
  import {MazCheckbox} from 'maz-ui'
  import CoreSelectSearch from '@/components/Core/CoreSelectSearch.vue';
  import CorePicker from '@/components/Core/CorePicker/CorePicker.vue';
  import CoreTagsInput from '@/components/Core/CoreTagsInput.vue';
  import CoreSelect from '@/components/Core/CoreSelect.vue';
  import CoreInput from '@/components/Core/CoreInput.vue';
  import CoreBtn from '@/components/Core/CoreBtn.vue';
  import { tomorrow, today, isBefore, isSame, dateISOFormat } from "@/utils/date";
  import TagDM from '@/datamodels/tagDM';
  import {ValidationObserver, ValidationProvider} from 'vee-validate';
  import {Wait, WaitStates} from '@/utils/vuewait';
  import moment from "moment";
  import {debounce} from '@/utils/debounce';
  import {Watch} from 'vue-property-decorator'
  import SimpleBar from 'simplebar-vue';
  import {State} from 'vuex-class';
  import NuggetDM from '@/datamodels/nuggetDM';
  import DetailSubModule from "@/components/Base/DetailSubModule.vue";
  import {DetailTabName} from "@/store/modules/datastore/applicationDS";
  import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
  import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
  import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';
  import { createToastNotification } from '@/utils/toast';
  import dayjs from "dayjs";
  import {DEBOUNCE, NUGGET_STAGES} from '@/utils/constants';
  import CorePopper from "@/components/Core/CorePopper.vue";
  import UserProfile from "@/components/UserProfile.vue";
  import CreateSprintForm from "@/components/Form/CreateSprintForm.vue";
  import {CORE_SELECT_MENU_OPTIONS, EVENTS} from "@/utils/constants"
  import UpdateSprintForm from "@/components/Form/UpdateSprintForm.vue";
  import cloneDeep from 'lodash.clonedeep';
  import SprintDM from "@/datamodels/sprintDM";
  import { required } from 'vee-validate/dist/rules';
  import { extend } from 'vee-validate';
  import {EventBus} from "@/utils/eventBus";
  extend('required', required)

  @Component({
  name: "NuggetDetail",
  components: {
    CoreCheckBox, CoreSelect, CoreBtn, MazCheckbox, CoreInput, ValidationProvider, ValidationObserver,
    SimpleBar, CoreSelectSearch, CoreTagsInput, CorePicker, CorePopper, UserProfile}
})
export default class NuggetDetail extends DetailSubModule {

  @State('nuggetDetail', {namespace: 'nuggetdetailcs'}) nuggetDetail!: NuggetDM;

  waitState = WaitStates;
  tag = null;
  tomorrow = tomorrow
  moveToArchive= false
  moveToBacklog= false
  selectedSprint!: SprintDM;

  configs = {
    tag: {labelKey: 'title', valueKey: 'id'},
    projects: {labelKey: 'title', valueKey: 'id'},
    relatedNuggets: {labelKey: 'title', valueKey: 'id', searchKey: 'title'},
    sprints: {labelKey: 'label', valueKey: 'id', labelText: 'labelText'}
  }

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
    tagProvider: InstanceType<typeof ValidationProvider>
    picker: CorePicker
    select: any
  };

  @Watch('nuggetDetail')
  onNuggetDetailChange() {
    this.$refs.observer.reset()
    this.moveToArchive = NuggetDetailCSModule.nuggetDetail.stage === NUGGET_STAGES.ARCHIVE ? true : false
    this.calculateMoveToBacklog()
  }

  @Watch('tag')
  onTagUpdate(value: string) {
    if(value.length < 2) return;
    debounce(DEBOUNCE.NUGGET_DETAIL_TAG_UPDATE, () => NuggetDetailCSModule.searchForNuggets(value), 300)
  }

  @Wait(WaitStates.ACTION_NUGGET_SAVING)
  async onSubmit() {
    await Promise.all([
      NuggetDetailCSModule.updateNuggetTags(),
      NuggetDetailCSModule.updateRelatedNuggets(),
      NuggetDetailCSModule.updateNuggetProject(),
      NuggetDetailCSModule.updateNugget()
    ])

    createToastNotification(`Successfully updated ${this.nuggetNumber}`);
    this.$refs.observer.reset();
  }

  sprintDropDownOnAction() {
    CreateSprintCSModule.setProjectId(this.projectId);
    EventBus.$on(EVENTS.CREATED_NEW_SPRINT, this.onSprintCreated);
    DialogCSModule.load({
        title: 'Add Sprint',
        content: CreateSprintForm,
        isShowingDialog: true,
        noClose: true,
        confirmLabel: "Save"
    });
  }

  async sprintDropDownOnMore(option) {
    if(option === CORE_SELECT_MENU_OPTIONS.delete ) {
        await SprintDropdownCSModule.delete(this.selectedSprint)
    } else if (option === CORE_SELECT_MENU_OPTIONS.edit) {
        UpdateSprintCSModule.setSprint(cloneDeep(this.selectedSprint))
        DialogCSModule.load({
            title: 'Update Sprint',
            content: UpdateSprintForm,
            isShowingDialog: true,
            noClose: true,
            confirmLabel: "Update"
        });
    } else {
        return;
    }
  }

  onSprintCreated(sprint: SprintDM) {
    this.nuggetSprintId = sprint.id;
    this.$refs.select.updateValue(sprint.id);
  }

  onMoveToArchiveChanged() {
    if (this.moveToArchive) {
      NuggetDetailCSModule.nuggetDetail.stage = NUGGET_STAGES.ARCHIVE
      NuggetDetailCSModule.nuggetDetail.sprintId = 0
      if(NuggetDetailCSModule.nuggetDetail.returntotriagejob?.at) {NuggetDetailCSModule.nuggetDetail.returntotriagejob.at = ''}
    } else  {
      const currentNugget= NuggetDSModule.getItems[this.nuggetDetail.id]
      NuggetDetailCSModule.nuggetDetail.stage = currentNugget.stage === NUGGET_STAGES.ARCHIVE ? NUGGET_STAGES.TRIAGE : currentNugget.stage
      NuggetDetailCSModule.nuggetDetail.sprintId = currentNugget.sprintId
      if(NuggetDetailCSModule.nuggetDetail.returntotriagejob?.at) {NuggetDetailCSModule.nuggetDetail.returntotriagejob.at = currentNugget.returntotriagejob.at}
    }
  }

  async updateRelatedNuggets(newNuggets: {text: string}[]) {
    this.$refs.tagProvider.setFlags({
      valid: true,
      dirty: true
    });
    const values = newNuggets.map(tag => tag.text);
    await NuggetDetailCSModule.clearSearchedNuggets();
    await NuggetDetailCSModule.updateRelatedNuggetsInCurrent(NuggetDSModule.itemsAsArray.filter(nugget => values.includes(`#${nugget.number} ${nugget.title}`)));
    await this.$refs.observer.validate();
  }

  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty(): true
  }
  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  onMoveToBacklogChanged() {
    const isTriageDateBeforeToday = this.selectedSprintReturnToTriageJobDate && isBefore(this.selectedSprintReturnToTriageJobDate, today);
    if(this.moveToBacklog && (!this.selectedSprintReturnToTriageJobDate || isTriageDateBeforeToday)) {
      this.$refs.picker.openPicker();
    } else {
      this.$refs.picker.closePicker();
      this.$refs.observer.reset()
    }
  }

  calculateMoveToBacklog() {
     if (NuggetDetailCSModule.nuggetDetail?.returntotriagejob?.at) {
            const isBeforeToday = isBefore(NuggetDetailCSModule.nuggetDetail?.returntotriagejob?.at, today)
            const isToday = isSame(today, NuggetDetailCSModule.nuggetDetail?.returntotriagejob?.at)
            if (isBeforeToday || isToday) {
                this.moveToBacklog = false
            } else {
                this.moveToBacklog = true
            }
        } else {
            this.moveToBacklog = false
        }
  }

  sprintDropDownMoreOptionAction(option) {
    this.selectedSprint = option
  }

  get projectId(): number {
    return this.nuggetDetail?.projectId
  }

  get selectedSprintReturnToTriageJobDate() {
    return this.sprint(this.nuggetDetail?.sprintId)?.returnToTriageJobDate
  }

  get sprintDropDownHeaderLabels() {
    return [ 'Sprint Name', 'Triage Date' ]
  }

  get disableBacklogCheckbox() {
    return this.moveToArchive
  }

  get disableArchiveCheckbox() {
    return this.moveToBacklog
  }

  get disableReturnToTriage() {
    return this.moveToArchive || !this.moveToBacklog
  }

  get tabName(): DetailTabName{
    return DetailTabName.nugget
  }

  get dataSources(): ILifeCycle[] {
    return [NuggetDetailCSModule]
  }

  public get filteredNuggets() {
    return NuggetDetailCSModule.searchedNuggets.filter(nugget => nugget.id !== NuggetDetailCSModule.nuggetDetail.id).map(nugget => ({text: `#${nugget.number} ${nugget.title}`}));
  }

  public get nuggets() {
    return NuggetDetailCSModule.nuggets;
  }

  public get relatedNuggets() {
    return NuggetDetailCSModule.currentRelatedNuggets.map(nugget => ({text: `#${nugget.number} ${nugget.title}`}));
  }

  public get types() {
    return NuggetDetailCSModule.types
  }

  public get priorities() {
    return NuggetDetailCSModule.priorities
  }

  public get tags() {
    const nuggetTags = NuggetDetailCSModule?.nuggetDetail?.tags?.filter(nuggetTag => NuggetDetailCSModule?.tags?.some(tag => tag.removedAt !== '' && nuggetTag.id === tag.id)) || [];
    const activeTags = NuggetDetailCSModule.tags?.filter(tag => tag.removedAt === '') || []
    return nuggetTags.concat(activeTags)
  }

  public get projects() {
    return NuggetDetailCSModule.projects
  }

  public get sprints() {
    const options = [ {label: [{labelText: 'None'}], id: 0} ];
    const sprints = NuggetDetailCSModule.sprints.filter(sprint => !sprint.isReleased || sprint.id === this.nuggetSprintId)
    if(!sprints.length) return options
    const details = sprints.map(item => {
            return {...item, label: [{labelText: item.name}, {labelText: item.returnToTriageJobDate? dayjs(item.returnToTriageJobDate).format("L"): '',
            // If the returnToTriageJobDate is before today, the color property add to the object
            ...((item.returnToTriageJobDate && isBefore(item.returnToTriageJobDate, today)) && {color: '#D82929'})}]
            };    })
    return [ ...options, ...details ];
  }

  public get nuggetManager() {
    return NuggetDetailCSModule.nuggetDetail?.project?.managerFullName || ''
  }

  public get nuggetSecondaryManager() {
    return NuggetDetailCSModule.nuggetDetail?.project?.secondaryManagerFullName || ''
  }

  public get nuggetDueDate() {
    return NuggetDetailCSModule.nuggetDetail?.releaseLaunchDate ? dayjs(
      NuggetDetailCSModule.nuggetDetail?.releaseLaunchDate
    ).format("L") : ''
  }

  public get nuggetID(): number {
    return  NuggetDetailCSModule.nuggetDetail?.id
  }

  public get nuggetNumber(): string {
    return  NuggetDetailCSModule.nuggetDetail?.nuggetNumber
  }

  public get nuggetTitle(): string {
    return NuggetDetailCSModule.nuggetDetail?.title || ''
  }
  public set nuggetTitle(value: string) {
    NuggetDetailCSModule.nuggetDetail.title = value;
  }

  public get nuggetKind(): string {
    return NuggetDetailCSModule.nuggetDetail?.type || ''
  }
  public set nuggetKind(value: string) {
    NuggetDetailCSModule.nuggetDetail.type = value;
  }

  public get nuggetProjectId(): number {
    return NuggetDetailCSModule.nuggetDetail.projectId || 0;
  }
  public set nuggetProjectId(value: number) {
    NuggetDetailCSModule.nuggetDetail.projectId = value;
  }

  public get nuggetSprintId(): number {
    return NuggetDetailCSModule.nuggetDetail.sprintId || 0;
  }
  public set nuggetSprintId(value: number) {
    const sprintHaveDate = this.sprint(value)?.returnToTriageJobDate
    if (sprintHaveDate) {
      const isTriageDateBeforeToday = isBefore(sprintHaveDate, today)
      this.moveToBacklog = true
      if(isTriageDateBeforeToday) {
        this.$refs.picker.openPicker();
      } else {
          this.returnToTriage = sprintHaveDate;
          this.$refs.picker.closePicker();
      }
    }  else if (this.sprint(value)?.returnToTriageJobDate === null || !this.sprint(value)?.returnToTriageJobDate) {
      NuggetDetailCSModule.nuggetDetail.returntotriagejob = NuggetDSModule.items[NuggetDetailCSModule.nuggetDetail.id].returntotriagejob
      this.calculateMoveToBacklog()

    }
    NuggetDetailCSModule.nuggetDetail.sprintId = value;
  }

  get sprint() {return (sprintId: number) => {
    const sprint= SprintDSModule.items[this.nuggetDetail.projectId]?.find(sprint => sprint.id === sprintId) || null

    return sprint
  }}

  get returnToTriage(): string {
    const isBeforeToday = isBefore( NuggetDetailCSModule.nuggetDetail?.returntotriagejob?.at, tomorrow) || false
    if(this.moveToArchive){
      return ''
      }
    if(this.moveToBacklog && isBeforeToday) {
      this.$refs.picker.openPicker();
      return ''
      }
    return NuggetDetailCSModule?.nuggetDetail?.returntotriagejob?.at || ''
  }

  set returnToTriage(value: string) {
    NuggetDetailCSModule.nuggetDetail.returntotriagejob = {at: dateISOFormat(value)}
  }

  public get nuggetStage(): string {
    return NuggetDetailCSModule.nuggetDetail?.stage || ''
  }

  public set nuggetStage(value: string) {
    NuggetDetailCSModule.nuggetDetail.stage = value;
  }

  public get nuggetLeadPhase(): string {
    return NuggetDetailCSModule.nuggetDetail?.leadPhaseTitle && NuggetDetailCSModule.nuggetDetail?.status ? NuggetDetailCSModule.nuggetDetail?.leadPhaseTitle + ': ' + NuggetDetailCSModule.nuggetDetail?.status : ''
  }

  public set nuggetLeadPhase(value: string) {
    NuggetDetailCSModule.nuggetDetail.leadPhase = value;
  }

  public get nuggetPriority(): string {
    return NuggetDetailCSModule.nuggetDetail.priority || '';
  }
  public set nuggetPriority(value: string) {
    NuggetDetailCSModule.nuggetDetail.priority = value;
  }

  public get nuggetTags(): number[] {
    return  NuggetDetailCSModule.nuggetDetail?.tags?.map(tag => tag.id) || []
  }
  public set nuggetTags(values: number[]) {
    const newTags: TagDM[] = [];
    if(values !== null) {
      for(const value of values) {
        for(const tag of NuggetDetailCSModule.tags!){
          if(value === tag.id) {
            newTags.push(tag);
          }
        }
      }
    }
    NuggetDetailCSModule.nuggetDetail.tags = newTags;
  }

  public get nuggetDescription(): string {
    return NuggetDetailCSModule.nuggetDetail?.description || ''
  }
  public set nuggetDescription(value: string) {
    NuggetDetailCSModule.nuggetDetail.description = value;
  }

  public get createdByUser() {
    return UserDSModule.users[NuggetDetailCSModule.nuggetDetail.createdByMemberId]?.fullName || "";
  }

  public get createdByDate(){
    const date = dayjs(
      NuggetDetailCSModule.nuggetDetail?.createdAt
    ).format("L");
    return date;
  }

  public get canShowUpdatedLabel() {
    return NuggetDetailCSModule.nuggetDetail.modifiedByReferenceId !== null && NuggetDetailCSModule.nuggetDetail?.createdAt !== NuggetDetailCSModule.nuggetDetail?.modifiedAt? NuggetDetailCSModule.nuggetDetail?.modifiedAt : null
  }

  public get updatedByUser() {
    const user = UserDSModule.itemsAsArray.find(user => user.referenceId === NuggetDetailCSModule.nuggetDetail.modifiedByReferenceId);
    return user?.fullName || "";
  }

  public get updatedByDate() {
    const date = dayjs(
      NuggetDetailCSModule.nuggetDetail?.modifiedAt
    ).format("L");
    return date;
  }

  public get nuggetIsSubscribedPublic(): boolean {
    return NuggetDetailCSModule.nuggetDetail.isSubscribedPublic || false;
  }
  public set nuggetIsSubscribedPublic(value: boolean) {
    this.nuggetIsSubscribedPublic ? NuggetDetailCSModule.unsubscribeNugget() : NuggetDetailCSModule.subscribeNugget();
  }

  get canViewMoveToActions() {
    return PermissionDSModule.can(Actions.VIEW, `${this.currentSubject}_moveto` as Subjects)
  }


  get createdByUserId() {
    return UserDSModule.users[NuggetDetailCSModule.nuggetDetail.createdByMemberId]?.referenceId
  }


  get updatedByUserId() {
    const user = UserDSModule.itemsAsArray.find(user => user.referenceId === NuggetDetailCSModule.nuggetDetail.modifiedByReferenceId);
    return user?.referenceId
  }

  public get isDisabled(): boolean {
   return !this.nuggetID;
  }

  get currentSubject() {
    return `${ApplicationDSModule.selectedModule}_${ApplicationDSModule.selectedModuleTab}_nugget` as Subjects;
  }

  get canEditTitle() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_name` as Subjects);
  }

  get canReadTitle() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_name` as Subjects) || this.canEditTitle;
  }

  get canEditType() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_type` as Subjects);
  }

  get canReadType() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_type` as Subjects) || this.canEditType;
  }

  get canEditProject() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_project` as Subjects);
  }

  get canReadProject() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_project` as Subjects) || this.canEditProject;
  }

  get canEditPriority() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_priority` as Subjects);
  }

  get canReadPriority() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_priority` as Subjects) || this.canEditPriority;
  }

  get canEditTags() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_tags` as Subjects);
  }

  get canReadTags() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_tags` as Subjects) || this.canEditTags;
  }

  get canEditRelatedNuggets() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_relatednuggets` as Subjects);
  }

  get canReadRelatedNuggets() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_relatednuggets` as Subjects) || this.canEditRelatedNuggets;
  }

  get canEditDescription() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_description` as Subjects);
  }

  get canReadDescription() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_description` as Subjects) || this.canEditDescription;
  }

  get canEditSubscribed() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_subscribe` as Subjects);
  }

  get canReadSubscribe() {
    return PermissionDSModule.can(Actions.READ, `${this.currentSubject}_subscribe` as Subjects)
  }

  get canEditSprint() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_sprint` as Subjects) && this.nuggetDetail.stage !== NUGGET_STAGES.RELEASED;
  }

  get canEditBacklog() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_backlog` as Subjects);
  }

  get canEditArchive() {
    return PermissionDSModule.can(Actions.WRITE, `${this.currentSubject}_archive` as Subjects);
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
.description{
  height: 100%;
  &.error{
    height: calc(100% - 30px);
  }
  ::v-deep textarea{
    resize: none;
  }
}
.action{
  display: grid;
  grid-template-columns: auto auto auto 1fr;
  grid-gap: 14px;
  align-items: center;
}
.details{
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
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

.subscribed-checkbox {
  width: fit-content;
}
</style>
