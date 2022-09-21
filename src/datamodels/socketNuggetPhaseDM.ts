import {SOCKET_ENTITY_ACTIONS} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import NuggetPhaseDM from "./nuggetPhaseDM";

@JsonObject("SocketNuggetPhaseDM")
export default class SocketNuggetPhaseDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: never[] = []
  @JsonProperty("content", NuggetPhaseDM, true) nuggetPhase: NuggetPhaseDM | null = null;
}
