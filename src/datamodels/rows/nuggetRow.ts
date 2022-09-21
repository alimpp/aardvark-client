import { JsonObject, JsonProperty } from "json2typescript";
import ProjectDM from "@/datamodels/projectDM"
import dayjs from "dayjs";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter } from "../converters";

@JsonObject("NuggetRow")
export default class NuggetRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined

    @JsonProperty("number", NuggetNumberConverter, true)
    nuggetNumber = '';

    @JsonProperty("isSubscribedPublic", Boolean)
    isSubscribedPublic = false;

    @JsonProperty("title", String)
    title: string | undefined = undefined;

    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;

    @JsonProperty("type", String)
    _kind: string | undefined = undefined;
    get kind() {
        return this._kind!.capitalize()
    }
    set kind(value: string) {
        this._kind = value;
    }

    @JsonProperty("leadPhaseTitle", String)
    _leadPhaseTitle: string | undefined = undefined;
    get phaseTitle() {
        return this._leadPhaseTitle!.capitalize();
    }
    set phaseTitle(value: string) {
        this._leadPhaseTitle = value;
    }

    get phaseTitleStatus(){
        return this.phaseTitle + ': ' + this.status
      }

    @JsonProperty("seenAt", String, true)
    _seenAt: string | null | undefined = null;
    get seenAt() {
        if(!this._seenAt){
            if (!this.privateSeenAt){
                this._seenAt = this.publicSeenAt
            } else if (!this.publicSeenAt) {
                this._seenAt = this.privateSeenAt
            } else {
                if (dayjs(this.publicSeenAt).isAfter(this.privateSeenAt)) {
                    this._seenAt = this.publicSeenAt
                } else {
                    this._seenAt = this.privateSeenAt
                }
            }
        }
        return this._seenAt
    }

    @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
    @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;
    get isBold() {
        return this.publicIsUnread || this.privateIsUnread;
    }

    @JsonProperty("status", String)
    _status: string | undefined = undefined;
    get status(){
        return this._status!.formatText();
    }

    @JsonProperty("publicSeenAt", String, true)
    publicSeenAt: string | null | undefined = undefined;

    @JsonProperty("stage", String, true)
    stage: string | null | undefined = undefined;

    @JsonProperty("privateSeenAt", String, true)
    privateSeenAt: string | null | undefined = undefined;

    @JsonProperty("recentMessageAt", String, true)
    recentMessageAt: string | null = null;

    @JsonProperty("project", ProjectDM)
    project: ProjectDM | undefined = undefined;

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined

}
