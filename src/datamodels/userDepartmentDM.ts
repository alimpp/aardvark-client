import { JsonParser } from "@/utils/jsonparser";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import DepartmentDM from "./departmentDM";

@JsonObject('UserDepartmentDM')
export default class UserDepartmentDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("userId", Number, true) userId = 0;
  @JsonProperty("department", DepartmentDM, true) department: DepartmentDM | undefined = undefined
  
  createUserDepartment(userId: number, department: DepartmentDM ) {
    const userDepartment = JsonParser.deserializeObject(
      {
        id: userId,
        userId: userId,
        department: department
    }, UserDepartmentDM);
     
    return userDepartment;
}
}
