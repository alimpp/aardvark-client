import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import GoodNewsArchiveRow from "@/datamodels/rows/goodNewsArchiveRow";
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, BadgeCountCSModule, GoodNewsArchiveCSModule, NuggetDSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import {BATCH_OPERATION} from '@/utils/constants';

@Module({name:'goodnewsarchivecs', namespaced: true, stateFactory: true})
export class GoodNewsArchiveCS extends TableSubModuleCS<GoodNewsArchiveRow> implements IGoodNewsArchiveCS{
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'tempo', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_TEMPO },
        { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', filterType: TABLE_FILTER_TYPE.NUGGET_TYPE, sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
        { id: 'project', type: 'text', headerType: 'text', title: 'Project', path: 'projectTitle', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.NUGGET_PROJECT },
        { id: 'tag', type: 'tag', headerType: 'text', title: 'Tag', path: 'tags', filterType: TABLE_FILTER_TYPE.TAGS },
        { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'priority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY },
        { id: 'creator', type: 'profile', headerType: 'text', title: 'Created By', path: 'creatorMemberId', whiteSpace:'normal', minWidth:'130px', sortField: TABLE_SORT_TYPE.NUGGET_CREATED_BY },
    ]
    sort = { field: TABLE_SORT_TYPE.NUGGET_SPRINT, direction: TABLE_SORT_DIRECTION.DESC };

    constructor(module: VuexModule<ThisType<GoodNewsArchiveRow>, GoodNewsArchiveRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setGoodNewsArchive(count)
            }
        }
        return {
            method: NuggetDSModule.listNuggets,
            parameters: () => ({ zone: 'goodnews-archived', processCount: badgeCountMethod}),
            model: GoodNewsArchiveRow
        }
    }

    get refreshOptions() {
        return {
            items: NuggetDSModule.getItems,
            model: GoodNewsArchiveRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({ rawError: true })
    async saveMethod(data: { op: BATCH_OPERATION, path: string, value: any }[]) {
        await NuggetDSModule.patch(data);
    }

    @Action
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.nuggetds.itemWatch;
            },
            function onChange(nugget) {
                if(ApplicationDSModule.selectedModuleTab === ModuleTabName.goodNewsArchive && nugget?.item?.id) {
                    GoodNewsArchiveCSModule.doRefreshRow({rowId: nugget?.item?.id})
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick() {
        return
    }

    @Action({ rawError: true })
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_GOODNEWSARCHIVE_LOADING)
    async doLoad(force = false) {
        if(isEmpty(this.tableData) || force){
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response!, GoodNewsArchiveRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: GoodNewsArchiveRow) {
        ApplicationDSModule.setSelectedNuggetId(data?.id);
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
    }
}
export interface IGoodNewsArchiveCS {
    tableData: TableRow[]
}
