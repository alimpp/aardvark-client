import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';

@JsonObject('HolidayType')
export default class HolidayTypeDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("title", String) title = '';
  @JsonProperty("description", String, true) description: String | null = null;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
}
