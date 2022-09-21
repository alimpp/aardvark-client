import {SOCKET_ENTITY_ACTIONS} from "@/utils/constants";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import UserDM from '@/datamodels/userDM';

@JsonObject("SocketUserDM")
export default class SocketUserDM extends Datamodel {
  @JsonProperty("action", String, true) action: SOCKET_ENTITY_ACTIONS | null = null;
  @JsonProperty("zones", [String], true) zones: never[] = []
  @JsonProperty("content", UserDM, true) user: UserDM | null = null;
}
