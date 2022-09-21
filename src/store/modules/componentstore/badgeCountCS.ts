import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store, { BadgeCountCSModule, DolphinSocketDSModule, PermissionDSModule, ProfileDSModule } from '@/store'
import BadgeCountAPI from '@/api/badgeCountAPI'
import MessageBadgeCountAPI from '@/api/messageBadgeCountAPI'
import { Actions, Subjects } from '../datastore/permissionDS'
import CountsDM from '@/datamodels/countsDM'
import {SOCKET_EVENTS} from '@/utils/constants'
import {PreventNegativeValue} from '@/utils/decorator'
import VisibilityStateEventEmitter from '@/utils/services/VisibilityStateEventEmitter'
import dayjs from 'dayjs'

@Module({ name: 'badgecountcs', namespaced: true })
export class BadgeCountCS extends VuexModule implements IBadgeCountCS {
    nuggetUnread = 0
    nuggetLastThirtyDays = 0
    nuggetSubscribed = 0
    nuggetReleased = 0
    assignmentInProgress = 0
    assignmentInProgressDue = 0
    assignmentUpcoming = 0
    assignmentNeedEstimate = 0
    assignmentUpcomingEstimates = 0
    assignmentCompleted = 0
    goodNewsTriage = 0
    goodNewsNeedApproval = 0
    goodNewsScrum = 0
    goodNewsBacklog = 0
    goodNewsUpcoming = 0
    goodNewsProduction = 0
    goodNewsArchive = 0
    badNewsDelayedNuggets = 0
    badNewsOverdueTimecard = 0
    badNewsOverdueEstimate = 0
    badNewsOverdueTriage = 0
    projectsActive = 0
    projectsBackloggedSprints = 0
    projects = 0
    projectsReleased = 0
    releases = 0
    releasesActive = 0
    releasesReleased = 0
    peopleUnread = 0
    groupsUnread = 0
    nuggetSearch = 0
    projectsNugget = 0
    leadNeedApproval = 0
    leadDelayedNuggets = 0
    leadOverdueEstimate = 0
    leadOverdueJournal = 0
    leadJournalReport = 0
    inboxNugget   = 0
    inboxProjects = 0
    inboxSprints  = 0
    inboxReleases = 0
    inboxNuggetUnread   = 0
    inboxProjectsUnread = 0
    inboxSprintsUnread  = 0
    inboxReleasesUnread = 0

    private dolphinPollingIntervalID: number | null = null;
    private dolphinPollingIntervalTime = 30000;
    private jaguarPollingIntervalID: number | null = null;
    private jaguarPollingIntervalTime = 30000;
    private badgecountPollingIntervalID: number | null = null;
    private badgecountPollingIntervalTime = 60000;

