<template>
  <div id="reportUpcoming" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_REPORT_COMPLETED_LOADING)"
                :datasource="dataSource"
        />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import {ApplicationDSModule, ReportCompletedCSModule} from "@/store"
import TableSubModule from "@/components/Base/TableSubModule.vue";
import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";

@Component({
    name: "ReportCompleted",
    components: {CoreTable}
})

export default class ReportCompleted extends TableSubModule {

        get moduleName(): ModuleName{
            return ModuleName.report
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.reportCompleted
        }

        get dataSource(): TableCS<TableRow> {
            return ReportCompletedCSModule
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