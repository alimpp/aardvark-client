<template>
  <CorePopper ref="popper" trigger="clickToToggle" :containerClass="popperContainer">
    <div slot="popper" class="menu-list">
      <div v-for="action in actions" :key="action.id">
        <div class="menu-item" @click="messageActionHandler(action)">{{ action.title }}</div>
      </div>
    </div>
    <span class="message-options" slot="reference">
      <i class="material-icons">more_horiz</i>
    </span>
  </CorePopper>
</template>

<script lang="ts">
import { ProfileDSModule } from "@/store";
import { Component, Prop, Ref } from "vue-property-decorator";
import { ClassAttributes } from '@/utils/types';
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import CorePopper from '@/components/Core/CorePopper.vue';

type MessageAction = {
  id: string
  title: string
}

@Component({
  name: "MessageOptions",
  components: {CorePopper}
})
export default class MessageOptions extends BaseMessageComponent {
  @Prop({ required: true }) actions!: MessageAction[];
  @Ref('popper') popper!: CorePopper;

  readonly popperContainer: ClassAttributes = {
    'p-0': true
  };

  public get currentUserId() {
    return ProfileDSModule?.id;
  }

  public get senderId() {
    return this.message.senderId;
  }

  messageActionHandler(action: MessageAction) {
    this.popper.doClose();
    this.$emit('onHandleAction', {action, message: this.message});
  }

}
</script>

<style lang="scss" scoped>
.menu-list{
  color: var(--text-color);
  background: var(--primary-color);
  padding: 0;
  overflow: hidden;
}
.menu-item{
  z-index: 1;
}
.message-options {
  cursor: pointer;
	transition: all 0.2s;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;

  &:hover{
    transform: scale(1.1);
    opacity: 0.7;
  }
}
</style>