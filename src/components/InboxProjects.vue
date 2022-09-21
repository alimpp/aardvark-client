<template>
    <div :key="$route.params.roomId" id="InboxProjects" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_INBOX_PROJECTS_LOADING)"
            :datasource="dataSource"
            ref="table"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import {ApplicationDSModule, InboxProjectsCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import { EventBus } from '@/utils/eventBus';
    import { EVENTS } from '@/utils/constants';

    @Component({
        name: 'InboxProjects',
        components: {CoreTable}
    })
    export default class InboxProjects extends TableSubModule {
        //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.inbox
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.inboxProjects
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return InboxProjectsCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return null;
        }
        mounted() {
            EventBus.$on(EVENTS.CLICK_NOTIFICATION_PROJECT_ENTITY, (data: {roomId: any}) => {
                InboxProjectsCSModule.setNotificationSelectProjectByRoomId(data.roomId);
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_NOTIFICATION_PROJECT_ENTITY)
        }
        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.project)
        }
    }
</script>
