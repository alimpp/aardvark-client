import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';

@JsonObject('TagDM')
export default class TagDM extends Datamodel {
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("organizationId", Number, true) organizationId = 0;
    @JsonProperty("title", String, true) title = '';
    @JsonProperty("description", String, true) description = '';
    @JsonProperty("removedAt", String, true) removedAt: string | null = '';
}
