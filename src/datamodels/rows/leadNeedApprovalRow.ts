import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript"
import SprintDM from '../sprintDM';
import { JsonParser } from '@/utils/jsonparser'
import TableSubmoduleRow from "../base/tableSubmoduleRow"
import { NuggetNumberConverter } from "../converters";

@JsonConverter
class NeedsWorkConverter implements JsonCustomConvert<Boolean> {
  serialize(data: boolean): boolean {
    return data;
  }
  deserialize(data: string): boolean {
    return data === 'need-work';
  }
}

@JsonObject("LeadNeedApprovalRow")
export default class LeadNeedApprovalRow extends TableSubmoduleRow {

  approve = false;

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("projectId", Number)
  projectId: number | undefined = undefined

  @JsonProperty("nuggetId", Number)
  nuggetId: number | undefined = undefined;

  @JsonProperty('nuggetNumber', NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("nuggetTitle", String)
  nuggetTitle: string | undefined = undefined

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined;

  @JsonProperty("nuggetKind", String)
  _type: string | undefined = undefined

  @JsonProperty("nuggetStage", String, true) nuggetStage: string | null = null;

  get type() {
    return this._type!.capitalize()
  }
  set type(value: string) {
    this._type = value
  }
  @JsonProperty("sprintId", Number, true) sprintId = 0;
  @JsonProperty("sprintNumber", Number, true) sprintNumber: number | null = null;
  @JsonProperty("sprintName", String, true) sprintName: string | null = null;
  @JsonProperty("sprintStage", String, true) sprintStage: string | null = null;
  @JsonProperty("sprintStatus", String, true) sprintStatus: string | null = null;
  _sprint: SprintDM | null = null;
  get sprint() {
    if(this._sprint) return this._sprint;
    if(this.sprintId) {
      return JsonParser.deserializeObject<SprintDM>({
        id: this.sprintId,
        number: this.sprintNumber,
        projectId: this.projectId,
        stage: this.sprintStage,
        name: this.sprintName,
        boarding: this.tempo,
        status: this.sprintStatus
      }, SprintDM)
    }
    return null;
  }
  set sprint(value: SprintDM | null) {
    this._sprint = value;
  }

  @JsonProperty("status", String, true) status: string | null = null;

  @JsonProperty("phaseTitle", String)
  phaseTitle: string | undefined = undefined

  @JsonProperty("gracePeriod", Number)
  responseTime: number | undefined = undefined

  @JsonProperty("projectTitle", String)
  _projectTitle: string | undefined = undefined
  get projectTitle() {
    return this._projectTitle!.capitalize()
  }
  set projectTitle(value: string) {
    this._projectTitle = value
  }

  @JsonProperty("fullName", String)
  fullName: string | undefined = undefined

  @JsonProperty("memberId", Number)
  memberId: number | null = null

  @JsonProperty("nuggetPriority", String)
  _nuggetPriority: string | undefined = undefined
  get nuggetPriority() {
    return this._nuggetPriority!.capitalize()
  }
  set nuggetPriority(value: string) {
    this._nuggetPriority = value
  }
  @JsonProperty('status', NeedsWorkConverter) needsWork = false;

}
