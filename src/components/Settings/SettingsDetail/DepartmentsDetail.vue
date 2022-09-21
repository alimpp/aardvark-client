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
          rules="departments-name"
          v-slot="{failed, errors, required}"
        >
          <CoreInput
            :required="required"
            :error="failed"
            v-model="DepartmentName"
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
          rules="departments-members"
          v-slot="{failed, errors, required}"
        >
          <CoreSelect
            :required="required"
            list-width="100%"
            :options="memberOptions"
            :config="configs.memberOptions"
            v-model="DepartmentMembers"
            :error="failed"
            placeholder="Members"
            multiple
            clearable
            slim
            disabled
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
            v-model="departmentIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Department</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled()"
          :loading="$wait.is(waitState.ACTION_DEPARTMENT_LOADING )"
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
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import Vue from "vue";
import { DepartmentDetailCSModule, DepartmentDSModule } from "@/store";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import DepartmentDM from "@/datamodels/departmentDM";
import UserDM from "@/datamodels/userDM";
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "DepartmentsDetail",
  components: {
    CoreCheckBox,
    CoreSelect,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar,
  },
})
export default class DepartmentsDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };

  configs = {
    memberOptions: { valueKey: "id", labelKey: "fullName" },
  };

  isRemoved = false;
  waitState = WaitStates;

  @State("departmentDetail", { namespace: "departmentdetailcs" })
  departmentDetail!: DepartmentDM;

  @Watch("departmentDetail")
  onDepartmentDetailChange() {
    this.isRemoved = DepartmentDetailCSModule.departmentDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  public get departmentId(): number {
    return DepartmentDetailCSModule.departmentDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.departmentId;
  }


  public get memberOptions() {
    return DepartmentDetailCSModule.members || [];
  }

  public get DepartmentName() {
    return DepartmentDetailCSModule.departmentDetail?.name;
  }
  public set DepartmentName(value: string) {
    DepartmentDetailCSModule.departmentDetail.name = value;
  }

  public get DepartmentMembers(): number[] {
    return DepartmentDetailCSModule.departmentDetail?.members?.map((member) => member.id) || null;
  }
  public set DepartmentMembers(values: number[]) {
    const newMembers: UserDM[] = [];
    if (values !== null) {
      for (const value of values) {
        for (const member of DepartmentDetailCSModule.members) {
          if (value === member.id) {
            newMembers.push(member);
          }
        }
      }
    }
    DepartmentDetailCSModule.departmentDetail.members = newMembers;
  }

  public get departmentIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set departmentIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      DepartmentDetailCSModule.departmentDetail.removedAt = null;
    }
  }

  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty() : true;
  }

  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some((key) => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_DEPARTMENT_LOADING)
  async onSubmit() {
    const departmentIsChange = JSON.stringify(DepartmentDetailCSModule.departmentDetail) !== JSON.stringify(DepartmentDSModule.currentDepartment)
    if ( this.isFormDirty() && (DepartmentDetailCSModule.departmentDetail.removedAt === null || departmentIsChange)) await DepartmentDetailCSModule.updateDepartment();
    if ( DepartmentDetailCSModule.departmentDetail.removedAt === '' && this.isRemoved) await DepartmentDetailCSModule.deactivateDepartment();
  }
}
</script>

<style lang="scss" scoped>
</style>
