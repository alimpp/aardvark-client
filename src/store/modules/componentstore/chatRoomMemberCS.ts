import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import ChatRoomMemberRow from '@/datamodels/rows/chatRoomMemberRow' 
import {ApplicationDSModule, EntityChatCSModule, GroupDSModule} from '@/store';
import TableCS from "@/store/modules/componentstore/base/tableCS";
import {JsonParser} from "@/utils/jsonparser";
import {isEmpty} from "@/utils/object";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";
import { ModuleName } from '../datastore/applicationDS';
import { Wait, WaitStates } from "@/utils/vuewait";

@Module({name:'chatroommembercs' , namespaced:true, stateFactory:true })
export  class  ChatRoomMemberCS extends TableCS<ChatRoomMemberRow> {

    private _tableSchema: ITableColumnSchema[] = [
        { id: "avatar", type: "avatarColumn", headerType: 'text', title: "", path: "avatar" },
        { id: "fullName" , type:"text" , headerType:'text',width:"99%" ,title:"Participants" , path:"fullName"}
    ];
    constructor(module: VuexModule<ThisType<ChatRoomMemberRow>, ChatRoomMemberRow>){
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    } 

    get requestOptions() {
        return {
            method: GroupDSModule.chatRoomMember,
            parameters: () => ({roomId: this.currentChatRoomId }),
            model: ChatRoomMemberRow
        }
    }

    get refreshOptions() {
        return {
            items: GroupDSModule.getItems,
            model: ChatRoomMemberRow
        }
    }

    get currentGroupRoomId() {
        return ApplicationDSModule.selectedGroupChatRoomID;
    }

    get currentEnttyChatId(){        
        return EntityChatCSModule.roomId
    }

    get currentChatRoomId() {        
        if (ApplicationDSModule.selectedModule === ModuleName.groups ){
            return this.currentGroupRoomId
        }else{
            return this.currentEnttyChatId
        }
    }

    @Mutation
      setTableSchema(value) {
        this._tableSchema = value;
      }

    onRowDoubleClick() {
        return
    }
    onRowClick() {
        return
    }  
    updateSelectedEntity() {
        return
    }
    onRowCellClick() {
        return
    }
    onHeaderCellClick() {
        return
    }
    
    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_CHATROOMMEMBER_LOADING)
    async doLoad(force = true) {
        if(isEmpty(this.tableData)|| force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ChatRoomMemberRow)
            this.doSetRows(data)
        }
    }

}
