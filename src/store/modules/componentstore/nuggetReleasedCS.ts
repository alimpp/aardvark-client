import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import NuggetReleasedRow from '@/datamodels/rows/nuggetReleasedRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, NuggetDSModule, BadgeCountCSModule, NuggetReleasedCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({ name:'nuggetreleasedcs', namespaced: true, stateFactory: true})
export class NuggetReleasedCS extends TableSubModuleCS<NuggetReleasedRow> implements INuggetReleasedCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'subscribe', type: 'checkbox', headerType: 'text', title: 'Follow', path: 'isSubscribedPublic', filterType: TABLE_FILTER_TYPE.NUGGET_SUBSCRIBE, sortField: TABLE_SORT_TYPE.NUGGET_SUBSCRIBE },
        {id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER},
        {id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME},
        {id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO},
        {id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE},
        {id: 'project', type: 'text', headerType: 'text', title: 'Project', path: {project: ['title']}, filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT},
        {id: 'sprintName', type: 'text', headerType: 'text', title: 'Sprint Name', path: 'sprintName', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT},
        {id: 'releaseAt', type: 'date', headerType: 'text', title: 'Release Date', path: 'releaseAt', sortField: TABLE_SORT_TYPE.NUGGET_RELEASE},

    ];
    sort = { field: TABLE_SORT_TYPE.NUGGET_RELEASE, direction: TABLE_SORT_DIRECTION.DESC };

    constructor(module: VuexModule<ThisType<NuggetReleasedRow>, NuggetReleasedRow>) {
          super(module);
      }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setNuggetReleased(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({zone: 'released', processCount: badgeCountMethod}),
            model: NuggetReleasedRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: NuggetReleasedRow
        }
    }

    @Mutation
    setTableSchema(value: ITableColumnSchema[]) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.nuggetReleased && nugget?.item?.id) {
                    NuggetReleasedCSModule.doRefreshRow({rowId: nugget?.item?.id});
                }
            }
        );
    }

    @Action({rawError: true})
    async onRowCellClick(data: { id: string, row: NuggetReleasedRow}) {
        switch (data.id) {
            case 'subscribe':
                if(data.row.id) {
                    if(data.row.isSubscribedPublic) {
                        const nugget = await NuggetDSModule.unsubscribeNugget(data.row.id)
                        const nuggetReleasedRow = JsonParser.deserializeObject<NuggetReleasedRow>(nugget, NuggetReleasedRow);
                        this.doUpdateRow({ item: nuggetReleasedRow})
                    } else {
                        const nugget = await NuggetDSModule.subscribeNugget(data.row.id);
                        const nuggetReleasedRow = JsonParser.deserializeObject<NuggetReleasedRow>(nugget, NuggetReleasedRow);
                        this.doUpdateRow({ item: nuggetReleasedRow})
                    }
                }
                break;
            default:
                break;
        }
    }

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_NUGGETRELEASED_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({ reset: true });
            const data = JsonParser.deserializeArray(response, NuggetReleasedRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: NuggetReleasedRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.project?.id);
    }

}

export interface INuggetReleasedCS {
    tableData: TableRow[]
}
