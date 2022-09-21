<template>
  <div id="ProjectsProjectNugget" class="max-height-moduletab-content">
      <CoreTable
        class="maz-flex-1"
        :loading="$wait.is(waitState.ACTION_PROJECTSPROJECTNUGGET_LOADING)"
        :datasource="dataSource"
        saveable
      />
  </div>
</template>

<script lang="ts">
import TableRow from '@/datamodels/base/tableRow';
import { ApplicationDSModule, ProjectsProjectNuggetCSModule } from '@/store';
import TableCS from '@/store/modules/componentstore/base/tableCS';
import { EntityType, ModuleName, ModuleTabName } from '@/store/modules/datastore/applicationDS';
import Component from 'vue-class-component';
import TableSubModule from './Base/TableSubModule.vue';
import CoreTable from "@/components/Core/Table/CoreTable.vue";

@Component({name: 'ProjectsProjectNugget', components: {CoreTable}})
export default class ProjectsProjectNugget extends TableSubModule {

  //Overriding Parent Method
  get moduleName(): ModuleName{
    return ModuleName.projects
  }

  //Overriding Parent Method
  get moduleTabName(): ModuleTabName{
    return ModuleTabName.projectsProjectNugget
  }
  
  //Overriding Parent Method
  get dataSource(): TableCS<TableRow> {
    return ProjectsProjectNuggetCSModule
  }

  //Overriding Parent Method
  get defaultSelectedRow(): TableRow | null {
      return this.dataSource.tableData?.[0];
  }

  activated() {
    ApplicationDSModule.setSelectedEntityType(EntityType.nugget);
    if (Number(this.$route.params.projectId)) {
      ProjectsProjectNuggetCSModule.updateProjectId(Number(this.$route.params.projectId));
      ApplicationDSModule.setSelectedProjectId(ProjectsProjectNuggetCSModule.projectId);
    }
  }

}
</script>