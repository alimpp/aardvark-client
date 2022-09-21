<template>
  <tr class="table-titles">
    <th
      v-for="(columnSchema, i) in datasource.tableSchema"
      :key="i"
      class="table-titles__title maz-text-muted maz-text-left bg-color px-2"
      :class="{'maz-flex-1': columnSchema.width === 'max'}"
      :style="{'width': columnSchema.width ? columnSchema.width : null,
          'max-width': columnSchema.maxWidth ? columnSchema.maxWidth : null,
          'min-width': columnSchema.minWidth ? columnSchema.minWidth : null}"
       draggable
            :data-index="i"
            @dragstart="onDragStart"
            @dragend="onDragEnd"
            @drop="onDrop"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
    >
      <GenericColumnHeader
          v-if="columnSchema.headerType === 'text'"
          :datasource="datasource"
          :columnSchema="columnSchema"
      />
      <EditModeColumnHeader
          v-if="columnSchema.headerType === 'editMode'"
          :datasource="datasource"
          :columnSchema="columnSchema"
      />
    </th>
  </tr>
</template>

<script lang="ts">
  import Component from "vue-class-component"
  import {Prop} from "vue-property-decorator"
  import Vue from 'vue'

  import GenericColumnHeader from '../Column/Header/GenericColumnHeader.vue'
  import EditModeColumnHeader from '../Column/Header/EditModeColumnHeader.vue'
  import TableCS from "@/store/modules/componentstore/base/tableCS";
  import TableRow from "@/datamodels/base/tableRow";

  @Component({
  name: "TableHeader",
  components: {
    GenericColumnHeader, EditModeColumnHeader
  }
})
export default class TableHeader extends Vue {
  @Prop({type: Object, default: Object}) datasource!: TableCS<TableRow>;

  indexFrom = null;

  onDragStart(e) {
    // e.target.classList.add('active')
    // this.indexFrom = e.target.attributes['data-index'].value
  }
  onDragEnd(e) {
    // e.target.classList.remove('active')
  }
  onDragOver(e) {
    // e.preventDefault()
    // e.target.classList.add('right-border')
  }
  onDragLeave(e) {
    // e.target.classList.remove('right-border')
  }
  onDrop(e) {
    // const indexTo = e.target.attributes['data-index'].value
    // e.target.classList.remove('right-border')
    // this.$emit('reorder-column', { from: this.indexFrom, to: indexTo })
    // this.indexFrom = null
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../../assets/scss/variables';

  .table-titles {
    height: 50px;

    // Set border-radius on the top-left and bottom-left of the first table data on the table row
    td:first-child,
    th:first-child {
      border-radius: 0px 0px 0px 8px;
    }

    // Set border-radius on the top-right and bottom-right of the last table data on the table row
    td:last-child,
    th:last-child {
      border-radius: 0px 0px 8px 0px;
    }

    &__title {
      height: 50px;
      max-height: 72px;
      top:-1px;
      position: sticky;
      z-index: 10;
      text-align: left;
      box-shadow: var(--primary-color) 0px 0px 0px 1px;

      /*&:hover {*/
      /*  background-color: var(--hover-color);*/
      /*}*/

      &.right-border:not(.active) {
        background-color: var(--second-color);
        border: 2px dotted var(--text-muted-color);
      }
    }
  }

</style>
