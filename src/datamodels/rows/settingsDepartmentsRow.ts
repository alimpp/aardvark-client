
import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsDepartmentsRow")
export default class SettingsDepartmentsRow extends TableRow {
  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("name", String)
  name: string | undefined = undefined;

  @JsonProperty("removedAt", String)
  removedAt: string | undefined = undefined

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }
}