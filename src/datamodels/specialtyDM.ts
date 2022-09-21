import { JsonObject, JsonProperty, JsonConverter, JsonCustomConvert } from "json2typescript";
import Datamodel from './base/datamodel';
import { SkillDSModule } from '@/store';


@JsonConverter
class SkillTitleConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const skill = SkillDSModule.items[data];
        if(skill) return skill.title;
        return "";
    }
}

@JsonObject('SpecialtyDM')
export default class SpecialtyDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("title", String, true) title = '';
  @JsonProperty("description", String, true) description = '';
  @JsonProperty("skillId", Number, true) skillId = 0;
  @JsonProperty("skillId", SkillTitleConverter, true) skillTitle = '';
}