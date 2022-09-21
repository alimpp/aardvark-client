<template>

  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

      <ValidationProvider
        slim
        class="mb-3"
        rules="invitations-email"
        v-slot="{failed, errors, required}"
        name="Email"
      >
      <CoreInput :required="required"
        v-model="email"
        placeholder="Email"
        ref="Input"
      />
      <div
        v-if="failed && !email"
        class="text-danger text-left mt-2"
      >Email field is required</div>
      <div
        v-else
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>
  </form>

</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { InvitationCSModule, DialogCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import { extend } from 'vee-validate';
import { email } from 'vee-validate/dist/rules';
import { Wait, WaitStates } from "@/utils/vuewait";

extend('email', email)

@Component({
  name: "InvitationForm",
  components: { CoreInput, ValidationProvider },
})
export default class InvitationForm extends DialogForm {
  get email(): string {
    return InvitationCSModule.email;
  }
  set email(value: string) {
    InvitationCSModule.setEmail(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await InvitationCSModule.invite();
    InvitationCSModule.clear();
    DialogCSModule.clear();
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    InvitationCSModule.clear();

    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-column-gap: 8px;
}
</style>
