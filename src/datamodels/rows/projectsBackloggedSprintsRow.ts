import { JsonObject, JsonProperty } from "json2typescript";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import ProjectDM from "@/datamodels/projectDM";
import { ProjectNumberConverter, SprintNumberConverter } from "../converters";


@JsonObject("ProjectsBackloggedSprintsRow")
export default class ProjectsBackloggedSprintsRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined;

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined;

    @JsonProperty("projectNumber", ProjectNumberConverter, true)
    projectNumber = '';

    @JsonProperty('number', SprintNumberConverter, true)
    sprintNumber = '';

    get projectSprintNumber() {
        return `${this.projectNumber}-${this.sprintNumber}`;
    }

    get groupTitle() {
        return ''
    }

    @JsonProperty("project", ProjectDM) project: ProjectDM | undefined = undefined;
    get projectTitle() {
        return this.project?.title || '';
    }
    set projectTitle(value: string) {
        if(this.project) this.project.title = value
    }

    get sprintId() {
        return this.id;
      }

    @JsonProperty("name", String)
    sprintName: string | undefined = undefined

    _projectSprint: string | undefined = undefined;
    get projectSprint() {
        return `${this.projectTitle!.capitalize()}: ${this.sprintName!.capitalize()}`
    }


    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;

    get managerFullName() {
        return this.project?.managerFullName || '';
    }

    get secondaryManagerFullName() {
        return this.project?.secondaryManagerFullName || '';
    }

    get managerId() {
        return this.project?.managerId || '';
    }

    get secondaryManagerId() {
        return this.project?.secondaryManagerId || '';
    }

}
