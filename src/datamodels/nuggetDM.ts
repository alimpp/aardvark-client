import { UserDSModule, NuggetPhasesDSModule } from "@/store";
import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import SprintDM from './sprintDM';
import NuggetPhaseDM from './nuggetPhaseDM';
import ProjectDM from './projectDM';
import Tag from './tagDM';
import {JsonParser} from '@/utils/jsonparser'
import {createModelObject} from "@/utils/object";
import { NuggetNumberConverter, ProjectNumberConverter } from "./converters";

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
class NuggetPhaseConverter implements JsonCustomConvert<Array> {
  serialize(data: Array): any {
    return data;
  }
  deserialize(data: number): Array {
    const phases = NuggetPhasesDSModule.items[data];
    return phases || []
  }
}

@JsonObject("NuggetDM")
export default class NuggetDM extends Datamodel {
  @JsonProperty("id", Number) id = 0
  @JsonProperty('number', Number, true) number = 0;
  @JsonProperty("number", NuggetNumberConverter, true) nuggetNumber = '';
  @JsonProperty('projectNumber', Number, true) projectNumber = 0;
  @JsonProperty("projectId", Number, true) projectId = 0
  @JsonProperty("groupId", Number, true) groupId = 0
  @JsonProperty("organizationId", Number, true) organizationId = 0
  @JsonProperty("title", String, true) title = ""
  @JsonProperty("privateRoomId", Number, true) privateRoomId = 0
  @JsonProperty("publicRoomId", Number, true) publicRoomId = 0
  @JsonProperty("kind", String, true) type = ""
  @JsonProperty("origin", String, true) origin = ""
  @JsonProperty("stage", String, true) stage = ""
  @JsonProperty("status", String, true) statusResponse = ""
  @JsonProperty("leadPhase", String, true) leadPhase = ""
  @JsonProperty("priority", String, true) priority = ""
  @JsonProperty("priorityValue", Number, true) priorityValue = 0
  @JsonProperty("sprintId", Number, true) sprintId = 0
  @JsonProperty("dueDate", String, true) dueDate = ""
  @JsonProperty("leadPhaseId", Number, true) leadPhaseId = 0
  @JsonProperty("leadPhaseTitle", String, true) leadPhaseTitle = ""
  @JsonProperty("sprint", SprintDM, true) sprintApi: SprintDM | null = null
  @JsonProperty("modifiedByReferenceId", Number, true) modifiedByReferenceId: number | null = null
  @JsonProperty("modifiedByReferenceId", FullNameConverter, true) ModifiedByMember= ''
  sprintView: SprintDM | null = null
  @JsonProperty("tags", [Tag], true) tags: Tag[] = []
  @JsonProperty("project", ProjectDM, true) projectApi: ProjectDM = {} as ProjectDM
  projectView = {} as ProjectDM
  @JsonProperty("returntotriagejob", Object, true) _returntotriagejob: any | null = null
  @JsonProperty("id", NuggetPhaseConverter, true) nuggetPhases: NuggetPhaseDM[] = []
  @JsonProperty("publicSeenAt", String, true) publicSeenAt: string | null = null;
  @JsonProperty("privateSeenAt", String, true) privateSeenAt: string | null = null;
  @JsonProperty("NeedEstimatedPhaseId", Number, true) NeedEstimatedPhaseId = 0
  @JsonProperty("responseTime", Number, true) responseTime = 0
  @JsonProperty("autoModifiedAt", String, true) autoModifiedAt = ""
  @JsonProperty("recentMessageAt", String, true) recentMessageAt = ""
  @JsonProperty("modifiedAt", String, true) modifiedAt = ""
  @JsonProperty("releaseAt", String, true) releaseAt = ""
  @JsonProperty("createdByReferenceId", Number, true) createdByReferenceId = 0
  @JsonProperty("createdByMemberId", Number, true) createdByMemberId = 0
  @JsonProperty("createdByMemberId", FullNameConverter, true) fullName = ""
  @JsonProperty("createdAt", String, true) createdAt = ""
  @JsonProperty("entityType", String, true) entityType = ""
  @JsonProperty("description", String, true) description = ""
  @JsonProperty("autoModifiedBy", Number, true) autoModifiedBy: number | null = null
  @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false
  @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false
  @JsonProperty("assignmentLevel", String, true) assignmentLevel = "";
  @JsonProperty("estimated", String, true) estimated = "";
  @JsonProperty("tempo", String, true) tempo = "";
  @JsonProperty("publicLatestSeenMessageId", Number, true) publicLatestSeenMessageId = 0;
  @JsonProperty("privateLatestSeenMessageId", Number, true) privateLatestSeenMessageId = 0;
  @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
  @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;

  //Nugget Views Properties
  @JsonProperty("returnToTriageJobDate", String, true) returnToTriageJobAt = ""
  @JsonProperty("projectWorkflowId", Number, true) projectWorkflowId = 0
  @JsonProperty("projectTitle", String, true) projectTitle = ""
  @JsonProperty("projectManagerId", Number, true) projectManagerId = 0
  @JsonProperty("projectSecondaryManagerId", Number, true) projectSecondaryManagerId = 0
  @JsonProperty("projectManagerTitle", String, true) projectManagerTitle = ""
  @JsonProperty("projectSecondaryManagerTitle", String, true) projectSecondaryManagerTitle = ""
  @JsonProperty("projectManagerFirstName", String, true) projectManagerFirstName = ""
  @JsonProperty("projectSecondaryManagerFirstName", String, true) projectSecondaryManagerFirstName = ""
  @JsonProperty("projectManagerLastName", String, true) projectManagerLastName = ""
  @JsonProperty("projectSecondaryManagerLastName", String, true) projectSecondaryManagerLastName = ""
  @JsonProperty("sprintNumber", Number, true) sprintNumber = 0
  @JsonProperty("sprintName", String, true) sprintName = ""
  @JsonProperty("sprintIsReleased", Boolean, true) sprintIsReleased = false
  @JsonProperty("sprintReturnToTriageJobDate", String, true) sprintReturnToTriageJobDate = ""
  @JsonProperty("releaseLaunchDate", String, true) releaseLaunchDate = ''


  get status() {
    return this.statusResponse;
  }

  get boarding() {
    if(this.status === "released"){
      return "released"
    }
    else if(this.status === "Archived"){
      return "at-rest"
    }
    else{
      return this.tempo
    }
  }

  get project() {
    if(!this.projectView?.id) this.projectView = JsonParser.deserializeObject(createModelObject('project', this), ProjectDM)
    return this.projectApi?.id ? this.projectApi : this.projectView
  }

  set project(value) {
    this.projectApi = value as ProjectDM
    this.projectView  = value as ProjectDM
  }

  get sprint() {
    if(!this.sprintView?.id)this.sprintView = JsonParser.deserializeObject(createModelObject('sprint', this), SprintDM)
    return this.sprintApi?.id ? this.sprintApi: this.sprintView
  }

  set sprint(value: SprintDM | null) {
    this.sprintApi = value as SprintDM | null
    this.sprintView  = value as SprintDM | null
  }

  get returntotriagejob() {
    return this._returntotriagejob?.at ? this._returntotriagejob : {at: this.returnToTriageJobAt}
  }

  set returntotriagejob(val) {
    this._returntotriagejob = val
    this.returnToTriageJobAt = val.at
  }
}
