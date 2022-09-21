import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import Specialty from './specialtyDM';

@JsonObject('SkillDM')
export default class SkillDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("description", String, true) description = '';
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("createdAt", String, true) createdAt = '';
  @JsonProperty("title", String, true) title = '';
  @JsonProperty("specialties", [Specialty], true) specialties: Specialty[] = [];
  @JsonProperty("removedAt", String, true) removedAt: string | null = '';
}
