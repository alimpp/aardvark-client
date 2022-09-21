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
          rules="skills-title"
        >
          <CoreInput 
            :required="required" 
            :error="failed"
            v-model="skillTitle"
            placeholder="Name"
            :disabled="isDisabled"
          />
          <div
            v-if="failed"
            class="text-danger text-left mt-2"
          >{{errors[0]}}</div>
        </ValidationProvider>
        <CoreTagsInput
          v-model="specialty"
          :tags="skillSpecialties"
          placeholder="Specialties"
          @tags-changed='updateSpecialty'
          :addOnBlur='false'
          :deleteOnBackspace='false'
          class="mb-3 tag-input"
          :disabled="isDisabled"
        />
        <ValidationProvider slim class="flex-grow-1 mb-3" v-slot="{failed, errors}">
            <CoreInput   class="description" :class="[{'error': failed}]" v-model="description" placeholder="Description" :error="failed" textarea />
            <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
        </ValidationProvider>
        <ValidationProvider
          slim
          class="mb-3"
        >
          <CoreCheckBox
            class="mb-3"
            v-model="skillIsDeactivate"
            :disabled="isDisabled"
          >Deactivate This Skill</CoreCheckBox>
        </ValidationProvider>
        <CoreBtn
          class="mb-3"
          type="submit"
          block
          :disabled="isButtonDisabled()"
          :loading="$wait.is(waitState.ACTION_SKILL_LOADING)"
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
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import Vue from "vue";
import { SkillDetailCSModule, SkillDSModule, SettingsDSModule } from "@/store";
import CoreTagsInput from "@/components/Core/CoreTagsInput.vue";
import { State } from "vuex-class";
import { Watch } from "vue-property-decorator";
import SkillDM from "@/datamodels/skillDM";
import {Wait, WaitStates} from "@/utils/vuewait";

@Component({
  name: "SkillsDetail",
  components: {
    CoreCheckBox,
    CoreBtn,
    CoreInput,
    ValidationProvider,
    ValidationObserver,
    SimpleBar,
    CoreTagsInput,
  },
})
export default class SkillsDetail extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  };

  @State("skillDetail", { namespace: "skilldetailcs" }) skillDetail!: SkillDM;

  @Watch("skillDetail")
  onSkillDetailChange() {
    this.isRemoved = SkillDetailCSModule.skillDetail.removedAt ? true : false
    this.$refs.observer.reset();
  }

  specialty = null;
  isRemoved = false;
  waitState = WaitStates;

  public get skillId(): number {
    return SkillDetailCSModule.skillDetail?.id;
  }

  public get isDisabled(): boolean {
    return !this.skillId;
  }

  public get skillTitle() {
    return SkillDetailCSModule.skillDetail?.title;
  }
  public set skillTitle(value: string) {
    SkillDetailCSModule.skillDetail.title = value;
  }

  public get skillSpecialties() {
    return SkillDetailCSModule.skillDetail?.specialties?.map((specialty) => ({
      text: `${specialty.title}`,
      id: specialty.id,
    }));
  }

  public get description(): string {
    if(SkillDetailCSModule.skillDetail?.description){
      return SkillDetailCSModule.skillDetail?.description.toString();
    }
    return '' ;
  }
  public set description(value: string) {
    SkillDetailCSModule.skillDetail.description = value;
  } 
  async updateSpecialty(specialties: { text: string, id: number }[]) {
    const values = specialties?.map((tag) => tag?.text);
    const deletedSpecialty = this.skillSpecialties.find(
      (item1) => !specialties.some((item2) => item2.id === item1.id)
    );
    if (values && values.length >= 1 && !deletedSpecialty) {
      const index = values.length - 1;
      const newValue = values[index];
      SkillDSModule.createSpecialty({
        title: newValue,
        skillId: SettingsDSModule.selectedSkillID,
      });
    }
    if (deletedSpecialty) {
      SkillDSModule.deleteSpecialty(deletedSpecialty.id);
    }
  }

  public get skillIsDeactivate(): boolean {
    return this.isRemoved
  }
  public set skillIsDeactivate(value: boolean) {
    this.isRemoved = value;
    if (!value) {
      SkillDetailCSModule.skillDetail.removedAt = null;
    }
  }

  isButtonDisabled() {
    return this.$refs.observer ? !this.isFormDirty() : true
  }
  isFormDirty() {
    return Object.keys(this.$refs.observer.fields).some(key => this.$refs.observer.fields[key].dirty);
  }

  @Wait(WaitStates.ACTION_SKILL_LOADING)
  async onSubmit() {
    const skillIsChange = JSON.stringify(SkillDetailCSModule.skillDetail) !== JSON.stringify(SkillDSModule.currentSkill)
    if (this.isFormDirty() && (SkillDetailCSModule.skillDetail.removedAt === null || skillIsChange)) await SkillDetailCSModule.updateSkill();
    if (SkillDetailCSModule.skillDetail.removedAt === '' && this.isRemoved) await SkillDetailCSModule.deactivateSkill();
  }

}
</script>

<style lang="scss" scoped>
</style>
