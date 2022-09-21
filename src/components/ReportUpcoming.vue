<template>
    <div id="reportUpcoming" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_REPORT_UPCOMING_LOADING)"
                :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
import Component from 'vue-class-component'
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import {ApplicationDSModule,ReportUpcomingCSModule} from "@/store"
import TableSubModule from "@/components/Base/TableSubModule.vue";
import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";

@Component({
    name: "ReportUpcoming",
    components: {CoreTable}
})

export default class ReportUpcoming extends  TableSubModule{
    
        get moduleName(): ModuleName{
            return ModuleName.report
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.reportUpcoming
        }

        get dataSource(): TableCS<TableRow> {
            return ReportUpcomingCSModule
        }

        //Overriding Parent Method
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