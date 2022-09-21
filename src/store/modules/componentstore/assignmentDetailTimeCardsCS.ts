import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import TimeCardDetailTimeCardsRow from '@/datamodels/rows/timeCardDetailTimeCardsRow';
import {JsonParser} from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDetailCSModule, AssignmentDetailTimeCardsCSModule, TimeCardDSModule} from "@/store";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {DetailTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";

@Module({ name: 'assignmentdetailtimecardscs', namespaced: true, stateFactory: true })
export class AssignmentDetailTimeCardsCS extends TableCS<TimeCardDetailTimeCardsRow> implements ILifeCycle {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "date", type: "timecardDate", headerType: 'text', title: "Date", path: "timecardDate"},
    { id: "hours", type: "text", headerType: 'text', title: "Hours", path: "hours" },
    { id: "note", type: "text", headerType: 'text', title: "Notes", path: "note", width:'99%'},
  ]
  selectedTimecardId = 0;
  resourceAssignmentId = 0;
  selectedNuggetId = 0;
  constructor(module: VuexModule<ThisType<TimeCardDetailTimeCardsRow>, TimeCardDetailTimeCardsRow>) {
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
  setTableSchema(value: ITableColumnSchema[]) {
    this._tableSchema = value;
  }

  @Mutation
  setSelectedResourceAssignmentId(value: number) {
      if(value !== this.resourceAssignmentId) {
          this.resourceAssignmentId = value;
      }
  }

  @Mutation
  setSelectedTimecardId(value: number) {
      if(value !== this.selectedTimecardId) {
          this.selectedTimecardId = value;
      }
  }

  @Mutation
  setSelectedNuggetId(value: number) {
      if(value !== this.selectedNuggetId) {
          this.selectedNuggetId = value;
      }
  }

  @Action({ rawError: true })
  async activate() {
    if (this.selectedNuggetId !== ApplicationDSModule.selectedNuggetID) {
      this.clear();
    }
  }

  @Action({rawError: true})
  async resourceSelected(params: {resourceAssignmentId: number, selectedNuggetId: number}) {
      if(this.resourceAssignmentId !== params.resourceAssignmentId){
        await this.setSelectedResourceAssignmentId(params.resourceAssignmentId)
        await this.setSelectedNuggetId(params.selectedNuggetId)
        await this.doLoad()
      }1
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.timecardds.itemWatch;
      },
      async function onChange(timecards) {
        const assignmentID = AssignmentDetailTimeCardsCSModule.resourceAssignmentId
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.assigned && assignmentID in timecards) {
          await AssignmentDetailTimeCardsCSModule.doLoad();
        }
      }
    )
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
    const currentTimeCards = TimeCardDSModule.items[this.resourceAssignmentId];

    if(currentTimeCards) {
      this.doSetRows(JsonParser.deserializeArray(currentTimeCards, TimeCardDetailTimeCardsRow));
    }
  }

  @Action({rawError: true})
  async onRowClick(data: TimeCardDetailTimeCardsRow) {
    this.setSelectedRows([data]);
    //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
    //instead of expensive store watch operations that are lower priority.
    window.setTimeout(() => this.updateSelectedEntity(data));
  }

  @Action({rawError: true})
  async onRowDoubleClick(data) {
    return
  }


  @Action({ rawError: true })
  updateSelectedEntity(data: TimeCardDetailTimeCardsRow) {
      return
  }

}
