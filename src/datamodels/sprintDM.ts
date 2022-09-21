import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import { PhaseDSModule, UserDSModule } from "@/store";
import ProjectDM from './projectDM';
import {JsonParser} from '@/utils/jsonparser'
import {createModelObject} from "@/utils/object";
import { Nullable } from "@/utils/generics";
import { SprintNumberConverter } from "./converters";

@JsonConverter
class PhaseTitleConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const phase = PhaseDSModule.itemsAsArray.find(phase => phase.id === data);
        if(phase) {
            return phase.title.capitalize();
        }
        return "";
    }
}

@JsonConverter
class FullNameConverter implements JsonCustomConvert<String> {
  serialize(data: string): any {
    return data;
  }
  deserialize(data: number): string {
    const user = UserDSModule.itemsAsArray.find(user => user.id === data);
    if (user) return user.fullName;
    return "";
  }
}

@JsonObject('SprintDM')
export default class SprintDM extends Datamodel {
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("id", Number) sprintId = 0;
    @JsonProperty("number", Number, true) number = 0;
    @JsonProperty('number', SprintNumberConverter, true) sprintNumber = '';
    @JsonProperty('projectNumber', Number, true) projectNumber = 0;
    @JsonProperty("projectId", Number, true) projectId = 0;
    @JsonProperty("returnToTriageJobId", Number, true) returnToTriageJobId: number | null = null;
    @JsonProperty("stage", String, true) stage: string | null = null;
    @JsonProperty("name", String, true) name = "";
    @JsonProperty("returntotriagejob", Object, true) returntotriagejob: any | null = null;
    @JsonProperty("dueDate", String, true) dueDate: string | null = '';
    @JsonProperty("description", String, true) description= '';
    @JsonProperty("tempo", String, true) tempo = "";
    @JsonProperty("status", String, true) status = "";
    @JsonProperty("phaseId", PhaseTitleConverter, true) phaseTitle= "";
    @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
    @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
    @JsonProperty("returnToTriageJobDate", String, true) returnToTriageJobDate: string | null = null;
    @JsonProperty("project", ProjectDM, true) projectApi: ProjectDM = {} as ProjectDM
    projectView  = {} as ProjectDM
    @JsonProperty("hasBackloggedNuggets", Boolean, true) hasBackloggedNuggets = false;
    @JsonProperty("hasEstimatedNuggets", Boolean, true) hasEstimatedNuggets = false;
    @JsonProperty("hasTriagedNuggets", Boolean, true) hasTriagedNuggets = false;
    @JsonProperty("privateSeenAt", String, true) privateSeenAt: string | null = null;
    @JsonProperty("publicSeenAt", String, true) publicSeenAt: string | null = null;
    @JsonProperty("isReleased", Boolean, true) isReleased = false;
    @JsonProperty("isTicketed", Boolean, true) isTicketed = false;
    @JsonProperty("seenAt", String, true) seenAt: string | null = null;
    @JsonProperty("organizationId", Number, true) organizationId = 0;
    @JsonProperty("recentMessageAt", String, true) recentMessageAt: string | null = null;
    @JsonProperty("period", String, true) period = '';
    @JsonProperty("periodDate", String, true) periodDate: string | null = null;
    @JsonProperty("modifiedAt", String, true) modifiedAt = '';
    @JsonProperty("createdAt", String, true) createdAt= '';
    @JsonProperty("createdByReferenceId", Number, true) createdByReferenceId = 0
    @JsonProperty("createdByMemberId", Number, true) createdByMemberId = 0
    @JsonProperty("createdByMemberId", FullNameConverter, true) createdByMember = ''
    @JsonProperty("modifiedByMemberId", Number, true) modifiedByMemberId= 0
    @JsonProperty("modifiedByMemberId", FullNameConverter, true) ModifiedByMember= ''
    @JsonProperty("modifiedByReferenceId", Number, true) modifiedByReferenceId= 0
    @JsonProperty("entityType", String, true) entityType = ""
    @JsonProperty("publicLatestSeenMessageId", Number, true) publicLatestSeenMessageId = 0;
    @JsonProperty("privateLatestSeenMessageId", Number, true) privateLatestSeenMessageId = 0;
    @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
    @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;

    //Sprint Views Properties
    @JsonProperty("projectWorkflowId", Number, true) projectWorkflowId = 0
    @JsonProperty("projectTitle", String, true) projectTitle = ""
    @JsonProperty("projectManagerId", Number, true) projectManagerId = 0
    @JsonProperty("projectManagerId", FullNameConverter, true) managerFullName = ""
    @JsonProperty("projectSecondaryManagerId", Number, true) projectSecondaryManagerId = 0
    @JsonProperty("projectSecondaryManagerId", FullNameConverter, true) secondaryManagerFullName = "";
    @JsonProperty("projectManagerTitle", String, true) projectManagerTitle = ""
    @JsonProperty("projectSecondaryManagerTitle", String, true) projectSecondaryManagerTitle = ""
    @JsonProperty("projectManagerFirstName", String, true) projectManagerFirstName = ""
    @JsonProperty("projectSecondaryManagerFirstName", String, true) projectSecondaryManagerFirstName = ""
    @JsonProperty("projectManagerLastName", String, true) projectManagerLastName = ""
    @JsonProperty("projectSecondaryManagerLastName", String, true) projectSecondaryManagerLastName = ""
    @JsonProperty("projectDescription", String, true) projectDescription = ""
    @JsonProperty("releaseId", Number, true) releaseId = 0
    @JsonProperty("releaseTitle", String, true) releaseTitle = ""
    @JsonProperty("releaseCutoff", String, true) cutoff = ""
    @JsonProperty("releaseLaunchDate", String, true) launchDate = ""
    @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false
    @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false

    get project() {
        this.projectView  = JsonParser.deserializeObject(createModelObject('project', this), ProjectDM)
        return this.projectApi?.id ? this.projectApi : this.projectView
    }

    set project(value) {
        this.projectApi = value as ProjectDM
        this.projectView  = value as ProjectDM
    }

}
