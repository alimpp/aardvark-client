import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import ProjectsReleasedRow from '@/datamodels/rows/projectsReleasedRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, BadgeCountCSModule, ProjectsReleasedCSModule, SprintsViewDSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION, TABLE_SORT_TYPE} from "@/utils/constants";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';

@Module({name: 'projectsreleasedcs', namespaced: true, stateFactory: true})
export class ProjectsReleasedCS extends TableSubModuleCS<ProjectsReleasedRow> implements IProjectsReleasedCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'projectSprintNumber', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_NUMBER },
        { id: 'projectSprint', type: 'text', headerType: 'text', title: 'Project-Sprint', path: 'projectSprint', width: '99%', minWidth: '350px', filterType: TABLE_FILTER_TYPE.PROJECT, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PROJECT_SPRINT },
        { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_TEMPO },
        { id: 'releaseTitle', type: 'text', headerType: 'text', title: 'Release', path: 'releaseTitle', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE },
        { id: 'releaseDate', type: 'date', headerType: 'text', title: 'Release Date', path: 'releaseDate', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE_DATE },
        { id: 'completedDate', type: 'date', headerType: 'text', title: 'Completed Date', path: 'completedDate', sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_COMPLETED_DATE },
        { id: "managerId", type: "profile", headerType: 'text', title: "Project Maestro", path: "managerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_PRIMARY_MAESTRO },
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title: "Secondary Maestro", path: "secondaryManagerId", sortField: TABLE_SORT_TYPE.PROJECT_SPRINT_SECONDARY_MAESTRO }
    ]
    sort = { field: TABLE_SORT_TYPE.PROJECT_SPRINT_RELEASE_DATE, direction: TABLE_SORT_DIRECTION.DESC }

    constructor(module: VuexModule<ThisType<ProjectsReleasedRow>, ProjectsReleasedRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
        const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setProjectsReleased(count)
            }
        }
        return {
            method: SprintsViewDSModule.listSprintDetails,
            parameters: () => ({stage: 'Production', isReleased: true, processCount: badgeCountMethod}),
            model: ProjectsReleasedRow
        }
    }

    get refreshOptions() {
        return {
            items: SprintsViewDSModule.getItems,
            model: ProjectsReleasedRow
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
                if (ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsReleased && project?.item?.id) {
                    ProjectsReleasedCSModule.doRefreshRow({rowId: project?.item?.id});
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
    @Wait(WaitStates.ACTION_PROJECTSRELEASED_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ProjectsReleasedRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: ProjectsReleasedRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET, {projectId: data.projectId, sprintId: data.sprintId})
    }

    @Action({rawError: true})
    updateSelectedEntity(data: ProjectsReleasedRow) {
        ApplicationDSModule.setSelectedProjectId(data?.projectId);
        ApplicationDSModule.setSelectedSprintsViewId(data?.id);
    }

}

export interface IProjectsReleasedCS {
    tableData: TableRow[]
}
