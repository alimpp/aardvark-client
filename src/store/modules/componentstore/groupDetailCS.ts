import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import GroupDM from '@/datamodels/groupDM';
import store, {GroupDetailCSModule, GroupDSModule} from '@/store';


@Module({ name: 'groupdetailcs', namespaced: true, stateFactory: true })
export class GroupDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  groupDetail: GroupDM = new GroupDM();

  @Mutation
  setGroupDetail(group: GroupDM) {
    this.groupDetail = group;
  }

  @Action({ rawError: true })
  async updateGroupDetailFromCache() {
    this.setGroupDetail(cloneDeep(GroupDSModule.currentGroup))
  }

  @Action({ rawError: true })
  async updateGroup() {
    await GroupDSModule.updateGroup(this.groupDetail)
  }

  @Action({ rawError: true })
  async deactivateGroup() {
    await GroupDSModule.deactivateGroup(this.groupDetail.id);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedGroupID;
      },
      function onChange(groups) {
        GroupDetailCSModule.updateGroupDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.groupds.itemWatch;
      },
      function onChange(groups) {
        GroupDetailCSModule.updateGroupDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
