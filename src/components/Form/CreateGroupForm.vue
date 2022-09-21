<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="groups-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        :error="failed"
        v-model="title"
        placeholder="Name"
        ref="Input"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 flex-grow-1 description"
      rules="groups-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        :error="failed"
        class="description"
        v-model="description"
        placeholder="Description"
        textarea
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>
    <div class="type">
      <ValidationProvider
        slim
        class="mb-3 mr-5"
        v-slot="{failed, errors}"
      >
        <CoreRadio
          v-model="type"
          :radio-value="GROUP_TYPE.PUBLIC"
        >Public</CoreRadio>
        <div
          v-if="failed"
          class="text-danger text-left mt-2"
        >{{errors[0]}}</div>
      </ValidationProvider>

      <ValidationProvider
        slim
        class="mb-3 mr-5"
        v-slot="{failed, errors}"
      >
        <CoreRadio
          v-model="type"
          :radio-value="GROUP_TYPE.PRIVATE"
        >Private</CoreRadio>
        <div
          v-if="failed"
          class="text-danger text-left mt-2"
        >{{errors[0]}}</div>
      </ValidationProvider>

      <ValidationProvider
        slim
        class="mb-3"
        v-slot="{failed, errors}"
      >
        <CoreRadio
          v-model="type"
          :radio-value="GROUP_TYPE.BOTH"
        >Both</CoreRadio>
        <div
          v-if="failed"
          class="text-danger text-left mt-2"
        >{{errors[0]}}</div>
      </ValidationProvider>
    </div>

  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { CreateGroupCSModule, DialogCSModule, SettingsGroupsCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";
import CoreRadio from "@/components/Core/CoreRadio.vue";
import {GROUP_TYPE} from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "CreateGroupForm",
  components: { CoreInput, ValidationProvider, CoreRadio },
})
export default class CreateGroupForm extends DialogForm {
  GROUP_TYPE = GROUP_TYPE;

  get title(): string {
    return CreateGroupCSModule.title;
  }
  set title(value: string) {
    CreateGroupCSModule.setTitle(value);
  }

  get description(): string {
    return CreateGroupCSModule.description;
  }
  set description(value: string) {
    CreateGroupCSModule.setDescription(value);
  }

  get type() {
    return CreateGroupCSModule.type
  }
  set type(value: GROUP_TYPE) {
    CreateGroupCSModule.setType(value);
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    await CreateGroupCSModule.create();
    CreateGroupCSModule.clear();
    DialogCSModule.clear();
    await SettingsGroupsCSModule.doLoad(true)
    await SettingsGroupsCSModule.selectNewGroupRow()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateGroupCSModule.clear();
    
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
  .type{
    display: grid;
    grid-auto-flow: column;
  }
}
</style>
