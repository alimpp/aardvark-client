<template>
    <div id="app" :class="[{'maz-is-dark': isDarkMode}]" :theme="themeAttribute">
        <Header />
        <div id="main-container" class="d-flex max-height overflow-hidden">
            <NavigationSidebar v-if="isAuthenticated"/>
            <div id="router" class="h-100 w-100">
                <keep-alive>
                    <router-view :class="widthClass" :style="{'width': isMobileScreenSize ? null : `calc(100vw - 63px - ${detailSidebarWidth}px)`}" class="maz-h-100"/>
                </keep-alive>
            </div>
            <ChatSidebar v-if="showRightSidebar"/>
            <DetailSidebar v-if="showRightSidebar"/>
            <GlobalDialog />
            <ScreenRecorder/>
            <GlobalVideoConference/>
        </div>
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import {
        ApplicationDSModule,
        BadgeCountCSModule,
        DirectDSModule,
        GroupDetailsDSModule,
        ProjectsSprintNuggetCSModule,
        ProjectsProjectNuggetCSModule,
        InboxSprintNuggetsCSModule,
        InboxProjectNuggetsCSModule,
        InboxReleaseNuggetsCSModule
    } from "@/store";
    import {Getter, State} from "vuex-class";
    import ScreenRecorder from "@/components/ScreenRecorder.vue";
    import Header from "@/components/Header.vue";
    import GlobalDialog from "@/components/GlobalDialog.vue";
    import {ModuleName} from "@/store/modules/datastore/applicationDS";
    import {EventBus} from "@/utils/eventBus";
    import {EVENTS} from "@/utils/constants";
    import 'simplebar-core/dist/simplebar.css';
    import GlobalVideoConference from '@/components/GlobalVideoConference.vue'

    @Component({
        name: 'App',
        components: {
            ChatSidebar: () => import(/* webpackChunkName: "chatSidebar" */ '@/components/ChatSidebar.vue'),
            DetailSidebar: () => import(/* webpackChunkName: "detailSidebar" */ '@/components/DetailSidebar.vue'),
            NavigationSidebar: () => import(/* webpackChunkName: "navigationSidebar" */ '@/components/NavigationSidebar.vue'),
            Header,
            GlobalDialog,
            GlobalVideoConference,
            ScreenRecorder
        }
    })

    export default class extends Vue {
        @Getter('isAuthenticated', {namespace: 'applicationds'}) isAuthenticated!: boolean;
        @State('isDarkMode', {namespace: 'profileds'}) isDarkMode!: boolean;
        @State('detailSidebarWidth', {namespace: 'applicationds'}) detailSidebarWidth!: number;
        @State('isMobileScreenSize', {namespace: 'applicationds'}) isMobileScreenSize!: boolean;
        badgetimer?: number;

        get widthClass(){
            if (ApplicationDSModule.isMobileScreenSize){
                return 'max-width'
            }

            return 'max-width-with-detail-sidebar'
        }

        get showRightSidebar() {
            return this.isAuthenticated && ApplicationDSModule.selectedModule !== ModuleName.none && ApplicationDSModule.selectedModule !== ModuleName.settings && ApplicationDSModule.selectedModule !== ModuleName.people && ApplicationDSModule.selectedModule !== ModuleName.groups
        }

        get themeAttribute() {
            return this.isDarkMode ? 'dark' : 'light'
        }

        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
            if(ApplicationDSModule.isMobileScreenSize){
                ApplicationDSModule.setDetailSidebarOpen(false)
            }
            if (document.readyState !== "complete") {
                this.$wait.start('navigationbar loading')
            }
            document.onreadystatechange = () => {
                if (document.readyState === "complete") {
                    this.$wait.end('navigationbar loading')
                }else {
                    this.$wait.start('navigationbar loading')
                }
            }
        }

        mounted() {
            EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_PROJECT_NUGGET, (data: {projectId: any}) => {
                ProjectsProjectNuggetCSModule.clear();
                this.$route.name !== 'ProjectsProjectNugget' ? this.$router.push({name: 'ProjectsProjectNugget', params: {projectId: `${data.projectId}`}}) : null
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET, (data: {projectId: number, sprintId: number}) => {
                const {projectId, sprintId} = data;
                ProjectsSprintNuggetCSModule.clear()
                this.$route.name !== 'ProjectsActiveSprintNugget' ? this.$router.push({name: 'ProjectsActiveSprintNugget', params: {projectId: `${projectId}`, sprintId: `${sprintId}`}}) : null
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET, (data: {projectId: number, sprintId: number}) => {
                const {projectId, sprintId} = data;
                ProjectsSprintNuggetCSModule.clear()
                this.$route.name !== 'ProjectsBackloggedSprintNugget' ? this.$router.push({name: 'ProjectsBackloggedSprintNugget', params: {projectId: `${projectId}`, sprintId: `${sprintId}`}}) : null
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET, (data: {projectId: number, sprintId: number}) => {
                const {projectId, sprintId} = data;
                ProjectsSprintNuggetCSModule.clear()
                this.$route.name !== 'ProjectsReleasedSprintNugget' ? this.$router.push({name: 'ProjectsReleasedSprintNugget', params: {projectId: `${projectId}`, sprintId: `${sprintId}`}}) : null
            })
            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_SPRINT_NUGGETS, (data: {projectId: number, sprintId: number}) => {
                const {projectId, sprintId} = data;
                InboxSprintNuggetsCSModule.clear()
                this.$route.name !== 'InboxSprintNuggets' ? this.$router.push({name: 'InboxSprintNuggets', params: {projectId: `${projectId}`, sprintId: `${sprintId}`}}) : null
            })

            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_PROJECT_NUGGETS, (data: {projectId: number}) => {
                const {projectId} = data;
                InboxProjectNuggetsCSModule.clear()
                this.$route.name !== 'InboxProjectNuggets' ? this.$router.push({name: 'InboxProjectNuggets', params: {projectId: `${projectId}`}}) : null
            })

            EventBus.$on(EVENTS.ROUTER_PUSH_INBOX_RELEASE_NUGGETS, (data: {releaseId: number }) => {
                const {releaseId } = data;
                InboxReleaseNuggetsCSModule.clear()
                this.$route.name !== 'InboxReleaseNuggets' ? this.$router.push({name: 'InboxReleaseNuggets', params: {releaseId: `${releaseId}` }}) : null
            })
            if(ApplicationDSModule.isAuthenticated) {
                Promise.allSettled([GroupDetailsDSModule.doLoad(), DirectDSModule.doLoad()])
            }

            const badgeRefresh = function(){
                if(ApplicationDSModule.isAuthenticated) {
                    ApplicationDSModule.doCheckVersion()
                    Promise.allSettled([BadgeCountCSModule.doLoad()])
                }
            }

            //Lets refresh badges if this is first time page is loading but user is authenticated already
            window.setTimeout(()=> {badgeRefresh()}, 2000);
        }

        beforeDestroy() {
            EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_PROJECT_NUGGET)
            EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET)
            EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET)
            EventBus.$off(EVENTS.ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET)
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_SPRINT_NUGGETS)
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_PROJECT_NUGGETS)
            EventBus.$off(EVENTS.ROUTER_PUSH_INBOX_RELEASE_NUGGETS)
        }

        destroyed() {
            window.removeEventListener('resize', this.handleResize);
            window.clearInterval(this.badgetimer)
        }

        handleResize() {
            if (window.innerWidth <= 768) {
                ApplicationDSModule.setIsMobileScreenSize(true)
            } else {
                ApplicationDSModule.setIsMobileScreenSize(false)
            }
        }

    }


</script>

<style lang="scss">
    /*#main-container{*/
    /*    position: relative;*/
    /*}*/
</style>
