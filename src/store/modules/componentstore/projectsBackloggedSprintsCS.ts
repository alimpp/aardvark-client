import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import ProjectsBackloggedSprintsRow from '@/datamodels/rows/projectsBackloggedSprintsRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, SprintsViewDSModule, BadgeCountCSModule, ProjectsBackloggedSprintsCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from "@/utils/constants";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import ProjectDM from '@/datamodels/projectDM';

@Module({name: 'projectsbackloggedsprintscs', namespaced: true, stateFactory: true})
export class ProjectsBackloggedSprintsCS extends TableSubModuleCS<ProjectsBackloggedSprintsRow> implements IProjectsBackloggedSprintsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'projectSprintNumber', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_NUMBER },
        { id: 'projectSprint', type: 'text', headerType: 'text', title: 'Project-Sprint', path: 'projectSprint', width: '99%', minWidth: '350px', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PROJECT_SPRINT },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_TEMPO },
        { id: "managerId", type: "profile", headerType: 'text', title: "Project Maestro", path: "managerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PRIMARY_MAESTRO },
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title: "Secondary Maestro", path: "secondaryManagerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_SECONDARY_MAESTRO }
    ]
    sort = { field: TABLE_SORT_TYPE.PROJECT_SPRINT_TEMPO, direction: TABLE_SORT_DIRECTION.ASC };

    constructor(module: VuexModule<ThisType<ProjectsBackloggedSprintsRow>, ProjectsBackloggedSprintsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setProjectsBackloggedSprints(count)
            }
        }
        return {
            method: SprintsViewDSModule.listSprintDetails,
            parameters: () => ({hasBackloggedNuggets: true, processCount: badgeCountMethod}),
            model: ProjectsBackloggedSprintsRow
        }
    }

    get refreshOptions() {
        return {
            items: SprintsViewDSModule.getItems,
            model: ProjectsBackloggedSprintsRow
        }
    }

    @Mutation
    setTableSchema(value) {
        this._tableSchema = value;
    }

    @Action({rawError: true})
    async loadChatTabs() {
        return [];
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.sprintsviewds.itemWatch;
            },
            function onChange(sprintDetail) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsBackloggedSprints && sprintDetail?.item?.id) {
                    ProjectsBackloggedSprintsCSModule.doRefreshRow({rowId: sprintDetail?.item?.id})
                }
            }
        );
    }

    @Action({rawError: true})
    onRowCellClick() {
        return
    }

    @Action({rawError: true})
    onHeaderCellClick() {
        return
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_PROJECTSBACKLOGGEDSPRINTS_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ProjectsBackloggedSprintsRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: ProjectsBackloggedSprintsRow) {
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedSprintsViewId(data?.id);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: ProjectsBackloggedSprintsRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET, {projectId: data.projectId, sprintId: data.sprintId})
    }
}

export interface IProjectsBackloggedSprintsCS {
    tableData: TableRow[]
}
