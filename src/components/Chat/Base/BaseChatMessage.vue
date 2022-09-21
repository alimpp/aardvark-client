<script lang="ts">
import ChatCS from "@/store/modules/componentstore/base/chatCS";
import { Component, Prop} from "vue-property-decorator";
import BaseMessage from "./BaseMessage.vue";

@Component({
  name: "BaseChatMessage"
})
export default class BaseChatMessage extends BaseMessage {
  @Prop({required: true}) store!: ChatCS;

  onRetry() {
    if(this.message.isErrored) this.store.retry(this.message);
  }

  onHandleAction(data) {
    this.store.onHandleChatAction(data);
  }

  get id(): number {
    return this.message.id;
  }

  get hasContent(): boolean {
    return !!this.message.content;
  }

  get hasReply(): boolean {
    return !!this.message.replyMessage;
  }

  get isErrored(): boolean {
    return this.message.isErrored;
  }

  get isDeleted() {
    return this.message.deleted;
  }

  get isMine() {
    return this.message.isMine;
  }

  get isSeen() {
    return this.message.isSeen;
  }

  get isSyncing() {
    return !this.isErrored && this.id === -1;
  }

  get isUpdating() {
    return this.message.isUpdating;
  }

  get isReadOnly() {
    return this.store.readOnlyData.isReadOnly;
  }

  get canReply(): boolean {
    return !this.isErrored && !this.isDeleted;
  }

  get canEdit(): boolean {
    return this.isMine && !this.isDeleted && !this.isErrored && !this.isSeen;
  }

  get canDelete(): boolean {
    return this.isMine && !this.isSeen && !this.isDeleted && !this.isErrored;
  }

  get canShowPopupAvatar() {
    return this.store.canShowPopupAvatar
  }

  get canShowPopupViewers() {
    return this.store.canShowPopupViewers
  }

}
</script>