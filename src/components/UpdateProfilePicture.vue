<template>
  <form
    id="picture"
    class="form"
    @submit.prevent="onConfirm"
  >
    <ValidationProvider
      slim
      class="mb-3"
      ref="provider"
      v-slot="{failed, errors, required}"
      rules="members-avatar|required"
    >
      <input :required="required"
        v-show="false"
        type="file"
        @change="setImage"
        ref="imageFileInput"
        accept="image/*"
      >
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>
    <div class="pictureCrop">
      <div
        class="image-placeholder"
        v-show="!imageSrc"
      >
        <CoreBtn
          @click="getImage"
          v-if="!imageSrc"
        >Upload Image</CoreBtn>
      </div>

      <VueCropper
        v-if="imageSrc"
        ref="cropper"
        :src="imageSrc"
        alt="Avatar"
        :aspectRatio="1"
        :zoomable="false"
        :viewMode="2"
        :minCanvasWidth="200"
        :minCanvasHeight="200"
        :minContainerWidth="200"
        :minContainerHeight="200"
      />

    </div>
    <p class="align-self-end m-1">We only accept JEPG and PNG files. Your picture size should be at least 300px</p>
  </form>

</template>


<script lang="ts">
import Component from "vue-class-component";
import DialogForm from "./Form/Base/DialogForm.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { UpdateProfilePictureCSModule, DialogCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import CoreInput from "@/components/Core/CoreInput.vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

@Component({
  name: "UpdateProfilePicture",
  components: {
    CoreBtn,
    ValidationProvider,
    CoreInput,
    VueCropper,
  },
})
export default class UpdateProfilePicture extends DialogForm {
  $refs!: {
    imageFileInput
    cropper
    provider
  };

  imageSrc: null | string | ArrayBuffer = "";

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: Math.floor(srcWidth * ratio),
      height: Math.floor(srcHeight * ratio),
    };
  }
  resizeImage(image, maxHeight = 300, maxWidth = 300) {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const targetSize = this.calculateAspectRatioFit(img.width, img.height, maxHeight, maxWidth);
      canvas.width = targetSize.width;
      canvas.height = targetSize.height;
      context?.drawImage(img, 0, 0, targetSize.width, targetSize.height);
      context?.canvas.toBlob((blob) => {
        UpdateProfilePictureCSModule.setAvatar(blob);
        UpdateProfilePictureCSModule.update();
      });
    };
  }

  getImage() {
    if(this.imageSrc){
      DialogCSModule.setDisableConfirmButton(false);
    }else{
      DialogCSModule.setDisableConfirmButton(true);
    }
    this.$refs.imageFileInput.click();
  }

  async setImage(e) {
    const { valid } = await this.$refs.provider.validate(e);
    if(valid){
      const file = e.target.files[0];
      this.imageSrc = URL.createObjectURL(file);
    }
    if(!this.imageSrc){
      DialogCSModule.setDisableConfirmButton(true);
    }else{
      DialogCSModule.setDisableConfirmButton(false);
    }
  }

  cropImage() {
    const croppedImage = (this.$refs.cropper as VueCropper).getCroppedCanvas().toDataURL();
    this.resizeImage(croppedImage);
  }

  async onConfirm() {
    this.cropImage();
    UpdateProfilePictureCSModule.clear();
    DialogCSModule.clear();
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    return;
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/scss/variables";


.pictureCrop {
  display: grid;
  grid-row-gap: 20px;
  padding: 12px;
  .image-placeholder {
    align-content: center;
    display: grid;
    height: 300px;
    justify-content: center
  }
}

</style>

