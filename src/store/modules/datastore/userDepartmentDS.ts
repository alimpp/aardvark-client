import UserAPI from "@/api/userAPI"
import DepartmentDM from "@/datamodels/departmentDM";
import { Action, Module, VuexModule } from "vuex-module-decorators";
import { Wait, WaitStates } from '@/utils/vuewait';
import { JsonParser } from "@/utils/jsonparser";
import BaseItemDS from "./base/baseItemDS";
import UserDM from "@/datamodels/userDM";
import UserDepartmentDM from "@/datamodels/userDepartmentDM";

@Module({ name: "userdepartmentds", namespaced: true, stateFactory: true})
export class UserDepartmentDS extends BaseItemDS<UserDepartmentDM>{

  constructor(module: VuexModule<ThisType<UserDepartmentDM>, UserDepartmentDM>) {
      super(module);
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_USER_LOADING)
  async update(params: {user: UserDM, department: DepartmentDM}) {
    const previousDepartment = this.items[params.user.id]?.department;
    if (previousDepartment &&  previousDepartment.id !== params.department.id ) {
        await UserAPI.REMOVE_DEPARTMENT({user:params.user, removedDepartment:previousDepartment.id, showToast:false});
        await UserAPI.ADD_DEPARTMENT({user:params.user, addedDepartment: params.department.id});
       this.removeItemById(params.user.id);
       const userDepartment = new UserDepartmentDM().createUserDepartment(params.user.id , params.department);
       this.addOrReplaceItem(userDepartment);
    }else {
      await UserAPI.ADD_DEPARTMENT({user:params.user, addedDepartment: params.department.id});
      const userDepartment = new UserDepartmentDM().createUserDepartment(params.user.id , params.department);
      this.addOrReplaceItem(userDepartment);
    }

  }


  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_MESSAGE_INFO)
  async doLoad(userId) {
    if(userId) {
      const response = await UserAPI.DEPARTMENT({userId});
      if(response.data){
             const department = JsonParser.deserializeObject(response.data, DepartmentDM);
             const userDepartment = new UserDepartmentDM().createUserDepartment(userId , department);
             this.addOrReplaceItem(userDepartment)
             return department
      }
    }
  }
}