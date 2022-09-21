<template>
  <div id="reportEstimates" class="max-height-moduletab-content">
        <CoreTable
            :loading="$wait.is(waitState.ACTION_REPORT_NEEDESTIMATEDUE_LOADING)"
            :datasource="dataSource"
        />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import {ApplicationDSModule, ReportEstimatesCSModule} from "@/store"
import TableSubModule from "@/components/Base/TableSubModule.vue";
import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";

@Component({
    name: "ReportEstimates",
    components: {CoreTable}
})

export default class ReportEstimates extends  TableSubModule{
    
        get moduleName(): ModuleName{
            return ModuleName.report
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.reportEstimates
        }

        get dataSource(): TableCS<TableRow> {
            return ReportEstimatesCSModule
        }

        get defaultSelectedRow(): TableRow | null {
            return this.dataSource.tableData?.[0];
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.assignment)
        }
}

</script>

<style>

</style>