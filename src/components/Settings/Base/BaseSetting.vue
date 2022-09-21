<script lang="ts">
import Component from 'vue-class-component'
import TableSubModule from "@/components/Base/TableSubModule.vue";
import TrackingTable from '@/components/Core/Table/CoreTable.vue';
import { EventBus } from '@/utils/eventBus';
import { EVENTS } from '@/utils/constants';

@Component({name:'BaseSetting'})

export default class BaseSetting extends TableSubModule {

    activated() {
        const table: TrackingTable = this.$refs.table as TrackingTable;

        EventBus.$on(EVENTS.CREATED_NEW_SETTING_ITEM, () => table.scrollToActiveRow());
    }

    deactivated() {
        EventBus.$off(EVENTS.CREATED_NEW_SETTING_ITEM)
    }
}
</script>