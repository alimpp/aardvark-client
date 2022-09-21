<template>
    <div id="InboxSprintNuggets" class="max-height-moduletab-content">
        <CoreTable
            class="maz-flex-1"
            :loading="$wait.is(waitState.ACTION_INBOXNUGGETSSPRINTS_LOADING)"
            :datasource="dataSource"
            saveable
        />
    </div>
</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from "@/components/Core/Table/CoreTable.vue";
    import {ApplicationDSModule, InboxSprintNuggetsCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";


    @Component({
        name: 'InboxSprintNuggets',
        components: {CoreTable}
    })
    export default class InboxSprintNuggets extends TableSubModule {
         //Overriding Parent Method
        get moduleName(): ModuleName{
            return ModuleName.inbox
        }

        //Overriding Parent Method
        get moduleTabName(): ModuleTabName{
            return ModuleTabName.inboxSprintNuggets
        }

        //Overriding Parent Method
        get dataSource(): TableCS<TableRow> {
            return InboxSprintNuggetsCSModule
        }

        //Overriding Parent Method
        get defaultSelectedRow(): TableRow | null {
            return this.dataSource.tableData?.[0];
        }

        activated() {
            ApplicationDSModule.setSelectedEntityType(EntityType.nugget);
            InboxSprintNuggetsCSModule.updateProjectId(Number(this.$route.params.projectId));
            ApplicationDSModule.setSelectedProjectId(InboxSprintNuggetsCSModule.projectId);
        }
    }
</script>
