import {SOCKET_ENTITY_ACTIONS, SOCKET_PROJECT_ZONES} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import ProjectDM from "./projectDM";

@JsonObject("SocketProjectDM")
export default class SocketProjectDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_PROJECT_ZONES[] = []
  @JsonProperty("content", ProjectDM, true) project: ProjectDM | null = null;
}
