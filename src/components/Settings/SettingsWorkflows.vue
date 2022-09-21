<template>
  <div
    id="SettingsWorkflows"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="maz-flex-1 table"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSWORKFLOWS_LOADING)"
      />

    </div>
      <WorkflowDetail class="form"/>
  </div>

</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import CoreSelect from "@/components/Core/CoreSelect.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import { SettingsWorkflowsCSModule } from "@/store";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import WorkflowDetail from "@/components/Settings/SettingsDetail/WorkflowsDetail.vue";
import BaseSetting from './Base/BaseSetting.vue';

@Component({
  name: "SettingsWorkflows",
  components: {
    CoreSelect,
    ValidationObserver,
    ValidationProvider,
    CoreInput,
    CoreTable,
    CoreCheckBox,
    WorkflowDetail,
  },
})
export default class SettingsWorkflows extends BaseSetting {

  @Ref('table') table!: CoreTable;
  deactivatedWorkflow = false;

  get dataSource(): TableCS<TableRow> {
    return SettingsWorkflowsCSModule;
  }

   //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
  //TODO: Add this part after the decision about table
  // get phasesDataSource(): TableCS<TableRow> {
  //   return WorkflowPhasesModule;
  // }

}
</script>

<style lang="scss" scoped>
.form {
  .table {
    ::v-deep .table-title {
      min-width: inherit;
    }
  }
  .checkbox {
    padding-top: 150px;
  }
}
</style>
