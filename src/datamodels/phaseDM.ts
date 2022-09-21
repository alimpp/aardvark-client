import { JsonObject, JsonProperty, JsonCustomConvert, JsonConverter } from "json2typescript"
import Datamodel from "./base/datamodel"
import { SkillDSModule } from "@/store";

@JsonConverter
class SkillTitleConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const skill = SkillDSModule.items[data];
        if (skill) return skill.title.capitalize();
        return "";
    }
}

@JsonObject("PhaseDM")
export default class PhaseDM extends Datamodel {
    @JsonProperty("id", Number) id = 0
    @JsonProperty("description", String, true) description: String = ""
    @JsonProperty("order", Number, true) order = 0
    @JsonProperty("skill", String, true) skill: String | null = null
    @JsonProperty("skillId", Number, true) skillId = 0
    @JsonProperty("skillId", SkillTitleConverter, true) skillTitle = ""
    @JsonProperty("title", String) title = ""
    // @JsonProperty("workflow", String) workflow = ""
    @JsonProperty("workflowId", Number, true) workflowId = 0
    @JsonProperty("organizationId", Number, true) organizationId = 0
    @JsonProperty("removedAt", String, true) removedAt: string | null = ''
    @JsonProperty("isSystem", Boolean, true) isSystem = false;
    @JsonProperty("entityType", String, true) entityType = ""
}
