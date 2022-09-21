import {JsonObject, JsonProperty} from "json2typescript"
import ProjectDM from "@/datamodels/projectDM"
import Tag from '@/datamodels/tagDM';
import SprintDM from '../sprintDM';
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter } from "../converters";

@JsonObject("GoodNewsArchiveRow")
export default class GoodNewsArchiveRow extends TableSubmoduleRow {

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

    @JsonProperty("priority", String)
    _priority: string | undefined = undefined
    get priority() {
      return this._priority!.capitalize()
    }
    set priority(value: string) {
      this._priority = value
    }

    @JsonProperty("fullName", String)
    fullName: string | undefined = undefined

    @JsonProperty("createdByMemberId", Number)
    creatorMemberId: number | null = null

    @JsonProperty("tags", [Tag])
    tags: [Tag] | undefined = undefined;

}
