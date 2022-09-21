<template>
    <div id="ProjectsBackloggedSprints" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_PROJECTSBACKLOGGEDSPRINTS_LOADING)"
            :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import {ApplicationDSModule, ProjectsBackloggedSprintsCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";


    @Component({
        name: 'ProjectsBackloggedSprints',
        components: {CoreTable}
    })
    export default class ProjectsBackloggedSprints extends TableSubModule {
         //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.projects
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.projectsBackloggedSprints
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return ProjectsBackloggedSprintsCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return this.dataSource.tableData?.[0];
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.sprint)
        }
    }
</script>
