import {utcFromNow} from "@/utils/date";
import dayjs from "dayjs";
import {JsonObject, JsonProperty} from "json2typescript";
import Datamodel from "./base/datamodel";
import MessageDM from "./messageDM";
import { JsonParser } from "@/utils/jsonparser"
import { createModelObject } from "@/utils/object"

@JsonObject('GroupDetailRoom')
class GroupDetailRoom {
  @JsonProperty("createdAt", String, true) createdAt: string | null = null;
  @JsonProperty("id", Number, true) id = 0;
  @JsonProperty("latestMessage", MessageDM, true) latestMessageApi: MessageDM | null = null;
  latestMessageView: MessageDM | null = null;
  @JsonProperty("latestMessageId", Number, true) latestMessageId: number | null = null;
  @JsonProperty("autoModifiedAt", String, true) autoModifiedAt: string | null = null;
  @JsonProperty("organizationId", Number, true) organizationId: number | null = null;
  @JsonProperty("ownerId", Number, true) ownerId: number | null = null;
  @JsonProperty("pinMessageId", Number, true) pinMessageId: number | null = null;
  @JsonProperty("private", Boolean, true) private = false;
  @JsonProperty("subscribableType", String, true) subscribableType: string | null = null;
  @JsonProperty("title", String, true) title: string | null = null;
  @JsonProperty("type", String, true) type: string | null = null;
  @JsonProperty("unreadCount", Number, true) unreadCount: number | null = null;

  @JsonProperty("latestMessageRoomName", String, true) latestMessageRoomName: string | null = null;
  @JsonProperty("latestMessageAttachment", Object, true) latestMessageAttachmentObject: Object | null = null;
  @JsonProperty("latestMessageIsMute", Boolean, true) latestMessageIsMute = false;
  @JsonProperty("latestMessageType", String, true) latestMessageType: string | null = null;
  @JsonProperty("latestMessageBody", String, true) latestMessageBody: string | null = null;
  @JsonProperty("latestMessageIsSeen", Boolean, true) latestMessageIsSeen = false;
  @JsonProperty("latestMessageOrganizationId", Number, true) latestMessageOrganizationId = 0;
  @JsonProperty("latestMessageFilename", String, true) latestMessageFilename: string | null = null;
  @JsonProperty("latestMessageSenderId", Number, true) latestMessageSenderId = 0;
  @JsonProperty("latestMessageReplyRoot", Number, true) latestMessageReplyRoot: Number | null = null;
  @JsonProperty("latestMessageSenderReferenceId", Number, true) latestMessageSenderReferenceId = 0;
  @JsonProperty("latestMessageMimetype", String, true) latestMessageMimetype: string | null = null;
  @JsonProperty("latestMessageDetails", String, true) latestMessageDetails: string | null = null;
  @JsonProperty("latestMessageAttachmentUrl", String, true) latestMessageAttachment: string | null = null;
  @JsonProperty("latestMessageCreatedAt", String, true) latestMessageCreatedAt = '';
  @JsonProperty("latestMessageSubscribableType", String, true) latestMessageSubscribableType: string | null = null;

   get latestMessage(): MessageDM | null{
    if(!this.latestMessageView?.id && this.latestMessageId) this.latestMessageView = JsonParser.deserializeObject(createModelObject('latestMessage', this), MessageDM)
    return this.latestMessageApi?.id ? this.latestMessageApi : this.latestMessageView
  }

  set latestMessage(value: MessageDM | null) {
    this.latestMessageApi = value as MessageDM | null
    this.latestMessageView = value as MessageDM | null
  }

}

@JsonObject('GroupDetailDM')
export default class GroupDetailDM extends Datamodel {
  @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false;
  @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false;
  @JsonProperty("privateSeenAt", String, true) privateSeenAt: string | null = null;
  @JsonProperty("publicSeenAt", String, true) publicSeenAt: string | null = null;
  @JsonProperty("seenAt", String, true) seenAt: string | null = null;
  @JsonProperty("id", Number, true) id = 0;
  @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
  @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("title", String, true) title = '';
  @JsonProperty("type", String, true) type = '';
  @JsonProperty("description", String, true) description: string | null = null;
  @JsonProperty("recentMessageAt", String, true) recentMessageAt: string | null = null;
  @JsonProperty("removedAt", String, true) removedAt: string | null = null;
  @JsonProperty("autoModifiedAt", String, true) autoModifiedAt: string | null = null;
  @JsonProperty("createdAt", String, true) createdAt: string | null = null;
  @JsonProperty("privateRoom", GroupDetailRoom, true) privateRoomApi: GroupDetailRoom | null = null;
  privateRoomView: GroupDetailRoom | null = null;
  @JsonProperty("publicRoom", GroupDetailRoom, true) publicRoomApi: GroupDetailRoom | null = null;
  publicRoomView: GroupDetailRoom | null = null;