    @Mutation
    @PreventNegativeValue()
    setInboxNuggetUnread(count: number){
        this.inboxNuggetUnread = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxProjectsUnread(count: number){
        this.inboxProjectsUnread = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxSprintsUnread(count: number){
        this.inboxSprintsUnread = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxReleasesUnread(count: number){
        this.inboxReleasesUnread = count
    }


    @Mutation
    @PreventNegativeValue()
    setInboxNugget(count: number){
        this.inboxNugget = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxProjects(count: number){
        this.inboxProjects = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxSprints(count: number){
        this.inboxSprints = count
    }

    @Mutation
    @PreventNegativeValue()
    setInboxReleases(count: number){
        this.inboxReleases = count
    }


    @Mutation
    @PreventNegativeValue()
    setNuggetUnread(count: number) {
        this.nuggetUnread = count
    }

    @Mutation
    @PreventNegativeValue()
    setNuggetLastThirtyDays(count: number) {
        this.nuggetLastThirtyDays = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentInProgress(count: number) {
        this.assignmentInProgress = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentInProgressDue(count: number) {
        this.assignmentInProgressDue = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentUpcoming(count: number) {
        this.assignmentUpcoming = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentNeedEstimate(count: number) {
        this.assignmentNeedEstimate = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentUpcomingEstimates(count: number) {
        this.assignmentUpcomingEstimates = count
    }

    @Mutation
    @PreventNegativeValue()
    setAssignmentCompleted(count: number) {
        this.assignmentCompleted = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsTriage(count: number) {
        this.goodNewsTriage = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsNeedApproval(count: number) {
        this.goodNewsNeedApproval = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodScrumReported(count: number) {
        this.goodNewsScrum = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsBacklog(count: number) {
        this.goodNewsBacklog = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsUpcoming(count: number) {
        this.goodNewsUpcoming = count
    }

    @Mutation
    @PreventNegativeValue()
    setBadNewsDelayedNuggets(count: number) {
        this.badNewsDelayedNuggets = count
    }

    @Mutation
    @PreventNegativeValue()
    setBadNewsOverdueTimecard(count: number) {
        this.badNewsOverdueTimecard = count
    }

    @Mutation
    @PreventNegativeValue()
    setBadNewsOverdueEstimate(count: number) {
        this.badNewsOverdueEstimate = count
    }

    @Mutation
    @PreventNegativeValue()
    setBadNewsOverdueTriage(count: number) {
        this.badNewsOverdueTriage = count
    }

    @Mutation
    @PreventNegativeValue()
    setReleasesActive(count: number) {
        this.releasesActive = count
    }

    @Mutation
    @PreventNegativeValue()
    setReleasesReleased(count: number) {
        this.releasesReleased = count
    }


    @Mutation
    @PreventNegativeValue()
    setReleases(count: number) {
        this.releases = count
    }

    @Mutation
    @PreventNegativeValue()
    setPeopleUnread(count: number) {
        this.peopleUnread = count;
    }

    @Mutation
    @PreventNegativeValue()
    setGroupsUnread(count: number) {
        this.groupsUnread = count;
    }

    @Mutation
    @PreventNegativeValue()
    setNuggetSearch(count: number) {
        this.nuggetSearch = count
    }

    @Mutation
    @PreventNegativeValue()
    setNuggetReleased(count: number) {
        this.nuggetReleased = count
    }

    @Mutation
    @PreventNegativeValue()
    setNuggetSubscribed(count: number) {
        this.nuggetSubscribed = count
    }

    @Mutation
    @PreventNegativeValue()
    setProjectsActive(count: number) {
        this.projectsActive = count
    }

    @Mutation
    @PreventNegativeValue()
    setProjectsBackloggedSprints(count: number) {
        this.projectsBackloggedSprints = count
    }

    @Mutation
    @PreventNegativeValue()
    setProjects(count: number) {
        this.projects = count
    }

    @Mutation
    @PreventNegativeValue()
    setProjectsReleased(count: number) {
        this.projectsReleased = count
    }

    @Mutation
    @PreventNegativeValue()
    setProjectsNugget(count: number) {
        this.projectsNugget = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsProduction(count: number) {
        this.goodNewsProduction = count
    }

    @Mutation
    @PreventNegativeValue()
    setGoodNewsArchive(count: number) {
        this.goodNewsArchive = count
    }

    @Mutation
    @PreventNegativeValue()
    setLeadNeedApproval(count: number) {
        this.leadNeedApproval = count
    }

    @Mutation
    @PreventNegativeValue()
    setLeadDelayedNuggets(count: number) {
        this.leadDelayedNuggets = count
    }

    @Mutation
    @PreventNegativeValue()
    setLeadOverdueEstimate(count: number) {
        this.leadOverdueEstimate = count
    }

    @Mutation
    @PreventNegativeValue()
    setLeadOverdueJournal(count: number) {
        this.leadOverdueJournal = count
    }

    @Mutation
    @PreventNegativeValue()
    setLeadJournalReport(count: number) {
        this.leadJournalReport = count
    }

    @Mutation
    setCountsFromDM(counts: CountsDM) {
        for(const entity of Object.keys(counts).filter(key => !key.includes('__'))) {
            for(const key in counts[entity]) {
                this[key] = counts[entity][key];
            }
        }
    }

    @Mutation
    setDolphinPollingIntervalID(id: number | null) {
        this.dolphinPollingIntervalID = id;
    }

    @Mutation
    setJaguarPollingIntervalID(id: number | null) {
        this.jaguarPollingIntervalID = id;
    }

    @Mutation
    setBadgecountPollingIntervalID(id: number | null) {
        this.badgecountPollingIntervalID = id;
    }

    get nuggetCount() {
        return 0;
    }

    get assignmentCount() {
        return (
            this.assignmentInProgressDue +
            this.assignmentNeedEstimate
        )

    }

    get leadCount() {
        return this.leadDelayedNuggets +
            this.leadJournalReport +
            this.leadNeedApproval +
            this.leadOverdueJournal +
            this.leadOverdueEstimate;

    }

    get goodNewsCount() {
        return (
            this.goodNewsTriage +
            this.goodNewsNeedApproval
        )

    }

    get badNewsCount() {
        return (
            this.badNewsOverdueTimecard +
            this.badNewsOverdueEstimate +
            this.badNewsOverdueTriage +
            this.badNewsDelayedNuggets
        )

    }

    get subscriptionsCount() {
        return 0
    }

    get nuggetsCount() {
        return 0
    }

    get projectsCount() {
        return 0
    }

    get releasesCount() {
        return this.releases
    }

    get peopleCount() {
        return this.peopleUnread
    }

    get groupsCount() {
        return this.groupsUnread
    }

    get inboxCount() {
        return (
            this.inboxReleasesUnread +
            this.inboxSprintsUnread +
            this.inboxNuggetUnread +
            this.inboxProjectsUnread
        )
    }

    @Action({rawError: true})
    private async refreshDolphinBadges() {
        await Promise.allSettled([
            this.loadNugget(),
            this.loadAssignment(),
            this.loadLead(),
            this.loadGoodNews(),
            this.loadBadNews(),
            this.loadProject(),
            this.loadRelease(),
            this.loadInbox()
        ]);
    }

    @Action({rawError: true})
    private async refreshJaguarBadges() {
        await this.loadMessages();
    }

    @Action({rawError: true})
    private async createDolphinPolling() {
        if(!this.dolphinPollingIntervalID) {
            this.setDolphinPollingIntervalID(window.setInterval(this.refreshDolphinBadges, this.dolphinPollingIntervalTime));
        }
    }

    @Action({rawError: true})
    private async destroyDolphinPolling() {
        if(this.dolphinPollingIntervalID) {
            window.clearInterval(this.dolphinPollingIntervalID);
            this.setDolphinPollingIntervalID(null);
        }
    }

    @Action({rawError: true})
    private async createJaguarPolling() {
        if(!this.jaguarPollingIntervalID) {
            this.setJaguarPollingIntervalID(window.setInterval(this.refreshJaguarBadges, this.jaguarPollingIntervalTime));
        }
    }

    @Action({rawError: true})
    private async destroyJaguarPolling() {
        if(this.jaguarPollingIntervalID) {
            window.clearInterval(this.jaguarPollingIntervalID);
            this.setJaguarPollingIntervalID(null);
        }
    }

    @Action({rawError: true})
    private async createWebsocketBadgecountPolling() {
        if (this.badgecountPollingIntervalID !== null) {
            await this.destroyWebsocketBadgecountPolling();
        }
        this.requestWebsocketBadgecounts();
        this.setBadgecountPollingIntervalID(window.setInterval(this.requestWebsocketBadgecounts, this.badgecountPollingIntervalTime));
    }

    @Action({rawError: true})
    private async destroyWebsocketBadgecountPolling() {
        if(this.badgecountPollingIntervalID) {
            window.clearInterval(this.badgecountPollingIntervalID);
            this.setBadgecountPollingIntervalID(null);
        }
    }

    @Action({rawError: true})
    private async requestWebsocketBadgecounts() {
        DolphinSocketDSModule.loadBadgeCounts();
    }

    @Action({rawError: true})
    async initVisibilityStateChangeObserver() {
        VisibilityStateEventEmitter.subscribe(({ hiddenAt, visibilityState }) => {
            if (visibilityState === 'visible' && hiddenAt) {
                const minutesHidden = dayjs().diff(hiddenAt, 'minute');
                if (minutesHidden >= 1) {
                    this.refreshJaguarBadges();
                }
            }
        });
    }

    @Action({ rawError: true })
    onInitialization() {
        this.initVisibilityStateChangeObserver();
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.dolphinSocket
            },
            async function onChange(socket) {
                if(socket && socket.registerEventCallback) {
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.OFFLINE,
                        callback: () => {
                            BadgeCountCSModule.createDolphinPolling();
                            BadgeCountCSModule.destroyWebsocketBadgecountPolling();
                        }
                    });
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.ONLINE,
                        callback: () => {
                            BadgeCountCSModule.destroyDolphinPolling();
                            BadgeCountCSModule.createWebsocketBadgecountPolling();
                        }
                    });
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.RECONNECT,
                        callback: () => BadgeCountCSModule.refreshDolphinBadges()
                    });
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.jaguarSocket
            },
            async function onChange(socket) {
                if(socket && socket.registerEventCallback) {
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.OFFLINE,
                        callback: () => BadgeCountCSModule.createJaguarPolling()
                    });
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.ONLINE,
                        callback: () => BadgeCountCSModule.destroyJaguarPolling()
                    });
                    socket.registerEventCallback({
                        event: SOCKET_EVENTS.RECONNECT,
                        callback: () => BadgeCountCSModule.refreshJaguarBadges()
                    });
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.counts
            },
            async function onChange(counts) {
                BadgeCountCSModule.setCountsFromDM(counts);
            }
        );
    }

    @Action({rawError: true})
    async loadInbox() {
        const {data} = await BadgeCountAPI.PATCH(({data: [
            {path: `nuggets/counts?zone=unread`, op: 'get', value: null},
            {path: `projectdetails/counts?zone=unread`, op: 'get', value: null},
            {path: `sprintdetails/counts?zone=unread`, op: 'get', value: null},
            {path: `releasedetails/counts?zone=unread`, op: 'get', value: null},
                // {path: `nuggets/counts?zone=inbox`, op: 'get', value: null},
                // {path: `projectdetails/counts?zone=inbox`, op: 'get', value: null},
                // {path: `sprintdetails/counts?zone=inbox`, op: 'get', value: null},
                // {path: `releasedetails/counts?zone=inbox`, op: 'get', value: null}
        ]}))
        this.setInboxNuggetUnread(data[0].count)
        this.setNuggetUnread(data[0].count)
        this.setInboxProjectsUnread(data[1].count)
        this.setInboxSprintsUnread(data[2].count)
        this.setInboxReleasesUnread(data[3].count)
        // this.setInboxNugget(data[4].count)
        // this.setInboxProjects(data[5].count)
        // this.setInboxSprints(data[6].count)
        // this.setInboxReleases(data[7].count)

    }

    @Action({ rawError: true })
    async loadMessages() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.PEOPLE)){
            const { data } = await MessageBadgeCountAPI.PATCH(({data: [
                { path: 'rooms/unreadcounts', op: 'get', value: null },
            ]}))
            this.setPeopleUnread(data[0].directUnreadCount)
            this.setGroupsUnread(data[0].groupUnreadCount)
        }
    }


    @Action({ rawError: true })
    async loadNugget() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS)) {
            // const { data } = await BadgeCountAPI.PATCH(({data: [
            // { path: 'nuggets/counts?unread=true', op: 'get', value: null },
            // { path: `nuggets/counts?zone=nuggetlastthirtydays`, op: 'get', value: null },
            // { path: 'nuggets/counts?zone=subscribed', op: 'get', value:null},
            // { path: 'nuggets/counts?zone=released', op: 'get', value:null},
            // ]}))

            // this.setNuggetUnread(data[0].count)
            // this.setNuggetLastThirtyDays(data[1].count)
            // this.setNuggetSubscribed(data[2].count)
            // this.setNuggetReleased(data[3].count)
        }
    }

