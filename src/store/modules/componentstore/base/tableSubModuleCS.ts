import {Action} from 'vuex-module-decorators'
import TableCS from "@/store/modules/componentstore/base/tableCS";
import {EventBus} from "@/utils/eventBus";
import {CHAT_LABEL_TYPE, EVENTS} from "@/utils/constants";
import {ApplicationDSModule, EntityChatCSModule} from '@/store';
import TableSubmoduleRow from '@/datamodels/base/tableSubmoduleRow';

export default abstract class TableSubModuleCS<Row extends TableSubmoduleRow> extends TableCS<Row>{

    @Action({rawError: true})
    async onRowClick(data) {
        this.context.commit("setSelectedRows", [data])
        this.context.dispatch("updateSelectedEntity", data)
        //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
        //instead of expensive store watch operations that are lower priority.
        window.setTimeout(() => {
            this.context.dispatch("setChatData", data)
            EventBus.$emit(EVENTS.CLICK_TABLE_SUBMODULE)
        }, 0)
    }

    //Overriding this to add default row selection behavior
    @Action({rawError: true})
    async doSetTableData(items: Row[]) {
        await this.context.commit("setTableData", items);
        await this.context.dispatch('doSelectedDefaultRow');
        if (!items.length)
            this.context.dispatch('updateSelectedEntity', null);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data) {
        EventBus.$emit(EVENTS.CLICK_DBL_TABLE_SUBMODULE)
    }

    @Action({rawError: true})
    async setChatData(data) {
        ApplicationDSModule.setSelectedEntityChatRoomID(data?.publicRoomId)
        ApplicationDSModule.setSelectedMediaRoomID(data?.publicRoomId)
        ApplicationDSModule.setSelectedDocumentRoomID(data?.publicRoomId)
        ApplicationDSModule.setSelectedLinkRoomID(data?.publicRoomId)
        EntityChatCSModule.updateLatestSeenMessageId(data);
        EntityChatCSModule.setChatTabs({tabs: []});
        const tabs = await this.context.dispatch('loadChatTabs') || [];
        EntityChatCSModule.setChatTabs({tabs});
    }

    //@Action({rawError: true})
    abstract updateSelectedEntity(data: Row | null);

    @Action({rawError: true})
    async loadChatTabs(): Promise<{id: number, highBadgeCount?: number, label: string, disableMention?: boolean}[]> {
        if(!this.selectedRow) return [];
        let tabs = [{ id: this.selectedRow.publicRoomId, highBadgeCount: 0, label: CHAT_LABEL_TYPE.PUBLIC, disableMention: false }];
        if(this.selectedRow.isSubscribedPrivate){
            tabs = [{ id: this.selectedRow.privateRoomId,highBadgeCount: 0 , label: CHAT_LABEL_TYPE.PRIVATE, disableMention: false }, ...tabs];
            EntityChatCSModule.loadBadgeCountPrivatePublic(tabs);
        }
        return tabs;
    }

}
