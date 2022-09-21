import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import Datamodel from "./base/datamodel"
import {UserDSModule, PhaseDSModule} from "@/store";

@JsonConverter
class IsDoneConverter implements JsonCustomConvert<Boolean> {
    serialize(data:  boolean): boolean {
        return data;
    }
    deserialize(data: string): boolean {
        return ["complete", "released", "approved"].includes(data);
    }
}
@JsonConverter
class FullNameConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const user = UserDSModule.items[data];
        if(user) return user.fullName;
        return "";
    }
}

@JsonConverter
class PhaseTitleConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const phase = PhaseDSModule.items[data];
        if(phase) {
            return phase.title.capitalize();
        }
        return "";
    }
}

@JsonObject("AssignmentDM")
export default class AssignmentDM extends Datamodel {
  @JsonProperty("id", Number) id = 0
  @JsonProperty("projectId", Number, true) projectId = 0
  @JsonProperty("projectTitle", String, true) projectTitle = ""
  @JsonProperty("groupId", Number, true) groupId = 0
  @JsonProperty("organizationId", Number, true) organizationId = 0
  @JsonProperty("nuggetId", Number, true) nuggetId: number | null = null
  @JsonProperty("nuggetTitle", String, true) nuggetTitle = ""
  @JsonProperty("nuggetKind", String, true) nuggetKind = ""
  @JsonProperty("nuggetStage", String, true) nuggetStage = ""
  @JsonProperty("nuggetPriority", String, true) nuggetPriority = ""
  @JsonProperty("nuggetPhaseId", Number, true) nuggetPhaseId: number | null = null
  @JsonProperty("nuggetPhase", String, true) nuggetPhase: string | null = null
  @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
  @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
  @JsonProperty("status", String, true) status = ""
  @JsonProperty("sprintId", Number, true) sprintId: number | null = null
  @JsonProperty("sprintName", String, true) sprintName: string | null = null
  @JsonProperty("sprintDescription", String, true) sprintDescription: string | null = null
  //@JsonProperty("sprintNumber", String) sprintNumber: string | null = null
  @JsonProperty("sprintStage", String, true) sprintStage: string | null = null
  @JsonProperty("sprintStatus", String, true) sprintStatus: string | null = null
  @JsonProperty("sprintTitle", String, true) sprintTitle: string | null = null
  @JsonProperty("delayedBy", String, true) delayedBy: string | null = null
  @JsonProperty("endDate", String, true) endDate = "";
  @JsonProperty("startDate", String, true) startDate = "";
  @JsonProperty("status", IsDoneConverter, true) isDone: boolean | null = null
  @JsonProperty("phaseId", Number, true) phaseId: number | null = null
  @JsonProperty("phaseId", PhaseTitleConverter, true) phaseTitle= ""
  @JsonProperty("tempo", String, true) tempo = ""
  @JsonProperty("estimatedHours", Number, true) estimatedHours = 0
  @JsonProperty("extendNeedApproval", Boolean, true) extendNeedApproval: boolean | null = null
  @JsonProperty("gracePeriod", Number, true) gracePeriod= 0
  @JsonProperty("responseTime", Number, true) responseTime = 0
  @JsonProperty("createdAt", String, true) createdAt = ""
  @JsonProperty("lastDelayedBy", String, true) lastDelayedBy: string | null = null
  @JsonProperty("memberId", Number, true) memberId: number | null = null
  @JsonProperty("memberId", FullNameConverter, true) fullName= ""
  @JsonProperty("mojoTempo", String, true) cadenceTempo: string | null = null
  @JsonProperty("mojoProgress", Number, true) cadenceProgress = 0
  // @JsonProperty("timecards", [timecardDM]) timecards: timecardDM[] = []
  @JsonProperty("hoursWorked", Number, true) hoursWorked: Number | null = null
  @JsonProperty("remainingHours", Number, true) remainingHours = 0
  @JsonProperty("lastTimecardTimestamp", Number, true) lastTimecardTimestamp = 0
  @JsonProperty("perspective", String, true) perspective = ""
  @JsonProperty("perspectiveId", Number, true) perspectiveId = 0
  @JsonProperty("assigneeMemberId", Number, true) assigneeMemberId = 0
  @JsonProperty('description', String, true) description = ""
  @JsonProperty('entityType', String, true) entityType = ""
  @JsonProperty('TotalNumberOfDaysRemaining', Number, true) TotalNumberOfDaysRemaining = 0;
  @JsonProperty('TotalNumberOfDaysStartToNow', Number, true) TotalNumberOfDaysStartToNow = 0;
  @JsonProperty('TotalNumberOfDaysStartToTarget', Number, true) TotalNumberOfDaysStartToTarget = 0;
  @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false;
  @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false;
}
