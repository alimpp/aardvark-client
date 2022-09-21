
import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsSkillsRow")
export default class SettingsSkillsRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("title", String, true)
  title: string | undefined = undefined;

  @JsonProperty("organizationId", Number, true)
  organizationId: number | undefined = undefined

  @JsonProperty("description", String, true)
  description: string | undefined = undefined

  @JsonProperty("specialties", Object, true)
  specialties: object | undefined = undefined

  @JsonProperty("removedAt", String)
  removedAt: string | undefined = undefined

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }
}