    @Action({ rawError: true })
    async loadAssignment() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT)) {
            const { data } = await BadgeCountAPI.PATCH(({data: [
                // { path: `assignments/counts?zone=complete&memberId=${ProfileDSModule.identifier}`, op: 'get', value: null },
                // { path: `assignments/counts?zone=newlyAssigned&memberId=${ProfileDSModule.identifier}`, op: 'get', value: null },
                { path: `assignments/counts?zone=needEstimate&memberId=${ProfileDSModule.identifier}`, op: 'get', value: null },
                // { path: `assignments/counts?zone=inProgressNuggets&memberId=${ProfileDSModule.identifier}`, op: 'get', value: null },
                // { path: `assignments/counts?zone=upcomingNuggets&memberId=${ProfileDSModule.identifier}`, op: 'get', value: null },
                { path: `assignments/counts?zone=inProgressNuggetsNotSubmitted`, op: 'get', value: null },
            ]}))

            // this.setAssignmentCompleted(data[0].count)
            // this.setAssignmentUpcomingEstimates(data[1].count)
            this.setAssignmentNeedEstimate(data[0].count)
            // this.setAssignmentInProgress(data[3].count)
            // this.setAssignmentUpcoming(data[4].count)
            this.setAssignmentInProgressDue(data[1].count)
        }
    }

    @Action ({ rawError: true })
    async loadLead() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.LEAD)) {
            const { data } = await BadgeCountAPI.PATCH(({data: [
                { path: 'assignments/counts?zone=teamlead-overdueestimates', op: 'get', value: null },
                { path: 'assignments/counts?zone=teamlead-overduejournals', op: 'get', value: null },
                { path: 'assignments/counts?zone=teamlead-delayednuggets', op: 'get', value: null },
                { path: 'assignments/counts?zone=teamlead-approvaldue', op: 'get', value: null },
                { path: 'assignments/counts?zone=teamlead-journalreports', op: 'get', value: null}
            ]}));
            this.setLeadOverdueEstimate(data[0].count);
            this.setLeadOverdueJournal(data[1].count);
            this.setLeadDelayedNuggets(data[2].count);
            this.setLeadNeedApproval(data[3].count);
            this.setLeadJournalReport(data[4].count);
        }
    }

    @Action ({ rawError: true })
    async loadGoodNews(){
        if(PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS)) {

            const { data } = await BadgeCountAPI.PATCH(({data: [
                { path: 'nuggets/counts?zone=goodnews-triage', op: 'get', value: null },
                // { path: 'nuggets/counts?zone=goodnews-backlog', op: 'get', value: null },
                // { path: 'nuggets/counts?Id&zone= goodnews-archived', op: 'get', value: null },
                { path: 'assignments/counts?zone=goodnews-approvalduecount', op: 'get', value: null },
                    // { path: `assignments/counts?zone=journal-report`, op: 'get', value: null},
                    // { path: 'nuggets/counts?zone=goodnews-upcoming', op: 'get', value: null }
            ]}))

            this.setGoodNewsTriage(data[0].count)
            // this.setGoodNewsBacklog(data[1].count)
            // this.setGoodNewsArchive(data[2].count)
            this.setGoodNewsNeedApproval(data[1].count)
            // this.setGoodScrumReported(data[4].count)
            // this.setGoodNewsUpcoming(data[5].count)
        }
    }

    @Action({ rawError: true })
    async loadBadNews() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS)) {
            const { data } = await BadgeCountAPI.PATCH(({data: [
                { path: 'assignments/counts?zone=badnews-delayednuggets', op: 'get', value: null },
                { path: `assignments/counts?zone=badnews-overduejournals`, op: 'get', value: null },
                { path: `assignments/counts?zone=badnews-overdueestimates`, op: 'get', value: null },
                { path: 'nuggets/counts?zone=badnews-overduetriage', op: 'get', value: null },
            ]}))

            this.setBadNewsDelayedNuggets(data[0].count)
            this.setBadNewsOverdueTimecard(data[1].count)
            this.setBadNewsOverdueEstimate(data[2].count)
            this.setBadNewsOverdueTriage(data[3].count)
        }
    }

    @Action({ rawError: true })
    async loadProject() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS)) {
            // const { data } = await BadgeCountAPI.PATCH(({data: [
            //     { path: 'sprintsview/counts?stage=Production&status=IN(in-progress,complete,approved)', op: 'get', value: null},
            //     { path: 'sprints/counts?hasBackloggedNuggets=true', op: 'get', value: null},
            //     { path: 'projects/counts', op: 'get', value: null},
            //     { path: 'sprintsview/counts?stage=Production&status=released', op: 'get', value: null},
            // ]}))
            // this.setProjectsActive(data[0].count)
            // this.setProjectsBackloggedSprints(data[1].count)
            // this.setProjects(data[2].count)
            // this.setProjectsReleased(data[3].count)
        }
    }

    @Action({ rawError: true })
    async loadRelease() {
        if(PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES)) {
            // const { data } = await BadgeCountAPI.PATCH(({data: [
            //     { path: 'releases/counts?status=%00', op: 'get', value: null},
            //     { path: 'releases/counts?status=complete', op: 'get', value: null}
            // ]}))


            // this.setReleasesActive(data[0].count)
            // this.setReleasesReleased(data[1].count)
        }
    }

    @Action({ rawError: true })
    async doLoad() {
        await Promise.allSettled([
            this.loadNugget(),
            this.loadAssignment(),
            this.loadLead(),
            this.loadGoodNews(),
            this.loadBadNews(),
            this.loadProject(),
            this.loadRelease(),
            this.loadMessages(),
            this.loadInbox()
        ])
    }

}

