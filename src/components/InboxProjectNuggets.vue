<template>
  <div id="InboxProjectNuggets" class="max-height-moduletab-content">
      <CoreTable
        class="maz-flex-1"
        :loading="$wait.is(waitState.ACTION_INBOXNUGGETSPROJECTS_LOADING)"
        :datasource="dataSource"
        saveable
      />
  </div>
</template>

<script lang="ts">
import TableRow from '@/datamodels/base/tableRow';
import { ApplicationDSModule, InboxProjectNuggetsCSModule } from '@/store';
import TableCS from '@/store/modules/componentstore/base/tableCS';
import { EntityType, ModuleName, ModuleTabName } from '@/store/modules/datastore/applicationDS';
import Component from 'vue-class-component';
import TableSubModule from './Base/TableSubModule.vue';
import CoreTable from "@/components/Core/Table/CoreTable.vue";

@Component({name: 'inboxprojectnuggets', components: {CoreTable}})
export default class InboxProjectNuggets extends TableSubModule {

  //Overriding Parent Method
  get moduleName(): ModuleName{
    return ModuleName.inbox
  }

  //Overriding Parent Method
  get moduleTabName(): ModuleTabName{
    return ModuleTabName.inboxProjectNuggets
  }
  
  //Overriding Parent Method
  get dataSource(): TableCS<TableRow> {
    return InboxProjectNuggetsCSModule
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }

  activated() {
    ApplicationDSModule.setSelectedEntityType(EntityType.nugget);
    if (Number(this.$route.params.projectId)) {
      InboxProjectNuggetsCSModule.updateProjectId(Number(this.$route.params.projectId));
      ApplicationDSModule.setSelectedProjectId(InboxProjectNuggetsCSModule.projectId);
    }
  }

}
</script>