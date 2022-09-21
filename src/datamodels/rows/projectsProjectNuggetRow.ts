import {JsonObject, JsonProperty} from "json2typescript";
import ProjectDM from "@/datamodels/projectDM";
import SprintDM from '../sprintDM';
import NuggetPhaseDM from "../nuggetPhaseDM";
import {createcadence, cadenceTypes} from "@/utils/create-cadence";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter } from "../converters";

@JsonObject("ProjectsProjectNuggetRow")
export default class ProjectsProjectNuggetRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
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
  get type() {
    return this._type!.capitalize()
  }
  set type(value: string) {
    this._type = value;
  }

  @JsonProperty("stage", String, true)
  stage: string | null | undefined = undefined;

  @JsonProperty("leadPhaseTitle", String)
  _leadPhaseTitle: string | undefined = undefined;
  get phaseTitle() {
    return this._leadPhaseTitle!.capitalize();
  }
  set phaseTitle(value: string) {
    this._leadPhaseTitle = value;
  }

  @JsonProperty("status", String)
  _status: string | undefined = undefined;
  get status() {
    return this._status!.formatText();
  }

  @JsonProperty("priority", String)
  _priority: string | undefined = undefined;
  get priority() {
    return this._priority!.capitalize();
  }

  @JsonProperty("dueDate", String)
  dueDate: string | null = null;

  @JsonProperty("fullName", String)
  fullName: string | undefined = undefined;

  @JsonProperty("createdAt", String)
  createdAt: string | undefined = undefined;

  @JsonProperty("sprint", SprintDM, true) sprint: SprintDM | null = null;
  @JsonProperty("sprintId", Number, true) sprintId = 0;
  @JsonProperty("projectId", Number) projectId: number | undefined = undefined

  @JsonProperty("project", ProjectDM)
  project: ProjectDM | undefined = undefined;

  @JsonProperty("nuggetPhases", [Object]) nuggetPhases: NuggetPhaseDM[] | undefined = undefined;

  _cadences: object | undefined = undefined
  get cadences() {
    const cadences = {}
    this.nuggetPhases?.map(phase => {
      cadences[`cadence-${phase.phaseTitle}`] = {
        phaseTitle: phase.phaseTitle,
        cadence: createcadence(cadenceTypes.nugget, phase.cadenceProgress, phase.cadenceTempo, phase.cadenceRemainingHours, phase.estimatedHours)
      }
    });
    return cadences
  }

}
