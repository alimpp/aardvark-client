<template>
  <div class="date-text maz-dots-text maz-text-left">
    <span v-if="!columnValue || !columnValue.length"></span>
    <span v-else>{{ columnValue | momentFilter(filter) }}</span>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Prop } from 'vue-property-decorator';
import BaseColumn from "../Base/BaseColumn.vue";
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)

@Component({
  name: "DateColumn",
  filters: {
    momentFilter: (value, filter) => dayjs(value).format(filter)
  }
})
export default class DateColumn extends BaseColumn {
  @Prop() date!: string;
  @Prop() filter!: string;
}
</script>

<style lang="scss">
  @import '../../../../assets/scss/variables';

  .date-text {
    font-family: $base-font-family;
    font-size: inherit;
  }

</style>
