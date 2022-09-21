import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsPhasesRow")
export default class SettingsPhasesRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("title", String)
  title: string | undefined = undefined

  @JsonProperty("description", String, true)
  description: string | undefined = undefined
  
  @JsonProperty("order", Number)
  order: number | undefined = undefined

  @JsonProperty("skillId", Number)
  skillId: number | undefined = undefined

  @JsonProperty("skillTitle", String)
  skillTitle: string | undefined = undefined

  @JsonProperty("removedAt", String)
  removedAt: string | undefined = undefined
  
  @JsonProperty("isSystem", Boolean)
  isSystem = false  

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }


}
