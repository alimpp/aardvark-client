import {JsonObject, JsonProperty} from "json2typescript"
import { createcadence, cadenceTypes } from "@/utils/create-cadence";
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter } from "../converters";

@JsonObject("ReportInProgressRow")
export default class ReportInProgressRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("nuggetId", Number)
  nuggetId: number | undefined = undefined;

  @JsonProperty("nuggetNumber", NuggetNumberConverter, true)
  nuggetNumber: number | undefined = undefined;

  @JsonProperty("nuggetTitle", String)
  nuggetTitle: string | undefined = undefined

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined

  @JsonProperty("nuggetKind", String)
  _type: string | undefined = undefined
  get type() {
    return this._type!.capitalize()
  }
  set type(value: string) {
    this._type = value
  }

  @JsonProperty("perspective", String)
  _timeCard: string | undefined = undefined
  get timeCard() {
    return this._timeCard!.capitalize()
  }


  @JsonProperty("startDate", String)
  startDate: string | undefined = undefined

  @JsonProperty("endDate", String)
  endDate: string | undefined = undefined

  @JsonProperty("cadenceProgress", Number)
  cadenceProgress: number |undefined = undefined

  @JsonProperty("cadenceTempo", String)
  cadenceTempo: string | undefined = undefined

  @JsonProperty("remainingHours", Number)
  remainingHours: number |undefined = undefined

  @JsonProperty("estimatedHours", Number)
  estimatedHours: number |undefined = undefined

  @JsonProperty("cadence", Object, true)
  _cadence: object | undefined = undefined
  get cadence() {
    return createcadence(cadenceTypes.assignment, this.cadenceProgress, this.cadenceTempo, this.remainingHours, this.estimatedHours)
  }

  @JsonProperty("status", String)
  _status: string | undefined = undefined
  get status() {
    return this._status!.capitalize()
  }

  @JsonProperty("phaseTitle", String)
  phaseTitle: string | undefined = undefined

  @JsonProperty("projectTitle", String)
  _projectTitle: string | undefined = undefined
  get projectTitle() {
    return this._projectTitle!.capitalize()
  }
  set projectTitle(value: string) {
    this._projectTitle = value
  }


  @JsonProperty("nuggetPriority", String)
  _nuggetPriority: string | undefined = undefined
  get nuggetPriority() {
    return this._nuggetPriority!.capitalize()
  }
  set nuggetPriority(value: string) {
    this._nuggetPriority = value
  }

  @JsonProperty("projectId", Number)
  projectId: number | undefined = undefined

}
