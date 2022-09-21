import {JsonObject, JsonProperty} from "json2typescript"
import TableSubmoduleRow from "../base/tableSubmoduleRow"
import { NuggetNumberConverter } from "../converters";

@JsonObject("AssignmentNeedEstimateRow")
export default class AssignmentNeedEstimateRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("nuggetId", Number, true)
  nuggetId: number | undefined = undefined;

  @JsonProperty("nuggetNumber", NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("nuggetTitle", String)
  nuggetTitle: string | undefined = undefined

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined

  @JsonProperty("nuggetKind", String)
  _type: string | undefined = undefined
  get type() {
    return this._type!.capitalize()
  }
  set type(value: string) {
    this._type = value
  }

  @JsonProperty("phaseTitle", String)
  phaseTitle: string | undefined = undefined

  @JsonProperty("projectTitle", String)
  _projectTitle: string | undefined = undefined
  get projectTitle() {
    return this._projectTitle!.capitalize()
  }
  set projectTitle(value: string) {
    this._projectTitle = value
  }

  @JsonProperty("nuggetPriority", String)
  _nuggetPriority: string | undefined = undefined
  get nuggetPriority() {
    return this._nuggetPriority!.capitalize()
  }
  set nuggetPriority(value: string) {
    this._nuggetPriority = value
  }

  @JsonProperty("responseTime", Number)
  responseTime: number | undefined = undefined

  @JsonProperty("projectId", Number)
  projectId: number | undefined = undefined
}
