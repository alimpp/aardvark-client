<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >

    <ValidationProvider
      slim
      class="mb-3"
      rules="tags-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput :required="required" 
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
      rules="tags-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput :required="required"
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

  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { CreateTagCSModule, DialogCSModule, SettingsTagsCSModule } from "@/store";
import { ValidationProvider } from "vee-validate";

@Component({
  name: "CreateTagForm",
  components: { CoreInput, ValidationProvider },
})
export default class CreateTagForm extends DialogForm {
  get title(): string {
    return CreateTagCSModule.title;
  }
  set title(value: string) {
    CreateTagCSModule.setTitle(value);
  }

  get description(): string {
    return CreateTagCSModule.description;
  }
  set description(value: string) {
    CreateTagCSModule.setDescription(value);
  }

  async onConfirm() {
    await CreateTagCSModule.create();
    CreateTagCSModule.clear();
    DialogCSModule.clear();
    await SettingsTagsCSModule.doLoad(true)
    await SettingsTagsCSModule.selectNewTagRow()
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateTagCSModule.clear();
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 8px;
}
</style>