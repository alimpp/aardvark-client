<template>
   <div id="reportInProgress" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_REPORT_INPROGRESS_LOADING)"
                :datasource="dataSource"
        />
   </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import CoreTable from '@/components/Core/Table/CoreTable.vue'
import {ApplicationDSModule, ReportInProgressCSModule} from "@/store"
import TableSubModule from "@/components/Base/TableSubModule.vue";
import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";

@Component({
    name: "ReportInProgress",
    components: {CoreTable}
})

export default class ReportInProgress extends  TableSubModule{
    
        get moduleName(): ModuleName{
            return ModuleName.report
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.reportInProgress
        }

        get dataSource(): TableCS<TableRow> {
            return ReportInProgressCSModule
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

<style lang="scss" scoped>

</style>