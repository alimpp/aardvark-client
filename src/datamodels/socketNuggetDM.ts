import {SOCKET_ENTITY_ACTIONS, SOCKET_NUGGET_ZONES} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import NuggetDM from "./nuggetDM";

@JsonObject("SocketNuggetDM")
export default class SocketNuggetDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: SOCKET_NUGGET_ZONES[] = [];
  @JsonProperty("content", NuggetDM, true) nugget: NuggetDM | null = null;
}
