import {
  JsonObject,
  JsonProperty,
  Any,
} from "json2typescript"
import Datamodel from "./base/datamodel"

@JsonObject("ResponseDM")
export default class ResponseDM extends Datamodel {
  @JsonProperty("data", Any, true) data: any|null = null
  @JsonProperty("status", Number, true) status = 0
  @JsonProperty("statusText", String, true) statusText = ""
  @JsonProperty("config", Object, true) config = {}
  @JsonProperty("headers", Object, true) headers = {}
  @JsonProperty("request", Object, true) request = {}

  get totalCount() {
    return parseInt(this.headers['x-pagination-count']?.split(',')?.slice(0,1)[0]) || 0
  }
}
