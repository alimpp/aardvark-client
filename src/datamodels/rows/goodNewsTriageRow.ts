import {JsonObject, JsonProperty} from "json2typescript"
import ProjectDM from "@/datamodels/projectDM"
import SprintDM from '../sprintDM';
import Tag from "@/datamodels/tagDM";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import dayjs from "dayjs"
import { NUGGET_STAGES } from "@/utils/constants"
import { today } from './../../utils/date';
import { NuggetNumberConverter } from "../converters";

@JsonObject("GoodNewsTriageRow")
export default class GoodNewsTriageRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined;

    @JsonProperty("number", NuggetNumberConverter, true)
    nuggetNumber = '';

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined

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

    @JsonProperty("tags", [Tag])
    tags: [Tag] | undefined = undefined;


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

    @JsonProperty("project", ProjectDM)
    project: ProjectDM | undefined = undefined;
    get projectTitle() {
      return this.project?.title || '';
    }

    set projectTitle(value: string) {
      if(this.project) this.project.title = value
    }

    @JsonProperty("assignmentLevel", String)
    _assignmentLevel: string | undefined = undefined
    get assignmentLevel() {
        return this._assignmentLevel!.capitalize()
    }
    set assignmentLevel(value: string){
      this._assignmentLevel = value;
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
    _responseTime: number | undefined = undefined

    get responseTime() {
      if (!this._responseTime) {
        return '00:00'
      }
      const hour = Math.floor(this._responseTime)
      const minute = Math.floor((this._responseTime - hour) * 60)
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
    set responseTime(value: any) {
      this._responseTime = value
    }

    @JsonProperty("createdByMemberId", Number)
    creatorMemberId: number | null = null

    @JsonProperty("origin", String)
    _origin: string | undefined = undefined
    get origin() {
      return this._origin!.capitalize()
    }

    set origin(value) {
      this._origin = value
    }

    @JsonProperty("fullName", String)
    fullName: string | undefined = undefined

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
