import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store, {
  ApplicationDSModule,
  SprintsViewDSModule,
  ReleaseDSModule,
  StatusDSModule,
  PeriodsDSModule,
  SprintDSModule,
  SprintDetailCSModule
} from '@/store';
import cloneDeep from 'lodash.clonedeep';
import {DetailTabName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import SprintDM from '@/datamodels/sprintDM';
import { getDifference } from '@/utils/object';
import { dateISOFormat } from '@/utils/date';
import {isEmpty} from "@/utils/object";
 
@Module({ name: 'sprintdetailcs', namespaced: true })
export class SprintDetailCS extends VuexModule implements ILifeCycle{
  sprintDetail: SprintDM = new SprintDM();

  @Mutation
  setSprintDetail(sprintView: SprintDM) {
    this.sprintDetail = sprintView;
  }
  
  public get statuses() {
    return StatusDSModule.statuses;
  }
  
  public get periods() {
    return PeriodsDSModule.periods;
  }

  public get sprintsView() {
    return SprintsViewDSModule.sprintsView;
  }

  public get releases() {
    return ReleaseDSModule.itemsAsArray;
  }

  public get isBackloggedSprint(): boolean {
    return ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsBackloggedSprints;
  }

  public get isInboxSprint(): boolean {
    return ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxSprints;
  }

  @Action({ rawError: true })
  async updateSprintDetailFromCache() {
    this.setSprintDetail(cloneDeep(SprintsViewDSModule.currentSprintView))
  }

  @Action({rawError: true})
  async handelUpdateSprint(){
    const difference = getDifference(SprintsViewDSModule.currentSprintView,SprintDetailCSModule.sprintDetail)
  if(!isEmpty(difference)){
    if(difference['name'] || difference['description'] || difference['period']){
      await this.updateSprintDetail()
    }
    if ((this.isBackloggedSprint|| this.isInboxSprint) && difference['returnToTriageJobDate']){
      await this.rescheduleSprint(dateISOFormat(difference['returnToTriageJobDate'].new))
    }
    if(difference['releaseId']){
      if(difference['releaseId'].old === 0 ){
        this.appendReleaseSprint(difference['releaseId'].new)
      }else if(difference['releaseId'].new === 0 ) {
        this.removeReleaseSprint(difference['releaseId'].old)
      }else if(difference['releaseId'].old !== 0 && difference['releaseId'].new !== 0 ){
        await this.removeReleaseSprint(difference['releaseId'].old)
        this.appendReleaseSprint(difference['releaseId'].new)
      }
    }
  }  

 }

  @Action({ rawError: true })
  async updateSprintDetail() {        
    await SprintDSModule.update({sprintId: this.sprintDetail.id, sprintName: this.sprintDetail.name, projectID: this.sprintDetail.project.id, description: this.sprintDetail.description, period: this.sprintDetail.period})
  }

  @Action({rawError: true})
  async rescheduleSprint(returnToTriage: string) {
    await SprintDSModule.rescheduleSprint({returnToTriage: returnToTriage, sprintId: this.sprintDetail.id});
  }

  @Action({rawError: true})
  async removeReleaseSprint(releaseId: number) {
    await SprintsViewDSModule.removeReleaseSprints({releaseId: releaseId, sprintId: this.sprintDetail.sprintId});
  }

  @Action({rawError: true})
  async appendReleaseSprint(releaseId: number) {
    await SprintsViewDSModule.appendReleaseSprints({releaseId: releaseId, sprintId: this.sprintDetail.sprintId});
  }

  @Action({ rawError: true })
  onInitialization() {

    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedSprintsViewID;
      },
      function onChange(id) {
        if (id!== 0 && ApplicationDSModule.selectedDetailTab === DetailTabName.sprintDetails) {
          SprintDetailCSModule.updateSprintDetailFromCache()
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.sprintsviewds.itemWatch;
      },
      function onChange(sprint) {
        if(ApplicationDSModule.selectedDetailTab === DetailTabName.sprintDetails) {
          SprintDetailCSModule.updateSprintDetailFromCache()
        }
      }
    );
  }

  @Action({rawError: true})
  async activate(){
    if(ApplicationDSModule.selectedDetailTab === DetailTabName.sprintDetails) {
      this.updateSprintDetailFromCache()
    }
  }
}
