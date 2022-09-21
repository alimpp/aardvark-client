import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store, {
  ApplicationDSModule,
  SprintsViewDSModule,
  GroupDSModule,
  ProjectDSModule,
  ReleaseDSModule,
  StatusDSModule,
  UserDSModule,
  ProjectDetailCSModule
} from '@/store';
import ProjectDM from '@/datamodels/projectDM'
import cloneDeep from 'lodash.clonedeep';
import {DetailTabName} from "@/store/modules/datastore/applicationDS";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";

@Module({name: 'projectdetailcs', namespaced: true})
export class ProjectDetailCS extends VuexModule implements ILifeCycle {
  projectDetail: ProjectDM = new ProjectDM();

  @Mutation
  setProjectDetail(project: ProjectDM) {
    this.projectDetail = project;
  }

  public get groups() {
    return GroupDSModule.itemsAsArray;
  }

  public get projects() {
    return ProjectDSModule.itemsAsArray;
  }

  public get users() {
    return UserDSModule.sortedItems('fullName');
  }


  public get statuses() {
    return StatusDSModule.statuses;
  }

  public get sprintsView() {
    return SprintsViewDSModule.sprintsView;
  }

  public get releases() {
    return ReleaseDSModule.sortedItems('title');
  }

  @Action({ rawError: true })
  async updateProjectDetailFromCache() {
    this.setProjectDetail(cloneDeep(ProjectDSModule.currentProject))
  }

  @Action({rawError: true})
  async updateProject() {
    await ProjectDSModule.updateProject(this.projectDetail);
  }

  @Action({rawError: true})
  async removeReleaseSprint(args: {releaseId: number, sprintId: number}) {
    await SprintsViewDSModule.removeReleaseSprints({releaseId: args.releaseId, sprintId: args.sprintId});
  }

  @Action({rawError: true})
  async appendReleaseSprint(args: {releaseId: number, sprintId: number}) {
    await SprintsViewDSModule.appendReleaseSprints({releaseId: args.releaseId, sprintId: args.sprintId});
  }


  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedProjectID;
      },
      function onChange(id) {
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.project) {
          ProjectDetailCSModule.updateProjectDetailFromCache();
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.applicationds.selectedSprintsViewID;
      },
      function onChange(id) {
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.project) {
          ProjectDetailCSModule.updateProjectDetailFromCache();
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.projectds.itemWatch;
      },
      function onChange(projects) {
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.project) {
          ProjectDetailCSModule.updateProjectDetailFromCache()
        }
      }
    );
  }

  @Action({rawError: true})
  async activate() {
    if (ApplicationDSModule.selectedDetailTab === DetailTabName.project) {
      this.updateProjectDetailFromCache()
    }
  }
}
