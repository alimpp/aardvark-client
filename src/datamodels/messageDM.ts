import {ProfileDSModule, UserDSModule} from '@/store';
import {utcIsToday, utcIsYesterday, utcToLocalDateFormat, utcToLocalTimeFormat} from '@/utils/date';
import {JsonParser} from '@/utils/jsonparser';
import {JsonConverter, JsonCustomConvert, JsonObject, JsonProperty} from "json2typescript";
import { createModelObject } from "@/utils/object"
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
class DateConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: any): string {
        if(utcIsToday(data)) return 'Today';
        if(utcIsYesterday(data)) return 'Yesterday';
        return utcToLocalDateFormat(data);
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

@JsonConverter
class IsMineConverter implements JsonCustomConvert<Boolean> {
    serialize(data: boolean): any {
        return data;
    }
    deserialize(data: number): boolean {
        return data === ProfileDSModule?.id;
    }
}

@JsonConverter
class OrganizationRoleConverter implements JsonCustomConvert<String> {
    serialize(data: string): any {
        return data;
    }
    deserialize(data: number): string {
        const user = UserDSModule.itemsAsArray.find(user => user.referenceId === data);
        if(user) {
            return user.organizationRoles.map(role => role.removeUnderscore()).join(", ");
        }
        return "";
    }
}

@JsonObject("MessageDM")
export default class MessageDM extends Datamodel {
    processedBy: string[] = [];
    isErrored = false;
    rawBody = "";
    tmpFile: {file: File, url: string} | null = null;
    isUpdating = false;
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("body", String) content = '';
    @JsonProperty("senderReferenceId", Number) senderId = 0;
    @JsonProperty("createdAt", String) createdAt = '';
    @JsonProperty("createdAt", DateConverter) date = '';
    @JsonProperty("createdAt", TimestampConverter) timestamp = '';
    @JsonProperty("seenAt", String, true) seenAt: string | null = null;
    @JsonProperty("organizationId", Number, true) organizationId = 0;
    @JsonProperty("isSeen", Boolean, true) isSeen = false
    @JsonProperty("replyTo", MessageDM, true) replyMessageApi: MessageDM | null = null;
    replyMessageView: MessageDM | null = null
    @JsonProperty("removedAt", String, true) deleted: string | null = null;
    @JsonProperty("senderReferenceId", IsMineConverter) isMine = false;
    @JsonProperty("isMute", Boolean, true) isMute = false;
    @JsonProperty("senderReferenceId", ProfileUrlConverter) profileUrl = '';
    @JsonProperty("senderReferenceId", UsernameConverter) username = '';
    @JsonProperty("senderReferenceId", OrganizationRoleConverter) organizationRoles = '';
    @JsonProperty('messageSeenOrganizationId', Number, true) messageSeenOrganizationId: number | null = null;
    @JsonProperty("mimetype", String, true) mimetype: string | null = null;
    @JsonProperty("filename", String, true) file: string | null = null;
    @JsonProperty("attachment", Object, true) attachmentObject: string | null | object = null
    @JsonProperty('temporaryId', String, true) temporaryId: string | null = null;
    @JsonProperty('type', String, true) type = '';
    @JsonProperty('roomId', Number, true) roomId = 0;
    @JsonProperty('roomMemberMemberId', Number, true) roomMemberMemberId: number | null = null;
    @JsonProperty('roomName', String, true) roomName: string | null = null;
    @JsonProperty('subscribableType', String, true) subscribableType = '';
    @JsonProperty('autoModifiedAt', String, true) autoModifiedAt: string | null = null;
    @JsonProperty('modifiedAt', String, true) modifiedAt: string | null = null;
    @JsonProperty('details', String, true) details= '';
    @JsonProperty('seenByMemberId', Number, true) seenByMemberId: number | null = null;
    @JsonProperty('messageSeenMemberId', Number, true) messageSeenMemberId: number | null = null;
    @JsonProperty('seenByMemberReferenceId', Number, true) seenByMemberReferenceId: number | null = null;
    @JsonProperty('attachmentUrl', String, true) attachment: string | null =  null;
    
    //Message Views Properties
    @JsonProperty("replyRootId", Number, true) replyRootId: number | null = 0;
    @JsonProperty("replyRootSenderId", Number, true) replyRootSenderId = 0;
    @JsonProperty("replyRootSenderReferenceId", Number, true) replyRootSenderReferenceId = 0;
    @JsonProperty('replyRootAttachmentUrl', String, true) replyRootAttachmentUrl: string | null =  null;
    @JsonProperty('replyRootBody', String, true) replyRootBody = '';
    @JsonProperty('replyRootDetails', String, true) replyRootDetails: string | null  = null;
    @JsonProperty('replyRootCreatedAt', String, true) replyRootCreatedAt = '';
    @JsonProperty('replyRootMimetype', String, true) replyRootMimetype = '';
    @JsonProperty('replyRootAutoModifiedAt', String, true) replyRootAutoModifiedAt = '';
    @JsonProperty('roomPrivate', Boolean, true) roomPrivate: Boolean | null = null;

    get replyMessage() {
        let replyMessageView
        if(!this.replyMessageView?.id){replyMessageView = JsonParser.deserializeObject(createModelObject('replyRoot', this), MessageDM)}
        return this.replyMessageApi?.id ? this.replyMessageApi : replyMessageView?.id ? replyMessageView : null
    }
    
    set replyMessage(value: MessageDM | null) {
        this.replyMessageApi = value as MessageDM | null
        this.replyMessageView = value as MessageDM | null
    }

    createTemporary(displayBody: string, temporaryId: string, rawBody: string, roomId: number, file?: {file: File, url: string}, replyTo?: MessageDM) {
        const tmpMessage = JsonParser.deserializeObject(
          {
            activatedAt: null,
            attachmentUrl: file?.url,
            body: displayBody,
            rawBody,
            tmpFile: file,
            createdAt: new Date().toUTCString(),
            filename: file?.file.name,
            id: -1,
            isMine: true,
            isMute: false,
            links: [],
            mimetype: file?.file.type || "text/plain",
            modifiedAt: null,
            removedAt: null,
            replyRoot: replyTo ? replyTo.id : null,
            replyTo: null,
            seenAt: null,
            organizationId: 0,
            isSeen: false,
            senderId: -1,
            senderReferenceId: ProfileDSModule?.id,
            subscribableType: "nugget",
            roomId,
            roomName: null,
            temporaryId: temporaryId,
            type: "message",
            details: ''
        }, MessageDM);
        tmpMessage.rawBody = rawBody;
        if(file) tmpMessage.tmpFile = file;
        if(replyTo) tmpMessage.replyMessage = replyTo;
        return tmpMessage;
    }

}