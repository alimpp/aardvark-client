import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {isEmpty} from "@/utils/object";
import ProjectsAllProjectsRow from '@/datamodels/rows/projectsAllProjectsRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, ProjectDSModule, BadgeCountCSModule, ProjectsAllProjectsCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import TableRow from "@/datamodels/base/tableRow";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EventBus} from "@/utils/eventBus";
import {EVENTS, TABLE_SORT_DIRECTION} from "@/utils/constants";
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import ProjectDM from '@/datamodels/projectDM';

@Module({name:'projectsallprojectscs', namespaced: true, stateFactory: true})
export class ProjectsAllProjectsCS extends TableSubModuleCS<ProjectsAllProjectsRow> implements IProjectsAllProjectsCS {
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'projectNumber', sortField: TABLE_SORT_TYPE.PROJECT_NUMBER },
        { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace:'normal',width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.PROJECT_NAME },
        { id: 'alert', type: 'alert', headerType: 'text', title:'Alert', path: 'alert', sortField: TABLE_SORT_TYPE.PROJECT_ALERT },
        { id: 'tempo', type: 'tempo', headerType: 'text', title:'Tempo',path: 'boarding', minWidth:'90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.PROJECT_TEMPO },
        { id: 'status', type: 'text', headerType: 'text', title:'Status', path: 'status', filterType: TABLE_FILTER_TYPE.PROJECTS_STATUS, sortField: TABLE_SORT_TYPE.PROJECT_STATUS },
        { id: 'workflow', type: 'text', headerType: 'text', title:'Workflow', path: 'workflowTitle', sortField: TABLE_SORT_TYPE.PROJECT_WORKFLOW },
        { id: "managerId", type: "profile", headerType: 'text', title:"Project Maestro", path: "managerId", sortField: TABLE_SORT_TYPE.PROJECT_PRIMARY_MAESTRO },
        { id: "secondaryManagerId", type: "profile", headerType: 'text', title:"Secondary Maestro", path: "secondaryManagerId", sortField: TABLE_SORT_TYPE.PROJECT_SECONDARY_MAESTRO }
    ]
    sort = { field: TABLE_SORT_TYPE.PROJECT_NAME, direction: TABLE_SORT_DIRECTION.ASC };
    filters = { status: ['active'] };

    constructor(module: VuexModule<ThisType<ProjectsAllProjectsRow>, ProjectsAllProjectsRow>) {
        super(module);
    }

    get tableSchema() {
        return this._tableSchema;
    }

    get requestOptions() {
         const badgeCountMethod = (count) => {
            if(!this.hasFilters) {
            BadgeCountCSModule.setProjects(count)
            }
        }
        return {
            method: ProjectDSModule.listProjects,
            parameters: () => ({processCount: badgeCountMethod }),
            model: ProjectsAllProjectsRow
        }
    }

    get refreshOptions() {
        return {
            items: ProjectDSModule.getItems,
            model: ProjectsAllProjectsRow
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
    async addProject(project: ProjectDM) {
        const row = JsonParser.deserializeObject(project, ProjectsAllProjectsRow);
        const rows = [...this.tableData];
        let isNewRowAdded = false;

        // If no filters, just add the project and sort
        if(!Object.keys(this.filters).length) {
            rows.push(row);
            isNewRowAdded = true;
        } else {
            // Loop through keys of filter, if we find a match, add, flag, break loop and sort.
            for(const key in this.filters) {
                if(this.filters[key].includes(project[key])) {
                    rows.push(row);
                    isNewRowAdded = true;
                    break;
                }
            }
        }

        // If no row added, return to prevent sort/set rows
        if(!isNewRowAdded) return;

        const sortedRows = rows.sort((a,b) => {
            if(this.sort.direction === 'ASC') {
                if (a[this.sort.field].toLowerCase() < b[this.sort.field].toLowerCase()) return -1;
                if (a[this.sort.field].toLowerCase() > b[this.sort.field].toLowerCase()) return 1;
                return 0;
            } else {
                if (a[this.sort.field].toLowerCase() > b[this.sort.field].toLowerCase()) return -1;
                if (a[this.sort.field].toLowerCase() < b[this.sort.field].toLowerCase()) return 1;
                return 0;
            }
        })

        this.doSetRows(sortedRows);
        return row;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.projectds.itemWatch;
            },
            function onChange(project) {
                if(ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsAllProjects && project?.item?.id) {
                    ProjectsAllProjectsCSModule.doRefreshRow({rowId: project?.item?.id});
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
    @Wait(WaitStates.ACTION_PROJECTSALLPROJECTS_LOADING)
    async doLoad(force = false) {
        if (isEmpty(this.tableData) || force) {
            const response = await this.fetch({reset: true});
            const data = JsonParser.deserializeArray(response, ProjectsAllProjectsRow)
            this.doSetRows(data)
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: ProjectsAllProjectsRow) {
        ApplicationDSModule.setSelectedProjectId(data?.id);
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: ProjectsAllProjectsRow) {
        EventBus.$emit(EVENTS.ROUTER_PUSH_PROJECTS_PROJECT_NUGGET, {projectId: data.id})
    }
}

export interface IProjectsAllProjectsCS {
    tableData: TableRow[]
}
