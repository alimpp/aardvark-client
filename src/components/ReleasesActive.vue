<template>
    <div id="ReleasesActive" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_RELEASEACTIVE_LOADING)"
                :datasource="dataSource"
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, ReleasesActiveCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'ReleasesActive',
        components: {CoreTable}
    })
    export default class ReleasesActive extends TableSubModule {

        get moduleName(): ModuleName{
            return ModuleName.releases
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.releasesActive
        }

        get dataSource(): TableCS<TableRow> {
            return ReleasesActiveCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return this.dataSource.tableData?.[0];
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.release)
        }
    }
</script>