import {ProfileDSModule, UserDSModule} from '@/store';
import {utcIsToday, utcIsYesterday, utcToLocalDateFormat, utcToLocalTimeFormat} from '@/utils/date';
import {JsonParser} from '@/utils/jsonparser';
import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";
import { createModelObject } from "@/utils/object"
import Datamodel from "./base/datamodel";
import UserDM from './userDM';
 

@JsonConverter
class UserConverter implements JsonCustomConvert<UserDM|undefined> {
    serialize(data: UserDM): UserDM {
        return data;
    }
    deserialize(data: number): UserDM|undefined {
        const user = UserDSModule.itemsAsArray.find(user => user.referenceId === data);
        if(user) {
            return user;
        }
    }
} 


@JsonObject('ConferenceRoom')
class ConferenceRoom {
  @JsonProperty("createdAt", String, true) createdAt: string | null = null;
  @JsonProperty("removedAt", String, true) removedAt: string | null = null;
  @JsonProperty("description", String, true) description: string | null = null;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("id", Number, true) id = 0;
  @JsonProperty("roomId", Number, true) roomId = 0;
  @JsonProperty("title", String, true) title: string | null = null;
  @JsonProperty("token", String, true) token: string | null = null;
}


@JsonObject("VideoConferenceDM")
export default class VideoConferenceDM extends Datamodel {
    @JsonProperty("senderReferenceId", UserConverter) senderUser: UserDM | undefined = undefined;
    @JsonProperty("receiverReferenceId", UserConverter) receiverUser: UserDM | undefined = undefined;
    @JsonProperty("sessionId", String) sessionId = '';
    @JsonProperty("status", String) status = undefined;
    @JsonProperty("senderToken", String , true) senderToken = '';
    @JsonProperty("conferenceRoom", ConferenceRoom) conferenceRoom: ConferenceRoom | null = null;
 
}
