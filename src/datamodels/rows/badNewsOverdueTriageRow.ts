import { today } from './../../utils/date';
import {JsonObject, JsonProperty} from "json2typescript"
import SprintDM from '../sprintDM';
import ProjectDM from '../projectDM';
import Tag from "@/datamodels/tagDM";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import dayjs from "dayjs"
import { NUGGET_STAGES } from "@/utils/constants"
import { NuggetNumberConverter } from '../converters';

@JsonObject("BadNewsOverdueTriageRow")
export default class BadNewsOverdueTriageRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined;

    @JsonProperty("nuggetNumber", NuggetNumberConverter, true)
    nuggetNumber = '';

    @JsonProperty("title", String)
    title: string | undefined = undefined;

    @JsonProperty("tempo", String)
    tempo: string | undefined = undefined;

    @JsonProperty("type", String)
    _type: string | undefined = undefined;
    get type(){
        return this._type!.capitalize()
    }
    set type(value: string){
        this._type = value;
    }

    @JsonProperty("sprint", SprintDM, true) sprint: SprintDM | null = null;
    @JsonProperty("sprintId", Number, true) sprintId = 0;

    @JsonProperty("returntotriagejob", Object, true) returntotriagejob: any | null = null;
    _returntotriagejobAt: string | null = null;
    get returnToTriageAt() {
      return this._returntotriagejobAt || this.returntotriagejob?.at || null;
    }
    set returnToTriageAt(v: string | null) {
      this._returntotriagejobAt = v;
    }

    @JsonProperty("project", ProjectDM) project: ProjectDM | undefined = undefined;
    get projectTitle() {
      return this.project?.title || '';
    }
    set projectTitle(value: string) {
      if(this.project) this.project.title = value

    }

    @JsonProperty("assignmentLevel", String)
    _assignmentLevel: string | undefined = undefined;

    get assignmentLevel() {
        return this._assignmentLevel!.capitalize()
    }
    set assignmentLevel(value: string){
      this._assignmentLevel = value
    }

    @JsonProperty("priority", String)
    _priority: string | undefined = undefined
    get priority() {
      return this._priority!.capitalize()
    }
    set priority(value: string) {
      this._priority = value
    }

    @JsonProperty("responseTime", Number)
    responseTime: number | undefined = undefined

    @JsonProperty("origin", String)
    _origin: string | undefined = undefined
    get origin() {
      return this._origin!.capitalize()
    }
    set origin(value: string) {
      this._origin = value
    }

    @JsonProperty("fullName", String)
    fullName: string | undefined = undefined

    @JsonProperty("createdByMemberId", Number)
    creatorMemberId: number | null = null

  @JsonProperty("projectId", Number)
  projectId: number | undefined = undefined

  @JsonProperty("tags", [Tag])
  tags: [Tag] | undefined = undefined;

  @JsonProperty("stage", String)
    stage: string | undefined = undefined

  _moveToBacklog = false;
  get moveToBacklog() {
    if(this.returnToTriageAt && dayjs(this.returnToTriageAt).isAfter(today)) {
      return true;
    }
    return this._moveToBacklog;
  }

  set moveToBacklog(val: boolean) {
    this._moveToBacklog = val
  }

  _moveToArchive = false;
  get moveToArchive() {
    return this.stage === NUGGET_STAGES.ARCHIVE || this._moveToArchive
  }

  set moveToArchive(val: boolean) {
    this._moveToArchive = val
  }

}
