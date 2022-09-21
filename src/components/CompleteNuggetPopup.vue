<template>
  <div class="title">Do you want this Nugget marked as complete and moved to the completed tab?</div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { CompleteNuggetPopupCSModule} from "@/store";


@Component({
  name: "CompleteNuggetPopup",
})
export default class CompleteNuggetPopup extends DialogForm {

  async onConfirm() {
    await CompleteNuggetPopupCSModule.complete()
    CompleteNuggetPopupCSModule.clear()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    CompleteNuggetPopupCSModule.clear()
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 30px;
}

</style>

