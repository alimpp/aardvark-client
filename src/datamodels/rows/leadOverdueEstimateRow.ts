import {JsonObject, JsonProperty} from "json2typescript"
import SprintDM from '../sprintDM';
import { JsonParser } from '@/utils/jsonparser'
import TableSubmoduleRow from "../base/tableSubmoduleRow"
import { NuggetNumberConverter } from "../converters";

@JsonObject("LeadOverdueEstimateRow")
export default class LeadOverdueEstimateRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("nuggetId", Number)
  nuggetId: number | undefined = undefined

  @JsonProperty('nuggetNumber', NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("nuggetTitle", String)
  nuggetTitle: string | undefined = undefined

  @JsonProperty("nuggetStage", String, true) nuggetStage: string | null = null;

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined;

  @JsonProperty("nuggetKind", String)
  _type: string | undefined = undefined

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
      return JsonParser.deserializeObject({
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

  @JsonProperty("responseTime", Number)
  responseTime: number | undefined = undefined

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

  @JsonProperty("status", String, true)
  status: string | null = null;

  get reason() {
    return this.status === 'declined' ? this.status?.capitalize() : 'Overdue'
  }

  @JsonProperty("projectId", Number)
  projectId: number | undefined = undefined

  extend = false;

}
