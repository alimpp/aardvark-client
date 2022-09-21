<template>

    <div id="AssignmentPage">
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
    import AssignmentInProgress from "@/components/AssignmentInProgress.vue";
    import AssignmentUpcomingEstimates from "@/components/AssignmentUpcomingEstimates.vue";
    import AssignmentNeedEstimate from "@/components/AssignmentNeedEstimate.vue";
    import AssignmentUpcoming from "@/components/AssignmentUpcoming.vue";
    import AssignmentCompleted from "@/components/AssignmentCompleted.vue";
    import {TAB_ASSIGNMENT_ID} from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';

    @Component({
        name: 'AssignmentPage',
        components: {
            AssignmentInProgress,
            AssignmentUpcomingEstimates,
            AssignmentNeedEstimate,
            AssignmentUpcoming,
            AssignmentCompleted,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class AssignmentPage extends Vue {

        get tabs() {
            return [
                { id: TAB_ASSIGNMENT_ID.IN_PROGRESS, label: 'In Progress', highBadgeCount: BadgeCountCSModule.assignmentInProgressDue, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET) },
                { id: TAB_ASSIGNMENT_ID.UPCOMING, label: 'Upcoming', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET) },
                { id: TAB_ASSIGNMENT_ID.NEED_ESTIMATE, label: 'Estimates Due', highBadgeCount: BadgeCountCSModule.assignmentNeedEstimate, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE) },
                { id: TAB_ASSIGNMENT_ID.UPCOMING_ESTIMATE, label: 'Upcoming Estimates', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE) },
                { id: TAB_ASSIGNMENT_ID.COMPLETED, label: 'Completed', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED) }
            ]
        }


        get activeTab(){
            if(ApplicationDSModule.selectedModuleTabAssignment === ModuleTabName.assignmentInProgress){
                return TAB_ASSIGNMENT_ID.IN_PROGRESS;
            } else if(ApplicationDSModule.selectedModuleTabAssignment === ModuleTabName.assignmentUpcoming){
                return TAB_ASSIGNMENT_ID.UPCOMING;
            } else if(ApplicationDSModule.selectedModuleTabAssignment === ModuleTabName.assignmentNeedEstimate){
                return TAB_ASSIGNMENT_ID.NEED_ESTIMATE;
            } else if(ApplicationDSModule.selectedModuleTabAssignment === ModuleTabName.assignmentUpcomingEstimates){
                return TAB_ASSIGNMENT_ID.UPCOMING_ESTIMATE;
            } else {
                return TAB_ASSIGNMENT_ID.COMPLETED;
            }
        }

        set activeTab(value: TAB_ASSIGNMENT_ID){
            if(value === TAB_ASSIGNMENT_ID.IN_PROGRESS) this.goToInProgress()
            else if(value === TAB_ASSIGNMENT_ID.UPCOMING) this.goToUpcoming()
            else if(value === TAB_ASSIGNMENT_ID.NEED_ESTIMATE) this.goToNeedEstimate()
            else if(value === TAB_ASSIGNMENT_ID.UPCOMING_ESTIMATE) this.goToNewlyAssigned()
            else this.goToCompleted()
        }

        goToInProgress() {
            this.$route.name !== 'AssignmentInProgress' ? this.$router.push({name: 'AssignmentInProgress'}) : null
        }
        goToUpcoming() {
            this.$route.name !== 'AssignmentUpcoming' ? this.$router.push({name: 'AssignmentUpcoming'}) : null
        }
        goToNeedEstimate() {
            this.$route.name !== 'AssignmentNeedEstimate' ? this.$router.push({name: 'AssignmentNeedEstimate'}) : null
        }
        goToNewlyAssigned() {
            this.$route.name !== 'AssignmentUpcomingEstimates' ? this.$router.push({name: 'AssignmentUpcomingEstimates'}) : null
        }
        goToCompleted() {
            this.$route.name !== 'AssignmentCompleted' ? this.$router.push({name: 'AssignmentCompleted'}) : null
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