  //Channel Views Properties
  @JsonProperty("publicRoomRoomId", Number, true) publicRoomRoomId = 0;
  @JsonProperty("publicRoomTitle", String, true) publicRoomTitle: string | null = null;
  @JsonProperty("publicRoomUnreadCount", Number, true) publicRoomUnreadCount = 0;
  @JsonProperty("publicRoomPinMessageId", Number, true) publicRoomPinMessageId = 0;
  @JsonProperty("publicRoomLatestMessageId", Number, true) publicRoomLatestMessageId = 0;
  @JsonProperty("publicRoomType", String, true) publicRoomType: string | null = null;
  @JsonProperty("publicRoomOwnerId", Number, true) publicRoomOwnerId = 0;
  @JsonProperty("publicRoomSubscribableType", String, true) publicRoomSubscribableType: string | null = null;
  @JsonProperty("publicRoomOrganizationId", Number, true) publicRoomOrganizationId = 0;
  @JsonProperty("publicRoomPrivate", Boolean, true) publicRoomPrivate= false;
  @JsonProperty("publicLatestMessageId", Number, true) publicLatestMessageId = 0;
  @JsonProperty("publicLatestMessageRoomName", String, true) publicRoomLatestMessageRoomName: string | null = null;
  @JsonProperty("publicLatestMessageSenderId", Number, true) publicRoomLatestMessageSenderId = 0;
  @JsonProperty("publicLatestMessageSenderReferenceId", Number, true) publicRoomLatestMessageSenderReferenceId = 0;
  @JsonProperty("publicLatestMessageReplyRoot", Number, true) publicRoomLatestMessageReplyRoot: Number | null = null;
  @JsonProperty("publicLatestMessageFilename", String, true) publicRoomLatestMessageFilename: string | null = null;
  @JsonProperty("publicLatestMessageAttachment", Object, true) publicRoomLatestMessageAttachmentObject: Object | null = null;
  @JsonProperty("publicLatestMessageOrganizationId", Number, true) publicRoomLatestMessageOrganizationId = 0;
  @JsonProperty("publicLatestMessageMimetype", String, true) publicRoomLatestMessageMimetype: string | null = null;
  @JsonProperty("publicLatestMessageRoomId", Number, true) publicRoomLatestMessageRoomId = 0;
  @JsonProperty("publicLatestMessageAttachmentUrl", String, true) publicRoomLatestMessageAttachment: string | null = null;
  @JsonProperty("publicLatestMessageIsSeen", Boolean, true) publicRoomLatestMessageIsSeen = false;
  @JsonProperty("publicLatestMessageDetails", String, true) publicRoomLatestMessageDetails: string | null = null;
  @JsonProperty("publicLatestMessageBody", String, true) publicRoomLatestMessageBody: string | null = null;
  @JsonProperty("publicLatestMessageIsMute", Boolean, true) publicRoomLatestMessageIsMute = false;
  @JsonProperty("publicLatestMessageType", String, true) publicRoomLatestMessageType: string | null = null;
  @JsonProperty("publicLatestMessageSubscribableType", String, true) publicRoomLatestMessageSubscribableType: string | null = null;
  @JsonProperty("publicLatestMessageCreatedAt", String, true) publicRoomLatestMessageCreatedAt: string | null = null;
  @JsonProperty('publicLatestSeenMessageId', Number, true) publicLatestSeenMessageId: number | null = null;

