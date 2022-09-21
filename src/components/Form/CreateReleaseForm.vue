<template>
  <form slot="default" class="form" @submit.prevent="onConfirm">
    <ValidationProvider
      slim
      class="mb-3"
      rules="releases-title"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        v-model.lazy="title"
        :required="required"
        :error="failed"
        placeholder="Name"
        ref="Input"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider slim class="mb-3" rules="releases-launchDate" v-slot="{failed, errors , required}">
      <CorePicker
        v-model.lazy.trim="releaseDate"
        :required="required"
        :error="failed"
        placeholder="Release Date"
        formatted="L"
        autoClose
        :minDate="minReleaseDate"
        noHeader
        noFooter
        noTime
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider slim class="mb-3" rules="releases-cutoff" v-slot="{failed, errors , required}">
      <CorePicker
        v-model.lazy.trim="releaseCutoff"
        placeholder="Release Cutoff"
        :required="required"
        :error="failed"
        formatted="L"
        autoClose
        :minDate="minCutoffDate"
        :maxDate="maxCutoffDate"
        noHeader
        noFooter
        noTime
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="releases-managerId"
      v-slot="{failed, errors, required}"
    >
      <CoreSelect
        v-model.lazy.trim="primaryMaestro"
        :required="required"
        :error="failed"
        list-width="100%"
        placeholder="Release Maestro"
        :options="primaryUsers"
        :config="configs.user"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3"
      rules="releases-secondaryManagerId"
      v-slot="{required, failed, errors}"
    >
      <CoreSelect
        v-model.lazy.trim="secondaryMaestro"
        :required="required"
        :error="failed"
        clearable
        list-width="100%"
        placeholder="Secondary Maestro"
        :options="secondaryUsers"
        :config="configs.user"
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>

    <ValidationProvider
      slim
      class="mb-3 flex-grow-1 description"
      rules="releases-description"
      v-slot="{failed, errors, required}"
    >
      <CoreInput
        v-model.lazy="description"
        :required="required"
        :error="failed"
        class="description"
        placeholder="Description"
        textarea
      />
      <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
    </ValidationProvider>
  </form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import CorePicker from '@/components/Core/CorePicker/CorePicker.vue';
import CoreSelect from "@/components/Core/CoreSelect.vue";
import ReleasesActiveRow from "@/datamodels/rows/releasesActiveRow";
import UserDM from "@/datamodels/userDM";
import {CreateReleaseCSModule, DialogCSModule, ReleasesActiveCSModule, UserDSModule} from "@/store";
import {Roles} from "@/store/modules/datastore/permissionDS";
import {dateISOFormat} from '@/utils/date';
import {Nullable} from "@/utils/generics";
import {JsonParser} from '@/utils/jsonparser';
import {Wait, WaitStates} from "@/utils/vuewait";
import {ValidationProvider} from "vee-validate";
import DialogForm from "./Base/DialogForm.vue";
import { today } from "@/utils/date";

@Component({ name: "CreateReleaseForm", components: { CoreInput, CoreSelect, ValidationProvider, CorePicker } })
export default class CreateReleaseForm extends DialogForm {
  configs = {
    group: {labelKey: 'title', valueKey: 'id'},
    user: {labelKey: 'fullName', valueKey: 'id'}
  }

  get primaryUsers(){
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.RELEASE_MAESTRO) && user.removedAt === '' && this.secondaryMaestro !== user.id) ?? [];
  }
  get secondaryUsers(){
    return UserDSModule.sortedItems('fullName')?.filter((user: UserDM) => user.organizationRoles.includes(Roles.RELEASE_MAESTRO) && user.removedAt === '' && this.primaryMaestro !== user.id) ?? [];
  }

  get title(): string {
    return CreateReleaseCSModule.title;
  }
  set title(value: string) {
    CreateReleaseCSModule.setTitle(value);
  }

  get description(): string {
    return CreateReleaseCSModule.description;
  }
  set description(value: string) {
    CreateReleaseCSModule.setDescription(value);
  }

  get primaryMaestro(): Nullable<number> {
    return CreateReleaseCSModule.primaryMaestro;
  }
  set primaryMaestro(value: Nullable<number>) {
    CreateReleaseCSModule.setPrimaryMaestro(value);
  }

  get secondaryMaestro(): Nullable<number> {
    return CreateReleaseCSModule.secondaryMaestro;
  }
  set secondaryMaestro(value: Nullable<number>) {
    CreateReleaseCSModule.setSecondaryMaestro(value);
  }

  get releaseDate(): string {
    return CreateReleaseCSModule.releaseDate;
  }
  set releaseDate(value: string) {
    CreateReleaseCSModule.setReleaseDate(dateISOFormat(value));
  }

  get releaseCutoff(): string {
    return CreateReleaseCSModule.releaseCutoff;
  }
  set releaseCutoff(value: string) {
    CreateReleaseCSModule.setReleaseCutoff(dateISOFormat(value));
  }

  get minReleaseDate() {
    if (this.releaseCutoff) {
      return this.releaseCutoff
    } else {
      return today
    }
  }

  get minCutoffDate() {
    return  today
  }

  get maxCutoffDate() {
    return this.releaseDate
  }

  @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
  async onConfirm(): Promise<void> {
    const newRelease = await CreateReleaseCSModule.create();
    CreateReleaseCSModule.clear();
    DialogCSModule.clear();
    const freshReleaseRow = JsonParser.deserializeObject(newRelease, ReleasesActiveRow);
    this.$route.name !== "ReleasesActive" ? this.$router.push({ name: "ReleasesActive" }) : null;
    ReleasesActiveCSModule.doSetRows([freshReleaseRow]);
    ReleasesActiveCSModule.doLoad(true)
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
    CreateReleaseCSModule.clear();
    if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)) {
      this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(7, auto);
  grid-column-gap: 8px;

  .description {
    grid-column: 2;
    grid-row: 1/7;
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