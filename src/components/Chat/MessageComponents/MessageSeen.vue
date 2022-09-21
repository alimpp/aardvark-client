<template>
  <CorePopper popperContainerId="seenPopper" :disabled="!canShowPopupViewers" @created="onLoadViewers"
    trigger="hover" :placement="placement" :containerClass="{'p-1': true}">
    <div slot="popper">
      <CoreScrollbar class="viewers-container">
        <div class="viewers" :style="[viewersGridColumnCount]">
          <div v-for="viewer in viewers" :key="viewer.id" class="viewer">
            <CoreAvatar :src="viewer.profileUrl" :username="viewer.username" :size="45" class="avatar" />
            <span>{{viewer.fullName}}</span>
          </div>
          <div v-if="isLoadingPeopleViewed" class="overflow-hidden">
            <CoreSpinner :size="45" />
          </div>
        </div>
      </CoreScrollbar>
    </div>
    <span slot="reference" class="checkmark" :class="{'highlight': isMessageSeen}">
      <i class="material-icons">{{ isMessageSeen ? 'done_all' : 'done' }}</i>
    </span>
  </CorePopper>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import UserDM from "@/datamodels/userDM";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import { WaitStates } from "@/utils/vuewait";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import ChatCS from "@/store/modules/componentstore/base/chatCS";
import CorePopper from '@/components/Core/CorePopper.vue';
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';

@Component({
  name: "MessageSeen",
  components: {CorePopper, CoreSpinner, CoreScrollbar, CoreAvatar}
})
export default class MessageSeen extends BaseMessageComponent {

  @Prop({required: true}) readonly store!: ChatCS;

  get placement() {
    return this.isOwnMessage ? 'left' : 'right';
  }

  get isOwnMessage() {
    return this.message.isMine
  }

  get canShowPopupViewers() {
    return this.store.canShowPopupViewers && this.message.id !== -1 && this.isMessageSeen;
  }

  public get viewers(): UserDM[] {
    return this.store.messageViewers(this.message.id);
  }

  get viewersGridColumnCount() {
    if(this.viewers.length < 4) {
      const count = this.isLoadingPeopleViewed ? this.viewers.length + 1 : this.viewers.length;
      return {'grid-template-columns': `repeat(${count}, auto)`}
    }
    return {'grid-template-columns': 'repeat(4, auto)'}
	}

  public get isLoadingPeopleViewed() {
    return this.$wait.is(WaitStates.ACTION_MESSAGE_PEOPLE_VIEWED);
  }

  public get isMessageSeen() {
    return this.message.isSeen || this.message.seenAt;
  }

  async onLoadViewers() {
    if(this.isMessageSeen) this.listViewers(this.message.id);
  }

  async listViewers(messageId: number): Promise<void> {
    this.store.listViewers(messageId)
  }

}
</script>
<style lang="scss" scoped>
.checkmark{
  height: 15px;
  &.highlight{
    color: var(--brand-color);
  }
  i {
    font-size: 15px;
    vertical-align: middle;
  }
}
.viewers-container{
  max-height: 200px;

  .viewers {
    display: grid;
    justify-items: center;
    grid-auto-flow: row dense;
    grid-gap: 8px 4px;
    margin: 0 4px;

    .viewer {
      display: grid;
      grid-template-rows: repeat(2, auto);
      justify-items: center;
      grid-gap: 2px;
      font-size: 9px !important;
      text-align: center;
      max-width: fit-content;
    }
  }
}
</style>
