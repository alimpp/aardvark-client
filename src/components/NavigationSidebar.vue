<template>
    <div>
        <CoreSidebar id="sidebar" expand-on-hover mini :mini-width="63" :width="180" class="h-100"
            :loading="$wait.is('navigationbar loading')" :debounce-time="350">
            <CoreScrollbar class="maz-p-2 maz-flex maz-direction-column" size="thin" suppressScrollX showOnHover>
                <div
                    class="profile maz-flex maz-align-center maz-border-color maz-border-bottom maz-border-bottom-solid">
                    <CoreAvatar :src="profileUrl" :username="fullName" :size="46" />
                    <p class="maz-ml-4 maz-dots-text" v-if="isOpen">
                        <strong> {{ username }} </strong>
                        <br>
                        <span>{{ accountName }}</span>
                    </p>
                </div>
                <CoreBtn
                        class="module-button ml-n3 compose"
                        color="transparent"
                        justify-start
                        left-icon-name="add_box"
                        @click="loadNuggetDialog"
                        no-shadow>
                    <span class="maz-ml-4" v-if="isOpen">Compose</span>
                </CoreBtn>
                <div class="maz-border-color maz-border-bottom maz-border-bottom-solid margin-t-b" />

                <CoreBtn v-if="canViewInbox" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="inbox" :active="isInboxSelected" @click="inboxClick" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="inboxCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Inbox</span>
                </CoreBtn>

                <CoreBtn class="module-button ml-n3" color="transparent" justify-start left-icon-name="groups"
                    :active="isGroupSelected" @click="groupsClick" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="groupsCount"
                        class="badge position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Channels</span>
                </CoreBtn>

                <CoreBtn v-if="canViewPeople" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="people_alt" :active="isPeopleSelected" @click="peopleClick" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="peopleCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">People</span>
                </CoreBtn>

                <CoreBtn v-if="canViewNuggets" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="widgets" @click="nuggetClick" :active="isNuggetSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="nuggetCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">My Nuggets</span>
                </CoreBtn>

                <div class="maz-border-color maz-border-bottom maz-border-bottom-solid margin-t-b"
                    v-if="canViewInbox || canViewPeople || canViewNuggets" />

                <CoreBtn v-if="canViewLead" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="thumbs_up_down" @click="leadClick" :active="isLeadSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="leadCount" class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Team Lead</span>
                </CoreBtn>

                <CoreBtn v-if="canViewAssignment" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="assignment" @click="assignmentClick" :active="isAssignmentSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="assignmentCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Assignments</span>
                </CoreBtn>

                <div class="maz-border-color maz-border-bottom maz-border-bottom-solid margin-t-b"
                    v-if="canViewLead || canViewAssignment" />

                <CoreBtn v-if="canViewGoodnews" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="thumb_up" @click="goodNewsClick" :active="isGoodNewsSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="goodNewsCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Good News</span>
                </CoreBtn>

                <CoreBtn v-if="canViewBadnews" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="thumb_down" @click="badNewsClick" :active="isBadNewsSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="badNewsCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Bad News</span>
                </CoreBtn>

                <CoreBtn v-if="canViewProjects" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="storage" @click="projectsClick" :active="isProjectSelected" no-shadow>
                    <CoreBadgeCount counterPadding="0px" :count="projectsCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Dashboard</span>
                </CoreBtn>

                <CoreBtn v-if="canViewReport" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="summarize" :active="isReportSelected" @click="reportClick" no-shadow>
                    <span class="maz-ml-4" v-if="isOpen">Report</span>
                </CoreBtn>

                <div class="maz-border-color maz-border-bottom maz-border-bottom-solid margin-t-b"
                    v-if="canViewGoodnews || canViewBadnews || canViewProjects || canViewReport" />

                <CoreBtn v-if="canViewReleases" class="module-button ml-n3" color="transparent" justify-start
                    @click="releasesClick" :active="isReleaseSelected" no-shadow>
                    <div class="maz-flex maz-flex-center maz-btn__icon-left maz-mr-2">
                        <ReleasesIcon width="27px" height="35px"
                            customClassName="maz-flex maz-flex-center maz-btn__icon-left" />
                    </div>
                    <CoreBadgeCount counterPadding="0px" :count="releasesCount"
                        class="badge  position-static badge-text" />
                    <span class="maz-ml-4" v-if="isOpen">Releases</span>
                </CoreBtn>

                <div v-if="canViewReleases"
                    class="maz-border-color maz-border-bottom maz-border-bottom-solid margin-t-b" />

                <CoreBtn v-if="canViewSettings" class="module-button ml-n3" color="transparent" justify-start
                    left-icon-name="settings" :active="isSettingsSelected" @click="settingsClick" no-shadow>
                    <span class="maz-ml-4" v-if="isOpen">Settings</span>
                </CoreBtn>

                <CoreBtn class="module-button ml-n3 flex-end" color="transparent" justify-start
                    left-icon-name="power_settings_new" no-shadow @click="logOut">
                    <span class="maz-ml-4" v-if="isOpen">Logout</span>
                </CoreBtn>
            </CoreScrollbar>
        </CoreSidebar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MazAvatar } from 'maz-ui'
