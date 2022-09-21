import {SOCKET_ENTITY_ACTIONS, SOCKET_SPRINT_ZONES} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import SprintDM from "./sprintDM";

@JsonObject("SocketSprintDM")
export default class SocketSprintDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_SPRINT_ZONES[] = []
  @JsonProperty("content", SprintDM, true) sprint: SprintDM | null = null;
}
