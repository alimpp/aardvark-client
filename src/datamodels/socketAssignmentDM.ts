import {SOCKET_ASSIGNMENT_ZONES, SOCKET_ENTITY_ACTIONS} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import AssignmentDM from "./assignmentDM";
import Datamodel from './base/datamodel';

@JsonObject("SocketAssignmentDM")
export default class SocketAssignmentDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_ASSIGNMENT_ZONES[] = []
  @JsonProperty("content", AssignmentDM, true) assignment: AssignmentDM | null = null;
}
