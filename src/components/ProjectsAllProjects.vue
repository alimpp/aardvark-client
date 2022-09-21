<template>
    <div id="ProjectsAllProjects" class="max-height-moduletab-content">
        <CoreTable
            ref="table"
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_PROJECTSALLPROJECTS_LOADING)"
            :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
import Component from 'vue-class-component'
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import {ApplicationDSModule, ProjectsAllProjectsCSModule} from "@/store"
import TableSubModule from "@/components/Base/TableSubModule.vue";
import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import { Ref } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventBus';
import { EVENTS } from '@/utils/constants';

@Component({
    name: 'ProjectsAllProjects',
    components: {CoreTable}
})
export default class ProjectsAllProjects extends TableSubModule {
    @Ref('table') table!: CoreTable;

    //Overriding Parent Method
    get moduleName(): ModuleName{
        return ModuleName.projects
    }

    //Overriding Parent Method
    get moduleTabName(): ModuleTabName{
        return ModuleTabName.projectsAllProjects
    }

    //Overriding Parent Method
    get dataSource(): TableCS<TableRow> {
        return ProjectsAllProjectsCSModule
    }

    //Overriding Parent Method
    get defaultSelectedRow(): TableRow | null {
        return this.dataSource.tableData?.[0];
    }

    activated() {
        ApplicationDSModule.setSelectedEntityType(EntityType.project);
        EventBus.$on(EVENTS.CREATED_NEW_PROJECT, () => this.table.scrollToActiveRow());
    }

    deactivated() {
        EventBus.$off(EVENTS.CREATED_NEW_PROJECT)
    }

}
</script>
