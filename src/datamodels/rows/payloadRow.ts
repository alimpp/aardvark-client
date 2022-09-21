import { JsonObject, JsonProperty } from "json2typescript";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import ProjectDM from "@/datamodels/projectDM";


@JsonObject("PayloadRow")
export default class PayloadRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined

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

    @JsonProperty("tempo", String)
    boarding: string | undefined = undefined;
}
