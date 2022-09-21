<template>
    <div id="BadNewsOverdueEstimate" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_BADNEWSOVERDUEESTIMATE_LOADING)"
                :datasource="dataSource"
                saveable
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, BadNewsOverdueEstimateCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'BadNewsOverdueEstimate',
        components: {CoreTable}
    })
    export default class BadNewsOverdueEstimate extends TableSubModule {


        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.badNews
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.badNewsOverdueEstimate
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return BadNewsOverdueEstimateCSModule
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
