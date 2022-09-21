import { JsonObject, JsonProperty } from "json2typescript"
import Datamodel from "./base/datamodel"

@JsonObject("TimeCardDM")
export default class TimeCardDM extends Datamodel {
  @JsonProperty("id", Number) id = 0
  @JsonProperty("date", String, true) date = ""
  @JsonProperty("hours", Number, true) hours = 0
  @JsonProperty("assignmentId", Number, true) assignmentId = 0
  @JsonProperty("lastHoursValue", Number, true) lastHoursValue = 0
  @JsonProperty("note", String, true) note = ""
}