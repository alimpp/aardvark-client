import packageJson from '@/../package.json';

export const AppVersion = packageJson.version;

export enum TAB_NUGGET_ID {
    UNREAD = 'nugget_page_unread',
    LAST_THIRTY_DAYS = 'nugget_page_lastthirtydays',
    SUBSCRIPTIONS_ACTIVE = 'nugget_page_subscriptions_active',
    SEARCH = 'nugget_page_search',
    RELEASED = 'nugget_page_RELEASED'
}

export enum TAB_INBOX_ID {
    NUGGET = 'inbox_nugget',
    PROJECTS = 'inbox_projects',
    SPRINTS = 'inbox_sprints',
    RELEASES = 'inbox_releases',
    SPRINT_NUGGET = 'inbox_page_sprint_nugget',
    PROJECT_NUGGET = 'inbox_page_project_nugget',
    RELEASE_NUGGET = 'inbox_page_release_nugget'
}

export enum TAB_ASSIGNMENT_ID {
    IN_PROGRESS = 'assignment_page_inprogress',
    UPCOMING = 'assignment_page_upcoming',
    NEED_ESTIMATE = 'assignment_page_needestimate',
    UPCOMING_ESTIMATE = 'assignment_page_newlyassigned',
    COMPLETED = 'assignment_page_completed'
}

export enum TAB_GOOD_NEWS_ID {
    TRIAGE = 'good_news_triage',
    NEED_APPROVAL = 'good_news_need_approval',
    HOURS_REPORTED = 'good_news_hours_reported',
    BACKLOG = 'good_news_backlog',
    UPCOMING = 'good_news_upcoming',
    PRODUCTION = 'good_news_production',
    ARCHIVE = 'good_news_archive'
}

export enum TAB_BAD_NEWS_ID {
    DELAYED_NUGGETS = 'bad_news_delayed_nuggets',
    OVERDUE_TIMRCARD = 'bad_news_overdue_timecard',
    OVERDUE_ESTIMATE = 'bad_news_overdue_estimate',
    OVERDUE_TRIAGE = 'bad_news_overdue_triage'
}

export enum TAB_LEAD_ID {
    APPROVAL_DUE = 'lead-approval-due',
    JOURNAL_REPORT = 'lead-journal-report',
    OVERDUE_JOURNAL = 'lead-overdue-journal',
    OVERDUE_ESTIMATE = 'lead-overdue-estimate',
    DELAYED_NUGGETS = 'lead-delayed-nuggets'
}

export enum TAB_PROJECTS_ID {
    ALL_PROJECTS = 'projects_page_all_projects',
    ACTIVE = 'projects_page_active',
    BACKLOGGED = 'projects_page_backlogged',
    RELEASED = 'projects_page_released',
    SPRINT_NUGGET = 'projects_page_sprint_nugget',
    PROJECT_NUGGET = 'projects_page_project_nugget'
}

export enum TAB_RELEASES_ID {
    ACTIVE = 'releases_active',
    RELEASED = 'releases_released'
}

export enum TAB_REPORT_ID {
    IN_PROGRESS = 'report_page_inprogress',
    UPCOMING = 'report_page_upcoming',
    ESTIMATE_DUE = 'report_page_estimate_due',
    UPCOMING_ESTIMATE = 'report_page_upcoming_estimate',
    COMPLETED = 'report_page_completed'
}

export enum BATCH_OPERATION {
    REMOVE = 'remove',
    APPEND = 'append',
    ACCOMPLISH = 'accomplish',
    APPROVE = 'approve',
    SCHEDULE = 'schedule',
    EXTEND = 'extend',
    UPDATE = 'update',
    WORKON = 'workon',
    ARCHIVE = 'archive',
    UNARCHIVE = 'unarchive'
}