export interface IBadgeCountCS {
    nuggetUnread: number
    nuggetLastThirtyDays: number
    nuggetSubscribed: number
    nuggetReleased: number
    assignmentInProgress: number
    assignmentInProgressDue: number
    assignmentUpcoming: number
    assignmentNeedEstimate: number
    assignmentUpcomingEstimates: number
    assignmentCompleted: number
    goodNewsTriage: number
    goodNewsNeedApproval: number
    goodNewsScrum: number
    goodNewsBacklog: number
    goodNewsUpcoming: number
    goodNewsProduction: number
    goodNewsArchive: number
    badNewsDelayedNuggets: number
    badNewsOverdueTimecard: number
    badNewsOverdueEstimate: number
    badNewsOverdueTriage: number
    projectsActive: number
    projectsBackloggedSprints: number
    projects: number
    projectsReleased: number
    releases: number
    releasesActive: number
    releasesReleased: number
    peopleUnread: number
    groupsUnread: number
    nuggetSearch: number
    projectsNugget: number
    leadNeedApproval: number
    leadDelayedNuggets: number
    leadOverdueEstimate: number
    leadOverdueJournal: number
    leadJournalReport: number
    inboxNugget: number
    inboxProjects: number
    inboxSprints: number
    inboxReleases: number
    inboxNuggetUnread: number
    inboxProjectsUnread: number
    inboxSprintsUnread: number
    inboxReleasesUnread: number
}
