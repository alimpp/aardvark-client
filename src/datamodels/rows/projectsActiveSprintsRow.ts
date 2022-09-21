import {JsonObject, JsonProperty} from "json2typescript";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { ProjectNumberConverter, SprintNumberConverter } from "../converters";
import ProjectDM from "../projectDM";

@JsonObject("ProjectsActiveSprintsRow")
export default class ProjectsActiveSprintsRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined;

    @JsonProperty("projectNumber", ProjectNumberConverter, true)
    projectNumber = '';

    @JsonProperty('number', SprintNumberConverter, true)
    sprintNumber = '';

    get projectSprintNumber() {
        return `${this.projectNumber}-${this.sprintNumber}`;
    }

    @JsonProperty("projectTitle", String)
    projectTitle: string | undefined = undefined;

    @JsonProperty("sprintId", Number)
    sprintId: number | undefined = undefined

    @JsonProperty("name", String)
    sprintName: string | undefined = undefined

    _projectSprint: string | undefined = undefined;
    get projectSprint() {
        return `${this.projectTitle!.capitalize()}: ${this.sprintName!.capitalize()}`
    }


    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;

    @JsonProperty("releaseTitle", String)
    releaseTitle: string | undefined = undefined;

    @JsonProperty("launchDate", String)
    releaseDate: string | undefined = undefined;

    @JsonProperty("cutoff", String)
    releaseCutoff: string | undefined = undefined;

    @JsonProperty("dueDate", String)
    sprintTarget: string | undefined = undefined;

    @JsonProperty("managerFullName", String)
    managerFullName: String | undefined = undefined;

    @JsonProperty("secondaryManagerFullName", String)
    secondaryManagerFullName: String | undefined = undefined;

    @JsonProperty("project", ProjectDM)
    project: ProjectDM | undefined = {} as ProjectDM

    get managerId() {
        return this.project?.managerId || 0
    }

    get secondaryManagerId() {
        return this.project?.secondaryManagerId || 0
    }

}