export enum EVENTS {
    CLICK_DBL_TABLE_SUBMODULE = 'double clicked table submodule',
    CLICK_TABLE_SUBMODULE = 'clicked table submodule',
    CLICK_MODULE = 'module clicked',
    ROUTER_PUSH_PROJECTS_PROJECT_NUGGET = 'push route projects project nugget',
    HANGUP_VIDEO_CONFERENCE = 'hangup video conference',
    ROUTER_PUSH_PROJECTS_ACTIVE_SPRINT_NUGGET = 'push route projects active sprint nugget',
    ROUTER_PUSH_PROJECTS_BACKLOGGED_SPRINT_NUGGET = 'push route projects backlogged sprint nugget',
    ROUTER_PUSH_PROJECTS_RELEASED_SPRINT_NUGGET = 'push route projects released sprint nugget',
    ROUTER_PUSH_INBOX_SPRINT_NUGGETS = 'push router inbox sprint nuggets',
    ROUTER_PUSH_INBOX_PROJECT_NUGGETS = 'push router inbox project nuggets',
    ROUTER_PUSH_INBOX_RELEASE_NUGGETS = 'push router inbox release nuggets',
    CLICK_DETAIL_TAB_ID = 'detail tab clicked',
    CHAT_ROOM_INPUT_FOCUS = 'chat room user changed',
    CREATED_NEW_SPRINT = 'new sprint created',
    CREATED_NEW_PROJECT = 'created new project',
    CREATED_NEW_SETTING_ITEM = 'create new setting item',
    CREATED_NEW_BATCH = 'new batch created',
    PHASES_UPDATE = 'detail slider phases table Update',
    USER_PROFILE_UPDATED = 'user profile updated',
    DETAILSIDEBAR_WIDTH_CHANGED = 'detail sidebar width changed',
    MOVE_TO_DIRECT = 'move to direct',
    CLOSE_POPPER = 'close popper',
    REPLY_MESSAGE_CLICKED = 'clickReplyedMessageTo',
    PEOPLE_NOTIFICATION_CLICKED = 'people notification clicked',
    UPDATE_SPRINT = "update sprint",
    CLICK_SCREEN_RECORDER = 'click screen recorder',  
    CLICK_SEND_SCREEN_RECORDER_FILE = 'send screen recorded file',  
    RESET_SCREEN_RECORDER = 'reset screen recorder',  
    CLICK_NOTIFICATION_NUGGET_ENTITY = "click notification nugget entity",
    CLICK_NOTIFICATION_PROJECT_ENTITY = "click notification project entity",
    CLICK_NOTIFICATION_SPRINT_ENTITY = "click notification sprint entity",
    CLICK_NOTIFICATION_RELEASE_ENTITY = "click notification release entity",
}

export enum TAB_DETAIL_SIDEBAR {
    CHAT = 'detail_sidebar_chat',
    DETAILS = 'detail_sidebar_details',
    ATTACHMENTS = 'detail_sidebar_attachments',
    ASSIGNMENT = 'detail_sidebar_assignment',
    TIMECARD = 'detail_sidebar_timecard'
}

export const enum TAB_DETAIL_SIDEBAR_TOOLTIP {
    CHAT = 'Chat',
    DETAILS = 'Details',
    ATTACHMENTS = 'Attachments',
    ASSIGNMENT = 'Workflow',
    TIMECARD = 'Daily Journals'
}

export enum TAB_ATTACHMENT_ID {
    MEDIA = 'attachment_media',
    DOCUMENTS = 'attachment_documents',
    LINKS = 'attachment_links'
}

export enum TABLE_SORT_TYPE {
    NUGGET_SUBSCRIBE = 'isSubscribedPublic',
    NUGGET_NUMBER = 'number',
    NUGGET_NAME = 'title',
    NUGGET_TEMPO = 'tempo',
    NUGGET_TYPE = 'kind',
    NUGGET_PROJECT = 'projectTitle',
    NUGGET_PHASE = 'phaseId',
    NUGGET_STAGE = 'stage',
    NUGGET_PRIORITY = 'priority',
    NUGGET_STATUS = 'status',
    NUGGET_TARGET = 'dueDate',
    NUGGET_RECEIVED_DATE = 'recentMessageAt',
    NUGGET_SEEN_AT = 'seenAt',
    NUGGET_CREATED_BY = 'createdByMemberId',
    NUGGET_CREATED_DATE = 'createdAt',
    NUGGET_ORIGIN = 'origin',
    NUGGET_RESPONSE_TIME = 'responseTime',
    NUGGET_RETURN_TO_TRIAGE = 'returnToTriage',
    NUGGET_SPRINT = 'sprintNumber',
    NUGGET_RELEASE = "releaseAt",

