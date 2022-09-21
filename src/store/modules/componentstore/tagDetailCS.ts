import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import TagDM from '@/datamodels/tagDM';
import store, {TagDetailCSModule, TagDSModule} from '@/store';


@Module({ name: 'tagdetailcs', namespaced: true, stateFactory: true })
export class TagDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  tagDetail: TagDM = new TagDM();

  @Mutation
  setTagDetail(tag: TagDM) {
    this.tagDetail = tag;
  }

  @Action({ rawError: true })
  async updateTagDetailFromCache() {
    this.setTagDetail(cloneDeep(TagDSModule.currentTag))
  }

  @Action({ rawError: true })
  async updateTag() {
    await TagDSModule.updateTag(this.tagDetail)
  }

  @Action({ rawError: true })
  async deactivateTag() {
    await TagDSModule.deactivateTag(this.tagDetail.id);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.settingsds.selectedTagID;
      },
      function onChange(tags) {
        TagDetailCSModule.updateTagDetailFromCache();
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.tagds.itemWatch;
      },
      function onChange(tags) {
        TagDetailCSModule.updateTagDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
