<template>
  <div
    id="Groups"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSGROUPS_LOADING)"
      />
    </div>
    <GroupsDetail class="form" />
  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsGroupsCSModule } from "@/store";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import GroupsDetail from "./SettingsDetail/GroupsDetail.vue";
import BaseSetting from './Base/BaseSetting.vue';

@Component({
  name: "SettingsGroups",
  components: {
    CoreTable,
    GroupsDetail,
  },
})
export default class SettingsGroups extends BaseSetting {

  @Ref('table') table!: CoreTable;
  get dataSource(): TableCS<TableRow> {
    return SettingsGroupsCSModule;
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#Groups {
  .content {
    ::v-deep .table-title {
      min-width: inherit;
    }
  }
  ::v-deep .form {
    display: flex;
    flex-flow: column;
    .type {
      display: flex;
      flex-flow: row;
    }
  }
}
</style>
