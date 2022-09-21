import { JsonObject, JsonProperty } from "json2typescript";
import ProjectDM from "@/datamodels/projectDM"
import Tag from '@/datamodels/tagDM';
import dayjs from "dayjs";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter, ProjectNumberConverter } from "../converters";

@JsonObject("NuggetSubscriptionsActiveRow")
export default class NuggetSubscriptionsActiveRow extends TableSubmoduleRow {

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

    get phaseTitleStatus(){
        return this.phaseTitle + ': ' + this.status
      }

    @JsonProperty("status", String)
    _status: string | undefined = undefined;
    get status(){
        return this._status!.formatText();
    }

    @JsonProperty("stage", String, true)
    stage: string | null | undefined = undefined;

    @JsonProperty("priority", String)
    _priority: string | undefined = undefined;
    get priority(){
        return this._priority!.capitalize();
    }

    @JsonProperty("dueDate", String)
    _dueDate: string | undefined = undefined;

    set dueDate(value: string | undefined) {
        this._dueDate = value;
    }

    get dueDate() {
        if(this._status === 'to-do' && !this._dueDate) {
            return dayjs(this.createdAt).add(2, 'day').toISOString()
        }
        return this._dueDate;
    }

    @JsonProperty("fullName", String)
    fullName: String | undefined = undefined;

    @JsonProperty("createdByMemberId", Number)
    createdByMemberId: number | null = null

    @JsonProperty("createdAt", String)
    createdAt: string | undefined = undefined;

    @JsonProperty("tags", [Tag])
    tags: [Tag] | undefined = undefined;


    @JsonProperty("project", ProjectDM)
    project: ProjectDM | undefined = undefined;

}
