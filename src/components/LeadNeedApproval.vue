<template>
    <div id="LeadNeedApproval" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_LEADNEEDAPPROVAL_LOADING)"
                :datasource="dataSource"
                saveable
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, LeadNeedApprovalCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'LeadNeedApproval',
        components: {CoreTable}
    }) 
    export default class LeadNeedApproval extends TableSubModule {

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.lead
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.leadNeedApproval
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return LeadNeedApprovalCSModule
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
