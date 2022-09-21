<template>

    <div id="GoodNewsPage">
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
    import GoodNewsProduction from "@/components/GoodNewsProduction.vue";
    import GoodNewsTriage from "@/components/GoodNewsTriage.vue";
    import GoodNewsNeedApproval from "@/components/GoodNewsNeedApproval.vue";
    import GoodNewsScrum from "@/components/GoodNewsScrum.vue";
    import GoodNewsBacklog from "@/components/GoodNewsBacklog.vue";
    import GoodNewsArchive from "@/components/GoodNewsArchive.vue";
    import GoodNewsUpcoming from "@/components/GoodNewsUpcoming.vue";
    import {TAB_GOOD_NEWS_ID} from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';


    @Component({
        name: 'GoodNewsPage',
        components: {
            GoodNewsProduction,
            GoodNewsTriage,
            GoodNewsNeedApproval,
            GoodNewsScrum: GoodNewsScrum,
            GoodNewsBacklog,
            GoodNewsArchive,
            GoodNewsUpcoming,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class GoodNewsPage extends Vue {

        get tabs() {
            return [
                { id: TAB_GOOD_NEWS_ID.TRIAGE, label: 'Triage', highBadgeCount: BadgeCountCSModule.goodNewsTriage, disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_TRIAGE)},
                { id: TAB_GOOD_NEWS_ID.UPCOMING, label: 'Upcoming', disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_UPCOMING)},
                { id: TAB_GOOD_NEWS_ID.BACKLOG, label: 'Backlog', disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_BACKLOG)},
                { id: TAB_GOOD_NEWS_ID.NEED_APPROVAL, label: 'Approvals Due', highBadgeCount: BadgeCountCSModule.goodNewsNeedApproval, disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_NEEDAPPROVAL)},
                { id: TAB_GOOD_NEWS_ID.HOURS_REPORTED, label: 'Journal Reports', disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_JOURNAL)},
                { id: TAB_GOOD_NEWS_ID.PRODUCTION, label: this.productionTabLabel, disabled: this.tabIsDisabled, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_PRODUCTION) },
                { id: TAB_GOOD_NEWS_ID.ARCHIVE, label: this.archiveTabLabel, disabled: this.tabIsDisabled, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_ARCHIVE) },
            ]
        }

        get tabIsDisabled(){
            return ApplicationDSModule.selectedProjectID ? false : true
        }

        get productionTabLabel(){
            //return ApplicationDSModule.selectedProjectID ? `${ProjectDSModule.projects[ApplicationDSModule.selectedProjectID].title} Production` : 'Production'
            return 'Production'
        }

        get archiveTabLabel(){
            //return ApplicationDSModule.selectedProjectID ? `${ProjectDSModule.projects[ApplicationDSModule.selectedProjectID].title} Archive` : 'Archive'
            return 'Archive'
        }

        get activeTab(){
            if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsTriage){
                return TAB_GOOD_NEWS_ID.TRIAGE;
            } else if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsNeedApproval){
                return TAB_GOOD_NEWS_ID.NEED_APPROVAL;
            } else if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsScrum){
                return TAB_GOOD_NEWS_ID.HOURS_REPORTED;
            } else if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsBacklog){
                return TAB_GOOD_NEWS_ID.BACKLOG;
            } else if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsUpcoming){
                return TAB_GOOD_NEWS_ID.UPCOMING;
            } else if(ApplicationDSModule.selectedModuleTabGoodNews === ModuleTabName.goodNewsProduction){
                return TAB_GOOD_NEWS_ID.PRODUCTION;
            } else {
                return TAB_GOOD_NEWS_ID.ARCHIVE;
            }
        }

        set activeTab(value: TAB_GOOD_NEWS_ID){
            if(value === TAB_GOOD_NEWS_ID.TRIAGE) this.goToTriage()
            else if(value === TAB_GOOD_NEWS_ID.NEED_APPROVAL) this.goToNeedApproval()
            else if(value === TAB_GOOD_NEWS_ID.HOURS_REPORTED) this.goToHoursReported()
            else if(value === TAB_GOOD_NEWS_ID.BACKLOG) this.goToBacklog()
            else if(value === TAB_GOOD_NEWS_ID.UPCOMING) this.goToUpcoming()
            else if(value === TAB_GOOD_NEWS_ID.PRODUCTION) this.goToProduction()
            else this.goToArchive()
        }

        goToTriage() {
            this.$route.name !== 'GoodNewsTriage' ? this.$router.push({name: 'GoodNewsTriage'}) : null
        }
        goToNeedApproval() {
            this.$route.name !== 'GoodNewsNeedApproval' ? this.$router.push({name: 'GoodNewsNeedApproval'}) : null
        }
        goToHoursReported() {
            this.$route.name !== 'GoodNewsScrum' ? this.$router.push({name: 'GoodNewsScrum'}) : null
        }
        goToBacklog() {
            this.$route.name !== 'GoodNewsBacklog' ? this.$router.push({name: 'GoodNewsBacklog'}) : null
        }
        goToUpcoming() {
            this.$route.name !== 'GoodNewsUpcoming' ? this.$router.push({name: 'GoodNewsUpcoming'}) : null
        }
        goToProduction() {
            this.$route.name !== 'GoodNewsProduction' ? this.$router.push({name: 'GoodNewsProduction'}) : null
        }

        goToArchive() {
            this.$route.name !== 'GoodNewsArchive' ? this.$router.push({name: 'GoodNewsArchive'}) : null
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
