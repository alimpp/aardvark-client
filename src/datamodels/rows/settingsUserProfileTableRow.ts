import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsUserProfileTableRow")
export default class SettingsUserProfileTableRow extends TableRow {

  @JsonProperty("del", Number)
  del: number | undefined = undefined;

  @JsonProperty("skill", String)
  skill: String | undefined = undefined;

  @JsonProperty("lead", Number)
  lead: number | undefined = undefined;


  @JsonProperty("specialties", String)
  specialties: string | undefined = undefined;

}
