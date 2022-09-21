import {JsonObject, JsonProperty} from "json2typescript"
import SprintDM from '../sprintDM';
import { JsonParser } from '@/utils/jsonparser'
import TableSubmoduleRow from "../base/tableSubmoduleRow"
import ProjectDM from "@/datamodels/projectDM"
import { NuggetNumberConverter } from "../converters";

@JsonObject("GoodNewsUpcomingRow")
export default class GoodNewsUpcomingRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined;

  @JsonProperty('number', NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined

  @JsonProperty("title", String)
  nuggetTitle: string | undefined = undefined

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined;

  @JsonProperty("type", String)
  _type: string | undefined = undefined

  @JsonProperty("stage", String, true)
    stage: string | null | undefined = undefined;

  @JsonProperty("assignmentLevel", String , true)
    _assignmentLevel: string | null | undefined = undefined

  @JsonProperty("estimated", String , true)
  _estimated: string | null | undefined = undefined

  get type() {
    return this._type!.capitalize()
  }
  set type(value: string) {
    this._type = value
  }

  get assignmentLevel(){
    return this._assignmentLevel!.capitalize()
  }
  set assignmentLevel(value: string){
    this._assignmentLevel = value;
  }

  get estimated(){
    return this._estimated!.capitalize()
  }
  set estimated(value: string){
    this._estimated = value
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

  @JsonProperty("leadPhaseTitle", String)
  leadPhaseTitle: string | undefined = undefined

  @JsonProperty("project", ProjectDM)
  project: ProjectDM | undefined = undefined;
  get projectTitle() {
    return this.project?.title || '';
  }

  set projectTitle(value: string) {
    if(this.project) this.project.title = value
  }

  @JsonProperty("priority", String)
  _nuggetPriority: string | undefined = undefined
  get nuggetPriority() {
    return this._nuggetPriority!.capitalize()
  }
  set nuggetPriority(value: string) {
    this._nuggetPriority = value
  }

}
