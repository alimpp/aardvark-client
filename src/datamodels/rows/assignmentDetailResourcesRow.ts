import {JsonObject, JsonProperty} from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"
import { createcadence, cadenceTypes } from "@/utils/create-cadence";
import store from '@/store';
import { DELAYED_BY } from "@/utils/constants";
import { NuggetNumberConverter } from "../converters";

@JsonObject("AssignmentDetailResourcesRow")
export default class AssignmentDetailResourcesRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty('nuggetId', Number, true)
  nuggetId: number | undefined = undefined;

  @JsonProperty("nuggetNumber", NuggetNumberConverter, true)
  nuggetNumber = '';

  @JsonProperty("fullName", String, true)
  fullName: string | undefined = undefined

  get isNotAssigned(): boolean {
    const assignmentFn = (assignment) => assignment?.memberId === this.id;
    const phaseAssignments = store.getters['assignmentdetailresourcescs/phaseAssignments']
    return !phaseAssignments.some(assignmentFn);
  }
  @JsonProperty("status", String, true)
  _status: string | undefined = undefined
  get status() {
    return this._status ? this._status.capitalize() : ''
  }

  @JsonProperty("delayedBy", String, true)
  delayedBy: string | undefined = undefined

  @JsonProperty("lastDelayedBy", String, true)
  lastDelayedBy: string | undefined = undefined

  @JsonProperty("startDate", String, true)
  _startDate: string | undefined = undefined

  get startDate() {
    return {
      startDate: this._startDate ? this._startDate : '',
      delayedBy: this.delayedBy,
      lastDelayedBy: this.lastDelayedBy ? this.lastDelayedBy : ''
    }
  }

  @JsonProperty("endDate", String, true)
  _endDate: string | undefined = undefined

  get endDate() {
    return {
      endDate: this._endDate ? this._endDate : '',
      delayedBy: this.delayedBy,
      lastDelayedBy: this.lastDelayedBy ? this.lastDelayedBy : ''
    }
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

  @JsonProperty("remainingHours", Number, true)
  _remainingHours: number |undefined = undefined
  get remainingHours() {
    return this._remainingHours ? this._remainingHours : 0
  }

  @JsonProperty("estimatedHours", Number, true)
  _estimatedHours: number |undefined = undefined
  get estimatedHours() {
    return this._estimatedHours ? this._estimatedHours : 0
  }

  get isDelayedByEstimatedHours() {
    return this.delayedBy === 'estimated_hours' ? true : false
  }

  _cadence: object | undefined = undefined
  get cadence() {
    if (this.estimatedHours > 0) {
      return createcadence(cadenceTypes.resource, this.cadenceProgress, this.cadenceTempo, this.remainingHours, this.estimatedHours, this.isDelayedByEstimatedHours, this.lastDelayedBy)
    } else {
      return {cadenceType: cadenceTypes.resource}
    }
  }

  _isSystemPhase = undefined
  get isSystemPhase() {
    if(this._isSystemPhase == undefined){
      this._isSystemPhase = store.getters["assignmentdetailcs/selectedPhase"].isSystem
    }

    return this._isSystemPhase
  }
  get resource() {
    return this
  }

  get isDelayed(){
    return this.delayedBy === DELAYED_BY.END_DATE || this.delayedBy === DELAYED_BY.START_DATE
  }

}
