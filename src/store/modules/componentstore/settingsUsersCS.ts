import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import SettingsUsersRow from '@/datamodels/rows/settingsUsersRow';
import store, {SettingsDSModule, SettingsUsersCSModule, UserDSModule} from '@/store';
import TableSettingsCS from "@/store/modules/componentstore/base/tableSettingsCS";
import {JsonParser} from "@/utils/jsonparser";
import {isEmpty} from "@/utils/object";
import { ITableColumnSchema } from "../interfaces/ITableColumnSchema";
import { TABLE_SORT_TYPE, TABLE_FILTER_TYPE, TABLE_SORT_DIRECTION } from '@/utils/constants';
import { Wait, WaitStates } from "@/utils/vuewait";
import TableRow from "@/datamodels/base/tableRow";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";

@Module({ name: 'settingsuserscs', namespaced: true, stateFactory: true })
export class SettingsUsersCS extends TableSettingsCS<SettingsUsersRow> implements ISettingsUsersCS {
  private _tableSchema: ITableColumnSchema[] = [
    { id: "avatar", type: "avatarColumn", headerType: 'text', title: "", path: "avatar" },
    { id: "lastName", type: "text", headerType: 'text', title: "Last Name", path: "lastName", sortField: TABLE_SORT_TYPE.USER_LAST_NAME },
    { id: "firstName", type: "text", headerType: 'text', title: "First Name", path: "firstName", sortField: TABLE_SORT_TYPE.USER_FIRST_NAME },
    { id: "department", type: "text", headerType: 'text', title: "Department", path: "department" },
    { id: "roles", type: "text", headerType: 'text', title: "Roles", path: "organizationRoles", filterType: TABLE_FILTER_TYPE.USER_ROLE, width: '99%'},
    { id: "messages", type: "text", headerType: 'text', title: "Messages", path: "messages" },
    { id: "deactivate", type: "checkbox", headerType: 'text', title: "Inactive", path: "deactivate", filterType: TABLE_FILTER_TYPE.INACTIVE, sortField: TABLE_SORT_TYPE.USER_INACTIVE },
  ];
  sort = { field: TABLE_SORT_TYPE.USER_LAST_NAME, direction: TABLE_SORT_DIRECTION.ASC };
  filters = { removedAt: ['active'] };

  constructor(module: VuexModule<ThisType<SettingsUsersRow>, SettingsUsersRow>) {
    super(module);
  }

  get tableSchema() {
    return this._tableSchema;
  }

  get requestOptions() {
    return {
      method: UserDSModule.listUsers,
      parameters: () => ({isSystem: false}),
      model: SettingsUsersRow
    }
  }

  get refreshOptions() {
    return {
      items: UserDSModule.getItems,
      model: SettingsUsersRow
    }
  }

  @Mutation
  setTableSchema(value) {
    this._tableSchema = value;
  }

  get users() {
    return UserDSModule.itemsAsArray
  }


  @Action({ rawError: true })
  async activate() {
    return
  }

  @Action
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.userds.itemWatch;
      },
      function onChange(user) {
        if (SettingsDSModule.selectedSettingsModule === SettingsModuleName.users && user?.item?.id) {
          SettingsUsersCSModule.doRefreshRow({rowId: user?.item?.id})
        }
      }
    );
  }

  @Action({ rawError: true })
  async onRowCellClick(data: {id: string, row: SettingsUsersRow}) {
    switch (data.id) {
      case 'deactivate':
          if(data.row.id) {
              if(data.row.removedAt === '') {
                  const user = await UserDSModule.kick(data.row.id)
                  const userRow = JsonParser.deserializeObject<SettingsUsersRow>(user, SettingsUsersRow);
                  this.doUpdateRow({item: userRow, replaceRowId: data.row.id})
              } else {
                const user = await UserDSModule.unkick(data.row.id)
                const userRow = JsonParser.deserializeObject<SettingsUsersRow>(user, SettingsUsersRow);
                this.doUpdateRow({item: userRow, replaceRowId: data.row.id})
              }
          }
          break;
      default:
          break;
  }
}

  @Action({ rawError: true })
  onHeaderCellClick() {
    return
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_SETTINGSUSERS_LOADING)
  async doLoad(force = false) {
    if (isEmpty(this.tableData) || force) {
      const response = await this.fetch({ reset: true });
      const data = JsonParser.deserializeArray(response, SettingsUsersRow)
      this.doSetRows(data)
    }

  }

  @Action({ rawError: true })
  updateSelectedEntity(data: SettingsUsersRow) {
    SettingsDSModule.setSelectedUserId(data?.id);
  }

}

export interface ISettingsUsersCS {
  tableData: TableRow[]
}
