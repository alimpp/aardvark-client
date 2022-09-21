<template>
  <div
    id="Phases"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSPHASES_LOADING)"
      />
    </div>
    <PhasesDetail class="form" />
  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsPhasesCSModule } from "@/store";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import PhasesDetail from "./SettingsDetail/PhasesDetail.vue";
import BaseSetting from '@/components/Settings/Base/BaseSetting.vue'

@Component({
  name: "SettingsPhases",
  components: { CoreTable, PhasesDetail },
})
export default class SettingsPhases extends BaseSetting {

  @Ref('table') table!: CoreTable;


  get dataSource(): TableCS<TableRow> {
    return SettingsPhasesCSModule;
  }

   //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
}
</script>

<style lang="scss" scoped>
</style>
