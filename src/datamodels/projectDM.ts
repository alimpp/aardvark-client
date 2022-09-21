import { JsonObject, JsonProperty, JsonConverter, JsonCustomConvert } from "json2typescript";
import Datamodel from './base/datamodel';
import { ProjectNumberConverter } from "./converters";
import { Nullable } from "@/utils/generics";
import { UserDSModule, WorkflowDSModule, ProfileDSModule } from "@/store";

@JsonConverter
class FullNameConverter implements JsonCustomConvert<String> {
  serialize(data: string): any {
    return data;
  }
  deserialize(data: number): string {
    const user = UserDSModule.items[data];
    if (user) return user.fullName;
    return "";
  }
}

@JsonConverter
class WorkflowTitleConverter implements JsonCustomConvert<String> {
  serialize(data: string): any {
    return data;
  }
  deserialize(data: number): string {
    const workflow = WorkflowDSModule.workflows[data]
    if (workflow) return workflow.title.capitalize();
    return "";
  }
}

@JsonObject('ProjectDM')
export default class ProjectDM extends Datamodel {
    @JsonProperty("id", Number) id = 0;
    @JsonProperty('number', Number, true) number = 0;
    @JsonProperty('number', ProjectNumberConverter, true) projectNumber = '';
    @JsonProperty("workflowId", Number, true) workflowId = 0;
    @JsonProperty("workflowId", WorkflowTitleConverter, true) workflowTitle = "";
    @JsonProperty("managerId", Number, true) managerId = 0;
    @JsonProperty("managerId", FullNameConverter, true) managerFullName = ""
    @JsonProperty("secondaryManagerId", Number, true) secondaryManagerId = 0;
    @JsonProperty("secondaryManagerId", FullNameConverter, true) secondaryManagerFullName = "";
    @JsonProperty("organizationId", Number, true) organizationId = 0;
    @JsonProperty("title", String, true) title = '';
    @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
    @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
    @JsonProperty("status", String, true) status = '';
    @JsonProperty("dueDate", String, true) dueDate= '';
    @JsonProperty("tempo", String, true) tempo= '';
    @JsonProperty("autoModifiedAt", String, true) autoModifiedAt= '';
    @JsonProperty("removedAt", String, true) removedAt= '';
    @JsonProperty("createdAt", String, true) createdAt= '';
    @JsonProperty("entityType", String, true) entityType = ""
    @JsonProperty("description", String, true) description= '';
    @JsonProperty("autoModifiedBy", Number, true) autoModifiedBy= 0;
    @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false;
    @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false;
    @JsonProperty("publicSeenAt", String, true) publicSeenAt = ""
    @JsonProperty("privateSeenAt", String, true) privateSeenAt = ""
    @JsonProperty("seenAt", String, true) seenAt = "";
    @JsonProperty("recentMessageAt", String, true) recentMessageAt: string | null = null;
    @JsonProperty("publicLatestSeenMessageId", Number, true) publicLatestSeenMessageId = 0;
    @JsonProperty("privateLatestSeenMessageId", Number, true) privateLatestSeenMessageId = 0;
    @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
    @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;

    get isProjectMaestro() {
      return this.managerId === ProfileDSModule.identifier
    }

    get isSecondaryMaestro() {
      return this.secondaryManagerId === ProfileDSModule.identifier
    }

}
