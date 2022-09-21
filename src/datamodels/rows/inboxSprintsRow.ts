import { JsonObject, JsonProperty } from "json2typescript";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import ProjectDM from "@/datamodels/projectDM";
import { ProjectNumberConverter, SprintNumberConverter } from "../converters";

@JsonObject("InboxSprintRow")
export default class InboxSprintRow extends TableSubmoduleRow {

    @JsonProperty("id", Number, true)
    sprintId: number | undefined = undefined;

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined;

    @JsonProperty('number', SprintNumberConverter, true)
    sprintNumber = '';

    @JsonProperty('projectNumber', ProjectNumberConverter, true)
    projectNumber = '';

    get projectSprintNumber(): string {
        return (this.projectNumber && this.sprintNumber) ? this.projectNumber.concat('-', this.sprintNumber) : '';
    }

    @JsonProperty("project", ProjectDM) project: ProjectDM | undefined = undefined;
    get projectTitle() {
        return this.project?.title || '';
    }
    set projectTitle(value: string) {
        if(this.project) this.project.title = value
    }

    @JsonProperty("name", String)
    sprintName: string | undefined = undefined

    _projectSprint: string | undefined = undefined;
    get projectSprint() {
        return `${this.projectTitle!.capitalize()}: ${this.sprintName!.capitalize()}`
    }

    get managerFullName() {
        return this.project?.managerFullName || '';
    }

    get managerId() {
        return this.project?.managerId || '';
    }

    get secondaryManagerFullName() {
        return this.project?.secondaryManagerFullName || '';
    }

    get secondaryManagerId() {
        return this.project?.secondaryManagerId || '';
    }


    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;


    @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
    @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;
    get isBold() {
        return this.publicIsUnread || this.privateIsUnread;
    }

    @JsonProperty("publicSeenAt", String, true)
    publicSeenAt: string | null | undefined = undefined;

    @JsonProperty("privateSeenAt", String, true)
    privateSeenAt: string | null | undefined = undefined;

    @JsonProperty("recentMessageAt", String, true)
    recentMessageAt: string | null = null;
}
