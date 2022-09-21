<template>
    <div class="detail-sidebar">
        <CoreSidebar
                v-model="isOpen"
                :width="sidebarWidth"
                :loading="false"
                :no-shadow="false"
                :no-close-btn="!isMobileScreenSize"
                :absolute="true"
                :layer="false"
                :mini="false"
                :expand-on-hover="false"
                right
        >

            <CoreTabsBar
                v-model="activeTab"
                :tabs="tabs"
                :noUseAnchor="true"
                :alignLeft="true"
                suppressScroll
                />

            <CoreTabsContent :activeTab="activeTab" class="h-100">
                <CoreTabsContentItem :key="detailSidebarTabs.CHAT"> <Chat :ref="detailSidebarTabs.CHAT"/> </CoreTabsContentItem>
                <CoreTabsContentItem :key="detailSidebarTabs.DETAILS">
                    <ProjectDetail v-if="isRenderProject"  :ref="detailSidebarTabs.DETAILS" />
                    <SprintDetail v-else-if="isRenderSprint"  :ref="detailSidebarTabs.DETAILS" />
                    <ReleaseDetail v-else-if="isRenderRelease" :ref="detailSidebarTabs.DETAILS" />
                    <NuggetDetail v-else :ref="detailSidebarTabs.DETAILS" />
                </CoreTabsContentItem>
                <!-- <CoreTabsContentItem> <Events /> </CoreTabsContentItem> -->
                <CoreTabsContentItem :key="detailSidebarTabs.ATTACHMENTS"> <Attachments :ref="detailSidebarTabs.ATTACHMENTS"/> </CoreTabsContentItem>
                <CoreTabsContentItem :key="detailSidebarTabs.ASSIGNMENT"> <AssignmentDetail :ref="detailSidebarTabs.ASSIGNMENT"/> </CoreTabsContentItem>
                <CoreTabsContentItem :key="detailSidebarTabs.TIMECARD"> <TimecardDetail :ref="detailSidebarTabs.TIMECARD"/> </CoreTabsContentItem>
            </CoreTabsContent>

        </CoreSidebar>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator'
    import CoreSidebar from '@/components/Core/CoreSidebar.vue'
    import {ApplicationDSModule, DetailSidebarCSModule} from "@/store";
    import {State} from 'vuex-class';
    import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
    import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
    import CoreTabsBar from "@/components/Core/CoreTabsBar.vue";
    import Chat from "@/components/DetailSidebar/Chat.vue";
    import Events from "@/components/DetailSidebar/Events.vue";
    import Attachments from "@/components/DetailSidebar/Attachments.vue";
    import TimecardDetail from "@/components/DetailSidebar/TimecardDetail.vue";
    import AssignmentDetail from "@/components/DetailSidebar/AssignmentDetail.vue";
    import NuggetDetail from "@/components/DetailSidebar/NuggetDetail.vue";
    import ProjectDetail from "@/components/DetailSidebar/ProjectDetail.vue";
    import SprintDetail from "@/components/DetailSidebar/SprintDetail.vue";
    import ReleaseDetail from "@/components/DetailSidebar/ReleaseDetail.vue";
    import {EventBus} from "@/utils/eventBus";
    import {EVENTS, TAB_DETAIL_SIDEBAR} from "@/utils/constants";
    import {DetailTabName, ModuleName, ModuleTabName} from "@/store/modules/datastore/applicationDS";
    import DetailSubModule from './Base/DetailSubModule.vue';

    @Component({
        name: 'DetailSidebar',
        components: {CoreSidebar, CoreTabsBar, CoreTabsContentItem, CoreTabsContent, SprintDetail, Chat, Events, Attachments, TimecardDetail, AssignmentDetail, NuggetDetail, ProjectDetail, ReleaseDetail}
    })
    export default class DetailSidebar extends Vue {
        $refs!: {
            [key in TAB_DETAIL_SIDEBAR]: DetailSubModule
        }
        @State('isMobileScreenSize', {namespace: 'applicationds'}) isMobileScreenSize!: boolean;

        @Watch('isMobileScreenSize')
        onIsMobileScreenSize(val: boolean, oldVal: boolean) {
            if (val){
                ApplicationDSModule.setDetailSidebarOpen(false)
            } else {
                ApplicationDSModule.setDetailSidebarOpen(true)
            }
        }

        @Watch('tabs')
        onTabsChange() {
            DetailSidebarCSModule.setDefaultActiveTab();
        }

        @Watch('activeTab')
        onActiveTabChange() {
           this.checkDetailSidebarWidth();
        }

        get detailSidebarTabs() {
            return TAB_DETAIL_SIDEBAR;
        }

        public get tabs(): any[] {
            return DetailSidebarCSModule.tabs;
        }

        get sidebarWidth() {
            return ApplicationDSModule.detailSidebarWidth;
        }

        get activeTab() {
            return DetailSidebarCSModule.currentActiveTab;
        }

        set activeTab(id: TAB_DETAIL_SIDEBAR) {
            // Currently not used but can be uncommented in the future
            // this.$refs[this.activeTab].onTabDeactivate()
            DetailSidebarCSModule.setCurrentActiveTab(id);
            window.setTimeout(()=> {
                this.$refs[this.activeTab].onTabActivate();
            }, 200)
        }

        checkDetailSidebarWidth(){
            window.setTimeout(()=> {
            let width = 0;
            if(!this.isMobileScreenSize && this.activeTab == this.detailSidebarTabs.ASSIGNMENT){
              width = (this.$refs.detail_sidebar_assignment as AssignmentDetail ).getTableWidth();
            }else {
              width = 440;
            }
            ApplicationDSModule.setDetailSidebarWidth(width);
            EventBus.$emit(EVENTS.DETAILSIDEBAR_WIDTH_CHANGED, width)
              }, 450)
         }

        sendOnTabActivate(){
            window.setTimeout(() => this.$refs[this.activeTab].onTabActivate(), 0)
        }

        set isOpen(value){
            ApplicationDSModule.setDetailSidebarOpen(value)
        }

        get isOpen(){
            return ApplicationDSModule.detailSidebarOpen
        }

        get isRenderProject() {
            return (ApplicationDSModule.selectedModule === ModuleName.projects && ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsAllProjects)
            || (ApplicationDSModule.selectedModule === ModuleName.inbox && ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxProjects)
        }

        get isRenderSprint() {
            return ((ApplicationDSModule.selectedModule === ModuleName.projects) && (
                    ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsActiveSprints ||  
                    ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsBackloggedSprints ||
                    ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsReleased)
                    ) ||
                    (ApplicationDSModule.selectedModule === ModuleName.inbox &&  ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxSprints)
        }

        get isRenderRelease() {
            return (ApplicationDSModule.selectedModule === ModuleName.releases)
            || (ApplicationDSModule.selectedModule === ModuleName.inbox && ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxReleases)

        }


        mounted(){
            DetailSidebarCSModule.setDefaultActiveTab();
            this.checkDetailSidebarWidth()
            EventBus.$on(EVENTS.CLICK_DBL_TABLE_SUBMODULE, () => {
                if (DetailSidebarCSModule.currentActiveTab === TAB_DETAIL_SIDEBAR.CHAT) {
                    this.activeTab = TAB_DETAIL_SIDEBAR.DETAILS
                } else {
                    this.activeTab = TAB_DETAIL_SIDEBAR.CHAT
                }
            })
            EventBus.$on(EVENTS.CLICK_DETAIL_TAB_ID, (id: TAB_DETAIL_SIDEBAR) => {
                this.activeTab = id
            })
            EventBus.$on(EVENTS.CLICK_TABLE_SUBMODULE, () => {
                this.sendOnTabActivate()
            })
            EventBus.$on(EVENTS.CLICK_MODULE, (moduleName: ModuleName) => {
                if(this.activeTab === TAB_DETAIL_SIDEBAR.DETAILS){
                    if ((moduleName === ModuleName.projects) &&
                        (ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsBackloggedSprints ||
                        ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsActiveSprints ||
                        ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsReleased)||
                        (moduleName === ModuleName.inbox && ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxSprints)) {
                        ApplicationDSModule.setSelectedDetailTabName(DetailTabName.sprintDetails)
                    } else if((moduleName === ModuleName.projects && ApplicationDSModule.selectedModuleTab === ModuleTabName.projectsAllProjects)||
                            (moduleName === ModuleName.inbox && ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxProjects)){
                        ApplicationDSModule.setSelectedDetailTabName(DetailTabName.project)
                    } else if(moduleName === ModuleName.releases ||
                        (moduleName === ModuleName.inbox && ApplicationDSModule.selectedModuleTab === ModuleTabName.inboxReleases)){
                        ApplicationDSModule.setSelectedDetailTabName(DetailTabName.release)
                    } else {
                        ApplicationDSModule.setSelectedDetailTabName(DetailTabName.nugget)
                    }

                }
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_TABLE_SUBMODULE)
            EventBus.$off(EVENTS.CLICK_DBL_TABLE_SUBMODULE)
            EventBus.$off(EVENTS.CLICK_MODULE)
            EventBus.$off(EVENTS.CLICK_DETAIL_TAB_ID)
        }
    }
</script>

<style lang="scss">
@import "src/assets/scss/variables";

    .detail-sidebar {
        background-color: gray;
        white-space: nowrap;
        text-align: center;
        position: static;
        float: right;

        .coretab-scrollbar {
            background-color: var(--second-color);
        }

        .maz-sidebar__wrapper {
            transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
            transition-duration: 0.1s;
        }

        .maz-tabs-bar__indicator {
            transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
            transition-duration: 0.45s;
        }

        .core-tabs-content{
            transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
            transition-duration: 0.45s;
        }

        .maz-tabs-bar, .maz-tabs-bar {
            background-color: inherit;
            .tabs-bar {
                width: 100%;
            }
             &__item {
                    &.active {
                        border: 0px;
                        background-color: inherit;
                    }

                    &.disabled {
                        color: var(--maz-disabled-color);
                        cursor: not-allowed;
                    }
                }
                 .core-btn {
                flex: 1 1;
                border: 0px;
                transition: none;
                i {
                    font-size: 21px;
                }
            }
            .maz-tabs-bar__item {
                &:focus {
                    text-decoration: none;
                    background-color: inherit;
                }
                &:hover{
                    border-radius: 8px 8px 0px 0px;
                    background-color: var(--primary-color);
                }
            }
        }

          .maz-sidebar {
            &__wrapper {
                background-color: var(--second-color);
                &__close-btn {
                    top: 58px;

                    button {
                        background-color: var(--primary-color);
                        border: 2px solid var(--second-color);
                        padding-right: 10px;
                        width: 35px;
                        transition: none;
                        height: $module-tab-height;
                    }
                }
                &.is-absolute.is-right {
                    position: absolute;
                    right: 0px;
                }
                &.is-absolute.is-right.is-mobile {
                    position: absolute;
                    right: 0px;
                }
            }
        }
        .attachment-content {
            height: calc(100vh - 98px - 1.1rem - 3.5rem) !important;
            &.rooms{
                height: calc(100vh - 147px - 1.1rem - 3.5rem) !important;
            }
        }
    }
</style>
