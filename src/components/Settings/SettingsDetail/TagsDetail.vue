<template>
  <SimpleBar class="xeba-scrollbar max-height-moduletab-content">
    <ValidationObserver
      slim
      ref="observer"
      v-slot="{handleSubmit}"
    >
      <form
        @submit.prevent="handleSubmit(onSubmit)"
        class="d-flex flex-column"
        autocomplete="off"
      >
        <ValidationProvider
          slim
          class="mb-3"
          v-slot="{failed, errors, required}"
          rules="tags-title"
        >
          <CoreInput
            :error="failed"
            :required="required"
            v-model="tagName"
            placeholder="Name"
            :disabled="isDisabled"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>
        <ValidationProvider
          slim
          class="mb-3"
          v-slot="{failed, errors, required}"
          rules="tags-description"
        >
          <CoreInput
            :error="failed"
            :required="required"
            v-model="tagDescription"
            placeholder="Description"
            textarea
            :disabled="isDisabled"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>
        <ValidationProvider
          slim
          class="mb-3"
        >
          <CoreCheckBox
            class="mb-3"
            v-model="tagIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Tag</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled()"
          :loading="$wait.is(waitState.ACTION_TAG_LOADING)"
        >Save</CoreBtn>
      </form>
    </ValidationObserver>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import SimpleBar from "simplebar-vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import Vue from "vue";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import { TagDetailCSModule, TagDSModule} from "@/store";
import TagDM from "@/datamodels/tagDM";
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "TagDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar,
    CorePicker,
  },
})
export default class TagDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };

  isRemoved = false;
  waitState = WaitStates;

  @State("tagDetail", { namespace: "tagdetailcs" }) tagDetail!: TagDM;

  @Watch("tagDetail")
  onTagDetailChange() {
    this.isRemoved = TagDetailCSModule.tagDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  public get tagId(): number {
    return TagDetailCSModule.tagDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.tagId;
  }

  public get tagName() {
    return TagDetailCSModule.tagDetail?.title;
  }
  public set tagName(value: string) {
    TagDetailCSModule.tagDetail.title = value;
  }

  public get tagDescription() {
    return TagDetailCSModule.tagDetail?.description;
  }
  public set tagDescription(value: string) {
    TagDetailCSModule.tagDetail.description = value;
  }

  public get tagIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set tagIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      TagDetailCSModule.tagDetail.removedAt = null;
    }
  }

  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty() : true
  }

  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_TAG_LOADING)
  async onSubmit() {
    const tagIsChange = JSON.stringify(TagDetailCSModule.tagDetail) !== JSON.stringify(TagDSModule.currentTag)
    if (this.isFormDirty() && (TagDetailCSModule.tagDetail.removedAt === null || tagIsChange)) await TagDetailCSModule.updateTag();
    if (TagDetailCSModule.tagDetail.removedAt === '' && this.isRemoved) await TagDetailCSModule.deactivateTag();
  }

}
</script>

<style lang="scss" scoped>
</style>
