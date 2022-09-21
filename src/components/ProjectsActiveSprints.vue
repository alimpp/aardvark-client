<template>
    <div id="ProjectsActiveSprints" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_PROJECTSACTIVESPRINTS_LOADING)"
            :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import {ApplicationDSModule, ProjectsActiveSprintsCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";


    @Component({
        name: 'ProjectsActiveSprints',
        components: {CoreTable}
    })
    export default class ProjectsActiveSprints extends TableSubModule {
         //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.projects
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.projectsActiveSprints
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return ProjectsActiveSprintsCSModule
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
