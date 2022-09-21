<script lang="ts">

    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {DetailTabName} from "@/store/modules/datastore/applicationDS";
    import {ApplicationDSModule} from "@/store";
    import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";

    @Component
    export default class DetailSubModule extends Vue {

        onTabActivate() {
            ApplicationDSModule.setSelectedDetailTabName(this.tabName)
             this.dataSources.forEach(datasource => window.setTimeout(() => datasource.activate && datasource.activate()))
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onTabDeactivate() {

        }

        //override this method to handle activated life cycle events
        protected get dataSources(): ILifeCycle[] {
            throw new Error('dataSources() method not overriden in TableSubModule!')
        }

        //Overide this method returning module name
        protected get tabName(): DetailTabName{
            throw new Error('tabName() method not overriden in parent DetailSubModule!')
        }


    }

</script>