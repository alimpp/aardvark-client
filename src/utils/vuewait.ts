import VueWait from 'vue-wait';

export const wait = new VueWait();




export enum WaitStates {
    NAV_BAR_LOADING = 'navigationbar loading',
    ACTION_ATTACHMENT_MEDIA_LOADING = 'action attachment media loading',
    ACTION_ATTACHMENT_LINKS_LOADING = "action attachment links loading",
    ACTION_NUGGET_SAVING = 'action nugget saving',
    ACTION_NUGGET_SEARCH = 'action nugget search',
    ACTION_NUGGET_LOADING = 'action nugget loading',
    ACTION_NUGGETASSIGNMENT_LOADING = 'nugget assignments loading',
    ACTION_LOGIN = 'action login',
    ACTION_CHAT_LOADING = 'action chat loading',
    ACTION_ATTACHMENT_DOCUMENTS_LOADING="action attachment documents loading",
    ACTION_CHAT_SENDING_MESSAGE = 'action chat sending message',
    ACTION_NUGGETLASTTHIRTYDAYS_LOADING = 'action nugget last thirty day loading',
    ACTION_NUGGETUNREAD_LOADING = 'action nugget unread loading',
    ACTION_NUGGETSUBSCRIPTIONSACTIVE_LOADING = "action nugget subscriptions active loading",
    ACTION_NUGGETSEARCH_LOADING = 'action nugget search loading',
    ACTION_NUGGETRELEASED_LOADING = 'action nugget released loading',
    ACTION_ASSIGNMENTCOMPLETED_LOADING = 'action assignment completed loading',
    ACTION_ASSIGNMENTINPROGRESS_LOADING = 'action assignment inprogress loading',
    ACTION_ASSIGNMENTNEEDESTIMATE_LOADING = 'action assignment need estimate loading',
    ACTION_ASSIGNMENTUPCOMINGESTIMATES_LOADING = 'action assignment upcoming estimates loading',
    ACTION_ASSIGNMENTUPCOMING_LOADING = 'action assignment upcoming loading',
    ACTION_BADNEWSDELAYEDNUGGETS_LOADING = 'action bad news delayed nuggets loading',
    ACTION_BADNEWSOVERDUETIMECARD_LOADING = 'action bad news overdue timecard loading',
    ACTION_BADNEWSOVERDUEESTIMATE_LOADING = 'action bad news overdue estimate loading',
    ACTION_BADNEWSOVERDUETRIAGE_LOADING = 'action bad news overdue triage loading',
    ACTION_GOODNEWSTRIAGE_LOADING = 'action good news triage loading',
    ACTION_GOODNEWSNEEDAPPROVAL_LOADING = 'action good news need approval loading',
    ACTION_GOODSCRUM_LOADING = 'action good news hourse reported loading',
    ACTION_GOODNEWSARCHIVE_LOADING = 'action good news archive loading',
    ACTION_GOODNEWSBACKLOG_LOADING = 'action good news backlog loading',
    ACTION_GOODNEWSUPCOMING_LOADING = 'action good news upcoming loading',
    ACTION_GOODNEWSPRODUCTION_LOADING = 'action good news production loading',
    ACTION_NUGGETSPHASES_LOADING = 'nuggets phases loading',
    ACTION_NUGGETPHASES_LOADING = 'nugget phases loading',
    ACTION_RELEASEACTIVE_LOADING = 'action release active loading',
    ACTION_RELEASERELEASED_LOADING = 'action release released loading',
    ACTION_RELEASE_SAVING = 'action release saving',
    ACTION_RELEASE_COMPLETING = 'action release completing',
    ACTION_RELEASE_PREFLIGHT = 'action release preflight',
    ACTION_PAYLOAD_LOADING = 'action payload loading',
    ACTION_PROJECTSALLPROJECTS_LOADING = 'action projects all projects loading',
    ACTION_PROJECTSACTIVESPRINTS_LOADING = 'action projects active loading',
    ACTION_PROJECTSBACKLOGGEDSPRINTS_LOADING = 'action projects active loading',
    ACTION_PROJECTSRELEASED_LOADING = 'action projects released loading',
    ACTION_PROJECT_SAVING = 'action project saving',
    ACTION_PROJECTSSPRINTNUGGET_LOADING = 'action projects sprint nugget loading',
    ACTION_PROJECTSPROJECTNUGGET_LOADING = 'action projects project nugget loading',
    ACTION_PROJECTPHASES_LOADING = 'action project phases loading',
    ACTION_TIMECARDS_LOADING = 'action timecard loading loading',
    ACTION_TIMECARD_SAVING = 'action timecard saving',
    ACTION_RESOURCESUMMARIES_LOADING = 'action resource summaries loading',
    ACTION_CHAT_ROOM_LOADING = 'action chat room loading',
    ACTION_CHAT_ROOM_TABS_LOADING = 'action chat room tabs loading',
    ACTION_CHATROOMMEMBER_LOADING = 'action chat room members loading',
    ACTION_ATTACHMENTS_TABS_LOADING = "action_attachments_tabs_loading",
    ACTION_DIALOG_CONFIRM = 'action dialog confirm',
    ACTION_ESTIMATE_SAVING = 'action estimate saving',
    ACTION_MESSAGE_PEOPLE_VIEWED = 'loading people viewed the message',
    ACTION_LEADNEEDAPPROVAL_LOADING = 'action lead need approval loading',
    ACTION_LEADDELAYEDNUGGETS_LOADING = 'action lead delayed nuggets loading',
    ACTION_LEADOVERDUETIMECARD_LOADING = 'action lead overdue timecard loading',
    ACTION_LEADOVERDUEESTIMATE_LOADING = 'action lead overdue estimate loading',
    ACTION_LEADJOURNALREPORT_LOADING = 'action lead hourse reported loading',
    ACTION_TEAMLEADOVERDUEESTIMATE_LOADING = 'action team  overdue estimate loading',
    ACTION_GROUPDETAILS_LOADING = 'action group details loading',
    ACTION_GROUPDETAILS_SEARCHING = 'action group details searching',
    ACTION_UPDATE_JOURNAL_REPORT = 'action update journal report',
    ACTION_INBOX_NUGGET_LOADING   = 'action load inbox nugget',
    ACTION_INBOX_PROJECTS_LOADING = 'action load inbox projects',
    ACTION_INBOX_SPRINTS_LOADING  = 'action load inbox sprints',
    ACTION_INBOX_RELEASES_LOADING = 'action load inbox releases',
    ACTION_INBOXNUGGETSSPRINTS_LOADING = 'action load inbox sprint nuggets',
    ACTION_INBOXNUGGETSPROJECTS_LOADING = 'action load inbox project nuggets',
    ACTION_INBOXNUGGETSRELEASE_LOADING = 'action load inbox release nuggets',
    ACTION_DELETE_PHASE_LOADING = 'action delete phase loading',
    ACTION_BUTTON_LOADING = 'action button loading',
    ACTION_USER_LOADING = 'action user saving ',
    ACTION_HOLIDAY_LOADING = 'action holiday saving ',
    ACTION_DEPARTMENT_LOADING = 'action department saving ',
    ACTION_GROUP_LOADING = 'action group saving ',
    ACTION_PHASE_LOADING = 'action phase saving ',
    ACTION_SKILL_LOADING = 'action skill saving ',
    ACTION_TAG_LOADING = 'action tag saving ',
    ACTION_WORKFLOW_LOADING = 'action workflow saving ',
    ACTION_PASSWORD_LOADING = 'action password saving ',
    ACTION_MESSAGE_INFO = 'action message info',
    ACTION_CHANNEL_MEMBER_LOADING = 'action channel member loading' ,
    ACTION_NUGGET_SUMMARY_LOADING = 'action nugget summary loading',
    ACTION_SPRINT_SAVING = 'action sprint saving',
    ACTION_SETTINGSGROUPS_LOADING = 'action settings groups loading',
    ACTION_SETTINGSPHASES_LOADING = 'action settings phases loading',
    ACTION_SETTINGSWORKFLOWS_LOADING = 'action settings workflows loading',
    ACTION_SETTINGSSKILLS_LOADING = 'action settings skills loading',
    ACTION_SETTINGSCOMPANYCALENDAR_LOADING = 'action settings company calendar loading',
    ACTION_SETTINGSPERSONALCALENDAR_LOADING = 'action settings personal calendar loading',
    ACTION_SETTINGTAGS_LOADING = 'action settings tags loading',
    ACTION_SETTINGSDEPARTMENT_LOADING = 'action settings departments loading',
    ACTION_SETTINGSUSERS_LOADING = 'action settings users loading',
    ACTION_REPORT_INPROGRESS_LOADING = 'action load report inprogress',
    ACTION_REPORT_UPCOMING_LOADING = 'action load report upcoming',
    ACTION_REPORT_NEEDESTIMATEDUE_LOADING = 'action load report need estimate',
    ACTION_REPORT_UPCOMING_NEEDESTIMATE_LOADING = 'action load report upcoming need estimate',
    ACTION_REPORT_COMPLETED_LOADING = 'action load report completed',
    ACTION_DECLINE_VIDEO_CONFERENCE = 'action decline video conference',
}

/**
 * Wraps the function with Vue Wait start/end functionality.
 * - Start gets called before the function runs.
 * - End gets called after the function resolves.
 */
export function Wait(waitName: WaitStates) {
    return function(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: unknown[]) {
            wait.start(waitName)
            let result = undefined

            try{
                result = await originalMethod.apply(this, args);
                wait.end(waitName);
            return result;
            } catch(e){
                wait.end(waitName);
                throw e;
            }
        }
    };
}
