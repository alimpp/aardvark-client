<template>
  <div id="profilePictureEditor">

    <!-- PICTURE -->
    <div
      class="avatar large"
      @click="loadDialog"
    >
      <CoreAvatar
        :src="profileUrl"
        :username="fullName"
        :size="170"
        class="avatar"
        :editable="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import Component from "vue-class-component";
import Vue from "vue";
import { Getter } from "vuex-class";
import { DialogCSModule, SettingsUserProfileCSModule, UpdateProfilePictureCSModule } from "@/store";
import PicturePopUp from "@/components/UpdateProfilePicture.vue";
@Component({
  name: "ProfilePictureEditor",
  components: {
    CoreAvatar,
    PicturePopUp,
  },
})
export default class ProfilePictureEditor extends Vue {

  @Getter("fullName", { namespace: "profileds" }) fullName!: string;
  get profileUrl() {
    return SettingsUserProfileCSModule.profileDetail?.profileUrl
  }

  async updateAvatar() {
    await UpdateProfilePictureCSModule.update();
  }

  loadDialog() {
    const content = PicturePopUp;

    DialogCSModule.load({
      title: "Select Profile Photo",
      isShowingDialog: true,
      noClose: true,
      noFooter: false,
      confirmLabel: "Set As Profile Photo",
      width: 800,
      content,
      excludedClasses: ["dz-hidden-input"],
      disableConfirmButton: true
    });
  }
}
</script>
