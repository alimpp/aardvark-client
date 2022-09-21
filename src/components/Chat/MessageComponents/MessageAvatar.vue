<template>
  <div class="message-avatar d-flex justify-content-center align-items-center">
    <CorePopper tag="div" trigger="hover" boundarySelector="#main-container" :disabled="!canShowPopupAvatar">
      <CoreAvatar slot="reference" :src="message.profileUrl" :username="message.username" :size="45" />
      <UserProfile slot="popper" :userId="message.senderId" />
    </CorePopper>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import UserProfile from "../../UserProfile.vue";
import CorePopper from "@/components/Core/CorePopper.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import ChatCS from "@/store/modules/componentstore/base/chatCS";

@Component({
  name: "MessageAvatar",
  components: {CoreAvatar, UserProfile, CorePopper}
})
export default class MessageAvatar extends BaseMessageComponent {
  @Prop({required: true}) store!: ChatCS;

  get canShowPopupAvatar() {
    return this.store.canShowPopupAvatar
  }

}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.message-avatar {
  min-width: 50px;
  max-width: 50px;
  width: 50px;
}
::v-deep .information {
  max-width: 260px;
}
</style>