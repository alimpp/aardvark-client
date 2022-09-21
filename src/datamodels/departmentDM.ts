import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import User from '@/datamodels/userDM'

@JsonObject('DepartmentDM')
export default class DepartmentDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("name", String, true) name = '';
  @JsonProperty("removedAt", String, true) removedAt: string | null = '';
  @JsonProperty("members", [User], true) members: User[] = [];
}
