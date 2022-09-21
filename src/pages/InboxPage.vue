<template>

    <div id="InboxPage">
        <CoreTabsBar
            v-model="activeTab"
            :tabs="tabs"
            :noUseAnchor="true"
            :alignLeft="true"
            @tabClosed="onTabClosed"
        />
        <keep-alive>
            <router-view :key="$route.fullPath" />
        </keep-alive>
    </div>

</template>


<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import CoreTabsBar from '@/components/Core/CoreTabsBar.vue'
    import { ApplicationDSModule, BadgeCountCSModule, InboxProjectsCSModule, InboxReleasesCSModule, InboxSprintCSModule, PermissionDSModule, ProjectDSModule, ReleaseDSModule, SprintsViewDSModule } from "@/store";
    import { ModuleTabName } from "@/store/modules/datastore/applicationDS";
    import CoreTabsContentItem from "@/components/Core/CoreTabsContentItem.vue";
    import CoreTabsContent from "@/components/Core/CoreTabsContent.vue";
    import InboxNugget from "@/components/InboxNugget.vue";
    import InboxProjects from "@/components/InboxProjects.vue";
    import InboxSprints from "@/components/InboxSprints.vue";
    import InboxReleases from "@/components/InboxReleases.vue";
    import { EVENTS, TAB_INBOX_ID } from "@/utils/constants";
    import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';
    import { EventBus } from '@/utils/eventBus';

    @Component({
        name: 'InboxPage',
        components: {
            InboxNugget,
            InboxProjects,
            InboxSprints,
            InboxReleases,
            CoreTabsContent,
            CoreTabsContentItem,
            CoreTabsBar
        }
    })
    export default class InboxPage extends Vue {
        selectedDynamicID = '';
        dynamicTabs: {id: string, label: string, hidden: boolean, closable: true}[] = [];

        get tabs() {
            return [
                { id: TAB_INBOX_ID.NUGGET, label: 'Nuggets', highBadgeCount: BadgeCountCSModule.inboxNuggetUnread,   hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_NUGGET)},
                { id: TAB_INBOX_ID.SPRINTS, label: 'Sprints', highBadgeCount: BadgeCountCSModule.inboxSprintsUnread,  hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTS)},
                { id: TAB_INBOX_ID.PROJECTS, label: 'Projects', highBadgeCount: BadgeCountCSModule.inboxProjectsUnread, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTS)},
                { id: TAB_INBOX_ID.RELEASES, label: 'Releases', highBadgeCount: BadgeCountCSModule.inboxReleasesUnread, hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASES)},
                ...this.dynamicTabs
            ];
        }

        get activeTab(): TAB_INBOX_ID | string{
            if(ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxNugget){
                return TAB_INBOX_ID.NUGGET;
            } else if(ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxProjects){
                return TAB_INBOX_ID.PROJECTS;
            } else if(ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxSprints){
                return TAB_INBOX_ID.SPRINTS;
            } else if(ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxReleases) {
                return TAB_INBOX_ID.RELEASES;
            } else if((ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxSprintNuggets ||
                       ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxProjectNuggets || 
                       ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxReleaseNuggets) && this.selectedDynamicID) {
                return this.selectedDynamicID;
            }
            return TAB_INBOX_ID.NUGGET
        }

        set activeTab(value: TAB_INBOX_ID | string){
            if(value === TAB_INBOX_ID.NUGGET) this.goToNugget()
            else if(value === TAB_INBOX_ID.PROJECTS) this.goToProject()
            else if(value === TAB_INBOX_ID.SPRINTS) this.goToSprint()
            else if(value === TAB_INBOX_ID.RELEASES) this.goToRelease()
            else if(value.startsWith(TAB_INBOX_ID.SPRINT_NUGGET)) this.goToSprintNugget(value)
            else if(value.startsWith(TAB_INBOX_ID.PROJECT_NUGGET)) this.goToProjectNugget(value)
            else if(value.startsWith(TAB_INBOX_ID.RELEASE_NUGGET)) this.goToReleaseNugget(value)
            else this.goToNugget()
        }

        goToNugget() {
            this.$route.name !== 'inboxNugget' ? this.$router.push({name: 'inboxNugget'}) : null
        }

        goToProject() {
            this.$route.name !== 'InboxProjects' ? this.$router.push({name: 'InboxProjects'}) : null
        }

        goToSprint() {
            this.$route.name !== 'InboxSprints' ? this.$router.push({name: 'InboxSprints'}) : null
        }

        goToRelease() {
            this.$route.name !== 'InboxReleases' ? this.$router.push({name: 'InboxReleases'}) : null
        }

        goToSprintNugget(tabId: string) {
            const sprintId = tabId.split('-')[1];
            const projectId = SprintsViewDSModule.items[sprintId].projectId;

            if(this.$route.name !== 'InboxSprintNuggets') {
                this.$router.push({name: 'InboxSprintNuggets', params: { projectId, sprintId}})
                this.selectedDynamicID = tabId;
            } else if(this.$route.name === 'InboxSprintNuggets' && (this.$route.params.projectId !== projectId || this.$route.params.sprintId !== sprintId)) {
                this.$router.replace({params: { projectId, sprintId}})
                this.selectedDynamicID = tabId;
            }
        }

        goToProjectNugget(tabId: string) {
            const projectId = tabId.split('-')[1]

            if(this.$route.name !== 'InboxProjectNuggets') {
                this.$router.push({name: 'InboxProjectNuggets', params: { projectId }})
                this.selectedDynamicID = tabId;
            } else if(this.$route.name === 'InboxProjectNuggets' && this.$route.params.projectId !== projectId) {
                this.$router.replace({params: { projectId }})
                this.selectedDynamicID = tabId;
            }
        }

        goToReleaseNugget(tabId: string) {
            const releaseId = tabId.split('-')[1]
            
            if(this.$route.name !== 'InboxReleaseNuggets') {
                this.$router.push({name: 'InboxReleaseNuggets', params: { releaseId }})
                this.selectedDynamicID = tabId;
            } else if(this.$route.name === 'InboxReleaseNuggets' && this.$route.params.releaseId !== releaseId) {
                this.$router.replace({params: { releaseId }})
                this.selectedDynamicID = tabId;
            }
        }

        addDynamicTab(tabData) {
            const isExistTab = this.dynamicTabs.some(tab => tab.id === tabData.id);
            if(!isExistTab) {
                this.dynamicTabs.push(tabData);
            }
        }

        onTabClosed(tab) {
            this.dynamicTabs = this.dynamicTabs.filter(dynamicTab => dynamicTab.id !== tab.id);
        }

        activated() {
            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_SPRINT_NUGGETS, (data: {projectId: number, sprintId: number}) => {
                this.setSprintNuggetsTab(data.sprintId);
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_PROJECT_NUGGETS, (data: {projectId: number}) => {
                this.setProjectNuggetsTab(data.projectId);
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_RELEASE_NUGGETS, (data: {releaseId: number}) => {
                this.setReleaseNuggetsTab(data.releaseId);
            })

            const activateTab = this.activeTab
            this.activeTab = activateTab
        }

        setSprintNuggetsTab(sprintId: number) {
            this.selectedDynamicID = `${TAB_INBOX_ID.SPRINT_NUGGET}-${sprintId}`;
            this.addDynamicTab({ 
                id: this.selectedDynamicID,
                label: `P${SprintsViewDSModule.currentSprintView?.projectNumber}-${SprintsViewDSModule.currentSprintView?.sprintNumber}`, 
                hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTNUGGETS),
                closable: true
            })
        }

        setProjectNuggetsTab(projectId: number) {
            this.selectedDynamicID = `${TAB_INBOX_ID.PROJECT_NUGGET}-${projectId}`;
            this.addDynamicTab({ 
                id: this.selectedDynamicID,
                label: ProjectDSModule.currentProject?.projectNumber, 
                hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTNUGGETS),
                closable: true
            })
        }

        setReleaseNuggetsTab(releaseId: number) {
            this.selectedDynamicID = `${TAB_INBOX_ID.RELEASE_NUGGET}-${releaseId}`;
            this.addDynamicTab({ 
                id: this.selectedDynamicID,
                label: ReleaseDSModule.currentRelease?.releaseNumber, 
                hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASENUGGETS),
                closable: true 
            })
        }

        beforeDestroy() {
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_SPRINT_NUGGETS);
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_PROJECT_NUGGETS);
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_RELEASE_NUGGETS);
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
