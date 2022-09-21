<template>
  <CorePopper tag="div" trigger="hover" class="d-inline">
    <strong slot="reference" class="username">@{{fullName}}</strong>
    <UserProfile slot="popper" :userId="userId" />
  </CorePopper>
</template>

<script lang="ts">
import { Component, Prop, Vue} from "vue-property-decorator";
import CorePopper from "@/components/Core/CorePopper.vue";
import UserProfile from './UserProfile.vue';
import {  UserDSModule } from "@/store";

@Component({
  name: "ProfilePopup",
  components: {CorePopper, UserProfile}
})
export default class ProfilePopup extends Vue {
  @Prop({ required: true, type: Number }) 
  readonly userId!: number;

  get user(){
    return UserDSModule.itemsAsArray.find(user => user.referenceId === +this.userId);
  }

  get fullName(){
    return this?.user?.fullName?.trim() ?? '';
  }
}
</script>
<style lang="scss" scoped>
::v-deep .information {
  max-width: 260px;
}
.username{
  color: var(--brand-color);
}
</style>