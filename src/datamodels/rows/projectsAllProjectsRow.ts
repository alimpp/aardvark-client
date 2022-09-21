import { JsonObject, JsonProperty } from "json2typescript";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { ProjectNumberConverter } from "../converters";

@JsonObject("ProjectsAllProjectsRow")
export default class ProjectsAllProjectsRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined;

    @JsonProperty("number", ProjectNumberConverter, true)
    projectNumber = '';

    @JsonProperty("title", String)
    title: string | undefined = undefined;

    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;

    @JsonProperty("status", String)
    _status: string | undefined = undefined;
    get status() {
        return this._status!.capitalize()
    }

    @JsonProperty("workflowTitle", String)
    workflowTitle: string | undefined = undefined

    @JsonProperty("managerFullName", String)
    managerFullName: String | undefined = undefined;

    @JsonProperty("secondaryManagerFullName", String)
    secondaryManagerFullName: String | undefined = undefined;

    @JsonProperty("managerId", Number)
    managerId: number | null = null

    @JsonProperty("secondaryManagerId", Number)
    secondaryManagerId: number | null = null

    @JsonProperty("isSubscribedPrivate", Boolean)
    isSubscribedPrivate= false

    @JsonProperty("isSubscribedPublic", Boolean)
    isSubscribedPublic= false

    @JsonProperty("publicSeenAt", String, true)
    publicSeenAt: string | null | undefined = undefined;

    @JsonProperty("privateSeenAt", String, true)
    privateSeenAt: string | null | undefined = undefined;

    get alert() {
        return ((this.isSubscribedPrivate && !this.privateSeenAt) || (this.isSubscribedPublic && !this.publicSeenAt) ) 
    }

}
