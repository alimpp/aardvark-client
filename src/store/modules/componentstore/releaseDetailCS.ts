import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store, {ApplicationDSModule, GroupDSModule, ReleaseDSModule, UserDSModule, ReleasesActiveCSModule, BadgeCountCSModule, ReleaseDetailCSModule} from '@/store';
import ReleaseDM from '@/datamodels/releaseDM';
import cloneDeep from 'lodash.clonedeep';
import {DetailTabName} from "@/store/modules/datastore/applicationDS";
import { ILifeCycle } from '@/store/modules/componentstore/base/interfaces/ILifeCycle'

export interface ILog {
    warning?: any
    error?: any
}

@Module({ name: 'releasedetailcs', namespaced: true })
export class ReleaseDetailCS extends VuexModule implements ILifeCycle {
    releaseDetail: ReleaseDM = new ReleaseDM()
    preflightLog = {} as ILog

    @Mutation
    setReleaseDetail(release: ReleaseDM) {
        this.releaseDetail = release;
  }

    @Mutation
    setPreflightLog(log: ILog) {
        this.preflightLog = log;
  }

    public get groups() {
        return GroupDSModule.itemsAsArray;
  }

  public get launchDate() {
    const release = ReleaseDSModule.items[this.releaseDetail.id];
    return release ? release.launchDate : ''
  }

    public get users() {
        return UserDSModule.sortedItems('fullName');
  }

    @Action({rawError: true})
    async updateRelease() {
        await ReleaseDSModule.updateRelease(this.releaseDetail);
  }

    @Action({rawError: true})
    async completeRelease() {
        const response = await ReleaseDSModule.completeRelease(this.releaseDetail);
      if (response.status !== '') {
          ReleasesActiveCSModule.tableData
            const index = ReleasesActiveCSModule.tableData.findIndex(release => release.id === response.id)
        if (index !== -1) {
            const newState = [...ReleasesActiveCSModule.tableData]
                newState.splice(index, 1);
          await ReleasesActiveCSModule.doSetTableData(newState)
                BadgeCountCSModule.setReleasesActive(BadgeCountCSModule.releasesActive - 1);
                BadgeCountCSModule.setReleasesReleased(BadgeCountCSModule.releasesReleased +1);
          }
      }
      return response
  }

    @Action({rawError: true})
    async preflight() {
        const log = await ReleaseDSModule.preflight(this.releaseDetail);
      this.setPreflightLog(log)
  }

    @Action({rawError: true})
    async updateReleaseDetailFromCache() {
        this.setReleaseDetail(cloneDeep(ReleaseDSModule.currentRelease))
    }


    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.releaseds.itemWatch;
        },
        function onChange(releases) {
                if(ApplicationDSModule.selectedDetailTab === DetailTabName.release) {
                  ReleaseDetailCSModule.updateReleaseDetailFromCache();
          }
      }
        );
  }

    @Action({rawError: true})
    async activate() {
        if(ApplicationDSModule.selectedDetailTab === DetailTabName.release) {
          this.updateReleaseDetailFromCache()
      }
  }
}
