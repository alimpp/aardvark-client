<template>
    <div id="ReportPage"
    class="d-flex max-height overflow-hidden"
    >
       <ReportMembers/>
        <div class="main">
                <CoreTabsBar
                v-model="activeTab"
                :tabs="tabs"
                :noUseAnchor="true"
                :alignLeft="true"/>
       <keep-alive>
            <router-view></router-view>
       </keep-alive>
        </div>
    </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ReportMembers from "@/components/ReportMembers.vue";
import { ApplicationDSModule, PermissionDSModule } from "@/store";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import CoreTabsBar from '@/components/Core/CoreTabsBar.vue'
import ReportInprogeress from '@/components/ReportInProgress.vue'
import ReportUpcoming from '@/components/ReportUpcoming.vue'
import ReportEstimates from '@/components/ReportEstimates.vue'
import ReportCompleted from '@/components/ReportCompleted.vue'
import {TAB_REPORT_ID} from '@/utils/constants'
import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';

@Component({
    name: "ReportPage",
    components: {
        ReportMembers ,
        CoreTabsBar ,
        ReportInprogeress ,
        ReportUpcoming , 
        ReportEstimates ,  
        ReportCompleted , 
    }
})
export default class ReportPage extends Vue{

       get tabs() {
            return [
                { id: TAB_REPORT_ID.IN_PROGRESS, label: 'In Progress', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_INPROGRESS) },
                { id: TAB_REPORT_ID.UPCOMING, label: 'Upcoming', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_UPCOMING) },
                { id: TAB_REPORT_ID.ESTIMATE_DUE, label: 'Estimates', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_ESTIMATES) },
                { id: TAB_REPORT_ID.COMPLETED , label: 'completed' , hidden: !PermissionDSModule.can(Actions.VIEW, Subjects. REPORT_COMPLETED) }
            ]
        }

        get activeTab(): TAB_REPORT_ID{
            if(ApplicationDSModule.selectedModuleTabReport === ModuleTabName.reportInProgress){
                return TAB_REPORT_ID.IN_PROGRESS;
            } else if(ApplicationDSModule.selectedModuleTabReport === ModuleTabName.reportUpcoming){
                return TAB_REPORT_ID.UPCOMING;
            } else if(ApplicationDSModule.selectedModuleTabReport === ModuleTabName.reportEstimates){
                return TAB_REPORT_ID.ESTIMATE_DUE;
            } else if(ApplicationDSModule.selectedModuleTabReport === ModuleTabName.reportCompleted){
                return TAB_REPORT_ID.COMPLETED
            }
                return TAB_REPORT_ID.IN_PROGRESS
        }

        set activeTab(value: TAB_REPORT_ID){
             if(value === TAB_REPORT_ID.IN_PROGRESS) this.goToReprtInProgress()
             else if(value === TAB_REPORT_ID.UPCOMING) this.goToReprtUpcoming()
             else if(value === TAB_REPORT_ID.ESTIMATE_DUE) this.goToReprtEstimateDue()
             else if(value === TAB_REPORT_ID.COMPLETED) this.goToReprtCompleted()
         }

        goToReprtInProgress() {
            this.$route.name !== 'ReportInProgress' ? this.$router.push({name: 'ReportInProgress'}) : null
        }
        goToReprtUpcoming() {
            this.$route.name !== 'ReportUpcoming' ? this.$router.push({name: 'ReportUpcoming'}) : null
        }
        goToReprtEstimateDue() {
            this.$route.name !== 'ReportEstimates' ? this.$router.push({name: 'ReportEstimates'}) : null
        }
        goToReprtCompleted(){
            this.$route.name !== 'ReportCompleted' ? this.$router.push({name: 'ReportCompleted'}) : null
        }

        activated() {
            const activateTab = this.activeTab
            this.activeTab = activateTab
        }

}

</script>

<style lang="scss" scoped>
    @import 'src/assets/scss/variables';
    ::v-deep {
        .tabs-bar{
            .core-btn{
                width: $module-tab-width;
            }
        }
        .main{
            width: inherit;
        }
    }
</style>
