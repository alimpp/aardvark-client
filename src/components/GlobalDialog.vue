<template>
<ValidationObserver v-slot="{invalid, dirty}">
  <CoreDialog
    v-model="isOpen"
    :maxWidth="maxWidth"
    :width="width"
    :persistent="dirty || persistent"
    :noHeader="noHeader"
    :noFooter="noFooter"
    :noClose="noClose"
    :noConfirm="noConfirm"
    :success="success"
    :danger="danger"
    :dark="dark"
    :excludedClasses="excludedClasses"
    :fullsize="fullsize"
    :title="title"
    :confirmLabel="confirmLabel"
    :disableConfirmButton="invalid || disableConfirmButton"
    :specificButton="specificButton"
    :cancelLabel="cancelLabel"
    @input="onBeforeClosed"
    @opened="onOpened"
    @confirm="onConfirm"
    @closed="onAfterClosed"
    >
      <component ref="component" :is="content" />
  </CoreDialog>
</ValidationObserver>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CoreDialog from "@/components/Core/CoreDialog.vue";
import { State } from "vuex-class";
import { DialogCSModule } from "@/store";
import DialogForm from "./Form/Base/DialogForm.vue";
import {ValidationObserver} from 'vee-validate';
import { Ref } from "vue-property-decorator";

@Component({
  name: "GlobalDialog",
  components: { CoreDialog, ValidationObserver },
})
export default class GlobalDialog extends Vue {
  @State("title", { namespace: "dialogcs" }) title!: boolean;
  @State("content", { namespace: "dialogcs" }) content!: DialogForm;
  @State("confirmLabel", { namespace: "dialogcs" }) confirmLabel!: boolean;
  @State("cancelLabel", { namespace: "dialogcs" }) cancelLabel!: boolean;
  @State("maxWidth", { namespace: "dialogcs" }) maxWidth!: boolean;
  @State("width", { namespace: "dialogcs" }) width!: boolean;
  @State("persistent", { namespace: "dialogcs" }) persistent!: boolean;
  @State("noHeader", { namespace: "dialogcs" }) noHeader!: boolean;
  @State("noFooter", { namespace: "dialogcs" }) noFooter!: boolean;
  @State("noClose", { namespace: "dialogcs" }) noClose!: boolean;
  @State("noConfirm", { namespace: "dialogcs" }) noConfirm!: boolean;
  @State("success", { namespace: "dialogcs" }) success!: boolean;
  @State("danger", { namespace: "dialogcs" }) danger!: boolean;
  @State("dark", { namespace: "dialogcs" }) dark!: boolean;
  @State("excludedClasses", { namespace: "dialogcs" }) excludedClasses!: string[];
  @State("fullsize", { namespace: "dialogcs" }) fullsize!: boolean;
  @State("disableConfirmButton", { namespace: "dialogcs" }) disableConfirmButton!: boolean;
  @Ref('component') dialogComponent!: DialogForm


  previousForm: DialogForm | undefined;
  @State("specificButton", { namespace: "dialogcs" }) specificButton!: boolean;

  onBeforeClosed(event: boolean) {
    this.dialogComponent.onBeforeClosed(event);
  }

  async onOpened(event: HTMLElement) {
    this.dialogComponent.onOpened(event);
    this.previousForm = this.dialogComponent;
    await this.focusInput()
  }

  onConfirm(event: HTMLElement) {
    (this.$refs.component as DialogForm).onConfirm(event);
  }

  onAfterClosed(event: HTMLElement) {
    if (this.previousForm!==undefined)
      if (this.previousForm.onClosed)
         this.previousForm.onClosed(event);
  }

  get isOpen() {
    return DialogCSModule.isShowingDialog;
  }

  set isOpen(value) {
    DialogCSModule.setIsShowingDialog(value);

  }

  focusInput() {
    const dialogForm = (this.$refs.dialogComponent as DialogForm)
    const textField = (this.dialogComponent as Vue)?.$refs.textField as Vue;
    const input = textField ? textField?.$refs.MazInput as HTMLElement : ( this.dialogComponent.$refs.Input as Vue)?.$refs.MazInput as HTMLElement
    return input?.focus()
  }
}
</script>