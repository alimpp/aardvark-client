<template>
  <div
    id="Tags"
    class="main-container"
  >
    <div class="content max-height-moduletab-content">
      <CoreTable
        ref="table"
        class="table maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_SETTINGTAGS_LOADING)"
      />
    </div>

    <TagsDetail class="form" />
  </div>
</template>

<script lang="ts">
import { Ref, Component } from 'vue-property-decorator';
import { SettingsTagsCSModule } from "@/store";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import TagsDetail from "./SettingsDetail/TagsDetail.vue";
import BaseSetting from '@/components/Settings/Base/BaseSetting.vue'

@Component({
  name: "SettingsTags",
  components: { CoreInput, CoreTable, TagsDetail },
})
export default class SettingsTags extends BaseSetting {

  @Ref('table') table!: CoreTable;

  get dataSource(): TableCS<TableRow> {
    return SettingsTagsCSModule;
  }
  
  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
#Tags {
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
