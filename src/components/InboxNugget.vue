<template>
    <div :key="$route.params.roomId" id="InboxNugget" class="max-height-moduletab-content">
            <CoreTable
                    :loading="$wait.is(waitState.ACTION_INBOX_NUGGET_LOADING)"
                    :datasource="dataSource"
                    ref="table"
            />
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, InboxNuggetCSModule} from "@/store"
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import {WaitStates} from "@/utils/vuewait";
    import TableSubModule from './Base/TableSubModule.vue';
    import { EventBus } from '@/utils/eventBus';
    import { EVENTS } from '@/utils/constants';

    @Component({
        name: 'InboxNugget',
        components: {CoreTable}
    })
    export default class InboxNugget extends TableSubModule {
        waitState = WaitStates;

        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.inbox
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.inboxNugget
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return InboxNuggetCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return null;
        }
        mounted() {
            EventBus.$on(EVENTS.CLICK_NOTIFICATION_NUGGET_ENTITY, (data: {roomId: any}) => {
                InboxNuggetCSModule.setNotificationSelectNuggetByRoomId(data.roomId);
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_NOTIFICATION_NUGGET_ENTITY)
        }
        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.nugget)
        }
    }
</script>
