<template>
  <div>
    <CoreSpinner v-if="isLoading" class="mx-auto" :size="25" />
    <div v-else>
      <div v-if="!nugget">No nugget found</div>
      <div v-else class="nugget-summary px-2 d-flex align-items-start flex-column text-left">
        <div class="title d-flex align-items-center py-1 w-100">
          <span class="maz-text-primary pr-1">N{{nuggetNumber}}</span>
          <span class="text-truncate pr-2 flex-grow-1" :title="nuggetTitle">{{nuggetTitle}}</span>
          <span class="material-icons maz-text-primary icon" @click="search()">open_in_new</span>
        </div>
        <CoreScrollbar size="thin" class="w-100 description">
          <div class="pb-1">{{nuggetDescription}}</div>
        </CoreScrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import NuggetDM from '@/datamodels/nuggetDM';
import { NuggetSearchCSModule, NuggetSummaryCSModule } from '@/store';
import { WaitStates } from '@/utils/vuewait';
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue"
import CoreBtn from "@/components/Core/CoreBtn.vue";

@Component({
  name: 'NuggetSummary',
  components: { CoreSpinner, CoreScrollbar, CoreBtn }
})
export default class NuggetSummary extends Vue {
  @Prop({ type: Number, required: true })
  readonly nuggetNumber!: number;

  get nugget(): NuggetDM | undefined {
    return NuggetSummaryCSModule.nuggets.find(nugget => nugget.number === this.nuggetNumber)
  }

  get nuggetTitle() {
    return this.nugget?.title
  }

  get nuggetDescription() {
    return this.nugget?.description
  }

  get isLoading(): boolean {
    return this.$wait.waiting(WaitStates.ACTION_NUGGET_SUMMARY_LOADING);
  }

  async search() {
    if(!this.nugget) return;
    NuggetSearchCSModule.setSearchQuery(this.nugget?.nuggetNumber);
    NuggetSearchCSModule.clearSortAndFilter();
    await NuggetSearchCSModule.clear();
    NuggetSearchCSModule.search();
    if (this.$route.name !== 'NuggetSearch') await this.$router.push({ name :'NuggetSearch' });
  }

  async beforeMount() {
    NuggetSummaryCSModule.findNugget(this.nuggetNumber);
  }

}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.nugget-summary{
  max-width: 250px;
  .title{
    max-width: 250px;
    color: $grey-color;
  }
  .icon {
    font-size: 18px;
  }
  .description{
    max-width: 250px;
    max-height: 250px;
    white-space: pre-line;
  }
}
</style>