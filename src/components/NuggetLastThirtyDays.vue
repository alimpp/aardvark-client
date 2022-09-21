<template>

    <div id="NuggetLastThirtyDays" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_NUGGETLASTTHIRTYDAYS_LOADING)"
                :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import {ApplicationDSModule, NuggetLastThirtyDaysCSModule} from "@/store";
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'NuggetLastThirtyDays',
        components: {CoreTable}
    })
    export default class NuggetLastThirtyDays extends TableSubModule {

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.nugget
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.nuggetLastThirtyDays
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return NuggetLastThirtyDaysCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return this.dataSource.tableData?.[0];
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.nugget)
        }
    }
</script>
