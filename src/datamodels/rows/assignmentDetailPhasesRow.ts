
import {JsonObject, JsonProperty} from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"
import { createcadence, cadenceTypes } from "@/utils/create-cadence";
import { NuggetNumberConverter } from "../converters";

@JsonObject("AssignmentDetailPhasesRow")
export default class AssignmentDetailPhasesRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("phaseId", Number, true)
  _phaseId: number | undefined = undefined
  get phaseId() {
    return this._phaseId || 0
  }

  @JsonProperty("nuggetId", Number, true)
  nuggetId: number | undefined = undefined;

  @JsonProperty("number", NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("isDelayed", Boolean, true)
  isDelayed: Boolean | undefined = undefined

  @JsonProperty("phaseTitle", String, true)
  phaseTitle: string | undefined = undefined

  @JsonProperty("title", String, true)
  _title: string | undefined = undefined
  get title() {
    return this.phaseTitle ? this.phaseTitle!.capitalize() : this._title!.capitalize()
  }

  @JsonProperty("isSkipped", Boolean, true)
  _isSkipped: boolean | undefined = undefined
  get isSkipped() {
    return this._isSkipped ? this._isSkipped : false
  }


  @JsonProperty("status", String, true)
  _status: string | undefined = undefined
  get status() {
    return this._status ? this._status!.capitalize() : ''
  }

  @JsonProperty("startDate", String, true)
  _startDate: string | undefined = undefined

  get startDate() {
    return this._startDate ? this._startDate : ''
  }

  @JsonProperty("endDate", String, true)
  _endDate: string | undefined = undefined

  get endDate() {
    return this._endDate ? this._endDate : ''
  }

  @JsonProperty("cadenceProgress", Number, true)
  _cadenceProgress: number |undefined = undefined
  get cadenceProgress() {
    return this._cadenceProgress ? this._cadenceProgress : 0
  }

  @JsonProperty("cadenceTempo", String, true)
  _cadenceTempo: string | undefined = undefined
  get cadenceTempo() {
    return this._cadenceTempo ? this._cadenceTempo : ''
  }

  @JsonProperty("cadenceRemainingHours", Number, true)
  _remainingHours: number |undefined = undefined
  get remainingHours() {
    return this._remainingHours ? this._remainingHours : 0
  }
  set remainingHours(value) {
    this._remainingHours = value
  }

  @JsonProperty("estimatedHours", Number, true)
  _estimatedHours: number |undefined = undefined
  get estimatedHours() {
    return this._estimatedHours ? this._estimatedHours : 0
  }

  _cadence: object | undefined = undefined
  get cadence() {
    if (this.estimatedHours > 0) {
      return createcadence(cadenceTypes.phase, this.cadenceProgress, this.cadenceTempo, this.remainingHours, this.estimatedHours)
    } else {
      return {cadenceType: cadenceTypes.phase}
    }
  }

  get phase() {
    return this
  }
  @JsonProperty("isSystem", Boolean, true)
  isSystem: boolean |undefined = undefined

}
