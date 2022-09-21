<template>
    <div id="AssignmentNeedEstimate" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_ASSIGNMENTNEEDESTIMATE_LOADING)"
                :datasource="dataSource"
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, AssignmentNeedEstimateCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'AssignmentNeedEstimate',
        components: {CoreTable}
    })
    export default class AssignmentNeedEstimate extends TableSubModule {
        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.assignment
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.assignmentNeedEstimate
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return AssignmentNeedEstimateCSModule
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
