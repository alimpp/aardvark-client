import {SOCKET_ENTITY_ACTIONS, SOCKET_RELEASE_ZONES, SOCKET_WORKFLOW_ZONES} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import WorkflowDM from "./workflowDM";

@JsonObject("SocketWorkflowDM")
export default class SocketWorkflowDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_WORKFLOW_ZONES[] = []
  @JsonProperty("content", WorkflowDM, true) workflow: WorkflowDM | null = null;
}