import { AccountDSModule, ApplicationDSModule, DialogCSModule, PermissionDSModule, ProfileDSModule } from '@/store'
import { Getter } from "vuex-class";
import CoreBadgeCount from "@/components/Core/CoreBadgeCount.vue";
import { ModuleName } from '@/store/modules/datastore/applicationDS'
import CoreBtn from '@/components/Core/CoreBtn.vue'
import CoreSidebar from '@/components/Core/CoreSidebar.vue'
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import { EventBus } from "@/utils/eventBus";
import { EVENTS } from "@/utils/constants";
import { Actions, Subjects } from '@/store/modules/datastore/permissionDS';
import ReleasesIcon from '@/components/Icons/ReleasesIcon.vue';
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";
import { ModuleTabName } from "@/store/modules/datastore/applicationDS";
import CreateNuggetForm from './Form/CreateNuggetForm.vue';
import { ProjectDSModule } from "@/store";

@Component({
    name: 'NavigationSidebar',
    components: { CoreSidebar, MazAvatar, CoreBtn, CoreBadgeCount, CoreAvatar, ReleasesIcon, CoreScrollbar }
})
export default class NavigationSidebar extends Vue {
    isOpen = true;
    @Getter('nuggetCount', { namespace: 'badgecountcs' }) nuggetCount!: number;
    @Getter('assignmentCount', { namespace: 'badgecountcs' }) assignmentCount!: number;
    @Getter('leadCount', { namespace: 'badgecountcs' }) leadCount!: number;
    @Getter('goodNewsCount', { namespace: 'badgecountcs' }) goodNewsCount!: number;
    @Getter('badNewsCount', { namespace: 'badgecountcs' }) badNewsCount!: number;
    @Getter('subscriptionsCount', { namespace: 'badgecountcs' }) subscriptionsCount!: number;
    @Getter('nuggetsCount', { namespace: 'badgecountcs' }) nuggetsCount!: number;
    @Getter('projectsCount', { namespace: 'badgecountcs' }) projectsCount!: number;
    @Getter('releasesCount', { namespace: 'badgecountcs' }) releasesCount!: number;
    @Getter('peopleCount', { namespace: 'badgecountcs' }) peopleCount!: number;
    @Getter('groupsCount', { namespace: 'badgecountcs' }) groupsCount!: number;
    @Getter('inboxCount', { namespace: 'badgecountcs' }) inboxCount!: number;
    @Getter('profileUrl', { namespace: 'profileds' }) profileUrl: string | undefined;
    @Getter('fullName', { namespace: 'profileds' }) fullName!: string

    inboxClick(): void {
        if (ApplicationDSModule.selectedModule !== ModuleName.inbox) {
            if (ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxSprintNuggets) {
                this.$router.push({ name: 'Inbox', params: { sprintId: `${ApplicationDSModule.selectedSprintsViewID}`, projectId: `${ApplicationDSModule.selectedProjectID}` } })
            } else if (ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxProjectNuggets) {
                this.$router.push({ name: 'Inbox', params: { projectId: `${ApplicationDSModule.selectedProjectID}` } })
            } else if (ApplicationDSModule.selectedModuleTabInbox === ModuleTabName.inboxReleaseNuggets) {
                this.$router.push({ name: 'Inbox', params: { releaseId: `${ApplicationDSModule.selectedReleaseID}` } })
            } else {
                this.$router.push({ name: 'Inbox' })
            }
        }
    }


    peopleClick(): void {
        if (ApplicationDSModule.selectedModule !== ModuleName.people) {
            this.$router.push({ name: 'People' });
        }
    }

    groupsClick(): void {
        if (ApplicationDSModule.selectedModule !== ModuleName.groups) {
            this.$router.push({ name: 'GroupChat' });
        }
    }

    nuggetClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.nugget)
        if (ApplicationDSModule.selectedModule !== ModuleName.nugget) {
            this.$router.push({ name: 'Nugget' })
        }
    }

    assignmentClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.assignment)
        if (ApplicationDSModule.selectedModule !== ModuleName.assignment) {
            this.$router.push({ name: 'Assignment' })
        }
    }

    leadClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.lead)
        if (ApplicationDSModule.selectedModule !== ModuleName.lead) {
            this.$router.push({ name: 'Lead' })
        }
    }

    goodNewsClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.goodNews)
        if (ApplicationDSModule.selectedModule !== ModuleName.goodNews) {
            this.$router.push({ name: 'GoodNews' })
        }
    }
    badNewsClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.badNews)
        if (ApplicationDSModule.selectedModule !== ModuleName.badNews) {
            this.$router.push({ name: 'BadNews' })
        }
    }

    settingsClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.settings)
        if (ApplicationDSModule.selectedModule !== ModuleName.settings) {
            this.$router.push({ name: 'Settings' });
        }
    }

    projectsClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.projects)
        if (ApplicationDSModule.selectedModule !== ModuleName.projects) {
            if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsSprintNugget) {
                this.$router.push({ name: 'Projects', params: { sprintId: `${ApplicationDSModule.selectedSprintsViewID}`, projectId: `${ApplicationDSModule.selectedProjectID}` } })
            } else if (ApplicationDSModule.selectedModuleTabProjects === ModuleTabName.projectsProjectNugget) {
                this.$router.push({ name: 'Projects', params: { projectId: `${ApplicationDSModule.selectedProjectID}` } })
            } else {
                this.$router.push({ name: 'Projects' })
            }
        }
    }
    

    releasesClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.releases)
        if (ApplicationDSModule.selectedModule !== ModuleName.releases) {
            this.$router.push({ name: 'Releases' })
        }
    }

    reportClick() {
        EventBus.$emit(EVENTS.CLICK_MODULE, ModuleName.report)
        if (ApplicationDSModule.selectedModule !== ModuleName.report) {
            this.$router.push({ name: 'Report' })
        }
    }

    get isInboxSelected(): boolean {
        return ApplicationDSModule.selectedModule == ModuleName.inbox
    }


    get accountName() {
        return AccountDSModule.selectedAccount.name.capitalize()
    }

    get username() {
        return ProfileDSModule.displayName
    }

    get isNuggetSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.nugget
    }

    get isAssignmentSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.assignment
    }

    get isLeadSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.lead
    }

    get isGoodNewsSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.goodNews
    }

    get isBadNewsSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.badNews
    }

    get isSubscriptionsSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.subscriptions
    }

    get isNuggetsSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.nuggets
    }

    get isProjectSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.projects
    }

    get isReleaseSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.releases
    }

    get isReportSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.report
    }

    get isSettingsSelected() {
        return ApplicationDSModule.selectedModule == ModuleName.settings
    }

    get isPeopleSelected(): boolean {
        return ApplicationDSModule.selectedModule == ModuleName.people
    }

    get isGroupSelected(): boolean {
        return ApplicationDSModule.selectedModule == ModuleName.groups
    }

    get canViewInbox() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.INBOX);
    }

    get canViewPeople() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.PEOPLE);
    }

    get canViewNuggets() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS);
    }

    get canViewAssignment() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT);
    }

    get canViewLead() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.LEAD);
    }

    get canViewGoodnews() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS);
    }

    get canViewBadnews() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS);
    }

    get canViewProjects() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS);
    }

    get canViewReleases() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES);
    }

    get canViewReport() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.REPORT);
    }

    get canViewSettings() {
        return PermissionDSModule.can(Actions.VIEW, Subjects.SETTINGS);
    }

    logOut() {
        this.$wait.start('navigationbar loading')
        ApplicationDSModule.invalidateToken()
        ApplicationDSModule.redirectToCAS()
    }

    loadNuggetDialog() {
        const projects = ProjectDSModule.sortedItems('title')?.filter(item => item.status === 'active');
        if (typeof projects === 'undefined' || projects.length == 0) {
            Vue.swal({
                title: "Please create a project first",
                heightAuto: false
            })
        } else {
            DialogCSModule.load({
                title: `Create Nugget`,
                isShowingDialog: true,
                noClose: true,
                confirmLabel: "Create",
                width: 800,
                content: CreateNuggetForm,
            });
        }

    }

}
</script>

<style lang="scss">
#sidebar {
    .profile {
        padding-bottom: 12px;
        margin-bottom: 8px;
    }

        .module-button {
            min-height: 46px;
            transition-duration: 0.1s;
            padding-right: 42px;
            &:hover {
                background-color: var(--primary-color);
            }
        }

        .compose{
            i {
                color: var(--brand-color);
            }
            &:focus{
                background: transparent;
                box-shadow: none;
            }
        }

    transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
    transition-duration: 0.1s;
    background-color: var(--second-color);

    button {
        margin-bottom: 6px;
    }

    .maz-active {
        box-shadow: var(--navigation-sidebar-btn-selected-border);
        background-color: var(--primary-color);
    }

    .badge {
        margin-left: -1.2rem;
    }

    .margin-t-b {
        margin: 4px 0 8px;
    }

}

// .maz-sidebar__wrapper {

// }
</style>
