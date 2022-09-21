<template>
  <div
    id="Departments"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSDEPARTMENT_LOADING)"
      />
    </div>
    <DepartmentsDetail class="form" />

  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsDepartmentsCSModule } from "@/store";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import DepartmentsDetail from "./SettingsDetail/DepartmentsDetail.vue";
import BaseSetting from '@/components/Settings/Base/BaseSetting.vue'

@Component({
  name: "SettingsDepartments",
  components: { CoreTable, DepartmentsDetail},
})
export default class SettingsDepartments extends BaseSetting {

  @Ref('table') table!: CoreTable;

  get dataSource(): TableCS<TableRow> {
    return SettingsDepartmentsCSModule;
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#Departments {
  .content {
    ::v-deep .table-title {
      min-width: inherit;
    }
  }
  .form {
    display: flex;
    flex-flow: column;
  }
}
</style>
