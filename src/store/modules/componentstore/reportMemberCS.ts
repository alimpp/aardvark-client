import  { Module, VuexModule} from "vuex-module-decorators";
import { UserDSModule,ProfileDSModule } from "@/store";
import { Roles } from "../datastore/permissionDS";

@Module({ name: 'reportmembercs', namespaced: true, stateFactory: true })
export class ReportMemberCS extends VuexModule {
    
    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
      }
    
    public get userlist(){
        return UserDSModule.itemsAsArray.filter(user => user.referenceId !== ProfileDSModule.id && !user.isSystem && user.organizationRoles.includes(Roles.RESOURCE));
     }
    
}