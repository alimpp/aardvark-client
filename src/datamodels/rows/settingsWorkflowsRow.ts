import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"
import { ProjectDSModule } from '@/store';
import PhaseDM from "../phaseDM";

@JsonObject("SettingsWorkflowsRow")
export default class SettingsWorkflowsRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("title", String)
  title: string | undefined = undefined;

  @JsonProperty("description", String)
  description: string | undefined = undefined

  @JsonProperty("phases", [PhaseDM], true)
  _phases: [PhaseDM] | undefined = undefined
  
  get phases() {
    return this._phases?.filter(phase => !phase.isSystem) || []
  }

  @JsonProperty("removedAt", String)
  removedAt: string | undefined = undefined

  get projects() {
    return ProjectDSModule.itemsAsArray.filter(item => {
      return item.workflowId === this.id && item.status === 'active'
    })
  }

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }
}
