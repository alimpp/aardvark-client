<template>

    <div id="LeadPage">
        <CoreTabsBar
            v-model="activeTab"
            :tabs="tabs"
            :noUseAnchor="true"
            :alignLeft="true"/>

        <keep-alive>
            <router-view />
        </keep-alive>
    </div>

</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import CoreTabsBar from '@/components/Core/CoreTabsBar.vue'
    import {ApplicationDSModule, BadgeCountCSModule, PermissionDSModule} from "@/store";
    import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
    import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
    import LeadOverdueEstimate from "@/components/LeadOverdueEstimate.vue";
    import LeadDelayedNuggets from "@/components/LeadDelayedNuggets.vue";
    import LeadJournalReport from "@/components/LeadJournalReport.vue";
    import LeadNeedApproval from "@/components/LeadNeedApproval.vue";
    import LeadOverdueTimecard from "@/components/LeadOverdueTimecard.vue";
    import {TAB_LEAD_ID} from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';


    @Component({
        name: 'LeadPage',
        components: {
            LeadOverdueEstimate,
            LeadDelayedNuggets,
            LeadJournalReport,
            LeadNeedApproval,
            LeadOverdueTimecard,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class LeadPage extends Vue {

        get tabs() {
            return [
                { id: TAB_LEAD_ID.APPROVAL_DUE,     label: 'Approvals Due', highBadgeCount: BadgeCountCSModule.leadNeedApproval, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_APPROVAL_DUE) },
                { id: TAB_LEAD_ID.JOURNAL_REPORT,   label: 'Journal Reports', highBadgeCount: BadgeCountCSModule.leadJournalReport, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_JOURNAL_REPORT) },
                { id: TAB_LEAD_ID.OVERDUE_JOURNAL,  label: 'Overdue Journals', highBadgeCount: BadgeCountCSModule.leadOverdueJournal, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUE_JOURNAL) },
                { id: TAB_LEAD_ID.OVERDUE_ESTIMATE, label: 'Overdue Estimates', highBadgeCount: BadgeCountCSModule.leadOverdueEstimate, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUE_ESTIMATE) },
                { id: TAB_LEAD_ID.DELAYED_NUGGETS,  label: 'Delayed Nuggets', highBadgeCount: BadgeCountCSModule.leadDelayedNuggets, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_DELAYED_NUGGETS) }

            ]
        }

        get activeTab(){
            if(ApplicationDSModule.selectedModuleTabLead === ModuleTabName.leadOverDueEstimate){
                return TAB_LEAD_ID.OVERDUE_ESTIMATE;
            } else if(ApplicationDSModule.selectedModuleTabLead === ModuleTabName.leadOverdueTimecard){
                return TAB_LEAD_ID.OVERDUE_JOURNAL;
            } else if(ApplicationDSModule.selectedModuleTabLead === ModuleTabName.leadNeedApproval){
                return TAB_LEAD_ID.APPROVAL_DUE;
            } else if(ApplicationDSModule.selectedModuleTabLead === ModuleTabName.leadDelayedNuggets){
                return TAB_LEAD_ID.DELAYED_NUGGETS;
            } else {
                return TAB_LEAD_ID.JOURNAL_REPORT;
            }
        }

        set activeTab(value: TAB_LEAD_ID){
            if(value === TAB_LEAD_ID.OVERDUE_ESTIMATE) this.goToOverdueEstimate()
            else if(value === TAB_LEAD_ID.OVERDUE_JOURNAL) this.goToOverdueTimecard();
            else if(value === TAB_LEAD_ID.APPROVAL_DUE) this.goToNeedApproval()
            else if(value === TAB_LEAD_ID.DELAYED_NUGGETS) this.goToDelayedNuggets()
            else this.goToJournalReport()
        }

        goToDelayedNuggets() {
            this.$route.name !== 'LeadDelayedNuggets' ? this.$router.push({name: 'LeadDelayedNuggets'}) : null
        }
        goToOverdueTimecard() {
            this.$route.name !== 'LeadOverdueTimecard' ? this.$router.push({name: 'LeadOverdueTimecard'}) : null
        }
        goToOverdueEstimate() {
            this.$route.name !== 'LeadOverdueEstimate' ? this.$router.push({name: 'LeadOverdueEstimate'}) : null
        }
        goToJournalReport() {
            this.$route.name !== 'LeadJournalReport' ? this.$router.push({name: 'LeadJournalReport'}) : null
        }
        goToNeedApproval() {
            this.$route.name !== 'LeadNeedApproval' ? this.$router.push({name: 'LeadNeedApproval'}) : null
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
    }
</style>
