<template>
  <ValidationProvider v-slot="{required}">
    <CoreSelect
      :required="required"
      ref="select"
      v-model="selectedValue"
      :disabled="isDisabled"
      :options="options"
      :headerLabels="headerLabels"
      :noLabel="noLabel"
      :placeholder="placeholder"
      :size="size"
      @input="onInputChange"
      :action="onAction"
      :config="config"
      @open="onOpen"
      @close="onClose"
      :multiple="multiple"
      :hasActionButton="hasActionButton"
      :excludedClasses="excludedClasses"
      :hasMoreButton="hasMoreButton"
      :onMore="onMore"
      :loading="loading"
      :listHeight="listHeight"
      @moreActionClick="moreOptionAction"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import { ValidationProvider } from 'vee-validate';
import { Ref } from "vue-property-decorator";

// We need to @ts-ignore because @Component section complains about the component being abstract.
// @ts-ignore
@Component({
  name: "BaseDropdownColumn",
  components: {CoreSelect, ValidationProvider}
})
export default abstract class BaseDropdownColumn extends BaseColumn {
  @Ref('select') select!: any;
  abstract selectedValue: any;
  abstract config: {labelKey: any, valueKey: any, labelText?: any};
  abstract options: any[];
  abstract headerLabels: any[];
  abstract placeholder: string;
  abstract noLabel: boolean;
  abstract isDisabled: boolean;
  abstract onAction(): void;
  abstract onOpen(): void;
  abstract onClose(): void;
  abstract onInputChange(value: string | number): void;
  abstract multiple: boolean;
  abstract size: string;
  abstract hasActionButton: boolean;
  abstract excludedClasses: string[];
  abstract hasMoreButton: boolean;
  preventClickRowSelection = true;
  loading = false;
  listHeight = 260;

  moreOptionAction(option: any) {
    return
  }

  onMore(option: any) {
    return
  }
}
</script>
