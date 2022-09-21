import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';

@JsonObject('NuggetPhaseDM')
export default class NuggetPhaseDM extends Datamodel {
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("phaseId", Number) phaseId = 0;
    @JsonProperty("nuggetId", Number) nuggetId = 0;
    @JsonProperty("roomId", Number, true) roomId = 0;
    @JsonProperty("status", String, true) status = '';
    @JsonProperty("isSkipped", Boolean, true) isSkipped = false;
    @JsonProperty("endDate", String, true) endDate= '';
    @JsonProperty("startDate", String, true) startDate= '';
    @JsonProperty("estimatedHours", Number, true) estimatedHours= 0;
    @JsonProperty("hoursWorked", Number, true) hoursWorked = 0.0;
    @JsonProperty("mojoRemainingHours", Number, true) cadenceRemainingHours= 0;
    @JsonProperty("mojoProgress", Number, true) cadenceProgress= 0;
    @JsonProperty("TotalNumberOfDaysStartToNow", Number, true) TotalNumberOfDaysStartToNow = 0;
    @JsonProperty("TotalNumberOfDaysStartToTarget", Number, true) TotalNumberOfDaysStartToTarget = 0;
    @JsonProperty("TotalNumberOfDaysRemaining", Number, true) TotalNumberOfDaysRemaining = 0;
    @JsonProperty("mojoTempo", String, true) cadenceTempo = '';
    @JsonProperty("isDelayed", Boolean, true) isDelayed = false;
    @JsonProperty("phaseTitle", String, true) phaseTitle = '';
    @JsonProperty("isSystem", Boolean, true) isSystem = false;
    @JsonProperty('createdAt', String, true) createdAt = '';
    @JsonProperty('entityType', String, true) entityType = '';
    @JsonProperty('autoModifiedAt', String, true) autoModifiedAt = '';
    @JsonProperty('organizationId', Number, true) organizationId = 0;
    @JsonProperty('privateRoomId', Number, true) privateRoomId = 0;
    @JsonProperty('publicRoomId', Number, true) publicRoomId = 0;
    @JsonProperty('teamLeadMemeberId', Number, true) teamLeadMemeberId = 0;
}
