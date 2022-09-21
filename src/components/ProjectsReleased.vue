<template>
    <div id="ProjectsReleased" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_PROJECTSRELEASED_LOADING)"
            :datasource="dataSource"
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {ApplicationDSModule, ProjectsReleasedCSModule} from "@/store"
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({
        name: 'ProjectsReleased',
        components: {CoreTable}
    })
    export default class ProjectsReleased extends TableSubModule {
         //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.projects
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.projectsReleased
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return ProjectsReleasedCSModule
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
