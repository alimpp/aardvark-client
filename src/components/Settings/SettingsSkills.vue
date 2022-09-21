<template>
  <div
    id="Skills"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGSSKILLS_LOADING)"
      />
    </div>

    <SkillsDetail class="form" />
  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsSkillsCSModule } from "@/store";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import SkillsDetail from "./SettingsDetail/SkillsDetail.vue";
import BaseSetting from './Base/BaseSetting.vue';

@Component({
  name: "SettingsSkills",
  components: { CoreTable, SkillsDetail },
})
export default class SettingsSkills extends BaseSetting {

  @Ref('table') table!: CoreTable;


  get dataSource(): TableCS<TableRow> {
    return SettingsSkillsCSModule;
  }

   //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#Skills {
  .content {
    ::v-deep .table-title {
      min-width: inherit;
    }
  }
  .form {
    display: flex;
    flex-flow: column;
  }
  div.form > * {
    padding: 8px;
  }
}
</style>