    ASSIGNMENT_NUGGET_NUMBER = 'nuggetNumber',
    ASSIGNMENT_NAME = 'nuggetTitle',
    ASSIGNMENT_TEMPO = 'tempo',
    ASSIGNMENT_TYPE = 'nuggetKind',
    ASSIGNMENT_TIMECARD = 'perspective',
    ASSIGNMENT_MY_START = 'startDate',
    ASSIGNMENT_MY_TARGET = 'endDate',
    ASSIGNMENT_CADENCE = 'mojo',
    ASSIGNMENT_PHASE = 'phaseTitle',
    ASSIGNMENT_PROJECT = 'projectTitle',
    ASSIGNMENT_PRIORITY = 'nuggetPriority',
    ASSIGNMENT_LEVEL = 'assignmentLevel',
    ASSIGNMENT_STARTS_IN = 'startDate',
    ASSIGNMENT_DUE_IN_HRS = 'responseTime',
    ASSIGNMENT_STATUS = 'status',
    ASSIGNMENT_SPRINT = 'sprintNumber',
    ASSIGNMENT_APPROVE = 'isDone',
    ASSIGNMENT_RESPONSE_TIME = 'gracePeriod',
    ASSIGNMENT_RESOURCE = 'leadResource',
    ASSIGNMENT_NUGGET_STAGE = 'assignmentNuggetStage',
    ASSIGNMENT_LAST_TIMECARD_TIMESTAMP = 'lastTimecardTimestamp',

    PROJECT_NUMBER = 'number',
    PROJECT_NAME = 'title',
    PROJECT_TEMPO = 'tempo',
    PROJECT_ALERT = 'alert',
    PROJECT_STATUS = 'status',
    PROJECT_WORKFLOW = 'workflowId',
    PROJECT_PRIMARY_MAESTRO = 'managerId',
    PROJECT_SECONDARY_MAESTRO = 'secondaryManagerId',

    PROJECT_SPRINT_NUMBER = 'projectNumber',
    PROJECT_SPRINT_PROJECT_SPRINT = 'projectTitle',
    PROJECT_SPRINT_TEMPO = 'tempo',
    PROJECT_SPRINT_RELEASE = 'releaseId',
    PROJECT_SPRINT_RELEASE_DATE = 'launchDate',
    PROJECT_SPRINT_RELEASE_CUTOFF = 'cutoff',
    PROJECT_SPRINT_COMPLETED_DATE = 'dueDate',
    PROJECT_SPRINT_SPRINT_TARGET = 'dueDate',
    PROJECT_SPRINT_PRIMARY_MAESTRO = 'managerId',
    PROJECT_SPRINT_SECONDARY_MAESTRO = 'secondaryManagerId',

    RELEASE_NUMBER = 'number',
    RELEASE_NAME = 'title',
    RELEASE_TEMPO = 'tempo',
    RELEASE_RELEASE_DATE = 'launchDate',
    RELEASE_RELEASE_CUTOFF = 'cutoff',
    RELEASE_ALERT = 'alert',
    RELEASE_PRIMARY_MAESTRO = 'managerId',
    RELEASE_SECONDARY_MAESTRO = 'secondaryManagerId',

    //Settings table sort
    TAG_NAME = 'title',
    TAG_INACTIVE = 'removedAt',

    GROUP_NAME = 'title',
    GROUP_INACTIVE = 'removedAt',

    DEPARTMENT_NAME = 'name',
    DEPARTMENT_INACTIVE = 'removedAt',

    PHASE_NAME = 'title',
    PHASE_INACTIVE = 'removedAt',
    PHASE_SKILLS = 'skillId',

    SKILL_NAME = 'title',
    SKILL_INACTIVE = 'removedAt',

    WORKFLOW_NAME = 'title',
    WORKFLOW_INACTIVE = 'removedAt',

    USER_FIRST_NAME = 'firstName',
    USER_LAST_NAME = 'lastName',
    USER_EMAIL = 'email',
    USER_INACTIVE = 'removedAt',

    COMPANY_CALENDAR_NAME = 'title',
    COMPANY_CALENDAR_DATE = 'startDate',
    COMPANY_CALENDAR_REPEAT = 'repeat',
    COMPANY_CALENDAR_ID = 'id',
    COMPANY_CALENDAR_INACTIVE = "removedAt",

    PERSONAL_CALENDAR_NAME = 'title',
    PERSONAL_CALENDAR_DATE = 'startDate',
    PERSONAL_CALENDAR_REPEAT = 'repeat',
    PERSONAL_CALENDAR_ID = 'id',
    PERSONAL_CALENDAR_INACTIVE = 'removedAt',

    // Estimated
    ESTIMATED_LEVEL = "estimatedlevel"

}

