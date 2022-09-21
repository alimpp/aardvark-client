<template>
  <SimpleBar class="xeba-scrollbar">
    <div class="max-height-moduletab-content">
      <TimeCardDetailEstimate />
      <TimeCardDetailOnHold />
      <TimeCardDetailReport />
      <TimeCardDetailTimeCards />
    </div>
  </SimpleBar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SimpleBar from 'simplebar-vue';
import TimeCardDetailTimeCards from "@/components/DetailSidebar/TimeCardDetailTimeCards.vue";
import { TimeCardDetailTimeCardsCSModule, TimeCardDetailCSModule, TimeCardDetailEstimateCSModule, TimeCardDetailReportCSModule, TimeCardDetailOnHoldCSModule } from "@/store";
import TimeCardDetailReport from "@/components/DetailSidebar/TimeCardDetailReport.vue";
import DetailSubModule from "@/components/Base/DetailSubModule.vue";
import { DetailTabName } from "@/store/modules/datastore/applicationDS";
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import TimeCardDetailEstimate from "@/components/DetailSidebar/TimeCardDetailEstimate.vue";
import TimeCardDetailOnHold from "@/components/DetailSidebar/TimecardDetailOnHold.vue"
@Component({
  name: "TimeCardDetail",
  components: {
    SimpleBar,
    TimeCardDetailTimeCards,
    TimeCardDetailEstimate,
    TimeCardDetailReport,
    TimeCardDetailOnHold
  },
})
export default class TimeCardDetail extends DetailSubModule {
  get tabName(): DetailTabName {
    return DetailTabName.timecard;
  }

  get dataSources(): ILifeCycle[] {
    return [TimeCardDetailCSModule, TimeCardDetailTimeCardsCSModule, TimeCardDetailEstimateCSModule, TimeCardDetailReportCSModule, TimeCardDetailOnHoldCSModule];
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
</style>