<template>
  <div id="LeadDelayedNuggets" class="max-height-moduletab-content">
        <CoreTable
                :loading="isLoading"
                :datasource="dataSource"
                saveable
        />
  </div>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import CoreTable from '@/components/Core/Table/CoreTable.vue'
    import {ApplicationDSModule, LeadDelayedNuggetsCSModule} from "@/store"
    import TableSubModule from "@/components/Base/TableSubModule.vue";
    import {EntityType, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";
 
    @Component({
      name: 'LeadDelayedNuggets',
      components: {CoreTable}
    })
    export default class LeadDelayedNuggets extends TableSubModule {
    //Overriding Parent Method
    get moduleName(): ModuleName {
      return ModuleName.lead
    }

    //Overriding Parent Method
    get moduleTabName(): ModuleTabName {
      return ModuleTabName.leadDelayedNuggets
    }

    //Overriding Parent Method
    get dataSource(): TableCS<TableRow> {
      return LeadDelayedNuggetsCSModule
    }

    //Overriding Parent Method
    get defaultSelectedRow(): TableRow | null {
        return this.dataSource.tableData?.[0];
    }

    activated() {
      ApplicationDSModule.setSelectedEntityType(EntityType.assignment)
    }

    get isLoading() {
      return this.$wait.is(this.waitState.ACTION_LEADDELAYEDNUGGETS_LOADING);
    }
}
</script>
