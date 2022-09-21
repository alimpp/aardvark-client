import {MessageDSModule, ProfileDSModule, UserDSModule} from "@/store";
import {utcFromNow} from "@/utils/date";
import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import MessageDM from "./messageDM";

interface DirectMember { id: number, referenceId: number, phone: string | null, email: string | null }

@JsonObject('DirectDM')
export default class DirectDM extends Datamodel {
  @JsonProperty("id", Number, true) id: number | null = null;
  @JsonProperty("type", String, true) type: string | null = null;
  @JsonProperty("subscribableType", String, true) subscribableType: string | null = null;
  @JsonProperty("members", [Object], true) members: DirectMember[] | null = null;
  @JsonProperty("createdAt", String, true) createdAt: string | null = null;
  @JsonProperty("autoModifiedAt", String, true) autoModifiedAt: string | null = null;
  @JsonProperty('modifiedAt', String, true) modifiedAt: string | null = null;
  @JsonProperty("unreadCount", Number, true) unreadCount: number | null = null;
  @JsonProperty("latestMessage", MessageDM, true) _latestMessage: MessageDM | null = null;
  @JsonProperty("latestMessageId", Number, true) latestMessageId: number | null = null;
  @JsonProperty("latestSeenMessageId", Number, true) latestSeenMessageId: number | null = null;

  get icon() {
    return UserDSModule.itemsAsArray.filter(user => user.referenceId === this.members?.filter(member => member.referenceId !== ProfileDSModule?.id)[0].referenceId)[0].profileUrl;
  }

  get name() {
    return UserDSModule.itemsAsArray.filter(user => user.referenceId === this.members?.filter(member => member.referenceId !== ProfileDSModule?.id)[0].referenceId)[0].fullName;
  }

  get timestamp() {
    if(this.id && MessageDSModule.getItems[this.id] && MessageDSModule.getItems[this.id].length !== 0) {
      return utcFromNow(MessageDSModule.getItems[this.id][MessageDSModule.getItems[this.id].length - 1].createdAt)
    }
    if(this.autoModifiedAt) return utcFromNow(this.autoModifiedAt);
  }

  get latestMessage() {
    if(this.id && MessageDSModule.getItems[this.id]) {
      return MessageDSModule.getItems[this.id][MessageDSModule.getItems[this.id].length - 1]
    }
    return this._latestMessage;
  }

}
