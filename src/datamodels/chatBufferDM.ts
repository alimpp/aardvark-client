import { JsonObject } from "json2typescript";
import Datamodel from "./base/datamodel";
import MessageDM from "./messageDM";
 
@JsonObject("ChatBufferDM")
export default class ChatBufferDM extends Datamodel {
    message = "";
    content = "";
    replayMessage: MessageDM | null = null;
}
