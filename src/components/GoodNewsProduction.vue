<template>
    <div id="GoodNewsProduction" class=" max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_GOODNEWSPRODUCTION_LOADING)"
                :datasource="dataSource"
                saveable
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, GoodNewsProductionCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'GoodNewsProduction',
        components: {CoreTable}
    })
    export default class GoodNewsProduction extends TableSubModule {

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.goodNews
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.goodNewsProduction
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return GoodNewsProductionCSModule
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
