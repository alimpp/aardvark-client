<template>
  <div class="option-container">

    <CoreTabsBar
      v-model="activeTab"
      :tabs="tabs"
      :noUseAnchor="true"
      :alignLeft="true"/>
    
    <CoreTabsContent :activeTab="activeTab">
      <CoreTabsContentItem key="sort">
        <HeaderOptionsSort :currentDirection="currentDirection" :isActiveSort="isActiveSort" @sort-update="updateSort" />
      </CoreTabsContentItem>
      <CoreTabsContentItem key="filter" class="filters">
        <HeaderOptionsFilter :filters="filters" :currentFilters="currentFilters" @filter-updated="updateFilter" />
      </CoreTabsContentItem>
    </CoreTabsContent>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
import CoreTabsBar from "@/components/Core/CoreTabsBar.vue";
import HeaderOptionsFilter from "@/components/Core/Table/TableComponents/HeaderOptionsFilter.vue";
import HeaderOptionsSort from "@/components/Core/Table/TableComponents/HeaderOptionsSort.vue";
import { Prop } from 'vue-property-decorator';
import TableCS from '@/store/modules/componentstore/base/tableCS';
import TableRow from '@/datamodels/base/tableRow';
import { ITableColumnSchema } from '@/store/modules/interfaces/ITableColumnSchema';
import { TableFilterCSModule } from '@/store';

@Component({ name: "HeaderOptions", components: {CoreTabsContentItem, CoreTabsContent, CoreTabsBar, HeaderOptionsFilter, HeaderOptionsSort}})
export default class HeaderOptions extends Vue {
  @Prop({default: false}) public isShown!: boolean;
  @Prop() public datasource!: TableCS<TableRow>;
  @Prop() public columnSchema!: ITableColumnSchema;
  activeTab = this.columnSchema?.sortField ? 'sort' : 'filter';

  get tabs() {
    return [
      { id: 'sort', label: 'Sort', hidden: !this.columnSchema?.sortField },
      { id: 'filter', label: 'Filter', hidden: this.filters === null }
    ]
  }

  get isActiveSort() {
    return this.currentSortField === this.currentField;
  }

  get currentSortField() {
    return this.datasource.sort.field
  }

  get currentField() {
    return this.columnSchema.sortField;
  }

  get currentDirection() {
    return this.datasource.sort.direction;
  }

  get filters() {
    if(this.columnSchema.filterType) return TableFilterCSModule.filters[this.columnSchema.filterType]
    return null;
  }

  get currentFilters() {
    if(this.filters?.key) {
      const filterObj: {[key: string]: boolean} = {};
      (this.datasource.filters[this.filters.key] || []).forEach(filter => filterObj[filter] = true);
      return filterObj;
    }
    return null;
  }

  updateSort(direction: "ASC" | "DESC") {
    if(this.columnSchema.sortField) this.datasource.sortBy({field: this.columnSchema.sortField, direction});
    this.$emit('hidePopper')
  }

  updateFilter(data: {key: string, filters: any[]}) {
    if(this.columnSchema.filterType) {
      this.datasource.filterBy({[data.key]: data.filters})
      this.$emit('hidePopper')
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .tabs-bar {
  width: 100%;
  .core-btn{
    width: inherit !important;
  }
}

.option-container{
  overflow: hidden;
  width: max-content;
  ::v-deep .coretab-scrollbar{
    border-radius: 8px 8px 0px 0px;
  }
  ::v-deep .maz-tabs-bar {
    &__item {
      border: 0px;
      &.active{
        background-color: inherit;
      }
      &:focus {
        text-decoration: none;
        background-color: inherit;
      }
      &:hover{
        border-radius: 8px 8px 0px 0px;
        background-color: var(--primary-color);
      }
    }
  }
}

::v-deep .simplebar-content::before, .simplebar-content::after{
  display: none;
}

</style>