  @JsonProperty("privateRoomRoomId", Number, true) privateRoomRoomId = 0;
  @JsonProperty("privateRoomTitle", String, true) privateRoomTitle: string | null = null;
  @JsonProperty("privateRoomOrganizationId", Number, true) privateRoomOrganizationId = 0;
  @JsonProperty("privateRoomSubscribableType", String, true) privateRoomSubscribableType: string | null = null;
  @JsonProperty("privateRoomType", String, true) privateRoomType: string | null = null;
  @JsonProperty("privateRoomLatestMessageId", Number, true) privateRoomLatestMessageId = 0;
  @JsonProperty("privateRoomPinMessageId", Number, true) privateRoomPinMessageId = 0;
  @JsonProperty("privateRoomPrivate", Boolean, true) privateRoomPrivate = false;
  @JsonProperty("privateRoomUnreadCount", Number, true) privateRoomUnreadCount = 0;
  @JsonProperty("privateRoomOwnerId", Number, true) privateRoomOwnerId = 0;
  @JsonProperty("privateLatestMessageRoomId", Number, true) privateRoomLatestMessageRoomId = 0;
  @JsonProperty("privateLatestMessageRoomName", String, true) privateRoomLatestMessageRoomName: string | null = null;
  @JsonProperty("privateLatestMessageAttachment", Object, true) privateRoomLatestMessageAttachmentObject: Object | null = null;
  @JsonProperty("privateLatestMessageId", Number, true) privateLatestMessageId = 0;
  @JsonProperty("privateLatestMessageIsMute", Boolean, true) privateRoomLatestMessageIsMute = false;
  @JsonProperty("privateLatestMessageType", String, true) privateRoomLatestMessageType: string | null = null;
  @JsonProperty("privateLatestMessageBody", String, true) privateRoomLatestMessageBody: string | null = null;
  @JsonProperty("privateLatestMessageIsSeen", Boolean, true) privateRoomLatestMessageIsSeen = false;
  @JsonProperty("privateLatestMessageOrganizationId", Number, true) privateRoomLatestMessageOrganizationId = 0;
  @JsonProperty("privateLatestMessageFilename", String, true) privateRoomLatestMessageFilename: string | null = null;
  @JsonProperty("privateLatestMessageSenderId", Number, true) privateRoomLatestMessageSenderId = 0;
  @JsonProperty("privateLatestMessageReplyRoot", Number, true) privateRoomLatestMessageReplyRoot: Number | null = null;
  @JsonProperty("privateLatestMessageSenderReferenceId", Number, true) privateRoomLatestMessageSenderReferenceId = 0;
  @JsonProperty("privateLatestMessageMimetype", String, true) privateRoomLatestMessageMimetype: string | null = null;
  @JsonProperty("privateLatestMessageDetails", String, true) privateRoomLatestMessageDetails: string | null = null;
  @JsonProperty("privateLatestMessageAttachmentUrl", String, true) privateRoomLatestMessageAttachment: string | null = null;
  @JsonProperty("privateLatestMessageSubscribableType", String, true) privateRoomLatestMessageSubscribableType: string | null = null;
  @JsonProperty('privateLatestMessageCreatedAt', String, true) privateRoomLatestMessageCreatedAt: string | null = null;
  @JsonProperty('privateLatestSeenMessageId', Number, true) privateLatestSeenMessageId: number | null = null;

  get privateRoom() {
    if(!this.privateRoomView?.id && this.privateRoomRoomId) this.privateRoomView = JsonParser.deserializeObject(createModelObject('privateRoom', this), GroupDetailRoom)
    return this.privateRoomApi?.id ? this.privateRoomApi : this.privateRoomView
  }

  set privateRoom(value: GroupDetailRoom | null) {
    this.privateRoomApi = value as GroupDetailRoom | null
    this.privateRoomView = value as GroupDetailRoom | null
  }

  get publicRoom() {
    if(!this.publicRoomView?.id && this.publicRoomRoomId)this.publicRoomView = JsonParser.deserializeObject(createModelObject('publicRoom', this), GroupDetailRoom)
    return this.publicRoomApi?.id ? this.publicRoomApi : this.publicRoomView
  }

  set publicRoom(value: GroupDetailRoom | null) {
    this.publicRoomApi = value as GroupDetailRoom | null
    this.publicRoomView = value as GroupDetailRoom | null
  }


  get unreadCount() {
    return (this.privateRoom?.unreadCount || 0) + (this.publicRoom?.unreadCount || 0);
  }

  get icon() {
    return;
  }

  get name() {
    return this.title;
  }

  get timestamp() {
    if(this.recentMessageAt) {
      return utcFromNow(this.recentMessageAt);
    }
    else {
      return ''
    }
  }

  get latestRoomId() {
    if(this.isSubscribedPrivate && this.isSubscribedPublic) {
      if(!this.privateSeenAt && this.publicSeenAt) {
        return this.privateRoom?.id;
      } else if(this.privateSeenAt && !this.publicSeenAt) {
        return this.publicRoom?.id;
      }
    }
    return this.latestRoom?.id;
  }

  get latestRoom() {
    if(this.isSubscribedPublic && this.isSubscribedPrivate) {
      // Find latest room, return that rooms message.
        if( this.privateRoom?.latestMessage && this.publicRoom?.latestMessage) {  
        return dayjs(this.publicRoom?.latestMessage?.createdAt).isAfter(this.privateRoom.latestMessage.createdAt) ? this.publicRoom : this.privateRoom;
        }else if(this.publicRoom?.latestMessage){
        return this.publicRoom
        } else{
          return  this.privateRoom
      }
    }else if(this.isSubscribedPrivate) {
      return this.privateRoom
    } else {
      return this.publicRoom
    }
  }

  get latestMessage() {
    if(this.isSubscribedPrivate && this.isSubscribedPublic) return this.latestRoom?.latestMessage
    else if (this.isSubscribedPublic) return this.publicRoom?.latestMessage
    else if (this.isSubscribedPrivate) return this.privateRoom?.latestMessage;
  }

}
