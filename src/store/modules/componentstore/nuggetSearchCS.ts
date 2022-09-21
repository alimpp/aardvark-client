import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import NuggetSearchRow from '@/datamodels/rows/nuggetSearchRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, NuggetDSModule, BadgeCountCSModule, NuggetSearchCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({ name:'nuggetsearchcs', namespaced: true, stateFactory: true})
export class NuggetSearchCS extends TableSubModuleCS<NuggetSearchRow> implements INuggetSearchCS {
    query = '';
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'subscribe', type: 'checkbox', headerType: 'text', title: 'Follow', path: 'isSubscribedPublic', filterType: TABLE_FILTER_TYPE.NUGGET_SUBSCRIBE, sortField: TABLE_SORT_TYPE.NUGGET_SUBSCRIBE },
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'stage', type: 'text', headerType: 'text', title:'Stage', path: 'stage', filterType: TABLE_FILTER_TYPE.NUGGET_STAGE, sortField: TABLE_SORT_TYPE.NUGGET_STAGE},
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo',path: 'boarding', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: { project: ['title'] }, filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'phase', type: 'text', headerType: 'text', title: 'Lead Phase', path: 'phaseTitleStatus', filterType: TABLE_FILTER_TYPE.NUGGET_PHASE, sortField: TABLE_SORT_TYPE.NUGGET_PHASE },
        { id: 'target', type: 'date', headerType: 'text', title: 'Target', path: 'dueDate', sortField: TABLE_SORT_TYPE.NUGGET_TARGET },
        { id: 'createdBy', type: 'profile', headerType: 'text', title: 'Created By', path: 'createdByMemberId', sortField: TABLE_SORT_TYPE.NUGGET_CREATED_BY },
    ]

    constructor(module: VuexModule<ThisType<NuggetSearchRow>, NuggetSearchRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setNuggetSearch(count)
            }
        }
        return {
            method: NuggetDSModule.searchForNugget,
            parameters: () => ({query: this.query, processCount: badgeCountMethod}),
            model: NuggetSearchRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: NuggetSearchRow
        }
    }

    @Mutation
    clearSortAndFilter() {
        this.sort = {};
        this.filters = {};
    }

    @Mutation
    setSearchQuery(value: string) {
        this.query = value;
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            function onChange(nugget) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.nuggetSearch && nugget?.item?.id) {
                    NuggetSearchCSModule.doRefreshRow({rowId: nugget?.item?.id});
                }
            }
        );
    }

    @Action({rawError: true})
    async onRowCellClick(data: { id: string, row: NuggetSearchRow}) {
        switch (data.id) {
            case 'subscribe':
                if(data.row.id) {
                    if(data.row.isSubscribedPublic) {
                        const nugget = await NuggetDSModule.unsubscribeNugget(data.row.id)
                        const nuggetSearchRow = JsonParser.deserializeObject<NuggetSearchRow>(nugget, NuggetSearchRow);
                        this.doUpdateRow({ item: nuggetSearchRow})
                    } else {
                        const nugget = await NuggetDSModule.subscribeNugget(data.row.id);
                        const nuggetSearchRow = JsonParser.deserializeObject<NuggetSearchRow>(nugget, NuggetSearchRow);
                        this.doUpdateRow({ item: nuggetSearchRow})
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
    async doLoad(force = true) {
        this.search();
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_NUGGETSEARCH_LOADING)
    async search() {
        if (this.query.length) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response ? response : [], NuggetSearchRow);
            this.doSetRows(data);
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: NuggetSearchRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.project?.id)
    }

}

export interface INuggetSearchCS {
    tableData: TableRow[]
}
