import { JsonObject, JsonProperty, JsonConverter, JsonCustomConvert } from "json2typescript";
import Datamodel from "./base/datamodel";
import ProjectDM from "./projectDM";
import { UserDSModule } from "@/store";
import { ReleaseNumberConverter } from "./converters";

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

@JsonObject("ReleaseDM")
export default class ReleaseDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("number", Number, true) number = 0;
  @JsonProperty('number', ReleaseNumberConverter, true) releaseNumber = '';
  // @JsonProperty("attachments", String, true) attachments = "";
  @JsonProperty("IsUnread", Boolean, true) IsUnread: boolean | null = null;
  @JsonProperty("IsExistsAtRiskBatch", String, true) IsExistsAtRiskSprint = "";
  @JsonProperty("createdAt", String, true) createdAt = "";
  @JsonProperty("cutoff", String, true) cutoff = "";
  @JsonProperty("description", String, true) description = "";
  @JsonProperty("group", String, true) group = "";
  @JsonProperty("lastLaunchDate", String, true) lastLaunchDate = "";
  @JsonProperty("launchDate", String, true) launchDate = "";
  // @JsonProperty("links", String, true) links = "";
  @JsonProperty("managerId", Number, true) managerId = 0;
  @JsonProperty("managerId", FullNameConverter, true) managerFullName = ""
  @JsonProperty("autoModifiedAt", String, true) autoModifiedAt = "";
  @JsonProperty("members", String, true) members = "";
  @JsonProperty("organization", String, true) organization = "";
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("projects", [ProjectDM], true) projects: ProjectDM[] = []
  @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
  @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
  @JsonProperty("secondaryManagerId", Number, true) secondaryManagerId = 0;
  @JsonProperty("secondaryManagerId", FullNameConverter, true) secondaryManagerFullName = "";
  @JsonProperty("status", String, true) status: string | null = '';
  @JsonProperty("tempo", String, true) tempo = "";
  @JsonProperty("title", String, true) title = "";
  @JsonProperty("entityType", String, true) entityType = ""
  @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false;
  @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false;
  @JsonProperty("privateSeenAt", String, true) privateSeenAt: string | null = null;
  @JsonProperty("publicSeenAt", String, true) publicSeenAt: string | null = null;
  @JsonProperty("recentMessageAt", String, true) recentMessageAt: string | null = null;
  @JsonProperty("publicLatestSeenMessageId", Number, true) publicLatestSeenMessageId = 0;
  @JsonProperty("privateLatestSeenMessageId", Number, true) privateLatestSeenMessageId = 0;
  @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
  @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;
}