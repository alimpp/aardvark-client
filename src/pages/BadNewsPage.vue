<template>

    <div id="BadNewsPage">
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
    import BadNewsOverdueTimecard from "@/components/BadNewsOverdueTimecard.vue";
    import BadNewsDelayedNuggets from "@/components/BadNewsDelayedNuggets.vue";
    import BadNewsOverdueEstimate from "@/components/BadNewsOverdueEstimate.vue";
    import BadNewsOverdueTriage from "@/components/BadNewsOverdueTriage.vue";
    import {TAB_BAD_NEWS_ID} from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';


    @Component({
        name: 'BadNewsPage',
        components: {
            BadNewsOverdueTimecard,
            BadNewsDelayedNuggets,
            BadNewsOverdueEstimate,
            BadNewsOverdueTriage,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class BadNewsPage extends Vue {

        get tabs() {
            return [
                { id: TAB_BAD_NEWS_ID.OVERDUE_TRIAGE, label: 'Overdue Triage', highBadgeCount: BadgeCountCSModule.badNewsOverdueTriage, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUETRIAGE) },
                { id: TAB_BAD_NEWS_ID.DELAYED_NUGGETS, label: 'Delayed Nuggets', highBadgeCount: BadgeCountCSModule.badNewsDelayedNuggets, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_DELAYEDNUGGETS) },
                { id: TAB_BAD_NEWS_ID.OVERDUE_ESTIMATE, label: 'Overdue Estimates', highBadgeCount: BadgeCountCSModule.badNewsOverdueEstimate, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_MISSINGESTIMATES) },
                { id: TAB_BAD_NEWS_ID.OVERDUE_TIMRCARD, label: 'Overdue Journals', highBadgeCount: BadgeCountCSModule.badNewsOverdueTimecard, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUEJOURNALS) }
            ]
        }

        get activeTab(){
            if(ApplicationDSModule.selectedModuleTabBadNews === ModuleTabName.badNewsDelayedNuggets){
                return TAB_BAD_NEWS_ID.DELAYED_NUGGETS;
            } else if(ApplicationDSModule.selectedModuleTabBadNews === ModuleTabName.badNewsOverdueTimecard){
                return TAB_BAD_NEWS_ID.OVERDUE_TIMRCARD;
            } else if(ApplicationDSModule.selectedModuleTabBadNews === ModuleTabName.badNewsOverdueEstimate){
                return TAB_BAD_NEWS_ID.OVERDUE_ESTIMATE;
            } else {
                return TAB_BAD_NEWS_ID.OVERDUE_TRIAGE;
            }
        }

        set activeTab(value: TAB_BAD_NEWS_ID){
            if(value === TAB_BAD_NEWS_ID.DELAYED_NUGGETS) this.goToDelayedNuggets()
            else if(value === TAB_BAD_NEWS_ID.OVERDUE_TIMRCARD) this.goToOverdueTimecard()
            else if(value === TAB_BAD_NEWS_ID.OVERDUE_ESTIMATE) this.goToOverdueEstimate()
            else this.goToOverdueTriage()
        }

        goToDelayedNuggets() {
            this.$route.name !== 'BadNewsDelayedNuggets' ? this.$router.push({name: 'BadNewsDelayedNuggets'}) : null
        }
        goToOverdueTimecard() {
            this.$route.name !== 'BadNewsOverdueTimecard' ? this.$router.push({name: 'BadNewsOverdueTimecard'}) : null
        }
        goToOverdueEstimate() {
            this.$route.name !== 'BadNewsOverdueEstimate' ? this.$router.push({name: 'BadNewsOverdueEstimate'}) : null
        }
        goToOverdueTriage() {
            this.$route.name !== 'BadNewsOverdueTriage' ? this.$router.push({name: 'BadNewsOverdueTriage'}) : null
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
