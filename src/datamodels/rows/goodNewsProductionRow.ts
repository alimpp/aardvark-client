import {JsonObject, JsonProperty} from "json2typescript"
import SprintDM from '../sprintDM';
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import NuggetPhaseDM from "../nuggetPhaseDM";
import { cadenceTypes, createcadence } from "@/utils/create-cadence";
import { NuggetNumberConverter } from "../converters";

@JsonObject("GoodNewsProductionRow")
export default class GoodNewsProductionRow extends TableSubmoduleRow {

    @JsonProperty("id", Number)
    id: number | undefined = undefined;

    @JsonProperty("number", NuggetNumberConverter, true)
    nuggetNumber = '';

    get entityId() {
        return this.id;
    }

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

    @JsonProperty("projectId", Number)
    projectId: number | undefined = undefined

    @JsonProperty("batchId", Number, true) batchId = 0;

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
