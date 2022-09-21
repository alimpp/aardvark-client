import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';

@JsonObject('GroupDM')
export default class GroupDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("description", String, true) description = '';
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("type", String, true) type = '';
  @JsonProperty("title", String, true) title = '';
  @JsonProperty("removedAt", String, true) removedAt: string | null = '';
  @JsonProperty("entityType", String, true) entityType = ""
}
