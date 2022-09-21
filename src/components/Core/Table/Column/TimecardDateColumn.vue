<template>
  <div class="timecard-date">
    <span :class="{'over-due': isDateOverDue}">{{ timeCard.date | momentFilter(filter) }}</span>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';
import dayjs, { ConfigType } from 'dayjs';
import { Prop } from 'vue-property-decorator';

@Component({
  name: "TimecardDateColumn",
  filters: {
    momentFilter: (value: ConfigType, filter: string) => dayjs(value).format(filter)
  }
})
export default class TimecardDateColumn extends BaseColumn {

  @Prop() filter!: string;

  get timeCard() {
    return this.columnValue;
  }

  get isDateOverDue(): boolean {
    return !this.timeCard._hours && !this.timeCard.note
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/assets/scss/variables';
  .over-due {
    color: $timecard-date-column-over-due-color;
  }
</style>