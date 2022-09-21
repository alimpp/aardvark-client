<template>
    <div id="NuggetSubscriptionsActive" class="max-height-moduletab-content">
            <CoreTable
                    :loading="$wait.is(waitState.ACTION_NUGGETSUBSCRIPTIONSACTIVE_LOADING)"
                    :datasource="dataSource"
            />
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, NuggetSubscriptionsActiveCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'NuggetSubscriptionsActive',
        components: {CoreTable}
    })
    export default class NuggetSubscriptionsActive extends TableSubModule {

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.nugget
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.nuggetSubscriptionsActive
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return NuggetSubscriptionsActiveCSModule
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
