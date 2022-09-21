<template>

    <div id="ReleasesPage">
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
    import {TAB_RELEASES_ID} from "@/utils/constants";
    import ReleasesActive from '@/components/ReleasesActive.vue';
    import ReleasesReleased from '@/components/ReleasesReleased.vue';
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';


    @Component({
        name: 'ReleasesPage',
        components: {
            ReleasesActive,
            ReleasesReleased,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class ReleasesPage extends Vue {

        get tabs() {
            return [
                { id: TAB_RELEASES_ID.ACTIVE, label: 'Active', disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_ACTIVE) },
                { id: TAB_RELEASES_ID.RELEASED, label: 'Released', disabled: false, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_RELEASED) }
            ]
        }

        get activeTab(){
            if(ApplicationDSModule.selectedModuleTabReleases === ModuleTabName.releasesActive){
                return TAB_RELEASES_ID.ACTIVE;
            } else {
                return TAB_RELEASES_ID.RELEASED;
            }
        }

        set activeTab(value: TAB_RELEASES_ID){
            value === TAB_RELEASES_ID.ACTIVE ? this.goToActive() : this.goToReleased();
        }

        goToActive() {
            this.$route.name !== 'ReleasesActive' ? this.$router.push({name: 'ReleasesActive'}) : null
        }

        goToReleased() {
            this.$route.name !== 'ReleasesReleased' ? this.$router.push({name: 'ReleasesReleased'}) : null
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
