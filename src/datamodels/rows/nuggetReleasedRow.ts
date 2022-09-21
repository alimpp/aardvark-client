import { JsonObject, JsonProperty } from "json2typescript";
import ProjectDM from "@/datamodels/projectDM"
import Tag from '@/datamodels/tagDM';
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import SprintDM from "../sprintDM";
import { NuggetNumberConverter } from "../converters";

@JsonObject("NuggetReleasedRow")
export default class NuggetReleasedRow extends TableSubmoduleRow {

    @JsonProperty("id", Number, true)
    id: number | undefined = undefined;

    @JsonProperty("number", NuggetNumberConverter, true)
    nuggetNumber = '';

    @JsonProperty("isSubscribedPublic", Boolean)
    isSubscribedPublic = false;

    @JsonProperty("title", String)
    title: string | undefined = undefined;

    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;

    @JsonProperty("type", String)
    _type: string | undefined = undefined;
    get type(){
        return this._type!.capitalize()
    }
    set type(value: string){
        this._type = value;
    }

    @JsonProperty("leadPhaseTitle", String)
    _leadPhaseTitle: string | undefined = undefined;
    get phaseTitle(){
        return this._leadPhaseTitle!.capitalize();
    }
    set phaseTitle(value: string) {
        this._leadPhaseTitle = value;
    }

    @JsonProperty("status", String)
    _status: string | undefined = undefined;
    get status(){
        return this._status!.formatText();
    }

    @JsonProperty("priority", String)
    _priority: string | undefined = undefined;
    get priority(){
        return this._priority!.capitalize();
    }

    @JsonProperty("dueDate", String)
    dueDate: string | undefined = undefined;

    @JsonProperty("fullName", String)
    fullName: string | undefined = undefined;

    @JsonProperty("createdAt", String)
    createdAt: string | undefined = undefined;

    @JsonProperty("releaseAt", String, true)
    releaseAt: string | undefined = undefined;

    @JsonProperty("tags", [Tag])
    tags: [Tag] | undefined = undefined;


    @JsonProperty("project", ProjectDM)
    project: ProjectDM | undefined = undefined;

    @JsonProperty("sprint", SprintDM)
    sprint: SprintDM | undefined = undefined;

    get sprintName() {
        return this.sprint?.name || ''
    }

}
