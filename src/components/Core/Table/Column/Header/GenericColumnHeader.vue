<template>
  <CorePopper ref="popper" trigger="clickToToggle" :disabled="isDisabled" :boundarySelector="boundarySelector" :offset="[0,15]" :zIndex="1" :containerClass="{'p-0': true}" attachTo="reference">
    <div slot="reference" :class="['table-lines-generic', 'maz-text-left', 'align-middle', {'maz-text-primary': isActiveSort || isActiveFilter}]" @click="onCellClick">
      <div ref="openPopper" class="w-100">
        <div @click="columnClick($event)" class="d-flex align-items-center">
          <b>{{ columnValue }}</b>
          <span v-if="isActiveSort && isSortAscending" class="material-icons">expand_more</span>
          <span v-if="isActiveSort && isSortDescending" class="material-icons">expand_less</span>
          <span v-if="isActiveFilter" class="material-icons">filter_alt</span>
        </div>
      </div>
    </div>
    <HeaderOptions slot="popper" :datasource="datasource" :columnSchema="columnSchema" @hidePopper="closePopper" />
  </CorePopper>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumnHeader from "../../Base/BaseColumnHeader.vue";
import HeaderOptions from "@/components/Core/Table/TableComponents/HeaderOptions.vue";
import CorePopper from '@/components/Core/CorePopper.vue';
import { Inject, Ref } from "vue-property-decorator";

@Component({
  name: "GenericColumnHeader",
  components: {HeaderOptions, CorePopper}
})
export default class GenericColumnHeader extends BaseColumnHeader {
  @Inject({from: 'CoreTableUniqueId'}) readonly boundarySelector!: string;
  @Ref('popper') popper!: CorePopper;
  @Ref('openPopper') openPopper!: HTMLElement;
  clicks = 0;
  timer!: number;

  get isDisabled() {
    return !this.isSortableOrFilterable
  }

  // We need to manually track the clicks because of the following behavior,
  // When double clicking, the popper unfortunately always flicker because the trigger is 'clickToToggle'
  // A double click should prevent a single click event propogation at origin
  columnClick(event: Event) {
    event.stopPropagation();
    this.clicks++;
    if (this.clicks === 1) {
      window.setTimeout(()=>{
        if(this.clicks === 1) this.openPopper.click();
        this.clicks = 0;
      }, 200);
    } else {
      clearTimeout(this.timer);
      if (!this.isDisabled) this.sortColumn()
      this.clicks = 0;
    }
  }

  sortColumn() {
    if(!this.isSortableOrFilterable)
     return ;

    let direction: "ASC" | "DESC"  = "ASC" ;

    direction = (this.isActiveSort && this.isSortAscending) ? "DESC" : "ASC" ;

    if(this.columnSchema.sortField) this.datasource.sortBy({field: this.columnSchema.sortField, direction:direction});

  }

  closePopper() {
    this.popper.doClose();
  }

}
</script>
<style lang="scss" scoped>
.table-lines-generic {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
