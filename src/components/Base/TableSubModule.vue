<script lang="ts">

    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
    import {WaitStates} from "@/utils/vuewait";
    import router from '@/router';
    import { ApplicationDSModule, EntityChatCSModule } from '@/store';
    import TrackingTable from '../Core/Table/CoreTable.vue';

    @Component
    export default class TableSubModule extends Vue {
        waitState = WaitStates;


        //Overide this method returning module name
        protected get moduleName(): ModuleName{
            throw new Error('moduleName() method not overriden in parent TableSubModule!')
        }

        //overide this method returning tab name
        protected get moduleTabName(): ModuleTabName{
            throw new Error('moduleTabName() method not overriden in TableSubModule!')
        }

        //override this method to handle activated life cycle events
        protected get dataSource(): TableCS<TableRow> {
            throw new Error('dataSource() method not overriden in TableSubModule!')
        }

        //override this method to handle activated life cycle events
        protected get defaultSelectedRow(): TableRow | null {
            throw new Error('defaultSelectedRow() method not overriden in TableSubModule!')
        }

        async selectRowForRoomId(roomId,waitTime)
        {
              window.setTimeout(()=>{
                const rows =  this.dataSource.tableData;
                rows.forEach(async row=> {
                  const publicRoomId  = (row as any).publicRoomId;
                  const privateRoomId = (row as any).privateRoomId;
                  if ((roomId==publicRoomId.toString()) || (roomId==privateRoomId.toString()) )
                  {
                    const rows: TableRow[]= [] ;
                    rows.push(row);
                    {
                        ApplicationDSModule.setSelectedEntityChatRoomID(roomId)
                        ApplicationDSModule.setSelectedMediaRoomID(roomId);
                        ApplicationDSModule.setSelectedDocumentRoomID(roomId);
                        ApplicationDSModule.setSelectedLinkRoomID(roomId);
                        EntityChatCSModule.setRoomId(roomId);
                        const table: TrackingTable = this.$refs.table as TrackingTable;
                        await table.handleDefaultRowClick(row);
                    }
                  }
                })
              },waitTime);

        }

        rows: TableRow[]=[];
        async updated()
        {
            const roomId = router.currentRoute.params.roomId
            if (roomId!=undefined)
              if (roomId!=ApplicationDSModule.selectedEntityChatRoomID.toString()) // This show the routed component is already loaded, so activated hook
                                                                                  // will not be called. Trying to select row corresponding to roomId
              {
                  this.rows =  this.dataSource.tableData;

                  if (this.rows.length>0)
                    this.selectRowForRoomId(roomId,0)
                  else
                  {
                    await this.dataSource.fetch({reset: false});
                    this.selectRowForRoomId(roomId,0)
                  }

            }
        }

        activated() {
          this.dataSource.onRowClick?.(this.defaultSelectedRow)
          //this timeout is important to prevent animation flickerings
          window.setTimeout(() => {
            this.dataSource.doLoad(true)
          }, 0)
        }
    }
</script>
