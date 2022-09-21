import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {ApplicationDSModule, PermissionDSModule} from "@/store";
import {TAB_DETAIL_SIDEBAR, TAB_DETAIL_SIDEBAR_TOOLTIP} from '@/utils/constants';
import {Actions, Subjects} from '../datastore/permissionDS';
@Module({name:'detailsidebarcs', namespaced: true})
export class DetailSidebarCS extends VuexModule {
    defaultTabs = [
        { id: TAB_DETAIL_SIDEBAR.CHAT, icon: 'xeba-chat', tooltip: TAB_DETAIL_SIDEBAR_TOOLTIP.CHAT, hidden: false },
        { id: TAB_DETAIL_SIDEBAR.DETAILS, icon: 'xeba-details', tooltip: TAB_DETAIL_SIDEBAR_TOOLTIP.DETAILS, hidden: false },
        // { id: 'detailSidebarEvents', icon: 'xeba-events', hidden: false },
        { id: TAB_DETAIL_SIDEBAR.ATTACHMENTS, icon: 'xeba-attachments', tooltip: TAB_DETAIL_SIDEBAR_TOOLTIP.ATTACHMENTS, hidden: false },
        { id: TAB_DETAIL_SIDEBAR.ASSIGNMENT, icon: 'xeba-assignment', tooltip: TAB_DETAIL_SIDEBAR_TOOLTIP.ASSIGNMENT, hidden: false },
        { id: TAB_DETAIL_SIDEBAR.TIMECARD, icon: 'xeba-timecard', tooltip: TAB_DETAIL_SIDEBAR_TOOLTIP.TIMECARD, hidden: false }
    ]
    currentActiveTab = TAB_DETAIL_SIDEBAR.CHAT;

