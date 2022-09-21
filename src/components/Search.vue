<template>
  <div
    class="search-bar"
    :class="{'search-bar-expand': isExpand}"
  >
    <CoreInput
      v-model="query"
      left-icon-name="search"
      placeholder="Search for a Nugget"
      @focus="searchFocus"
      @blur="searchBlur"
      @keydown.enter.exact.prevent="search()"
      :loading="isLoading"
      clearable
      @iconclick= "search()"
    />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { NuggetSearchCSModule } from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import { WaitStates } from '@/utils/vuewait';

@Component({
  name: "Header",
  components: { CoreInput },
})
export default class Search extends Vue {
  isExpand = false;

  searchFocus(event) {
    this.isExpand = true;
  }

  searchBlur(event) {
    if (!this.query) {
      this.isExpand = false;
    }
  }

  get query() {
    return NuggetSearchCSModule.query;
  }

  set query(value: string) {
    NuggetSearchCSModule.setSearchQuery(value);
    this.isExpand = value ? true : false;
  }

  get isLoading() {
    return this.$wait.is(WaitStates.ACTION_NUGGETSEARCH_LOADING);
  }

  async search() {
    if (this.query.trim()) {
      await NuggetSearchCSModule.clearSortAndFilter();
      await NuggetSearchCSModule.clear();
      NuggetSearchCSModule.search();
      if (this.$route.name !== 'NuggetSearch') await this.$router.push({ name :'NuggetSearch'});
    }
  }

}
</script>

<style lang="scss" scoped>
.search-bar {
  min-width: 250px;
}
</style>
