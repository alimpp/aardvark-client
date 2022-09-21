<template>
    <div :key="$route.params.roomId" id="InboxSprints" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_INBOX_SPRINTS_LOADING)"
            :datasource="dataSource"
            ref="table"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import {ApplicationDSModule, InboxSprintCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import { EventBus } from '@/utils/eventBus';
    import { EVENTS } from '@/utils/constants';


    @Component({
        name: 'InboxSprints',
        components: {CoreTable}
    })
    export default class InboxSprints extends TableSubModule {
         //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.inbox
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.inboxSprints
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return InboxSprintCSModule
        }
        mounted() {
            EventBus.$on(EVENTS.CLICK_NOTIFICATION_SPRINT_ENTITY, (data: {roomId: any}) => {
               InboxSprintCSModule.setNotificationSelectSprintByRoomId(data.roomId);
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_NOTIFICATION_SPRINT_ENTITY)
        }
        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return null;
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.sprint)
        }
    }
</script>
