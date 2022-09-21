import { JsonObject, JsonProperty } from "json2typescript"
import Datamodel from "./base/datamodel"
import PhaseDM from './phaseDM';


@JsonObject("WorkflowDM")
export default class WorkflowDM extends Datamodel {
    @JsonProperty("id", Number) id = 0
    @JsonProperty("title", String, true) title = ""
    @JsonProperty("createdAt", String, true) createdAt = ""
    @JsonProperty("description", String, true) description = ''
    @JsonProperty("autoModifiedAt", String, true) autoModifiedAt: string | null = null
    @JsonProperty("organizationId", Number, true) organizationId = 0
    // @JsonProperty("organization", String) organization = ""
    @JsonProperty("phases", [PhaseDM], true) phases: PhaseDM[] = []
    // @JsonProperty("projects", String) projects = ""
    @JsonProperty("removedAt", String, true) removedAt: string | null = ''
}