export const enum TABLE_SORT_DIRECTION {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum TABLE_FILTER_TYPE {
    // Nugget filters
    NUGGET_SUBSCRIBE = 'isSubscribedPublic',
    NUGGET_PHASE = 'phaseId',
    NUGGET_STATUS = 'nuggetStatus',
    NUGGET_TYPE = 'kind',
    NUGGET_PRIORITY = 'priority',
    NUGGET_ORIGIN = 'origin',
    NUGGET_STAGE = 'stage',
    IS_UNREAD = 'isUnread',
    
    // Assignment Filters
    ASSIGNMENT_TYPE = 'nuggetKind',
    ASSIGNMENT_TIMECARD = 'perspective',
    ASSIGNMENT_PRIORITY = 'nuggetPriority',
    ASSIGNMENT_LEVEL = 'assignmentLevel',
    ASSIGNMENT_NUGGET_STAGE = 'assignmentNuggetStage',

    // Projects Filters
    PROJECTS_STATUS = 'projectsStatus',

    // Releases Filters
    RELEASES_TEMPO = 'tempo',

    // Estiamted Filters
    ESTIMATED_LEVEL = "estimatedlevel",

    // Reusable Filters
    TEMPO = 'tempo',
    PROJECT = 'projectId',
    TAGS = 'tagId',
    INACTIVE = 'removedAt',

    //Settings table filter
    WORKFLOW_PHASES = 'phaseId',
    WORKFLOW_ACTIVE_PROJECTS = 'projectId',
    PHASE_SKILL = 'skillId',

    GROUP_TYPE = 'type',

    USER_ROLE = 'organizationRoles',

    CALENDAR_REPEAT = 'repeat'
}

export enum SETTINGS_TABLE_SORT_TYPE {
    TAG_NAME = 'title'
}

export enum AUDIT_MESSAGE_TYPE {
    NAME = 'Modified Name',
    DESCRIPTION = 'Modified Description'
}

export enum BADGE_COUNT_TYPE {
    HIGH_BADGE_COUNT = 'highBadgeCount',
    LOW_BADGE_COUNT = 'lowBadgeCount'
}

export enum CORE_SELECT_MENU_OPTIONS {
    edit = 'edit',
    delete = 'delete'
}

export enum GROUP_TYPE {
    PUBLIC = 'public',
    PRIVATE = 'private',
    BOTH = 'both'
}

export enum CHAT_LABEL_TYPE {
    PUBLIC = 'Public',
    PRIVATE = 'Private',
    BOTH = 'Both',
}

export enum VIDEO_CONFERENCE_STATUS{
    IN_CALL = "in call",
    RINGING = "ringing",
    AVAILABLE  = "available",
    BUSY  = "busy",
    HANGUP  = "hangup",
    REJECT  = "reject",
    WAIT_FOR_CALEE  = "wait for calee",
    INITIATE_VIDEO_CALL  = "initiate video call",
    ACCEPT_CALL  = "accept call",
    JOIN_VIDEO_CALL = "join video call"
}

export const DAYS_OF_WEEK = [
    {
        name: "Sunday",
        id: 1,
    },
    {
        name: "Monday",
        id: 2,
    },
    {
        name: "Tuesday",
        id: 3,
    },
    {
        name: "Wednesday",
        id: 4,
    },
    {
        name: "Thursday",
        id: 5,
    },
    {
        name: "Friday",
        id: 6,
    },
    {
        name: "Saturday",
        id: 7,
    },
]

export enum HOLIDAY_TYPE {
  PERSONAL = "Personal",
  COMPANY = "Company Wide",
}

export enum MESSAGE_MIMETYPE {
    AUDIT = "application/x-auditlog"
}

export enum MESSAGE_TYPE {
    CHAT_TEXT_MESSAGE = "chat_text_message",
    CHAT_IMAGE_MESSAGE = "chat_image_message",
    CHAT_FILE_MESSAGE = "chat_file_message",
    CHAT_AUDIT_MESSAGE = "chat_audit_message",
    CHAT_DELETED_MESSAGE = "chat_deleted_message",
    ATTACHMENT_MEDIA_IMAGE_MESSAGE = "attachment_media_image_message",
    ATTACHMENT_MEDIA_VIDEO_MESSAGE = "attachment_media_video_message",
    ATTACHMENT_MEDIA_AUDIO_MESSAGE = "attachment_media_audio_message",
    ATTACHMENT_DOCUMENT_MESSAGE = "attachment_document_message",
    ATTACHMENT_LINK_MESSAGE = "attachment_link_message",
    CHAT_AUDIO_MESSAGE = "chat_audio_message",
    CHAT_VIDEO_MESSAGE = "chat_video_message"
}

export enum CHAT_EVENTS {
    CHAT_EVENT_REPLY = "chat event reply",
    CHAT_EVENT_EDIT = "chat event edit",
    CHAT_EVENT_DELETE = "chat event delete",
}

export const CHAT_ACTIONS = {
    REPLY_MESSAGE: {id: CHAT_EVENTS.CHAT_EVENT_REPLY, title: "Reply"},
    EDIT_MESSAGE: {id: CHAT_EVENTS.CHAT_EVENT_EDIT, title: "Edit Message"},
    DELETE_MESSAGE: {id: CHAT_EVENTS.CHAT_EVENT_DELETE, title: "Delete Message"}
};

export enum GROUP_EVENTS {
    LEAVE = "chat event leave",
}

export const GROUP_ACTIONS = {
    LEAVE: {id: GROUP_EVENTS.LEAVE, title: "Leave"},
};

export const CHAT_LOCALE = {
    TYPE_MESSAGE: 'Type message',
    NEW_MESSAGES: 'New Messages',
    ROOMS_EMPTY: 'No rooms',
    CONVERSATION_STARTED: 'Conversation started on:',
    MESSAGE_DELETED: 'This message was deleted',
    CHAT_EMPTY: 'No messages',
    ATTACHMENT_MAXIMUM_SIZE: 26214400,
    MESSAGE_ERROR_LARGE_FILE: ' size is larger than 25MB '
}

export const ATTACHMENT_MEDIA_LOCALE = {
    ...CHAT_LOCALE,
    CHAT_EMPTY: 'No media'
}

export const ATTACHMENT_DOCUMENT_LOCALE = {
    ...CHAT_LOCALE,
    CHAT_EMPTY: 'No documents',
}

export const ATTACHMENT_LINK_LOCALE = {
    ...CHAT_LOCALE,
    CHAT_EMPTY: 'No links',
}

export enum MESSAGE_SIGNATURE {
    SEEN_SIGNATURE = 'message_datastore_seen_message',
    NEW_SIGNATURE = 'message_datastore_new_message',
    DELETE_SIGNATURE = 'message_datastore_delete_message',
    EDIT_SIGNATURE = 'message_datastore_edit_message',
    EVENT_SIGNATURE = 'message_datastore_event_message',
    PUSH_SIGNATURE = 'socket_service_push_notification'
}

export enum SUBSCRIBABLE_TYPE {
    DIRECT = 'direct',
    CHANNEL = 'channel',
    NUGGET = 'nugget',
    PROJECT = 'project',
    RELEASE = 'release',
    SPRINT = 'sprint'
}

export const enum JOURNAL_SUBMIT_STATE {
    EXTEND_HOURS = 'extend',
    EXTEND_DATE = 'complete',
    SUBMIT = 'submit'
}

export const enum JOURNAL_DIALOG_TITLE {
    EXTEND_DATE = 'Your Nugget is complete right now. Do you want to change your `End date` to ',
    EXTEND_HOURS = 'Sum of hours you registered on this item is greater than your estimated hours. Do you want to update your `estimation` to ',
    SUBMIT = ''
}
export enum DEFAULT_ROUTES {
    INBOX = '/inbox/nugget',
    NUGGET = '/nugget/unread',
    ASSIGNMENT = '/assignment/in-progress',
    LEAD = '/lead/need-approval',
    GOOD_NEWS = '/good-news/triage',
    BAD_NEWS = '/bad-news/overdue-triage',
    PROJECTS = '/projects/active-projects',
    RELEASES = '/releases/active',
    REPORT = '/report/in-progress',
    SETTINGS = '/settings/user-profile'
}

export enum DEFAULT_ROUTES_ROOTS {
    INBOX = 'INBOX',
    NUGGET = 'NUGGET',
    ASSIGNMENT = 'ASSIGNMENT',
    LEAD = 'LEAD',
    GOOD_NEWS = 'GOOD_NEWS',
    BAD_NEWS = 'BAD_NEWS',
    PROJECTS = 'PROJECTS',
    RELEASES = 'RELEASES',
    REPORT = 'REPORT',
    SETTINGS = 'SETTINGS'
}

export const enum NAVIGATION_PAGES {
    UNREAD = 'NuggetUnread',
    LAST_THIRTY_DAYS = 'NuggetLastThirtyDays',
    SUBSCRIPTIONS_ACTIVE = 'NuggetSubscriptionsActive',
    SEARCH = 'NuggetSearch',
    RELEASED = 'NuggetReleased',
    NONE = ''
}

export enum ANIMATION_TIMING {
    DIALOG_CLOSE = 300,
    TABLE_ROW_ENTER = 75,
    BADGE_COUNT_DURATION = 3000
}

export const enum SOCKET_CONNECTIONS {
    JAGUAR = 'jaguar',
    DOLPHIN = 'dolphin'
}

export const enum SOCKET_EVENTS {
    CONNECT = 'connect',
    ONLINE = 'online',
    DISCONNECT = 'disconnect',
    OFFLINE = 'offline',
    RECONNECT = 'reconnect',
    STALE = 'stale'
}

export const enum SOCKET_ENTITY_ACTIONS {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    SEND = 'send',
}

export const enum SOCKET_NUGGET_ZONES {
    INBOX = 'inbox',
    TRIAGE = 'triage'
}

export const enum SOCKET_ASSIGNMENT_ZONES {
    NEED_ESTIMATE = 'needEstimate'
}

export const enum SOCKET_PROJECT_ZONES {
    INBOX = 'inbox'
}

export const enum SOCKET_RELEASE_ZONES {
    INBOX = 'inbox'
}

export const enum SOCKET_WORKFLOW_ZONES {
    INBOX = 'inbox'
}

export const enum SOCKET_SPRINT_ZONES {
    INBOX = 'inbox'
}

export const enum NUGGET_STAGES {
    TRIAGE = 'Triage',
    BACKLOG = 'Backlog',
    PRODUCTION = 'Production',
    ONHOLD = 'On-hold',
    ARCHIVE = 'Archive',
    RELEASED = 'Released'
}

export const enum RELEASE_STATUS {
    ONHOLD = 'On-hold',
    COMPLETE = 'complete',
    DELAYED = 'delayed',
    INPROGRESS ='in-progress'
}

export const enum DELAYED_BY {
    START_DATE = 'start_date',
    END_DATE = 'end_date'
}

export const enum BREADCRUMB_ICON {
    'project' = 'storage',
    'sprint' = 'directions_run',
    'nugget' = 'widgets'
}

export const enum DEBOUNCE {
    UPDATE_CHAT_BUFFER = 'update_chat_buffer',
    CALENDAR_TIMEPICKER_ON_SCROLL_HANDLER = 'calendar_timepicker_on_scroll_handler',
    NUGGET_DETAIL_TAG_UPDATE = 'nugget_detail_tag_update',
    CREATE_NUGGET_FORM_RELATED_NUGGETS = 'create_nugget_form_related_nuggets',
    CALENDAR_TIMEPICKER_ON_SCROLL_APMS = 'calendar_timepicker_on_scroll_apms',
    CALENDAR_TIMEPICKER_ON_SCROLL_MINUTES_HANDLER = 'calendar_timepicker_on_scroll_minutes_handler',
    GROUP_CHAT_LIST_SEARCH_TERMS = 'group_chat_list_search_terms',
    DIRECTDS_UPDATE_DIRECT_BADGE_COUNT_BY_SEEN_MESSAGE = 'directds_update_direct_badge_count_by_seen_message',
    GROUP_DEAILSDS_UPDATE_CHANNEL_BADGE_COUNT_BY_SEEN_MESSAGE = 'group_deailsds_update_channel_badge_count_by_seen_message',
    CORE_SELECT_SEARCH_QUERY = 'core_select_search_query',
    CORE_SIDEBAR_ON_HOVER = 'core_sidebar_on_hover',
    INITIATE_VIDEO_CALL  = "initiate_video_call",
    JOIN_VIDEO_CALL = "join_video_call",
    KEEP_ALIVE_CALL = "keep_alive_call"
}
export const enum POPUP_DIALOG_TEXT {
    ATTACH_SCREEN_RECORDED_FILE = "Do you want to send screen recorded file to original chat ?",
}

export const enum TOAST_NOTIFICATION_TEXT {
    RECORDER_SELECT_CHAT_ERROR = "For sending recorded file , Please select a chat",
    RECORDER_NOT_SUPPORTED = "MediaRecorder is not supported by this browser",
}
