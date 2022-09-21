<template>
    <div id="ReleasesReleased" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_RELEASERELEASED_LOADING)"
                :datasource="dataSource"
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, ReleasesReleasedCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'ReleasesReleased',
        components: {CoreTable}
    })
    export default class ReleasesReleased extends TableSubModule {

        get moduleName(): ModuleName{
            return ModuleName.releases
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.releasesReleased
        }

        get dataSource(): TableCS<TableRow> {
            return ReleasesReleasedCSModule
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