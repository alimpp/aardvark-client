import {getDifference, isEmpty} from "@/utils/object";
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import ProjectsProjectNuggetRow from '@/datamodels/rows/projectsProjectNuggetRow';
import {JsonParser} from '@/utils/jsonparser';
import store, {ApplicationDSModule, NuggetDSModule, ProfileDSModule, ProjectPhaseDSModule, ProjectDSModule, BadgeCountCSModule, ProjectsProjectNuggetCSModule, InboxReleaseNuggetsCSModule} from '@/store';
import TableSubModuleCS from "@/store/modules/componentstore/base/tableSubModuleCS";
import {Wait, WaitStates} from "@/utils/vuewait";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import router from '@/router';
import {BATCH_OPERATION, TABLE_SORT_DIRECTION} from '@/utils/constants';
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import {TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from '@/utils/constants';

@Module({name: 'inboxreleasenuggetscs', namespaced: true, stateFactory: true})
export class InboxReleaseNuggetsCS extends TableSubModuleCS<ProjectsProjectNuggetRow> implements IProjectsProjectNuggetCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: 'subscribe', type: 'checkbox', headerType: 'text', title: 'Follow', path: 'isSubscribedPublic', filterType: TABLE_FILTER_TYPE.NUGGET_SUBSCRIBE, sortField: TABLE_SORT_TYPE.NUGGET_SUBSCRIBE },
    { id: 'id', type: 'text', headerType: 'text', title: 'ID', path: 'nuggetNumber', sortField: TABLE_SORT_TYPE.NUGGET_NUMBER },
    { id: 'name', type: 'text', headerType: 'text', title: 'Name', path: 'title', whiteSpace: 'normal', width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.NUGGET_NAME },
    { id: 'stage', type: 'text', headerType: 'text', title: 'Stage', path: 'stage', filterType: TABLE_FILTER_TYPE.NUGGET_STAGE, sortField: TABLE_SORT_TYPE.NUGGET_STAGE },
    { id: 'tempo', type: 'tempo', headerType: 'text', title: 'Tempo', path: 'boarding', minWidth: '90px', filterType: TABLE_FILTER_TYPE.TEMPO, sortField: TABLE_SORT_TYPE.NUGGET_NAME },
    { id: 'type', type: 'text', headerType: 'text', title: 'Type', path: 'type', sortField: TABLE_SORT_TYPE.NUGGET_TYPE },
    { id: 'priority', type: 'text', headerType: 'text', title: 'Priority', path: 'priority', filterType: TABLE_FILTER_TYPE.NUGGET_PRIORITY, sortField: TABLE_SORT_TYPE.NUGGET_PRIORITY },
    { id: 'sprint', type: 'sprintDropdown', headerType: 'text', title: 'Sprint', path: 'sprintId', minWidth: '125px', sortField: TABLE_SORT_TYPE.NUGGET_SPRINT }
  ]
  sort = { field: TABLE_SORT_TYPE.NUGGET_NUMBER, direction: TABLE_SORT_DIRECTION.DESC };
  releaseId = 0;

  constructor(module: VuexModule<ThisType<ProjectsProjectNuggetRow>, ProjectsProjectNuggetRow>) {
    super(module);
  }

  @Mutation
  setReleaseId(releaseId: number) {
    this.releaseId = releaseId;
  }

  @Action({rawError: true})
  async updateReleaseId(releaseId: number) {
    this.setReleaseId(releaseId);
  }

  @Action
  async saveMethod(data: { op: BATCH_OPERATION, path: string, value: any }[]) {
    await NuggetDSModule.patch(data);
  }

  @Action
  async compareForSave() {
    const batch: any[] = []
    const nuggetSprints: any[] = []
    let batchOperation: string
    let batchPath: string
    for (const row of this.tableData) {
      if (row.id) {
        const convertedItem = JsonParser.deserializeObject(NuggetDSModule.getItems[row.id], ProjectsProjectNuggetRow)
        const difference = getDifference(convertedItem, row);
        if (Object.keys(difference).length === 0) continue;
        if (difference['sprintId']) {
          if (difference['sprintId'].new !== 0) {
            nuggetSprints.push({sprintId: difference['sprintId'].new, nuggetId: row.id})
          }
          if (difference['sprintId'].new === 0) {
            batchOperation = BATCH_OPERATION.REMOVE;
            batchPath = `projects/${row.projectId}/sprints`;
            batch.push({op: batchOperation, path: batchPath, value: {nuggetId: row.id}})
          }
        }
      }
    }
    if (nuggetSprints.length) {
      batchOperation = BATCH_OPERATION.APPEND;
      batchPath = 'nuggetsprints';
      batch.push({op: batchOperation, path: batchPath, value: nuggetSprints})
    }
    return batch.length !== 0 ? {batch} : undefined;
  }
  get fixedSchema(): ITableColumnSchema[] {
    const isProjectMaestroRole = ProjectDSModule?.items[this.releaseId]?.managerId === ProfileDSModule.identifier || ProjectDSModule?.items[this.releaseId]?.secondaryManagerId === ProfileDSModule.identifier
    return this._tableSchema.map((schema: ITableColumnSchema): ITableColumnSchema => {
      if (schema.id === 'sprint' && !isProjectMaestroRole)
        return {...schema, type: 'text', path: {sprint: ['name']}}
      return schema;
    })
  }

  get dynamicColumns(): ITableColumnSchema[] {
    if (!this.tableData.length || !this.releaseId || !ProjectPhaseDSModule.items[this.releaseId]) return [];
    return ProjectPhaseDSModule.items[this.releaseId].filter(phase => !phase.isSystem).map(projectPhase => {
      return {
        id: `cadence-${projectPhase.title}`, type: 'cadence', headerType: 'text', title: projectPhase.title,
        path: {cadences: [`cadence-${projectPhase.title}`, 'cadence']}, minWidth: '130px'
      }
    })
  }

  get tableSchema(): ITableColumnSchema[] {
    return [
      ...this.fixedSchema,
      ...this.dynamicColumns
    ]
  }

  get requestOptions() {
    const badgeCountMethod = (count) => {
      if(!this.hasFilters) {
      BadgeCountCSModule.setProjectsNugget(count)
      }
  }
    return {
      method: NuggetDSModule.listNuggets,
      parameters: () => ({releaseId: Number(router.currentRoute.params.releaseId) || this.releaseId, processCount: badgeCountMethod,zone : 'relevantNuggets'}),
      model: ProjectsProjectNuggetRow
    }
  }

  get refreshOptions() {
    return {
      items: NuggetDSModule.getItems,
      model: ProjectsProjectNuggetRow
    }
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.nuggetds.itemWatch
      },
      function onChange(nugget) {
        if (ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxReleaseNuggets  && nugget?.item?.id) {
          InboxReleaseNuggetsCSModule.doRefreshRow({rowId: nugget?.item?.id});
        }
      }
    );
  }

  @Action({rawError: true})
  async onRowCellClick(data: {id: string, row: ProjectsProjectNuggetRow}) {
    switch (data.id) {
      case 'subscribe':
        if (data.row.id) {
          if (data.row.isSubscribedPublic) {
            const nugget = await NuggetDSModule.unsubscribeNugget(data.row.id)
            const projectsProjectNuggetRow = JsonParser.deserializeObject<ProjectsProjectNuggetRow>(nugget, ProjectsProjectNuggetRow);
            this.doUpdateRow({item: projectsProjectNuggetRow})
          } else {
            const nugget = await NuggetDSModule.subscribeNugget(data.row.id);
            const projectsProjectNuggetRow = JsonParser.deserializeObject<ProjectsProjectNuggetRow>(nugget, ProjectsProjectNuggetRow);
            this.doUpdateRow({item: projectsProjectNuggetRow})
          }
        }
        break;
      default:
        break;
    }
  }

  @Action({rawError: true})
  onHeaderCellClick() {
    return
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_INBOXNUGGETSRELEASE_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response = await this.fetch({reset: true});
      const data = JsonParser.deserializeArray(response, ProjectsProjectNuggetRow)
      this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  updateSelectedEntity(data: ProjectsProjectNuggetRow) {
    ApplicationDSModule.setSelectedNuggetId(data?.id);
  }

}

export interface IProjectsProjectNuggetCS {
  tableData: ProjectsProjectNuggetRow[]
}
