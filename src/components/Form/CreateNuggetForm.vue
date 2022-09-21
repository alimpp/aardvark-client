<template>
  <form
    slot="default"
    class="form"
    @submit.prevent="onConfirm"
  >
    <ValidationProvider
      slim
      class="mb-3 type"
      rules="nuggets-kind"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="type"
        :required="required"
        :error="failed"
        :options="types"
        ref="Input"
        placeholder="Type"
        listWidth="100%"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 title"
      rules="nuggets-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        v-model.lazy="title"
        :required="required"
        :error="failed"
        v-model="title"
        placeholder="Name"
        autocomplete="create-project-title"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 project"
      rules="nuggets-projectId"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="project"
        :required="required"
        :error="failed"
        list-width="100%"
        placeholder="Project"
        :options="projects"
        :config="projectConfig"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 priority"
      rules="nuggets-priority"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="priority"
        :required="required"
        :error="failed"
        list-width="100%"
        placeholder="Priority"
        :options="priorities"
      />
      <div
        v-if="failed"
        class="text-danger text-left mt-2"
      >{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 description"
      rules="nuggets-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        :required="required"
        :error="failed"
        v-model="description"
        placeholder="Description"
        autocomplete="create-nuggets-description"
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
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import DialogForm from "./Base/DialogForm.vue";
import  {
  CreateNuggetCSModule,
  DialogCSModule,
  ProfileDSModule,
  NuggetSubscriptionsActiveCSModule,
  GoodNewsTriageCSModule,
  BadgeCountCSModule,
} from "@/store";
import { ValidationProvider } from "vee-validate";
import { Wait, WaitStates } from "@/utils/vuewait";
import CoreTagsInput from "@/components/Core/CoreTagsInput.vue";
import { DEBOUNCE } from "@/utils/constants";
import { debounce } from "@/utils/debounce";
import { Watch } from "vue-property-decorator";
import { JsonParser } from '@/utils/jsonparser';
import NuggetSubscriptionsActiveRow from '@/datamodels/rows/nuggetSubscriptionsActiveRow';
import GoodNewsTriageRow from '../../datamodels/rows/goodNewsTriageRow';
import NuggetDM from "@/datamodels/nuggetDM";
import { Nullable } from "@/utils/generics";

@Component({
  name: "CreateNuggetForm",
  components: {
    CoreInput,
    CoreSelect,
    ValidationProvider,
    CoreTagsInput,
    CoreCheckBox,
  },
})
export default class CreateNuggetForm extends DialogForm {
  projectConfig = { labelKey: "title", valueKey: "id" };
  tagConfig = { labelKey: "title", valueKey: "id" };
  newNugget: NuggetDM | undefined;
  relatedNuggetsConfig = {
    labelKey: "title",
    valueKey: "id",
    searchKey: "title",
  };

  waitState = WaitStates;
  relatedNugget = null;

  @Watch("relatedNugget")
  onTagUpdate(value: string) {
    if (value.length < 2) return;
    debounce(DEBOUNCE.CREATE_NUGGET_FORM_RELATED_NUGGETS, () => CreateNuggetCSModule.searchForNuggets(value), 300);
  }

  get title(): string {
    return CreateNuggetCSModule.title;
  }
  set title(value: string) {
    CreateNuggetCSModule.setTitle(value);
  }

  get type(): string {
    return CreateNuggetCSModule.type;
  }
  set type(value: string) {
    CreateNuggetCSModule.setType(value);
  }

  get types() {
    return CreateNuggetCSModule.types;
  }

  get project(): Nullable<number> {
    return CreateNuggetCSModule.projectId;
  }
  set project(value: Nullable<number>) {
    CreateNuggetCSModule.setProjectId(value);
  }

  get projects() {
    return CreateNuggetCSModule.projects;
  }

  get priority(): string {
    return CreateNuggetCSModule.priority;
  }
  set priority(value: string) {
    CreateNuggetCSModule.setPriority(value);
  }

  get priorities() {
    return CreateNuggetCSModule.priorities;
  }

  get description(): string {
    return CreateNuggetCSModule.description;
  }

  set description(value: string) {
    CreateNuggetCSModule.setDescription(value);
  }

  get userIsProjectMaestro() {
    const  { isProjectMaestro }  = ProfileDSModule;
    return isProjectMaestro;
  }

  onOpened() {
    return;
  }

  closeDialog() {
    window.setTimeout(() => {
      CreateNuggetCSModule.clear();
      DialogCSModule.clear();
    }, 500);
  }

  async onClosed() {
    this.afterCloseOperation()
  }


  afterCloseOperation()
  {
    if ( (this.newNugget!=undefined) && (this.newNugget.isSubscribedPublic)) {
      const freshSubscriptionRow = JsonParser.deserializeObject(this.newNugget, NuggetSubscriptionsActiveRow);
      BadgeCountCSModule.setNuggetSubscribed(BadgeCountCSModule.nuggetSubscribed + 1)
      NuggetSubscriptionsActiveCSModule.doSetRows([freshSubscriptionRow]);
      this.$route.name !== "NuggetSubscriptionsActive" ? this.$router.push({ name: "NuggetSubscriptionsActive" }) : NuggetSubscriptionsActiveCSModule.doLoad(true)
    } else {
      if (this.newNugget!=undefined)
      {
        const freshRow = JsonParser.deserializeObject(this.newNugget, GoodNewsTriageRow);
        BadgeCountCSModule.setGoodNewsTriage(BadgeCountCSModule.goodNewsTriage + 1)
        GoodNewsTriageCSModule.doSetRows([freshRow]);
        this.$route.name !== "GoodNewsTriage" ? this.$router.push({ name: "GoodNewsTriage" }) : GoodNewsTriageCSModule.doLoad(true)
      }
     }
  }


  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm() {
    this.newNugget = await CreateNuggetCSModule.create();
    this.closeDialog()
  }

  onBeforeClosed() {

    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, auto);
  grid-column-gap: 8px;

  .description {
    grid-column: 2;
    grid-row: 1/5;
    height: 100%;
    &.error {
      height: calc(100% - 30px);
    }
    ::v-deep .maz-input {
      height: calc(100% - 8px);
    }
    ::v-deep textarea {
      resize: none;
      height: calc(100% - 8px);
    }
  }
}
</style>
