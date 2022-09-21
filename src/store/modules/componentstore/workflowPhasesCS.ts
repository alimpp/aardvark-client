import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import WorkflowPhasesRow from '@/datamodels/rows/workflowPhasesRow';
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";

@Module({ name: 'workflowphasescs', namespaced: true, stateFactory: true })
export class WorkflowPhasesCS extends TableCS<WorkflowPhasesRow> implements ILifeCycle {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "del", type: "text", headerType: 'text', title: "Del", path: "del" },
    { id: "phase", type: "text", headerType: 'text', title: "Phase", path: "phase" },
    { id: "skill", type: "text", headerType: 'text', title: "Required Skills", path: "skill" },
  ]
  
  constructor(module: VuexModule<ThisType<WorkflowPhasesRow>, WorkflowPhasesRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return
  }

  get refreshOptions() {
    return
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Action({ rawError: true })
  async activate() {
    return
  }

  @Action
  onInitialization() {
    return;
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
  async doLoad() {
    return
  }

  @Action({ rawError: true })
  updateSelectedEntity() {
    return
  }

  @Action({ rawError: true })
  async onRowDoubleClick() {
    return
  }

  @Action({ rawError: true })
  async onRowClick() {
    return
  }

}