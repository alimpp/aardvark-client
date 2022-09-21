<template>
  <div id="SettingsUsers" class="main-container">
    <div class="content max-height-moduletab-content">
      <CoreTable
        class="maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSUSERS_LOADING)"
      />
    </div>

    <UsersDetail class="form"/>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import { SettingsUsersCSModule } from "@/store";
import TableRow from "@/datamodels/base/tableRow";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreSelect from "@/components/Core/CoreSelect.vue";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import UsersDetail from "./SettingsDetail/UsersDetail.vue";
import TableSubModule from "@/components/Base/TableSubModule.vue";

@Component({
  name: "SettingsUsers",
  components: {
    CoreTable,
    ValidationObserver,
    ValidationProvider,
    CoreInput,
    CoreSelect,
    CoreAvatar,
    UsersDetail
  },
})
export default class SettingsUsers extends TableSubModule {

  get dataSource(): TableCS<TableRow> {
    return SettingsUsersCSModule;
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
}
</script>


<style lang="scss" scoped>
@import "src/assets/scss/variables";
.form {
  padding: 8px;
  .user-info {
    .user-avatar {
      max-width: 100px;
      .avatar {
        border-radius: 5px;
        justify-self: center;
        ::v-deep .vue-avatar--wrapper {
          border-radius: 0 !important;
          width: 100px !important;
          height: 100px !important;
        }
      }
    }
    .inputs {
      max-width: 340px;
    }
  }
  .user-table {
    .table {
      ::v-deep .table-title {
        min-width: inherit;
      }
    }
  }
}
</style>