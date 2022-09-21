import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import ProjectsActiveSprintsRow from '@/datamodels/rows/projectsActiveSprintsRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, BadgeCountCSModule, ProjectsActiveSprintsCSModule, SprintsViewDSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from "@/utils/constants";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'projectsactivesprintscs', namespaced: true, stateFactory: true})
export class ProjectsActiveSprintsCS extends TableSubModuleCS<ProjectsActiveSprintsRow> implements IProjectsActiveSprintsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'projectSprintNumber', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_NUMBER },
        { id: 'projectSprint', type: 'text', headerType: 'text', title: 'Project-Sprint', path: 'projectSprint', width: '99%', minWidth: '350px', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PROJECT_SPRINT },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_TEMPO },
        { id: 'releaseTitle', type: 'text', headerType: 'text', title: 'Release', path: 'releaseTitle', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE },
        { id: 'releaseDate', type: 'date', headerType: 'text', title: 'Release Date', path: 'releaseDate', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE_DATE },
        { id: 'releaseCutoff', type: 'date', headerType: 'text', title: 'Release Cutoff', path: 'releaseCutoff', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE_CUTOFF },
        { id: 'sprintTarget', type: 'date', headerType: 'text', title: 'Sprint Target', path: 'sprintTarget', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_SPRINT_TARGET },
        { id: "managerId", type: "profile", headerType: 'text', title: "Project Maestro", path: "managerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PRIMARY_MAESTRO },
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title: "Secondary Maestro", path: "secondaryManagerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_SECONDARY_MAESTRO }
    ]
    sort = { field: TABLE_SORT_TYPE.PROJECT_SPRINT_TEMPO, direction: TABLE_SORT_DIRECTION.ASC };

    constructor(module: VuexModule<ThisType<ProjectsActiveSprintsRow>, ProjectsActiveSprintsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setProjectsActive(count)
            }
        }
        return {
            method: SprintsViewDSModule.listSprintDetails,
            parameters: () => ({hasProductionNuggets: true, isReleased: false, processCount: badgeCountMethod}),
            model: ProjectsActiveSprintsRow
        }
    }

    get refreshOptions() {
        return {
            items: SprintsViewDSModule.getItems,
            model: ProjectsActiveSprintsRow
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
            function onChange(project) {
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsActiveSprints && project?.item?.id) {
                    ProjectsActiveSprintsCSModule.doRefreshRow({rowId: project?.item?.id});
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
    @Wait(WaitStates.ACTION_PROJECTSACTIVESPRINTS_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ProjectsActiveSprintsRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: ProjectsActiveSprintsRow) {
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedSprintsViewId(data?.id);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: ProjectsActiveSprintsRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET, {projectId: data.projectId, sprintId: data.sprintId})
    }

}

export interface IProjectsActiveSprintsCS {
    tableData: TableRow[]
}
