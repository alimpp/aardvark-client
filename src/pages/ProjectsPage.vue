<template>
    <div id="ProjectsPage">
        <CoreTabsBar 
            v-model="activeTab" 
            :tabs="tabs"
            :noUseAnchor="true" 
            :alignLeft="true"
            @tabClosed="onTabClosed"
        />
        <keep-alive>
            <router-view :key="$route.fullPath"/>
        </keep-alive>
    </div>
</template>


<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import CoreTabsBar from '@/components/Core/CoreTabsBar.vue'
import {
    ApplicationDSModule,
    PermissionDSModule,
    ProjectDSModule,
    SprintsViewDSModule
} from "@/store";
import {ModuleTabName} from "@/store/modules/datastore/applicationDS";
import {EVENTS, TAB_PROJECTS_ID} from "@/utils/constants";
import {Actions, Subjects} from '@/store/modules/datastore/permissionDS';
import { EventBus } from '@/utils/eventBus';

@Component({
    name: 'ProjectsPage',
    components: {CoreTabsBar}
})
export default class ProjectsPage extends Vue {
    selectedDynamicID = '';
    dynamicTabs: {id: string, label: string, hidden: boolean, closable: true}[] = [];

    get tabs() {
        return [
            { id: TAB_PROJECTS_ID.ALL_PROJECTS, label: 'Active Projects', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTS) },
            { id: TAB_PROJECTS_ID.ACTIVE, label: 'Active Sprints', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_ACTIVESPRINTS) },
            { id: TAB_PROJECTS_ID.BACKLOGGED, label: 'Backlog Sprints', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_BACKLOGGEDSPRINTS) },
            { id: TAB_PROJECTS_ID.RELEASED, label: 'Released Sprints', hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_RELEASEDSPRINTS) },
            ...this.dynamicTabs
        ];
    }

    get activeTab() {
        if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsActiveSprints) {
            return TAB_PROJECTS_ID.ACTIVE;
        } else if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsBackloggedSprints) {
            return TAB_PROJECTS_ID.BACKLOGGED;
        } else if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsAllProjects) {
            return TAB_PROJECTS_ID.ALL_PROJECTS;
        } else if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsReleased) {
            return TAB_PROJECTS_ID.RELEASED;
        } else if ((ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsSprintNugget ||
                    ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsProjectNugget) && this.selectedDynamicID) {
            return this.selectedDynamicID;
        }
        return TAB_PROJECTS_ID.ACTIVE;
    }

    set activeTab(value: TAB_PROJECTS_ID | string) {
        if (value === TAB_PROJECTS_ID.ACTIVE) this.goToActive()
        else if (value === TAB_PROJECTS_ID.BACKLOGGED) this.goToBackloggedSprints()
        else if (value === TAB_PROJECTS_ID.ALL_PROJECTS) this.goToAllProjects()
        else if (value === TAB_PROJECTS_ID.RELEASED) this.goToReleased()
        else if (value.startsWith(TAB_PROJECTS_ID.PROJECT_NUGGET)) this.goToProjectNugget(value)
        else if (value.startsWith(`${TAB_PROJECTS_ID.ACTIVE}${TAB_PROJECTS_ID.SPRINT_NUGGET}`)) this.goToActiveSprintNugget(value)
        else if (value.startsWith(`${TAB_PROJECTS_ID.BACKLOGGED}${TAB_PROJECTS_ID.SPRINT_NUGGET}`)) this.goToBackloggedSprintNugget(value)
        else if (value.startsWith(`${TAB_PROJECTS_ID.RELEASED}${TAB_PROJECTS_ID.SPRINT_NUGGET}`)) this.goToReleasedSprintNugget(value)
        else this.goToActive()
    }

    goToActive() {
        this.$route.name !== 'ProjectsActiveSprints' ? this.$router.push({name: 'ProjectsActiveSprints'}) : null
    }

    goToBackloggedSprints() {
        this.$route.name !== 'ProjectsBackloggedSprints' ? this.$router.push({name: 'ProjectsBackloggedSprints'}) : null
    }

    goToReleased() {
        this.$route.name !== 'ProjectsReleased' ? this.$router.push({name: 'ProjectsReleased'}) : null
    }

    goToAllProjects() {
        this.$route.name !== 'ProjectsAllProjects' ? this.$router.push({name: 'ProjectsAllProjects'}) : null
    }

    goToActiveSprintNugget(tabId: string) {
        const sprintId = tabId.split('-')[1];
        const projectId = SprintsViewDSModule.items[sprintId].projectId;

        if(this.$route.name !== 'ProjectsActiveSprintNugget') {
            this.$router.push({ name: 'ProjectsActiveSprintNugget', params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        } else if(this.$route.name === 'ProjectsActiveSprintNugget' && (this.$route.params.projectId !== projectId || this.$route.params.sprintId !== sprintId)) {
            this.$router.replace({params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        }
    }

    goToBackloggedSprintNugget(tabId: string) {
        const sprintId = tabId.split('-')[1];
        const projectId = SprintsViewDSModule.items[sprintId].projectId;

        if(this.$route.name !== 'ProjectsBackloggedSprintNugget') {
            this.$router.push({ name: 'ProjectsBackloggedSprintNugget', params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        } else if(this.$route.name === 'ProjectsBackloggedSprintNugget' && (this.$route.params.projectId !== projectId || this.$route.params.sprintId !== sprintId)) {
            this.$router.replace({params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        }
    }

    goToReleasedSprintNugget(tabId: string) {
        const sprintId = tabId.split('-')[1];
        const projectId = SprintsViewDSModule.items[sprintId].projectId;

        if(this.$route.name !== 'ProjectsReleasedSprintNugget') {
            this.$router.push({ name: 'ProjectsReleasedSprintNugget', params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        } else if(this.$route.name === 'ProjectsReleasedSprintNugget' && (this.$route.params.projectId !== projectId || this.$route.params.sprintId !== sprintId)) {
            this.$router.replace({params: { sprintId, projectId }});
            this.selectedDynamicID = tabId;
        }
    }

    goToProjectNugget(tabId: string) {
        const projectId = tabId.split('-')[1];

        if(this.$route.name !== 'ProjectsProjectNugget') {
            this.$router.push({name: 'ProjectsProjectNugget', params: { projectId }})
            this.selectedDynamicID = tabId;
        } else if(this.$route.name === 'ProjectsProjectNugget' && this.$route.params.projectId !== projectId) {
            this.$router.replace({params: { projectId }})
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
        EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_PROJECT_NUGGET, (data: { projectId: number }) => {
            this.setProjectNuggetsTab(data.projectId);
        })
        EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET, ({projectId, sprintId}: {projectId: number, sprintId: number}) => { 
            this.setReleasedSprintNuggetsTab(projectId, sprintId);
        })
        EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET, ({projectId, sprintId}: {projectId: number, sprintId: number}) => { 
            this.setBackloggedSprintNuggets(projectId, sprintId);
        })
        EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET, ({projectId, sprintId}: {projectId: number, sprintId: number}) => { 
            this.setActiveSprintNuggets(projectId, sprintId);
        })

        const activateTab = this.activeTab
        this.activeTab = activateTab
    }

    getProjectNuggetTooltip(projectId: number) {
        const project = ProjectDSModule.items[projectId];
        if(project) {
            return project.title;
        }
        return null;
    }

    getSprintNuggetTooltip(sprintId: number, projectId: number) {
        const project = ProjectDSModule.items[projectId];
        const sprint = SprintsViewDSModule.items[sprintId];

        if(project && sprint) {
            return `${project.title}: ${sprint.name}`;
        }
        return null;
    }

    setProjectNuggetsTab(projectId: number) {
        this.selectedDynamicID = `${TAB_PROJECTS_ID.PROJECT_NUGGET}-${projectId}`;
        this.addDynamicTab({ 
            id: this.selectedDynamicID,
            label: ProjectDSModule.items[projectId].projectNumber, 
            hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTNUGGETS),
            tooltip: this.getProjectNuggetTooltip(projectId),
            closable: true
        })
    }

    setReleasedSprintNuggetsTab(projectId: number, sprintId: number) {
        this.selectedDynamicID = `${TAB_PROJECTS_ID.RELEASED}${TAB_PROJECTS_ID.SPRINT_NUGGET}-${sprintId}`;
        this.addDynamicTab({ 
            id: this.selectedDynamicID,
            label: `${ProjectDSModule.items[projectId]?.projectNumber}-${SprintsViewDSModule.items[sprintId]?.sprintNumber}`,
            hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS),
            tooltip: this.getSprintNuggetTooltip(projectId, sprintId),
            closable: true
        })
    }

    setBackloggedSprintNuggets(projectId: number, sprintId: number) {
        this.selectedDynamicID = `${TAB_PROJECTS_ID.BACKLOGGED}${TAB_PROJECTS_ID.SPRINT_NUGGET}-${sprintId}`;
        this.addDynamicTab({ 
            id: this.selectedDynamicID,
            label: `${ProjectDSModule.items[projectId]?.projectNumber}-${SprintsViewDSModule.items[sprintId]?.sprintNumber}`,
            hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS),
            tooltip: this.getSprintNuggetTooltip(projectId, sprintId),
            closable: true
        })
    }

    setActiveSprintNuggets(projectId: number, sprintId: number) {
        this.selectedDynamicID = `${TAB_PROJECTS_ID.ACTIVE}${TAB_PROJECTS_ID.SPRINT_NUGGET}-${sprintId}`;
        this.addDynamicTab({ 
            id: this.selectedDynamicID,
            label: `${ProjectDSModule.items[projectId]?.projectNumber}-${SprintsViewDSModule.items[sprintId]?.sprintNumber}`,
            hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS),
            tooltip: this.getSprintNuggetTooltip(projectId, sprintId),
            closable: true
        })
    }

    beforeDestroy() {
        EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_PROJECT_NUGGET);
        EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET);
        EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET);
        EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET);
    }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
::v-deep {
    .tabs-bar {
        .core-btn {
            width: $module-tab-width;
        }
    }
}
</style>
