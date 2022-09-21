<template>
  <div class="assignment-date">
    <CorePopper trigger="hover" v-if="assignmentDate.endDate">
      <div slot="popper">
        {{assignmentDate.delayedBy === 'end_date'? assignmentDate.lastDelayedBy : assignmentDate.endDate | momentFilter(filter)}}
      </div>
      <span slot="reference" :class="{'expire': assignmentDate.delayedBy === 'end_date'}">{{ assignmentDate.endDate | momentFilter(filter) }}</span>
    </CorePopper>

    <CorePopper trigger="hover" v-if="assignmentDate.startDate">
      <div slot="popper">
        {{assignmentDate.delayedBy === 'start_date'? assignmentDate.lastDelayedBy : assignmentDate.startDate | momentFilter(filter)}}
      </div>
      <span slot="reference"  :class="{'expire': assignmentDate.delayedBy === 'start_date'}">{{ assignmentDate.startDate | momentFilter(filter) }}</span>
    </CorePopper>

    <span v-else></span>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';
import dayjs, { ConfigType } from 'dayjs';
import { Prop } from 'vue-property-decorator';
import CorePopper from '@/components/Core/CorePopper.vue';

@Component({
  name: "AssignmentDateColumn",
  components: {CorePopper},
  filters: {
    momentFilter: (value: ConfigType, filter: string) => dayjs(value).format(filter)
  }
})
export default class AssignmentDateColumn extends BaseColumn {

  @Prop() filter!: string;

  get assignmentDate(): any {
    return this.columnValue;
  }

}
</script>

<style lang="scss" scoped>
  @import 'src/assets/scss/variables';
  .expire {
    color: $assignment-date-column-expire-color;
  }
</style>