import {SOCKET_ENTITY_ACTIONS, SOCKET_RELEASE_ZONES} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import ReleaseDM from "./releaseDM";

@JsonObject("SocketReleaseDM")
export default class SocketReleaseDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_RELEASE_ZONES[] = []
  @JsonProperty("content", ReleaseDM, true) release: ReleaseDM | null = null;
}