    // TODO: This should be generated in onInit and cached.
    get layout() {
        return {
            nugget: {
                nuggetUnread: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_UNREAD_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_UNREAD_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_UNREAD_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_UNREAD_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                nuggetLastThirtyDays: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_LASTTHIRTYDAYS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_LASTTHIRTYDAYS_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_LASTTHIRTYDAYS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_LASTTHIRTYDAYS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                nuggetSubscriptionsActive: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SUBSCRIBED_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SUBSCRIBED_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SUBSCRIBED_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SUBSCRIBED_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                nuggetSearch: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SEARCH_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SEARCH_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SEARCH_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_SEARCH_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                nuggetReleased: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_RELEASED_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_RELEASED_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_RELEASED_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.NUGGETS_RELEASED_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                }
            },
            assignment: {
                assignmentInProgress: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_TIMECARD) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.TIMECARD
                },
                assignmentUpcoming: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET_TIMECARD) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGNUGGET_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                assignmentNeedEstimate: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE_TIMECARD) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_NEEDESTIMATE_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.TIMECARD
                },
                assignmentUpcomingEstimates: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE_TIMECARD) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_UPCOMINGESTIMATE_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                assignmentCompleted: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED_TIMECARD) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_COMPLETED_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                }
            },
            goodNews: {
                goodNewsTriage: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_TRIAGE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_TRIAGE_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_TRIAGE_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_TRIAGE_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                goodNewsNeedApproval: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_NEEDAPPROVAL_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_NEEDAPPROVAL_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_NEEDAPPROVAL_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_NEEDAPPROVAL_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                goodNewsScrum: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_JOURNAL_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_JOURNAL_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_JOURNAL_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_JOURNAL_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                goodNewsBacklog: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_BACKLOG_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_BACKLOG_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_BACKLOG_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_BACKLOG_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                goodNewsUpcoming: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_UPCOMING_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_UPCOMING_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_UPCOMING_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_UPCOMING_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                goodNewsProduction: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_PRODUCTION_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_PRODUCTION_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_PRODUCTION_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_PRODUCTION_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                goodNewsArchive: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_ARCHIVE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_ARCHIVE_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_ARCHIVE_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.GOODNEWS_ARCHIVE_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
            },
            badNews: {
                badNewsDelayedNuggets: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_DELAYEDNUGGETS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_DELAYEDNUGGETS_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_DELAYEDNUGGETS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_DELAYEDNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                badNewsOverdueTimecard: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUEJOURNALS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUEJOURNALS_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUEJOURNALS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUEJOURNALS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                badNewsOverdueEstimate: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_MISSINGESTIMATES_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_MISSINGESTIMATES_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_MISSINGESTIMATES_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_MISSINGESTIMATES_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                badNewsOverdueTriage: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUETRIAGE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUETRIAGE_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUETRIAGE_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.BADNEWS_OVERDUETRIAGE_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
            },
            lead: {
                leadDelayedNuggets: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_DELAYEDNUGGETS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_DELAYEDNUGGETS_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_DELAYEDNUGGETS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_DELAYEDNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
               },
               leadOverdueTimecard: {
                [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUEJOURNALS_CHAT) },
                [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUEJOURNALS_DETAILS) },
                [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUEJOURNALS_ASSIGNMENT) },
                [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_OVERDUEJOURNALS_ATTACHMENTS)},
                [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },

                leadOverdueEstimate: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_MISSINGESTIMATES_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_MISSINGESTIMATES_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_MISSINGESTIMATES_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_MISSINGESTIMATES_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                leadNeedApproval: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_NEEDAPPROVAL_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_NEEDAPPROVAL_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_NEEDAPPROVAL_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_NEEDAPPROVAL_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                leadJournalReport: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_JOURNAL_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_JOURNAL_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_JOURNAL_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.LEAD_JOURNAL_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },


            },
            inbox:{
                inboxNugget:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_NUGGET_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_NUGGET_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_NUGGET_ASSIGNMENT)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_NUGGET_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]:{hidden: true},
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                inboxProjects:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTS_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]:{hidden:true},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]:{hidden:true},
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                inboxSprints:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTS_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                inboxReleases:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASES_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASES_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASES_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.CHAT
                },
                inboxSprintNuggets: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTNUGGETS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTNUGGETS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTNUGGETS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_SPRINTNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                inboxProjectNuggets:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTNUGGETS_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTNUGGETS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTNUGGETS_ASSIGNMENT)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_PROJECTNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]:{hidden: true},
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                inboxReleaseNuggets:{
                    [TAB_DETAIL_SIDEBAR.CHAT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASENUGGETS_CHAT)},
                    [TAB_DETAIL_SIDEBAR.DETAILS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASENUGGETS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASENUGGETS_ASSIGNMENT)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]:{hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.INBOX_RELEASENUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]:{hidden: true},
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },

            },
            projects: {
                projectsActiveSprints: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_ACTIVESPRINTS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_ACTIVESPRINTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_ACTIVESPRINTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                projectBackloggedSprints: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_BACKLOGGEDSPRINTS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_BACKLOGGEDSPRINTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_BACKLOGGEDSPRINTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                projectAllProject: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                projectReleased: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_RELEASEDSPRINTS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_RELEASEDSPRINTS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_RELEASEDSPRINTS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                projectsProjectNugget: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTNUGGETS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTNUGGETS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTNUGGETS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_PROJECTNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                projectsSprintNugget: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.PROJECTS_SPRINTNUGGETS_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                }
            },

            releases: {
                releasesActive: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_ACTIVE_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_ACTIVE_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_ACTIVE_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                },
                releasesReleased: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_RELEASED_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_RELEASED_DETAILS)},
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.RELEASES_RELEASED_ATTACHMENTS)},
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    defaultTab: TAB_DETAIL_SIDEBAR.DETAILS
                }
            },

            report: {
                reportInProgress: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_INPROGRESS_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.ASSIGNMENT_INPROGRESSNUGET_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_INPROGRESS_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_INPROGRESS_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                reportUpcoming: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_UPCOMING_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_UPCOMING_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_UPCOMING_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_UPCOMING_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                reportEstimates: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_ESTIMATES_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_ESTIMATES_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_ESTIMATES_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_ESTIMATES_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
                reportCompleted: {
                    [TAB_DETAIL_SIDEBAR.CHAT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_COMPLETED_CHAT) },
                    [TAB_DETAIL_SIDEBAR.DETAILS]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_COMPLETED_DETAILS) },
                    [TAB_DETAIL_SIDEBAR.TIMECARD]: { hidden: true },
                    [TAB_DETAIL_SIDEBAR.ASSIGNMENT]: { hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_COMPLETED_ASSIGNMENT) },
                    [TAB_DETAIL_SIDEBAR.ATTACHMENTS]: {hidden: !PermissionDSModule.can(Actions.VIEW, Subjects.REPORT_COMPLETED_ATTACHMENTS)},
                    defaultTab: TAB_DETAIL_SIDEBAR.ASSIGNMENT
                },
            },
        }
    }

    public get tabs() {
        // Clone the tabs, set the disabled field from layout, and return array
        const clone = [...this.defaultTabs];
        clone.forEach((tab, index) => {
            if (this.layout[ApplicationDSModule.selectedModule][ApplicationDSModule.selectedModuleTab][tab.id]) {
                clone[index] = { ...tab, ...this.layout[ApplicationDSModule.selectedModule][ApplicationDSModule.selectedModuleTab][tab.id] }
            }
        });
        return clone;
    }

    @Mutation
    updateCurrentActiveTab(id: TAB_DETAIL_SIDEBAR){
        this.currentActiveTab = id;
    }

    @Action({rawError: true})
    setCurrentActiveTab(id: TAB_DETAIL_SIDEBAR){
        if(id === TAB_DETAIL_SIDEBAR.CHAT) ApplicationDSModule.setChatSidebarOpen(false);
        this.updateCurrentActiveTab(id);
    }

    @Action({rawError: true})
    setDefaultActiveTab() {
        if(this.layout[ApplicationDSModule.selectedModule][ApplicationDSModule.selectedModuleTab].defaultTab) {
            this.setCurrentActiveTab(this.layout[ApplicationDSModule.selectedModule][ApplicationDSModule.selectedModuleTab].defaultTab);
        }
    }
}
