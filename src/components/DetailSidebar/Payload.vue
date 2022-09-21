<template>
  <div id="Payload" class="max-height-moduletab-content">
    <div class="mb-1 text-left">Payload</div>

    <CoreTable
      class="table payload-table"
      :loading="$wait.is(waitState.ACTION_PAYLOAD_LOADING)"
      :datasource="dataSource"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import { PayloadCSModule } from "@/store";
import { WaitStates } from "@/utils/vuewait";

@Component({
  name: "Payload",
  components: {
    CoreTable,
  },
  props: {
    disabled: { type: Boolean, default: false },
  },
})
export default class Payload extends Vue {
  waitState = WaitStates;

  get dataSource(): TableCS<TableRow> {
    return PayloadCSModule;
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
    return null;
  }
}
</script>

<style lang="scss">
.payload-table {
  .scroll-content {
    max-height: 200px;
  }
  .simplebar-content {
    margin: 0 -6px;
  }
}
.payload-table .tracking-table {
  border-spacing: 3px 3px !important;
  margin-top: 0px !important;
  overflow: hidden;

  thead th {
    &:first-child {
      border-radius: 8px 0px 0px 0px !important;
    }
    &:last-child {
      border-radius: 0px 8px 0px 0px !important;
    }
    border-radius: 0px !important;
  }

  tbody tr {
    &:last-child td {
      &:first-child {
        border-radius: 0px 0px 0px 8px !important;
      }
      &:last-child {
        border-radius: 0px 0px 8px 0px !important;
      }
    }

    td {
      border-radius: 0px !important;
      border-right: none;
    }
  }

  .table-title .table-titles__title {
    top: 0px !important;
    box-shadow: var(--primary-color) 0px 0px 0px 0px !important;
  }
}
</style>
