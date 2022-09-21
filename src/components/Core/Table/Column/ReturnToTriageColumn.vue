<template>
  <ValidationProvider ref="provider" :rules="{'required': moveToBacklog}" v-slot="{failed}" slim>
    <CorePicker
      ref="picker"
      v-model="value"
      :minDate="tomorrow"
      noHeader
      noFooter
      noTime
      autoClose
      noLabel
      placeholder
      :format="format"
      :formatted="formatted"
      size="sm"
      :disabled="isDisabled"
      :error="failed"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";
import CorePicker from '@/components/Core/CorePicker/CorePicker.vue';
import moment from 'moment'
import {isBefore, isSame, today, tomorrow} from "@/utils/date";
import {ValidationProvider} from 'vee-validate';
import {Ref, Watch} from 'vue-property-decorator'
import {SprintDSModule} from '@/store';
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required)

@Component({name: "ReturnToTriageColumn", components: {CorePicker, ValidationProvider}})
export default class ReturnToTriageColumn extends BaseColumn {
  @Ref('picker') picker!: CorePicker;
  @Ref('provider') provider!: InstanceType<typeof ValidationProvider>;
  format = 'YYYY-MM-DD';
  formatted = moment().localeData().longDateFormat('L');
  tomorrow = tomorrow

  // @override
  preventClickRowSelection = true;

  @Watch('moveToBacklog')
  onMoveToBacklogChange(isMovingToBacklog: boolean) {
    const isTriageDateBeforeTodayOrCurrentDay = this.returnToTriageJobDate && (isBefore(this.returnToTriageJobDate, today) || isSame(this.returnToTriageJobDate, today));
    if(isMovingToBacklog && (!this.returnToTriageJobDate || isTriageDateBeforeTodayOrCurrentDay)) {
      this.picker.openPicker();
    } else {
      this.picker.closePicker();
      this.onReset();
    }
  }

  @Watch('sprintId', {deep: true})
  onRowDataChange(val: number, oldVal: number) {
    if(this.rowHasMoveToBacklog && this.moveToBacklog) {
      if(this.returnToTriageJobDate) {
        const isTriageDateBeforeTodayOrCurrentDay = (isBefore(this.returnToTriageJobDate, today) || isSame(this.returnToTriageJobDate, today));
        if(isTriageDateBeforeTodayOrCurrentDay) {
          this.picker.openPicker();
        } else {
          this.value = this.returnToTriageJobDate || null;
          this.picker.closePicker();
        }
      }
    }
  }

  get moveToBacklog() {
    return this.rowData['moveToBacklog'];
  }

  get rowHasMoveToBacklog() {
    return 'moveToBacklog' in this.rowData;
  }

  get sprintId() {
    return this.rowData['sprintId'];
  }

  get returnToTriageJobDate() {
    return this.sprint(this.sprintId)?.returnToTriageJobDate;
  }

  get sprint() {
    return (sprintId: number) => {
      const projectId = this.rowData['projectId']
      return SprintDSModule.items[projectId]?.find(batch => batch.id === sprintId) || null
    }
  }

  get value(): string | null {
    if('moveToArchive' in this.rowData && this.rowData['moveToArchive'] === true) {
      return '';
    }

    if('moveToBacklog' in this.rowData && this.rowData['moveToBacklog'] && isBefore(this.columnValue, tomorrow)) {
      return '';
    }
    
    return this.columnValue
  }

  set value(value: string | null) {
    this.rowData[this.columnSchema.path] = value;
  }

  get isDisabled(): boolean {
    if ('moveToBacklog' in this.rowData && this.rowData['moveToBacklog'] === true) return false
    else return true
  }

  onReset() {
    this.provider.reset();
  }

}
</script>
