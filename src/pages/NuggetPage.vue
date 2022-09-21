<template>

    <div id="NuggetPage">
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
    import {ApplicationDSModule, PermissionDSModule} from "@/store";
    import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
    import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
    import NuggetUnread from "@/components/NuggetUnread.vue";
    import NuggetLastThirtyDays from "@/components/NuggetLastThirtyDays.vue";
    import NuggetSubscriptionsActive from "@/components/NuggetSubscriptionsActive.vue";
    import NuggetSearch from "@/components/NuggetSearch.vue";
    import NuggetReleased from "@/components/NuggetReleased.vue";
    import {TAB_NUGGET_ID} from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';


    @Component({
        name: 'NuggetPage',
        components: {
            NuggetLastThirtyDays,
            NuggetUnread,
            NuggetSubscriptionsActive,
            NuggetSearch,
            NuggetReleased,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class NuggetPage extends Vue {

        get tabs() {
            return [
                { id: TAB_NUGGET_ID.UNREAD, label: 'Unread', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_UNREAD)},
                { id: TAB_NUGGET_ID.LAST_THIRTY_DAYS, label: 'Last 30 Days', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_LASTTHIRTYDAYS) },
                { id: TAB_NUGGET_ID.SUBSCRIPTIONS_ACTIVE, label: 'Following', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SUBSCRIBED) },
                { id: TAB_NUGGET_ID.RELEASED, label: 'Released', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_RELEASED) },
                { id: TAB_NUGGET_ID.SEARCH, label: 'Search Results', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SEARCH) }
            ]
        }

        get activeTab(): TAB_NUGGET_ID{
            if(ApplicationDSModule.selectedModuleTabNugget === ModuleTabName.nuggetUnread){
                return TAB_NUGGET_ID.UNREAD;
            } else if(ApplicationDSModule.selectedModuleTabNugget === ModuleTabName.nuggetLastThirtyDays){
                return TAB_NUGGET_ID.LAST_THIRTY_DAYS;
            } else if(ApplicationDSModule.selectedModuleTabNugget === ModuleTabName.nuggetSubscriptionsActive){
                return TAB_NUGGET_ID.SUBSCRIPTIONS_ACTIVE;
            } else if(ApplicationDSModule.selectedModuleTabNugget === ModuleTabName.nuggetSearch) {
                return TAB_NUGGET_ID.SEARCH;
            } else {
                return TAB_NUGGET_ID.RELEASED;
            }
        }

        set activeTab(value: TAB_NUGGET_ID){
            if(value === TAB_NUGGET_ID.UNREAD) this.goToUnread()
            else if(value === TAB_NUGGET_ID.LAST_THIRTY_DAYS) this.goToLastThirtyDays()
            else if(value === TAB_NUGGET_ID.SUBSCRIPTIONS_ACTIVE) this.goToSubscriptionActive()
            else if(value === TAB_NUGGET_ID.SEARCH) this.goToSearch()
            else this.goToReleased()
        }

        goToUnread() {
            this.$route.name !== 'NuggetUnread' ? this.$router.push({name: 'NuggetUnread'}) : null
        }
        goToLastThirtyDays() {
            this.$route.name !== 'NuggetLastThirtyDays' ? this.$router.push({name: 'NuggetLastThirtyDays'}) : null
        }

        goToSubscriptionActive() {
            this.$route.name !== 'NuggetSubscriptionsActive' ? this.$router.push({name: 'NuggetSubscriptionsActive'}) : null
        }
        goToSearch() {
            this.$route.name !== 'NuggetSearch' ? this.$router.push({name: 'NuggetSearch'}) : null
        }

        goToReleased() {
            this.$route.name !== 'NuggetReleased' ? this.$router.push({name: 'NuggetReleased'}) : null
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
