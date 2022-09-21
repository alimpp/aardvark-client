<template>
    <div id="NuggetUnread" class="max-height-moduletab-content">
            <CoreTable
                    :loading="$wait.is(waitState.ACTION_NUGGETUNREAD_LOADING)"
                    :datasource="dataSource"
            />
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, NuggetUnreadCSModule} from "@/store"
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import {WaitStates} from "@/utils/vuewait";
    import TableSubModule from './Base/TableSubModule.vue';

    @Component({
        name: 'NuggetUnread',
        components: {CoreTable}
    })
    export default class NuggetUnread extends TableSubModule {
        waitState = WaitStates;

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.nugget
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.nuggetUnread
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return NuggetUnreadCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return null;
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.nugget)
        }
    }
</script>
