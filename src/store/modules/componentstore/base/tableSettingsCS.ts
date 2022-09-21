import { Action } from 'vuex-module-decorators'
import TableRow from "@/datamodels/base/tableRow";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import { EventBus } from '@/utils/eventBus';
import { EVENTS } from '@/utils/constants';

export default abstract class TableSettingsCS<Row extends TableRow> extends TableCS<Row>{
  @Action({ rawError: true })
  async onRowClick(data) {
    await this.context.commit("setSelectedRows", [data])
    //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
    //instead of expensive store watch operations that are lower priority.
    window.setTimeout(() => {
      this.context.dispatch("updateSelectedEntity", data)
    }, 0)
  }

  @Action({ rawError: true })
  async onRowDoubleClick(data: Row) {
    return
  }

  //Overriding this to add default row selection behavior
  @Action({ rawError: true })
  async doSetTableData(items: Row[]) {
    await this.context.commit("setTableData", items)
    await this.context.dispatch("doSelectedDefaultRow")
    if (!items.length) this.context.dispatch("updateSelectedEntity", null)
  }

  @Action({rawError: true})
    async selectNewRow(newItemId: number){
      if( !newItemId ) return

      const ItemID = newItemId
      const index = this.tableData.findIndex(row => row.id === newItemId);      
      if(index === -1){
        await this.context.dispatch("fetchMore")
        this.context.dispatch("selectNewRow", ItemID)
      }else{
        this.context.dispatch("onRowClick",this.tableData[index])
        setTimeout(() => {
          EventBus.$emit(EVENTS.CREATED_NEW_SETTING_ITEM)
        }, 0);
        
      }
    }

  abstract updateSelectedEntity(data: Row);
}
