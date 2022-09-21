
import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsTagsRow")
export default class SettingsTagsRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("title", String)
  title: string | undefined = undefined;

  @JsonProperty("organizationId", Number)
  organizationId: number | undefined = undefined

  @JsonProperty("description", String)
  description: string | undefined = undefined

  @JsonProperty("removedAt", String)
  removedAt: string | undefined = undefined

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }

}
