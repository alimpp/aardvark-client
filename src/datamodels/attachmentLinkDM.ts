import {ProfileDSModule, UserDSModule} from "@/store";
import {utcToLocalTimeFormat} from "@/utils/date";
import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";
import Datamodel from "./base/datamodel";

@JsonConverter
class TimestampConverter implements JsonCustomConvert<String> {
  serialize(data: string): any {
    return data;
  }
  deserialize(data: any): string {
    return utcToLocalTimeFormat(data);
  }
}

@JsonConverter
class ProfileUrlConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        if(ProfileDSModule?.profileUrl && data === ProfileDSModule?.id) {
            return ProfileDSModule.profileUrl;
        }
        const user = UserDSModule.itemsAsArray.find(user => user.referenceId === data);
        if(user?.profileUrl) {
            return user.profileUrl;
        }
        return "";
    }
}

@JsonConverter
class UsernameConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        if(data === ProfileDSModule?.id) {
            return ProfileDSModule.fullName;
        }
        const user = UserDSModule.itemsAsArray.find(user => user.referenceId === data);
        if(user) {
            return user.fullName;
        }
        return "";
    }
}

@JsonObject("AttachmentLinkDM")
export default class AttachmentLinkDM extends Datamodel {
	@JsonProperty('id', Number) id = 0;
	@JsonProperty('envelopId', Number, true) envelopId: number | null = null;
	@JsonProperty('title', String, true) title: string | null = null;
	@JsonProperty('url', String, true) url: string | null = null;
	@JsonProperty('senderId', Number, true) senderId = 0;
	@JsonProperty('senderReferenceId', Number, true) senderReferenceId: number | null = null;
	@JsonProperty("senderReferenceId", ProfileUrlConverter) profileUrl = '';
	@JsonProperty("senderReferenceId", UsernameConverter) username = '';
	@JsonProperty('removedAt', String, true) removedAt: string | null = null;
	@JsonProperty('createdAt', String, true) createdAt = '';
	@JsonProperty("createdAt", TimestampConverter) timestamp = '';
	@JsonProperty('roomId', Number, true) roomId = 0;
}
