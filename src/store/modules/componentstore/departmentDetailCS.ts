import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import cloneDeep from 'lodash.clonedeep';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import DepartmentDM from '@/datamodels/departmentDM';
import store, {DepartmentDetailCSModule, DepartmentDSModule, UserDSModule} from '@/store';


@Module({ name: 'departmentdetailcs', namespaced: true, stateFactory: true })
export class DepartmentDetailCS extends VuexModule implements ILifeCycle {
  
  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  departmentDetail: DepartmentDM = new DepartmentDM();

  get members() {
    return UserDSModule.itemsAsArray
  }

  @Mutation
  setDepartmentDetail(department: DepartmentDM) {
    this.departmentDetail = department;
  }

  @Action({ rawError: true })
  async updateDepartmentDetailFromCache() {
    this.setDepartmentDetail(cloneDeep(DepartmentDSModule.currentDepartment))
  }

  @Action({ rawError: true })
  async updateDepartment() {
    await DepartmentDSModule.updateDepartment(this.departmentDetail)
  }

  @Action({ rawError: true })
  async deactivateDepartment() {
    await DepartmentDSModule.deactivateDepartment(this.departmentDetail.id);
  }

  @Action({ rawError: true })
  async updateMembers() {
    await DepartmentDSModule.updateMembers(this.departmentDetail);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return { departments: state.departmentds.itemWatch, departmentID: state.settingsds.selectedDepartmentID }
      },
      function onChange() {
        DepartmentDetailCSModule.updateDepartmentDetailFromCache();
      }
    );
  }

  @Action({ rawError: true })
  activate() {
    return
  }

}
