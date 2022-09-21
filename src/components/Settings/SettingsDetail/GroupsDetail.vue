<template>
  <SimpleBar class="xeba-scrollbar max-height-moduletab-content">
    <ValidationObserver
      slim
      ref="observer"
      v-slot="{invalid, handleSubmit, dirty}"
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
          rules="groups-title"
        >
          <CoreInput
           :required="required"
           :error="failed"
            v-model="GroupName"
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
          rules="groups-description"
        >
          <CoreInput
            :required="required"
            v-model="GroupDescription"
            placeholder="Description"
            textarea
            :disabled="isDisabled"
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
              v-model="GroupType"
              :radio-value="GROUP_TYPE.PUBLIC"
              :disabled="isDisabled"
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
              v-model="GroupType"
              :radio-value="GROUP_TYPE.PRIVATE"
              :disabled="isDisabled"
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
              v-model="GroupType"
              :radio-value="GROUP_TYPE.BOTH"
              :disabled="isDisabled"
            >Both</CoreRadio>
            <div
              v-if="failed"
              class="text-danger text-left mt-2"
            >{{errors[0]}}</div>
          </ValidationProvider>
        </div>
        <ValidationProvider
          slim
          class="mb-3"
        >
          <CoreCheckBox
            class="mb-3"
            v-model="groupIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Channel</CoreCheckBox>
        </ValidationProvider>

        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="!dirty || invalid"
          :loading="$wait.is(waitState.ACTION_GROUP_LOADING)"
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
import CoreRadio from "@/components/Core/CoreRadio.vue";
import Vue from "vue";
import { GroupDetailCSModule, GroupDSModule } from "@/store";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import GroupDM from "@/datamodels/groupDM";
import {GROUP_TYPE} from '@/utils/constants';
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "GroupsDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    CorePicker,
    CoreRadio,
    SimpleBar,
  },
})
export default class GroupsDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };

  deactivate = false;
  GROUP_TYPE = GROUP_TYPE;
  isRemoved = false;
  waitState = WaitStates;

  @State("groupDetail", { namespace: "groupdetailcs" }) groupDetail!: GroupDM;

  @Watch("groupDetail")
  onGroupDetailChange() {
    this.isRemoved = GroupDetailCSModule.groupDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  public get groupId(): number {
    return GroupDetailCSModule.groupDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.groupId;
  }

  public get GroupName() {
    return GroupDetailCSModule.groupDetail?.title;
  }
  public set GroupName(value: string) {
    GroupDetailCSModule.groupDetail.title = value;
  }

  public get GroupDescription() {
    return GroupDetailCSModule.groupDetail?.description;
  }
  public set GroupDescription(value: string) {
    GroupDetailCSModule.groupDetail.description = value;
  }

  public get GroupType() {
    return GroupDetailCSModule.groupDetail.type || ''
  }
  public set GroupType(value: string) {
    GroupDetailCSModule.groupDetail.type = value;
  }

  public get groupIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set groupIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      GroupDetailCSModule.groupDetail.removedAt = null;
    }
  }

  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_GROUP_LOADING)
  async onSubmit() {
    const groupIsChange = JSON.stringify(GroupDetailCSModule.groupDetail) !== JSON.stringify(GroupDSModule.currentGroup)
    if (this.isFormDirty() && (GroupDetailCSModule.groupDetail.removedAt === null || groupIsChange)) await GroupDetailCSModule.updateGroup();
    if (GroupDetailCSModule.groupDetail.removedAt === '' && this.isRemoved) await GroupDetailCSModule.deactivateGroup();
  }
}
</script>

<style lang="scss" scoped>
</style>
