import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsWorkflowsRow from '@/datamodels/rows/settingsWorkflowsRow';
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import store, { WorkflowDSModule, SettingsDSModule, SettingsWorkflowsCSModule,TableFilterCSModule } from "@/store"
import { JsonParser } from "@/utils/jsonparser";
import { isEmpty } from "@/utils/object";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: 'settingsworkflowscs', namespaced: true, stateFactory: true })
export class SettingsWorkflowsCS extends TableSettingsCS<SettingsWorkflowsRow> implements ISettingsWorkflowsCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "title", type: "text", headerType: 'text', title: "Name", path: "title", minWidth: '350px', sortField: TABLE_SORT_TYPE.WORKFLOW_NAME },
    { id: "description", type: "text", headerType: 'text', title: "Description", path: "description" },
    { id: "phase", type: "phases", headerType: 'text', title: "Phases", path: "phases", filterType: TABLE_FILTER_TYPE.WORKFLOW_PHASES },
    { id: "project", type: "project", headerType: 'text', title: "Active Projects", path: "projects", width: '99%' },
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.WORKFLOW_INACTIVE },
  ]
  sort = { field: TABLE_SORT_TYPE.WORKFLOW_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsWorkflowsRow>, SettingsWorkflowsRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: WorkflowDSModule.listWorkflows,
      parameters: () => ({}),
      model: SettingsWorkflowsRow
    }
  }

  get refreshOptions() {
    return {
      items: WorkflowDSModule.getItems,
      model: SettingsWorkflowsRow
    }
  }

  get hasRemovedAtFilters() {
    return TableFilterCSModule.filters[`removedAt`].options.map(item => item.id).every(value => { return this.filters?.removedAt?.includes(value); });
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.workflowds.itemWatch;
      },
      function onChange(workflow) {
        if(workflow?.item?.id){
          SettingsWorkflowsCSModule.doRefreshRow({rowId: workflow.item.id});
          if(SettingsWorkflowsCSModule?.filters?.removedAt &&
            !SettingsWorkflowsCSModule.hasRemovedAtFilters &&
            workflow?.changes?.removedAt?.new !== workflow?.changes?.removedAt?.old)
          {
            SettingsWorkflowsCSModule.removeRowsById({ids: [workflow.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  onRowCellClick() {
    return;
  }

  @Action({ rawError: true })
  onHeaderCellClick() {
    return
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSWORKFLOWS_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsWorkflowsRow)
      this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  async selectNewWorkFlowRow(){
    await this.selectNewRow(SettingsDSModule.newWorkflowId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsWorkflowsRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedWorkflowId(data.id);
    } else {
      SettingsDSModule.setSelectedWorkflowId(0);
    }
  }

  @Action({ rawError: true })
  async activate() {
    return
  }

}

export interface ISettingsWorkflowsCS {
  tableData: TableRow[]
}
