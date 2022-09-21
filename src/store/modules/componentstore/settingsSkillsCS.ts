import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import SettingsSkillsRow from "@/datamodels/rows/settingsSkillsRow";
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import { isEmpty } from "@/utils/object";
import store, { SettingsDSModule, SettingsSkillsCSModule, SkillDSModule,TableFilterCSModule } from "@/store"
import { JsonParser } from "@/utils/jsonparser";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";

@Module({ name: "settingsskillscs", namespaced: true, stateFactory: true })
export class SettingsSkillsCS extends TableSettingsCS<SettingsSkillsRow> implements ISettingsSkillsCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "title", type: "text", headerType: 'text', title: "Skills", path: "title", width: '99%', minWidth: '350px', sortField: TABLE_SORT_TYPE.SKILL_NAME },
    { id: "description", type: "text", headerType: 'text', title: "Description", path: "description", width: '30%' },
    { id: "specialties", type: "specialty", headerType: 'text', title: "Specialties", path: "specialties"},
    { id: "inactive", type: "text", headerType: 'text', title: "Inactive", path: "inactive", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.SKILL_INACTIVE },
  ]
  sort = { field: TABLE_SORT_TYPE.SKILL_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsSkillsRow>, SettingsSkillsRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: SkillDSModule.listSkills,
      parameters: () => ({}),
      model: SettingsSkillsRow
    }
  }

  get refreshOptions() {
    return {
      items: SkillDSModule.getItems,
      model: SettingsSkillsRow
    }
  }

  get sortedSkills() {
    return SkillDSModule.sortedItems('title')
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  get hasRemovedAtFilters() {
    return TableFilterCSModule.filters[`removedAt`].options.map(item => item.id).every(value => { return this.filters?.removedAt?.includes(value); });
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.skillds.itemWatch;
      },
      function onChange(skill) {
        if(skill?.item?.id){
          SettingsSkillsCSModule.doRefreshRow({rowId: skill.item.id});
          if(SettingsSkillsCSModule?.filters?.removedAt &&
            !SettingsSkillsCSModule.hasRemovedAtFilters &&
            skill?.changes?.removedAt?.new !== skill?.changes?.removedAt?.old)
          {
            SettingsSkillsCSModule.removeRowsById({ids: [skill.item.id]})
          }
        }
      }
    );
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSSKILLS_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response: Array = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsSkillsRow)
      this.doSetRows(data)
    }
  }

  @Action({rawError: true})
  async selectNewSkillRow(){
    await this.selectNewRow(SettingsDSModule.newSkillId)
  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsSkillsRow) {
    if (data?.id) {
      SettingsDSModule.setSelectedSkillId(data.id);
    } else {
      SettingsDSModule.setSelectedSkillId(0);
    }
  }

  @Action({ rawError: true })
  onRowCellClick() {
    return;
  }

  @Action({ rawError: true })
  onHeaderCellClick() {
    return
  }

}

export interface ISettingsSkillsCS {
  tableData: TableRow[]
}
