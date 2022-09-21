import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import TimeCardDetailTimeCardsRow from '@/datamodels/rows/timeCardDetailTimeCardsRow';
import { JsonParser } from "@/utils/jsonparser";
import store, {ApplicationDSModule, AssignmentDetailCSModule, AssignmentDetailTimeCardsCSModule, TimeCardDetailTimeCardsCSModule, TimeCardDSModule} from "@/store";
import TimeCardDM from '@/datamodels/timeCardDM'
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import { DetailTabName } from "@/store/modules/datastore/applicationDS";
import {ITableColumnSchema} from "../interfaces/ITableColumnSchema";
import TableCS from "./base/tableCS";

@Module({ name: 'timecarddetailtimecardscs', namespaced: true, stateFactory: true })
export class TimeCardDetailTimeCardsCS extends TableCS<TimeCardDetailTimeCardsRow> implements ILifeCycle {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "date", type: "timecardDate", headerType: 'text', title:"Date", path: "timecardDate" },
    { id: "hours", type: "text", headerType: 'text', title:"Hours", path: "hours" },
    { id: "note", type: "text", headerType: 'text', title:"Notes", path: "note", width: '99%'},
  ]
  timeCards: TimeCardDM[] = [];

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
  setTableSchema(value) {
    this._tableSchema = value;
  }

  @Mutation
  setTimecards(timecard: TimeCardDM[]) {
    this.timeCards = timecard;
  }

  @Action({ rawError: true })
  async updateTimecardsFromCache() {
    const {currentTimeCards} = TimeCardDSModule;
    this.setTimecards(currentTimeCards)
  }

  @Action({ rawError: true })
  async activate() {
    if (ApplicationDSModule.selectedDetailTab === DetailTabName.timecard) {
      await TimeCardDetailTimeCardsCSModule.updateTimecardsFromCache();
      await TimeCardDetailTimeCardsCSModule.doLoad();
      if (ApplicationDSModule.selectedAssignmentID > 0) {
        await TimeCardDSModule.doLoad(ApplicationDSModule.selectedAssignmentID);
      }
    }
  }

  @Action({ rawError: true })
  async createTimecard(date: string) {
    await TimeCardDSModule.createTimecard({ assignmentId: ApplicationDSModule.selectedAssignmentID, note: '', hours: 0, date: date })
    }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.timecardds.items;
      },
      async function onChange(timecards) {
        if (ApplicationDSModule.selectedDetailTab === DetailTabName.timecard) {
          await TimeCardDetailTimeCardsCSModule.updateTimecardsFromCache();
          await TimeCardDetailTimeCardsCSModule.doLoad();
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
    const currentTimeCard = this.context.state['timeCards']
    this.doSetRows(JsonParser.deserializeArray(currentTimeCard, TimeCardDetailTimeCardsRow));
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: TimeCardDetailTimeCardsRow) {
    AssignmentDetailTimeCardsCSModule.setSelectedTimecardId(data?.id || 0);
  }

  @Action({rawError: true})
  async onRowClick(data) {
    this.setSelectedRows([data]);
    //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
    //instead of expensive store watch operations that are lower priority.
    window.setTimeout(() => this.updateSelectedEntity(data));
  }

  //Overriding this to add default row selection behavior
  @Action({rawError: true})
  async doSetTableData(items: TimeCardDetailTimeCardsRow[]) {
    await this.context.commit("setTableData", items)
    await this.context.dispatch("doSelectedDefaultRow")
  }

  @Action({rawError: true})
  async onRowDoubleClick(data) {
    return
  }

}