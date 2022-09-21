<template>
    <div :key="$route.params.roomId" id="InboxReleases" class="max-height-moduletab-content">
        <CoreTable
                :loading="$wait.is(waitState.ACTION_INBOX_RELEASES_LOADING)"
                :datasource="dataSource"
                ref="table"
        />
    </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, InboxReleasesCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import { EventBus } from '@/utils/eventBus';
    import { EVENTS } from '@/utils/constants';

    @Component({
        name: 'InboxReleases',
        components: {CoreTable}
    })
    export default class InboxReleases extends TableSubModule {

        get moduleName(): ModuleName{
            return ModuleName.inbox
        }

        get moduleTabName(): ModuleTabName{
            return ModuleTabName.inboxReleases
        }

        get dataSource(): TableCS<TableRow> {
            return InboxReleasesCSModule
        }

        get defaultSelectedRow(): TableRow | null {
            return null;
        }
        mounted() {
            EventBus.$on(EVENTS.CLICK_NOTIFICATION_RELEASE_ENTITY, (data: {roomId: any}) => {
                InboxReleasesCSModule.setNotificationSelectReleaseByRoomId(data.roomId);
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_NOTIFICATION_RELEASE_ENTITY)
        }
        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.release)
        }
    }
</script>