<template>
  <component :is="component">
    <CoreCheckBox class="core-checkbox" v-model="checked" color="black" :disabled="isDisabled"/>
  </component>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import BaseColumn from "../Base/BaseColumn.vue";
  import {ValidationProvider} from 'vee-validate';
  import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
  import { SprintDSModule } from '@/store';
  import {Watch} from 'vue-property-decorator'

  @Component({
  name: "CheckboxColumn",
  components: {CoreCheckBox, ValidationProvider }
})
export default class CheckboxColumn extends BaseColumn {
  preventClickRowSelection = true;

  @Watch('rowData.sprintId', {deep: true})
  onRowDataChange(val: number, oldVal: number) {
    if(this.columnSchema.id === 'moveToBacklog' && 'moveToBacklog' in this.rowData && 'sprintId' in this.rowData && 'sprint' in this.rowData) {
      const originalSprint = this.rowData['sprint'];
      if(val === originalSprint?.['id']) {
        this.checked = false;
        return;
      } else {
        if (val !== oldVal) {
          if(!val && oldVal) {
            this.checked = false;
          } else if (this.sprint(this.rowData['sprintId'])?.returnToTriageJobDate){
            this.checked = true;
          } else if (this.sprint(oldVal)?.returnToTriageJobDate && this.sprint(val)?.returnToTriageJobDate === null) {
            this.checked = false;
          }
        }
      }
    }
  }

  get component() {
    // We don't want validation on Backlog or Subscribe, return a div element instead.
    if(this.columnSchema.id === 'moveToBacklog' || this.columnSchema.id === 'subscribe') {
      return 'div';
    }
    return ValidationProvider;
  }

  get sprint() {return (sprintId: number) => {
    const projectId = this.rowData['projectId']
    return SprintDSModule.items[projectId]?.find(sprint => sprint.id === sprintId) || null
  }}

  get checked() {
    return this.columnValue;
  }

  set checked(value: boolean) {
    this.onCellClick();
    this.rowData[this.columnSchema.path] = value;
  }

  get isDisabled(): boolean {
    if (this.columnSchema && this.columnSchema.id === 'archive') {
      return 'moveToBacklog' in this.rowData ? this.rowData['moveToBacklog'] : false;
    } else if (this.columnSchema && this.columnSchema.id === 'moveToBacklog') {
      return 'moveToArchive' in this.rowData ? this.rowData['moveToArchive'] : false;
    } else if (this.columnSchema && this.columnSchema.id === 'approve') {
      return 'needsWork' in this.rowData ? this.rowData['needsWork'] : false;
    } else if (this.columnSchema && this.columnSchema.id === 'needsWork') {
      return 'approve' in this.rowData ? this.rowData['approve'] : false;
    }  else if ( 'reason' in this.rowData && this.rowData['reason'] === 'Declined' ) {
      return true
    } else {
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.core-checkbox {
  display: grid;
  justify-content: center;
}
</style>
