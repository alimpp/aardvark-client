<template>
  <div id="EditModeColumnHeader" @click="onCellClick">
    <img
      v-if="showEditIcon"
      src="@/assets/icons/inactive-edit.svg"
      alt="alt"
      width="24px"
    >
    <img
      v-else
      src="@/assets/icons/edit.svg"
      alt="alt"
      width="24px"
    >
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumnHeader from "../../Base/BaseColumnHeader.vue";
import {ProfileDSModule} from "@/store";

@Component({
  name: "EditModeColumnHeader"
})
export default class EditModeColumnHeader extends BaseColumnHeader {
      get showEditIcon() {
        let result = false

        if(!this.columnValue && this.columnSchema.id === 'assignPhase') {
          result =  true
        } else if (!this.columnValue && this.columnSchema.id === 'assignResource') {
          result = true
        } else {
          result = false
        }

        return ProfileDSModule.isDarkMode ? !result : result
      }
}
</script>

<style lang="scss" scoped>
#EditModeColumnHeader {
  cursor: pointer !important;
}
</style>