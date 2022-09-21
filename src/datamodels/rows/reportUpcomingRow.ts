import {JsonObject, JsonProperty} from "json2typescript"
import { createcadence, cadenceTypes } from "@/utils/create-cadence";
import dayjs from 'dayjs'
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { NuggetNumberConverter } from "../converters";

@JsonObject("ReportUpcomingRow")
export default class ReportUpcomingRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("nuggetId", Number)
  nuggetId: number | undefined = undefined;

  @JsonProperty("nuggetNumber", NuggetNumberConverter, true)
  nuggetNumber = '';

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


  @JsonProperty("startDate", String)
  startDate: string | undefined = undefined

  _startsIn: string | undefined = undefined
  get startsIn() {
    if (this._startsIn === undefined && this.startDate) {
      const today = dayjs(new Date())
      const startDay = dayjs(this.startDate)
      this._startsIn  = `${startDay.diff(today, 'day') + 1} Days`
    }
    return this._startsIn

  }

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

  _cadence: object | undefined = undefined
  get cadence() {
    return createcadence(cadenceTypes.assignment, this.cadenceProgress, this.cadenceTempo, this.remainingHours, this.estimatedHours)
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
