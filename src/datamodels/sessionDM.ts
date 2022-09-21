import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';


@JsonObject('SessionDM')
export default class SessionDM extends Datamodel {
  @JsonProperty("sessionId", String) id = '';
  @JsonProperty("info", Object) info: object = {};
}