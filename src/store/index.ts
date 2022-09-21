// Impose strict mode
'use strict'

import Vue from "vue"
import Vuex, {ModuleTree, Store} from "vuex"
import VuexPersistence, {AsyncStorage} from "vuex-persist"
import LocalForage from "localforage"
import {restoreClasses} from "@/utils/vuextyping"
import {getModuleWrapper} from "@/utils/vuexmodule"
import {pushNotificationService} from "./plugins/pushNotificiationService"
import {jaguarSocketService} from "./plugins/jaguarSocketService"
import {dolphinSocketService} from "./plugins/dolphinSocketService"
import TableRow from "@/datamodels/base/tableRow"
import Datamodel from "@/datamodels/base/datamodel"
import DirectDM from "@/datamodels/directDM"
import GroupDM from "@/datamodels/groupDM"
import SkillDM from "@/datamodels/skillDM"
import MessageDM from "@/datamodels/messageDM"
import PhaseDM from "@/datamodels/phaseDM"
import ProjectDM from "@/datamodels/projectDM"
import TagDM from "@/datamodels/tagDM"
import UserDM from "@/datamodels/userDM"
import WorkflowDM from "@/datamodels/workflowDM"
import MemberDM from "@/datamodels/memberDM"
import NuggetRow from "@/datamodels/rows/nuggetRow"
import AssignmentCompletedRow from "@/datamodels/rows/assignmentCompletedRow"
import AssignmentDetailPhasesRow from "@/datamodels/rows/assignmentDetailPhasesRow"
import AssignmentDetailResourcesRow from "@/datamodels/rows/assignmentDetailResourcesRow"
import AssignmentInProgressRow from "@/datamodels/rows/assignmentInProgressRow"
import AssignmentNeedEstimateRow from "@/datamodels/rows/assignmentNeedEstimateRow"
import AssignmentUpcomingEstimatesRow from "@/datamodels/rows/assignmentUpcomingEstimatesRow"
import AssignmentUpcomingRow from "@/datamodels/rows/assignmentUpcomingRow"
import BadNewsDelayedNuggetsRow from "@/datamodels/rows/badNewsDelayedNuggetsRow"
import BadNewsOverdueEstimateRow from "@/datamodels/rows/badNewsOverdueEstimateRow"
import BadNewsOverdueTimecardRow from "@/datamodels/rows/badNewsOverdueTimecardRow"
import BadNewsOverdueTriageRow from "@/datamodels/rows/badNewsOverdueTimecardRow"
import GoodNewsArchiveRow from "@/datamodels/rows/goodNewsArchiveRow"
import GoodNewsBacklogRow from "@/datamodels/rows/goodNewsBacklogRow"
import GoodNewsScrumRow from "@/datamodels/rows/goodNewsScrumRow"
import GoodNewsNeedApprovalRow from "@/datamodels/rows/goodNewsNeedApprovalRow"
import GoodNewsProductionRow from "@/datamodels/rows/goodNewsProductionRow"
import GoodNewsTriageRow from "@/datamodels/rows/goodNewsTriageRow"
import GoodNewsUpcomingRow from "@/datamodels/rows/goodNewsUpcomingRow"
import LeadNeedApprovalRow from "@/datamodels/rows/leadNeedApprovalRow"
import LeadDelayedNuggetsRow from "@/datamodels/rows/leadDelayedNuggetsRow"
import LeadOverdueTimecardRow from "@/datamodels/rows/leadOverdueTimecardRow"
import LeadOverdueEstimateRow from "@/datamodels/rows/leadOverdueEstimateRow"
import LeadJournalReportRow from "@/datamodels/rows/leadJournalReportRow"
import NuggetReleasedRow from "@/datamodels/rows/nuggetReleasedRow"
import NuggetSearchRow from "@/datamodels/rows/nuggetSearchRow"
import NuggetSubscriptionsActiveRow from "@/datamodels/rows/nuggetSubscriptionsActiveRow"
import PayloadRow from "@/datamodels/rows/payloadRow"
import ProjectsActiveSprintsRow from "@/datamodels/rows/projectsActiveSprintsRow"
import ProjectsBackloggedSprintsRow from "@/datamodels/rows/projectsBackloggedSprintsRow"
import ProjectsAllProjectsRow from "@/datamodels/rows/projectsAllProjectsRow"
import ProjectsReleasedRow from "@/datamodels/rows/projectsReleasedRow"
import ReleasesActiveRow from "@/datamodels/rows/releasesActiveRow"
import SettingsCompanyCalendarRow from "@/datamodels/rows/settingsCompanyCalendarRow"
import SettingsDepartmentsRow from "@/datamodels/rows/settingsDepartmentsRow"
import SettingsGroupsRow from "@/datamodels/rows/settingsGroupsRow"
import SettingsPersonalCalendarRow from "@/datamodels/rows/settingsPersonalCalendarRow"
import SettingsSkillsRow from "@/datamodels/rows/settingsSkillsRow"
import SettingsTagsRow from "@/datamodels/rows/settingsTagsRow"
import SettingsUsersRow from "@/datamodels/rows/settingsUsersRow"
import TimeCardDetailTimeCardsRow from "@/datamodels/rows/timeCardDetailTimeCardsRow"
import ChatRoomMemberRow from "@/datamodels/rows/chatRoomMemberRow"
import InboxProjectsRow from "@/datamodels/rows/inboxProjectsRow"
import InboxReleasesRow from "@/datamodels/rows/inboxReleasesRow"
import InboxSprintRow from "@/datamodels/rows/inboxSprintsRow"
import InboxSprintNuggetsRow from "@/datamodels/rows/inboxSprintNuggetsRow"
import {AccountDS} from "./modules/datastore/accountDS"
import {ApplicationDS} from "./modules/datastore/applicationDS"
import {AssignmentCompletedCS} from "./modules/componentstore/assignmentCompletedCS"
import {AssignmentDetailCS} from "./modules/componentstore/assignmentDetailCS"
import {AssignmentDetailPhasesCS} from "./modules/componentstore/assignmentDetailPhasesCS"
import {AssignmentDetailResourcesCS} from "./modules/componentstore/assignmentDetailResourcesCS"
import {AssignmentDetailTimeCardsCS} from "./modules/componentstore/assignmentDetailTimeCardsCS"
import {AssignmentDS} from "./modules/datastore/assignmentDS"
import {AssignmentInProgressCS} from "./modules/componentstore/assignmentInProgressCS"
import {AssignmentNeedEstimateCS} from "./modules/componentstore/assignmentNeedEstimateCS"
import {AssignmentUpcomingEstimatesCS} from "./modules/componentstore/assignmentUpcomingEstimatesCS"
import {AssignmentUpcomingCS} from "./modules/componentstore/assignmentUpcomingCS"
import {AttachmentDocumentsCS} from "./modules/componentstore/attachmentDocumentsCS"
import {AttachmentDocumentsDS} from "./modules/datastore/attachmentDocumentsDS"
import {AttachmentLinkCS} from "./modules/componentstore/attachmentLinkCS"
import {BadgeCountCS} from "./modules/componentstore/badgeCountCS"
import {BadNewsDelayedNuggetsCS} from "./modules/componentstore/badNewsDelayedNuggetsCS"
import {BadNewsOverdueEstimateCS} from "./modules/componentstore/badNewsOverdueEstimateCS"
import {BadNewsOverdueTimecardCS} from "./modules/componentstore/badNewsOverdueTimecardCS"
import {BadNewsOverdueTriageCS} from "./modules/componentstore/badNewsOverdueTriageCS"
import {BusinessRule, BusinessRuleDS} from "./modules/datastore/businessRuleDS"
import {EntityChatCS} from "./modules/componentstore/entityChatCS"
import {JaguarSocketDS} from "./modules/datastore/jaguarSocketDS"
import {CompanyCalendarDetailCS} from "./modules/componentstore/companyCalendarDetailCS"
import {CreateNuggetCS} from "./modules/componentstore/createNuggetCS"
import {CreateProjectCS} from "./modules/componentstore/createProjectCS"
import {CreateReleaseCS} from "./modules/componentstore/createReleaseCS"
import {CreateHolidayCS} from "./modules/componentstore/createHolidayCS"
import { CompleteNuggetPopupCS } from "./modules/componentstore/completeNuggetPopupCS"
import {DeleteEmptyTimeCardPopupCS} from "./modules/componentstore/DeleteEmptyTimeCardPopupCS "
import {DateAndTimeDS} from "./modules/datastore/settingsDateAndTimeDS"
import {DetailSidebarCS} from "./modules/componentstore/detailsidebarCS"
import {DialogCS} from "./modules/componentstore/dialogCS"
import {DirectDS} from "./modules/datastore/directDS"
import {GoodNewsArchiveCS} from "./modules/componentstore/goodNewsArchiveCS"
import {GoodNewsBacklogCS} from "./modules/componentstore/goodNewsBacklogCS"
import {GoodNewsScrumCS} from "./modules/componentstore/goodNewsScrumCS"
import {GoodNewsNeedApprovalCS} from "./modules/componentstore/goodNewsNeedApprovalCS"
import {GoodNewsProductionCS} from "./modules/componentstore/goodNewsProductionCS"
import {GoodNewsTriageCS} from "./modules/componentstore/goodNewsTriageCS"
import {GoodNewsUpcomingCS} from "./modules/componentstore/goodNewsUpcomingCS"
import {GroupDS} from "./modules/datastore/groupDS"
import {GroupDetailCS} from "./modules/componentstore/groupDetailCS"
import {HolidayDS} from "./modules/datastore/holidayDS"
import {InvitationCS} from "./modules/componentstore/InvitationCS"
import {AttachmentLinkDS} from "./modules/datastore/attachmentLinkDS"
import {HolidayTypesDS} from "./modules/datastore/holidayTypesDS"
import {LeadNeedApprovalCS} from "./modules/componentstore/leadNeedApprovalCS"
import {LeadOverdueTimecardCS} from "./modules/componentstore/leadOverdueTimecardCS"
import {LeadOverdueEstimateCS} from "./modules/componentstore/leadOverdueEstimateCS"
import {LeadJournalReportCS} from "./modules/componentstore/leadJournalReportCS"
import {LeadDelayedNuggetsCS} from "./modules/componentstore/leadDelayedNuggetsCS"
import {MessageDS} from "./modules/datastore/messageDS"
import {AttachmentMediaDS} from "./modules/datastore/attachmentMediaDS"
import {NuggetAssignmentDS} from "./modules/datastore/nuggetAssignmentDS"
import {NuggetDetailCS} from "./modules/componentstore/nuggetDetailCS"
import {NuggetSummaryCS} from "./modules/componentstore/nuggetSummaryCS"
import {NuggetDS} from "./modules/datastore/nuggetDS"
import {NuggetPhasesDS} from "./modules/datastore/nuggetPhasesDS"
import {NuggetLastThirtyDaysCS} from "./modules/componentstore/nuggetLastThirtyDaysCS"
import {NuggetReleasedCS} from "./modules/componentstore/nuggetReleasedCS"
import {NuggetSearchCS} from "./modules/componentstore/nuggetSearchCS"
import {NuggetSubscriptionsActiveCS} from "./modules/componentstore/nuggetSubscriptionsActiveCS"
import {NuggetUnreadCS} from "./modules/componentstore/nuggetUnreadCS"
import {PeopleRoomsCS} from "./modules/componentstore/peopleRoomsCS"
import {ChatBufferCS} from "./modules/componentstore/chatBufferCS"
import {CacheControlDs} from "./modules/datastore/cacheControlDS"
import {GroupChatCS} from "./modules/componentstore/groupChatCS"
import {GroupRoomsCS} from "./modules/componentstore/groupRoomsCS"
import {PayloadDS} from "./modules/datastore/payloadDS"
import {PayloadCS} from "./modules/componentstore/payloadCS"
import {PersonalCalendarDetailCS} from "./modules/componentstore/personalCalendarDetailCS"
import {PhaseDetailCS} from "./modules/componentstore/phasesDetailCS"
import {PhaseDS} from "./modules/datastore/phaseDS"
import {PhaseResourceDS} from "./modules/datastore/phaseResourcesDS"
import {PriorityDS} from "./modules/datastore/priorityDS"
import {ProfileDS} from "./modules/datastore/profileDS"
import {ProjectDetailCS} from "./modules/componentstore/projectDetailCS"
import {SprintDetailCS} from "./modules/componentstore/sprintDetailCS"
import {ProjectDS} from "./modules/datastore/projectDS"
import {ProjectPhaseDS} from "./modules/datastore/projectPhaseDS"
import {ProjectsActiveSprintsCS} from "./modules/componentstore/projectsActiveSprintsCS"
import {ProjectsBackloggedSprintsCS} from "./modules/componentstore/projectsBackloggedSprintsCS"
import {ProjectsAllProjectsCS} from "./modules/componentstore/projectsAllProjectsCS"
import {ProjectsReleasedCS} from "./modules/componentstore/projectsReleasedCS"
import {RelatedNuggetDS} from "./modules/datastore/relatedNuggetDS"
import {ReleaseDetailCS} from "./modules/componentstore/releaseDetailCS"
import {ReleaseDS} from "./modules/datastore/releaseDS"
import {ReleasesActiveCS} from "./modules/componentstore/releasesActiveCS"
import {ReleasesReleasedCS} from "./modules/componentstore/releasesReleasedCS"
import {ScreenRecorderCS} from "./modules/componentstore/ScreenRecorderCS"
import {SettingsCompanyCalendarCS} from "./modules/componentstore/settingsCompanyCalendarCS"
import {SettingsDateAndTimeCS} from "./modules/componentstore/settingsDateAndTimeCS"
import {SettingsDefaultSettingsCS} from "./modules/componentstore/settingsDefaultSettingsCS"
import {SettingsDepartmentsCS} from "./modules/componentstore/settingsDepartmentsCS"
import {SettingsDS} from "./modules/datastore/settingsDS"
import {SettingsGroupsCS} from "./modules/componentstore/settingsGroupsCS"
import {SettingsHeaderCS} from "./modules/componentstore/settingsHeaderCS"
import {SettingsPersonalCalendarCS} from "./modules/componentstore/settingsPersonalCalendarCS"
import {SettingsPhasesCS} from "./modules/componentstore/settingsPhasesCS"
import {SettingsSkillsCS} from "./modules/componentstore/settingsSkillsCS"
import {SettingsTagsCS} from "./modules/componentstore/settingsTagsCS"
import {SettingsUserProfileCS} from "./modules/componentstore/settingsUserProfileCS"
import {SettingsUsersCS} from "./modules/componentstore/settingsUsersCS"
import {SettingsWorkflowsCS} from "./modules/componentstore/settingsWorkflowsCS"
import {SkillDetailCS} from "./modules/componentstore/skillsDetailCS"
import {SkillDS} from "./modules/datastore/skillDS"
import {StatusDS} from "./modules/datastore/statusDS"
import {PeriodsDS} from "./modules/datastore/periodsDS"
import {TagDetailCS} from "./modules/componentstore/tagDetailCS"
import {TagDS} from "./modules/datastore/tagDS"
import {TimeCardDetailCS} from "./modules/componentstore/timeCardDetailCS"
import {TimeCardDetailEstimateCS} from "./modules/componentstore/timeCardDetailEstimateCS"
import {TimeCardDetailOnHoldCS} from "./modules/componentstore/timeCardDetailOnHoldCS"
import {TimeCardDetailReportCS} from "./modules/componentstore/timeCardDetailReportCS"
import {TimeCardDetailTimeCardsCS} from "./modules/componentstore/timeCardDetailTimeCardsCS"
import {TimeCardDS} from "./modules/datastore/timeCardDS"
import {TypeDS} from "./modules/datastore/typeDS"
import {UserDS} from "./modules/datastore/userDS"
import {UserDepartmentDS} from "./modules/datastore/userDepartmentDS"
import {UserSkillDS} from "./modules/datastore/userSkillDS"
import {ChatRoomMemberDS} from "./modules/datastore/chatRoomMemberDS"
import {UserSpecialtyDS} from "./modules/datastore/userSpecialityDS"
import {UserGroupDS} from "./modules/datastore/userGroupDS"
import {UserDetailCS} from './modules/componentstore/userDetailCS';
import {UserSkillsCS} from "./modules/componentstore/userSkillsCS"
import {WorkflowDetailCS} from "./modules/componentstore/workflowDetailCS"
import {AddPhaseCS} from "./modules/componentstore/addPhaseCS"
import {WorkflowDS} from "./modules/datastore/workflowDS"
import {WorkflowPhasesCS} from "./modules/componentstore/workflowPhasesCS"
import {IProjectsProjectNuggetCS, ProjectsProjectNuggetCS} from "./modules/componentstore/projectsProjectNuggetCS"
import ProjectsProjectNuggetRow from "@/datamodels/rows/projectsProjectNuggetRow"
import {PermissionDS} from "./modules/datastore/permissionDS"
import {CreateGroupCS} from "./modules/componentstore/createGroupCS"
import {CreateTagCS} from "./modules/componentstore/createTagCS"
import {CreateWorkflowCS} from "./modules/componentstore/createWorkflowCS"
import {DepartmentDS} from "./modules/datastore/departmentDS"
import {DepartmentDetailCS} from "./modules/componentstore/departmentDetailCS"
import {CreateDepartmentCS} from "./modules/componentstore/createDepartmentCS"
import {TableFilterCS} from "./modules/componentstore/tableFilterCS"
import {CreateSkillCS} from "./modules/componentstore/createSkillCS"
import {TempoDS} from "./modules/datastore/tempoDS"
import {CreatePhaseCS} from "./modules/componentstore/createPhaseCS"
import {BreadCrumbsCS} from './modules/componentstore/breadcrumbsCS';
import TableSubmoduleRow from "@/datamodels/base/tableSubmoduleRow"
import {PeopleChatCS} from "./modules/componentstore/peopleChatCS"
import {AttachmentMediaCS} from "./modules/componentstore/attachmentMediaCS"
import {AttachmentCS} from "./modules/componentstore/attachmentCS"
import {GroupDetailsDS} from "./modules/datastore/groupDetailsDS"
import GroupDetailDM from "@/datamodels/groupDetailDM"
import {SettingsChangePasswordCS} from "./modules/componentstore/settingsChangePasswordCS"
import {SessionDS} from "./modules/datastore/sessionDS"
import {UpdateProfilePictureCS} from "./modules/componentstore/updateProfilePictureCS"
import {ChatRoomMemberCS} from "./modules/componentstore/chatRoomMemberCS"
import {VideoConferenceCS} from "./modules/componentstore/videoConferenceCS"
import {GlobalVideoConferenceCS} from "./modules/componentstore/globalVideoConferenceCS"
import {InboxNuggetCS} from "./modules/componentstore/inboxNuggetCS"
import {InboxProjectsCS} from "./modules/componentstore/inboxProjectsCS"
import {InboxReleasesCS} from "./modules/componentstore/inboxReleasesCS"
import {InboxSprintsCS} from "./modules/componentstore/inboxSprintsCS"
import {DolphinSocketDS} from "./modules/datastore/dolphinSocketDS"
import {InboxSprintNuggetsCS} from "./modules/componentstore/inboxSprintNuggetsCS"
import {InboxProjectNuggetsCS} from "./modules/componentstore/inboxProjectNuggetsCS" 
import {InboxReleaseNuggetsCS} from "./modules/componentstore/inboxReleaseNuggetsCS"
import {ReportMemberCS} from "./modules/componentstore/reportMemberCS"
import {ReportInProgressCS} from "./modules/componentstore/reportInProgressCS"
import {ReportUpcomingCS} from "./modules/componentstore/reportUpcomingCS"
import {ReportEstimatesCS} from "./modules/componentstore/reportEstimatesCS"
import {ReportCompletedCS} from "./modules/componentstore/reportCompletedCS"
import {IProjectsSprintNuggetCS, ProjectsSprintNuggetCS} from "./modules/componentstore/projectsSprintNuggetCS"
import {UpdateSprintCS} from "./modules/componentstore/updateSprintCS"
import ProjectsSprintNuggetRow from "@/datamodels/rows/projectsSprintNuggetRow"
import SprintDM from "@/datamodels/sprintDM"
import {CreateSprintCS} from "./modules/componentstore/createSprintCS"
import {SprintDropdownCS} from "./modules/componentstore/sprintDropdownCS"
import {SprintDS} from "./modules/datastore/sprintDS"
import {SprintsViewDS} from "./modules/datastore/sprintsViewDS"
import { AppVersion } from "@/utils/constants"

Vue.use(Vuex)

export interface IRootState {
	accountds: AccountDS
	addphasecs: AddPhaseCS
	applicationds: ApplicationDS
	assignmentcompletedcs: AssignmentCompletedCS
	assignmentdetailcs: AssignmentDetailCS
	assignmentdetailphasescs: AssignmentDetailPhasesCS
	assignmentdetailresourcescs: AssignmentDetailResourcesCS
	assignmentdetailtimecardscs: AssignmentDetailTimeCardsCS
	assignmentds: AssignmentDS
	assignmentinprogresscs: AssignmentInProgressCS
	assignmentneedestimatecs: AssignmentNeedEstimateCS
	assignmentupcomingcs: AssignmentUpcomingCS
	assignmentupcomingestimatescs: AssignmentUpcomingEstimatesCS
	attachmentcs: AttachmentCS
	attachmentdocumentscs: AttachmentDocumentsCS
	attachmentdocumentsds: AttachmentDocumentsDS
	attachmentlinkcs: AttachmentLinkCS
	attachmentlinkds: AttachmentLinkDS
	attachmentmediacs: AttachmentMediaCS
	attachmentmediads: AttachmentMediaDS
	badgecountcs: BadgeCountCS
	badnewsdelayednuggetscs: BadNewsDelayedNuggetsCS
	badnewsoverdueestimatecs: BadNewsOverdueEstimateCS
	badnewsoverduetimecardcs: BadNewsOverdueTimecardCS
	badnewsoverduetriagecs: BadNewsOverdueTriageCS
	breadcrumbscs: BreadCrumbsCS
	businessruleds: BusinessRuleDS
	chatbuffercs: ChatBufferCS
	chatmessagesocketds: JaguarSocketDS
	chatroommembercs: ChatRoomMemberCS
	companycalendardetailcs: CompanyCalendarDetailCS
	createdepartmentcs: CreateDepartmentCS
	creategroupcs: CreateGroupCS
	createholidaycs: CreateHolidayCS
	createnuggetcs: CreateNuggetCS
	createphasecs: CreatePhaseCS
	createprojectcs: CreateProjectCS
	createreleasecs: CreateReleaseCS
	createskillcs: CreateSkillCS
	createsprintcs: CreateSprintCS
	createtagcs: CreateTagCS
	createworkflowcs: CreateWorkflowCS
	completenuggetpopupcs: CompleteNuggetPopupCS
	deleteemptytimecardcs: DeleteEmptyTimeCardPopupCS
	dateandtimeds: DateAndTimeDS
	departmentdetailcs: DepartmentDetailCS
	departmentds: DepartmentDS
	detailsidebarcs: DetailSidebarCS
	dialogcs: DialogCS
	directds: DirectDS
	dolphinsocketds: DolphinSocketDS
	entitychatcs: EntityChatCS
	goodnewsarchivecs: GoodNewsArchiveCS
	goodnewsbacklogcs: GoodNewsBacklogCS
	goodnewsneedapprovalcs: GoodNewsNeedApprovalCS
	goodnewsproductioncs: GoodNewsProductionCS
	goodnewsscrumcs: GoodNewsScrumCS
	goodnewstriagecs: GoodNewsTriageCS
	goodnewsupcomingcs: GoodNewsUpcomingCS
	groupchatcs: GroupChatCS
	groupdetailcs: GroupDetailCS
	groupdetailsds: GroupDetailsDS
	groupds: GroupDS
	grouproomscs: GroupRoomsCS
	holidayds: HolidayDS
	holidaytypesds: HolidayTypesDS
	videoconferencecs: VideoConferenceCS
	globalvideoconferencecs: GlobalVideoConferenceCS
	inboxnuggetcs: InboxNuggetCS
	inboxprojectscs: InboxProjectsCS
	inboxreleasescs: InboxReleasesCS
	inboxsprintscs: InboxSprintsCS
	inboxsprintnuggetscs: InboxSprintNuggetsCS
	inboxprojectnuggetscs: InboxProjectNuggetsCS 
	inboxreleasenuggetscs: InboxReleaseNuggetsCS
	invitationcs: InvitationCS
	jaguarsocketds: JaguarSocketDS
	leaddelayednuggetscs: LeadDelayedNuggetsCS
	leadjournalreportcS: LeadJournalReportCS
	leadneedapprovalcS: LeadNeedApprovalCS
	leadoverdueestimatecS: LeadOverdueEstimateCS
	leadoverduetimecardcs: LeadOverdueTimecardCS
	messageds: MessageDS
	nuggetassignmentds: NuggetAssignmentDS
	nuggetdetailcs: NuggetDetailCS
	nuggetsummarycs: NuggetSummaryCS
	nuggetds: NuggetDS
	nuggetlastthirtydayscs: NuggetLastThirtyDaysCS
	nuggetphasesds: NuggetPhasesDS
	nuggetreleasedcs: NuggetReleasedCS
	nuggetsearchcs: NuggetSearchCS
	nuggetsubscriptionsactivecs: NuggetSubscriptionsActiveCS
	nuggetunreadcs: NuggetUnreadCS
	payloadds: PayloadDS
	payloadcs: PayloadCS
	peoplechatcs: PeopleChatCS
	peopleroomscs: PeopleRoomsCS
	permissionds: PermissionDS
	personalcalendardetailcs: PersonalCalendarDetailCS
	phasedetailcs: PhaseDetailCS
	phaseds: PhaseDS
	phaseresourcesds: PhaseResourceDS
	priorityds: PriorityDS
	profileds: ProfileDS
	projectdetailcs: ProjectDetailCS
	sprintdetailcs: SprintDetailCS
	projectds: ProjectDS
	projectphaseds: ProjectPhaseDS
	projectssctivesprintscs: ProjectsActiveSprintsCS
	projectsallprojectscs: ProjectsAllProjectsCS
	projectsbackloggedsprintscs: ProjectsBackloggedSprintsCS
	projectsprojectnuggetcs: IProjectsProjectNuggetCS
	projectsreleasedcs: ProjectsReleasedCS
	projectssprintnuggetcs: IProjectsSprintNuggetCS
	relatednuggetds: RelatedNuggetDS
	releasedetailcs: ReleaseDetailCS
	releaseds: ReleaseDS
	releasesactivecs: ReleasesActiveCS
	releasesreleasedcs: ReleasesReleasedCS
	reportmembercs: ReportMemberCS
	reportinprogresscs: ReportInProgressCS
	reportupcomingcs: ReportUpcomingCS
	reportestimatescs: ReportEstimatesCS
	reportcompletedcs: ReportCompletedCS
	sessionds: SessionDS
	screenrecordercs: ScreenRecorderCS
	settingschangepasswordcs: SettingsChangePasswordCS
	settingscompanycalendarcs: SettingsCompanyCalendarCS
	settingsdateandtimecs: SettingsDateAndTimeCS
	settingsdefaultsettingscs: SettingsDefaultSettingsCS
	settingsdepartmentscs: SettingsDepartmentsCS
	settingsds: SettingsDS
	settingsgroupscs: SettingsGroupsCS
	settingsheadercs: SettingsHeaderCS
	settingspersonalcalendarcs: SettingsPersonalCalendarCS
	settingsphasescs: SettingsPhasesCS
	settingsskillscs: SettingsSkillsCS
	settingstagscs: SettingsTagsCS
	settingsuserprofilecs: SettingsUserProfileCS
	settingsuserscs: SettingsUsersCS
	settingsworkflowscs: SettingsWorkflowsCS
	skilldetailcs: SkillDetailCS
	skillds: SkillDS
	sprintdropdowncs: SprintDropdownCS
	sprintds: SprintDS
	sprintsviewds: SprintsViewDS
	statusds: StatusDS
	periodsds: PeriodsDS
	tablefiltercs: TableFilterCS
	tagdetailcs: TagDetailCS
	tagds: TagDS
	cachecontrolds: CacheControlDs
	tempods: TempoDS
	timecarddetailcs: TimeCardDetailCS
	timecarddetailestimatecs: TimeCardDetailEstimateCS
	timecarddetailonholdcs: TimeCardDetailOnHoldCS
	timecarddetailreportcs: TimeCardDetailReportCS
	timecarddetailtimecardscs: TimeCardDetailTimeCardsCS
	timecardds: TimeCardDS
	typeds: TypeDS
	updateprofilepicturecs: UpdateProfilePictureCS
	updatesprintcs: UpdateSprintCS
	userdepartmentds: UserDepartmentDS
	chatroommemberds: ChatRoomMemberDS
	userdetailcs: UserDetailCS
	userds: UserDS
	usergroupds: UserGroupDS
	userskillds: UserSkillDS
	userskillscs: UserSkillsCS
	userspecialtyds: UserSpecialtyDS
	workflowdetailcs: WorkflowDetailCS
	workflowds: WorkflowDS
	workflowphasescs: WorkflowPhasesCS
    
}

LocalForage.config({
	driver: LocalForage.INDEXEDDB,
	name: "Maestro",
})

const classes: (typeof Datamodel | typeof BusinessRule)[] = [
	AssignmentCompletedRow,
	AssignmentDetailPhasesRow,
	AssignmentDetailResourcesRow,
	AssignmentInProgressRow,
	AssignmentNeedEstimateRow,
	AssignmentUpcomingEstimatesRow,
	AssignmentUpcomingRow,
	BadNewsDelayedNuggetsRow,
	BadNewsOverdueEstimateRow,
	BadNewsOverdueTimecardRow,
	BadNewsOverdueTriageRow,
	BusinessRule,
	ChatRoomMemberRow,
	DirectDM,
	GoodNewsArchiveRow,
	GoodNewsBacklogRow,
	GoodNewsNeedApprovalRow,
	GoodNewsProductionRow,
	GoodNewsScrumRow,
	GoodNewsTriageRow,
	GoodNewsUpcomingRow,
	GroupDetailDM,
	GroupDM,
	InboxProjectsRow,
	InboxReleasesRow,
	InboxSprintRow,
	InboxSprintNuggetsRow,
	LeadDelayedNuggetsRow,
	LeadJournalReportRow,
	LeadNeedApprovalRow,
	LeadOverdueEstimateRow,
	LeadOverdueTimecardRow,
	MemberDM,
	MessageDM,
	NuggetReleasedRow,
	NuggetRow,
	NuggetSearchRow,
	NuggetSubscriptionsActiveRow,
	PhaseDM,
	ProjectDM,
	PayloadRow,
	ProjectsActiveSprintsRow,
	ProjectsAllProjectsRow,
	ProjectsBackloggedSprintsRow,
	ProjectsProjectNuggetRow,
	ProjectsReleasedRow,
	ProjectsSprintNuggetRow,
	ReleasesActiveRow,
	SettingsCompanyCalendarRow,
	SettingsDepartmentsRow,
	SettingsGroupsRow,
	SettingsPersonalCalendarRow,
	SettingsSkillsRow,
	SettingsTagsRow,
	SettingsUsersRow,
	SkillDM,
	SprintDM,
	TableRow,
	TableSubmoduleRow,
	TagDM,
	TimeCardDetailTimeCardsRow,
	UserDM,
	WorkflowDM
]

const vuexLocalStorage: VuexPersistence<IRootState> = new VuexPersistence({
	key: "mdb-" + AppVersion,
	// @ts-ignore
	storage: LocalForage,
	async restoreState(key: string): Promise<IRootState> {
		const state: unknown = await LocalForage.getItem(key)
		return restoreClasses(state, classes)
	},
	async saveState(key: string, state: {}, storage: Storage | AsyncStorage | undefined): Promise<void> {
		// @ts-ignore
		if ((state as IRootState).applicationds?.isPersisting) {
			// @ts-ignore
			await storage.setItem(key, state)
		}
	},
	modules: [
		"accountds",
		"applicationds",
		"badgecountcs",
		"businessruleds",
		"chatbuffercs",
		"directds",
		"groupdetailsds",
		"groupds",
		"grouproomscs",
		"holidaytypesds",
		"peopleroomscs",
		"phaseds",
		"profileds",
		"projectds",
		"projectphaseds",
		"releaseds",
		"skillds",
		"sprintds",
		"tagds",
		"userds",
		"workflowds"
	],
	asyncStorage: true,
})

const store: Store<IRootState> = new Vuex.Store<IRootState>({
	modules: {
		accountds: AccountDS,
		addphasecs: AddPhaseCS,
		applicationds: ApplicationDS,
		assignmentcompletedcs: AssignmentCompletedCS,
		assignmentdetailcs: AssignmentDetailCS,
		assignmentdetailphasescs: AssignmentDetailPhasesCS,
		assignmentdetailresourcescs: AssignmentDetailResourcesCS,
		assignmentdetailtimecardscs: AssignmentDetailTimeCardsCS,
		assignmentds: AssignmentDS,
		assignmentinprogresscs: AssignmentInProgressCS,
		assignmentneedestimatecs: AssignmentNeedEstimateCS,
		assignmentupcomingcs: AssignmentUpcomingCS,
		assignmentupcomingestimatescs: AssignmentUpcomingEstimatesCS,
		attachmentcs: AttachmentCS,
		attachmentdocumentscs: AttachmentDocumentsCS,
		attachmentdocumentsds: AttachmentDocumentsDS,
		attachmentlinkcs: AttachmentLinkCS,
		attachmentlinkds: AttachmentLinkDS,
		attachmentmediacs: AttachmentMediaCS,
		attachmentmediads: AttachmentMediaDS,
		badgecountcs: BadgeCountCS,
		badnewsdelayednuggetscs: BadNewsDelayedNuggetsCS,
		badnewsoverdueestimatecs: BadNewsOverdueEstimateCS,
		badnewsoverduetimecardcs: BadNewsOverdueTimecardCS,
		badnewsoverduetriagecs: BadNewsOverdueTriageCS,
		breadcrumbscs: BreadCrumbsCS,
		businessruleds: BusinessRuleDS,
		chatbuffercs: ChatBufferCS,
		chatroommembercs: ChatRoomMemberCS,
		companycalendardetailcs: CompanyCalendarDetailCS,
		createdepartmentcs: CreateDepartmentCS,
		creategroupcs: CreateGroupCS,
		createholidaycs: CreateHolidayCS,
		createnuggetcs: CreateNuggetCS,
		createphasecs: CreatePhaseCS,
		createprojectcs: CreateProjectCS,
		createreleasecs: CreateReleaseCS,
		createskillcs: CreateSkillCS,
		createsprintcs: CreateSprintCS,
		createtagcs: CreateTagCS,
		createworkflowcs: CreateWorkflowCS,
		completenuggetpopupcs: CompleteNuggetPopupCS,
		deleteemptytimecardcs: DeleteEmptyTimeCardPopupCS,
		dateandtimeds: DateAndTimeDS,
		departmentdetailcs: DepartmentDetailCS,
		departmentds: DepartmentDS,
		detailsidebarcs: DetailSidebarCS,
		dialogcs: DialogCS,
		directds: DirectDS,
		dolphinsocketds: DolphinSocketDS,
		entitychatcs: EntityChatCS,
		goodnewsarchivecs: GoodNewsArchiveCS,
		goodnewsbacklogcs: GoodNewsBacklogCS,
		goodnewsneedapprovalcs: GoodNewsNeedApprovalCS,
		goodnewsproductioncs: GoodNewsProductionCS,
		goodnewsscrumcs: GoodNewsScrumCS,
		goodnewstriagecs: GoodNewsTriageCS,
		goodnewsupcomingcs: GoodNewsUpcomingCS,
		groupchatcs: GroupChatCS,
		groupdetailcs: GroupDetailCS,
		groupdetailsds: GroupDetailsDS,
		groupds: GroupDS,
		grouproomscs: GroupRoomsCS,
		holidayds: HolidayDS,
		holidaytypesds: HolidayTypesDS,
		videoconferencecs: VideoConferenceCS,
		globalvideoconferencecs: GlobalVideoConferenceCS,
		inboxnuggetcs: InboxNuggetCS,
		inboxprojectscs: InboxProjectsCS,
		inboxreleasescs: InboxReleasesCS,
		inboxsprintscs: InboxSprintsCS,
		inboxsprintnuggetscs : InboxSprintNuggetsCS,
		inboxprojectnuggetscs : InboxProjectNuggetsCS,
		inboxreleasenuggetscs : InboxReleaseNuggetsCS,
		invitationcs: InvitationCS,
		jaguarsocketds: JaguarSocketDS,
		leaddelayednuggetscs: LeadDelayedNuggetsCS,
		leadjournalreportcs: LeadJournalReportCS,
		leadneedapprovalcs: LeadNeedApprovalCS,
		leadoverdueestimatecs: LeadOverdueEstimateCS,
		leadoverduetimecardcs: LeadOverdueTimecardCS,
		messageds: MessageDS,
		nuggetassignmentds: NuggetAssignmentDS,
		nuggetdetailcs: NuggetDetailCS,
		nuggetsummarycs: NuggetSummaryCS,
		nuggetds: NuggetDS,
		nuggetlastthirtydayscs: NuggetLastThirtyDaysCS,
		nuggetphasesds: NuggetPhasesDS,
		nuggetreleasedcs: NuggetReleasedCS,
		nuggetsearchcs: NuggetSearchCS,
		nuggetsubscriptionsactivecs: NuggetSubscriptionsActiveCS,
		nuggetunreadcs: NuggetUnreadCS,
		peoplechatcs: PeopleChatCS,
		peopleroomscs: PeopleRoomsCS,
		permissionds: PermissionDS,
		personalcalendardetailcs: PersonalCalendarDetailCS,
		phasedetailcs: PhaseDetailCS,
		phaseds: PhaseDS,
		phaseresourcesds: PhaseResourceDS,
		priorityds: PriorityDS,
		profileds: ProfileDS,
		projectdetailcs: ProjectDetailCS,
		sprintdetailcs: SprintDetailCS,
		payloadds: PayloadDS,
		payloadcs: PayloadCS,
		projectds: ProjectDS,
		projectphaseds: ProjectPhaseDS,
		projectsactivesprintscs: ProjectsActiveSprintsCS,
		projectsallprojectscs: ProjectsAllProjectsCS,
		projectsbackloggedsprintscs: ProjectsBackloggedSprintsCS,
		projectsprojectnuggetcs: ProjectsProjectNuggetCS,
		projectsreleasedcs: ProjectsReleasedCS,
		projectssprintnuggetcs: ProjectsSprintNuggetCS,
		relatednuggetds: RelatedNuggetDS,
		releasedetailcs: ReleaseDetailCS,
		releaseds: ReleaseDS,
		releasesactivecs: ReleasesActiveCS,
		releasesreleasedcs: ReleasesReleasedCS,
		reportmembercs: ReportMemberCS,
		reportinprogresscs: ReportInProgressCS,
		reportupcomingcs: ReportUpcomingCS,
		reportestimatescs: ReportEstimatesCS,
		reportcompletedcs: ReportCompletedCS,
		screenrecordercs: ScreenRecorderCS,
		sessionds: SessionDS,
		settingschangepasswordcs: SettingsChangePasswordCS,
		settingscompanycalendarcs: SettingsCompanyCalendarCS,
		settingsdateandtimecs: SettingsDateAndTimeCS,
		settingsdefaultsettingscs: SettingsDefaultSettingsCS,
		settingsdepartmentscs: SettingsDepartmentsCS,
		settingsds: SettingsDS,
		settingsgroupscs: SettingsGroupsCS,
		settingsheadercs: SettingsHeaderCS,
		settingspersonalcalendarcs: SettingsPersonalCalendarCS,
		settingsphasescs: SettingsPhasesCS,
		settingsskillscs: SettingsSkillsCS,
		settingstagscs: SettingsTagsCS,
		settingsuserprofilecs: SettingsUserProfileCS,
		settingsuserscs: SettingsUsersCS,
		settingsworkflowscs: SettingsWorkflowsCS,
		skilldetailcs: SkillDetailCS,
		skillds: SkillDS,
		sprintdropdowncs: SprintDropdownCS,
		sprintds: SprintDS,
		sprintsviewds: SprintsViewDS,
		statusds: StatusDS,
		periodsds: PeriodsDS,
		tablefiltercs: TableFilterCS,
		tagdetailcs: TagDetailCS,
		tagds: TagDS,
		cachecontrolds: CacheControlDs,
		tempods: TempoDS,
		timecarddetailcs: TimeCardDetailCS,
		timecarddetailestimatecs: TimeCardDetailEstimateCS,
		timecarddetailonholdcs: TimeCardDetailOnHoldCS,
		timecarddetailreportcs: TimeCardDetailReportCS,
		timecarddetailtimecardscs: TimeCardDetailTimeCardsCS,
		timecardds: TimeCardDS,
		typeds: TypeDS,
		updateprofilepicturecs: UpdateProfilePictureCS,
		updatesprintcs: UpdateSprintCS,
		userdepartmentds: UserDepartmentDS,
		chatroommemberds: ChatRoomMemberDS,
		userdetailcs: UserDetailCS,
		userds: UserDS,
		usergroupds: UserGroupDS,
		userskillds: UserSkillDS,
		userskillscs: UserSkillsCS,
		userspecialtyds: UserSpecialtyDS,
		workflowdetailcs: WorkflowDetailCS,
		workflowds: WorkflowDS,
		workflowphasescs: WorkflowPhasesCS
	} as ModuleTree<Readonly<IRootState>>,
	// Enforce strick declaration type above, so it must match IRootState, if any declaration is there in IRootState but missing in here, then it will throw errors
	plugins: [vuexLocalStorage.plugin, jaguarSocketService, dolphinSocketService,  pushNotificationService],
})

export default store

// CSModules sorted

export const AddPhaseCSModule = getModuleWrapper(AddPhaseCS, store)
export const AssignmentCompletedCSModule = getModuleWrapper(AssignmentCompletedCS, store)
export const AssignmentDetailCSModule = getModuleWrapper(AssignmentDetailCS, store)
export const AssignmentDetailPhasesCSModule = getModuleWrapper(AssignmentDetailPhasesCS, store)
export const AssignmentDetailResourcesCSModule = getModuleWrapper(AssignmentDetailResourcesCS, store)
export const AssignmentDetailTimeCardsCSModule = getModuleWrapper(AssignmentDetailTimeCardsCS, store)
export const AssignmentInProgressCSModule = getModuleWrapper(AssignmentInProgressCS, store)
export const AssignmentNeedEstimateCSModule = getModuleWrapper(AssignmentNeedEstimateCS, store)
export const AssignmentUpcomingCSModule = getModuleWrapper(AssignmentUpcomingCS, store)
export const AssignmentUpcomingEstimatesCSModule = getModuleWrapper(AssignmentUpcomingEstimatesCS, store)
export const AttachmentCSModule = getModuleWrapper(AttachmentCS, store);
export const AttachmentDocumentsCSModule = getModuleWrapper(AttachmentDocumentsCS, store)
export const AttachmentLinkCSModule = getModuleWrapper(AttachmentLinkCS, store)
export const AttachmentMediaCSModule = getModuleWrapper(AttachmentMediaCS, store)
export const BadgeCountCSModule = getModuleWrapper(BadgeCountCS, store)
export const BadNewsDelayedNuggetsCSModule = getModuleWrapper(BadNewsDelayedNuggetsCS, store)
export const BadNewsOverdueEstimateCSModule = getModuleWrapper(BadNewsOverdueEstimateCS, store)
export const BadNewsOverdueTimecardCSModule = getModuleWrapper(BadNewsOverdueTimecardCS, store)
export const BadNewsOverdueTriageCSModule = getModuleWrapper(BadNewsOverdueTriageCS, store)
export const BreadCrumbsCSModule = getModuleWrapper(BreadCrumbsCS, store)
export const chatBufferCSModule = getModuleWrapper(ChatBufferCS, store)
export const ChatRoomMemberCSModule = getModuleWrapper(ChatRoomMemberCS, store)
export const CompanyCalendarDetailCSModule = getModuleWrapper(CompanyCalendarDetailCS, store)
export const CreateDepartmentCSModule = getModuleWrapper(CreateDepartmentCS, store)
export const CreateGroupCSModule = getModuleWrapper(CreateGroupCS, store)
export const CreateHolidayCSModule = getModuleWrapper(CreateHolidayCS, store)
export const CreateNuggetCSModule = getModuleWrapper(CreateNuggetCS, store)
export const CreatePhaseCSModule = getModuleWrapper(CreatePhaseCS, store)
export const CreateProjectCSModule = getModuleWrapper(CreateProjectCS, store)
export const CreateReleaseCSModule = getModuleWrapper(CreateReleaseCS, store)
export const CreateSkillCSModule = getModuleWrapper(CreateSkillCS, store)
export const CreateSprintCSModule = getModuleWrapper(CreateSprintCS, store)
export const CreateTagCSModule = getModuleWrapper(CreateTagCS, store)
export const CreateWorkflowCSModule = getModuleWrapper(CreateWorkflowCS, store)
export const DepartmentDetailCSModule = getModuleWrapper(DepartmentDetailCS, store)
export const CompleteNuggetPopupCSModule = getModuleWrapper(CompleteNuggetPopupCS, store)
export const DeleteEmptyTimeCardPopupCSModule = getModuleWrapper(DeleteEmptyTimeCardPopupCS, store)
export const DetailSidebarCSModule = getModuleWrapper(DetailSidebarCS, store)
export const DialogCSModule = getModuleWrapper(DialogCS, store)
export const EntityChatCSModule = getModuleWrapper(EntityChatCS, store)
export const GoodNewsArchiveCSModule = getModuleWrapper(GoodNewsArchiveCS, store)
export const GoodNewsBacklogCSModule = getModuleWrapper(GoodNewsBacklogCS, store)
export const GoodNewsNeedApprovalCSModule = getModuleWrapper(GoodNewsNeedApprovalCS, store)
export const GoodNewsProductionCSModule = getModuleWrapper(GoodNewsProductionCS, store)
export const GoodNewsScrumCSModule = getModuleWrapper(GoodNewsScrumCS, store)
export const GoodNewsTriageCSModule = getModuleWrapper(GoodNewsTriageCS, store)
export const GoodNewsUpcomingCSModule = getModuleWrapper(GoodNewsUpcomingCS, store)
export const GroupChatCSModule = getModuleWrapper(GroupChatCS, store)
export const GroupDetailCSModule = getModuleWrapper(GroupDetailCS, store)
export const GroupRoomsCSModule = getModuleWrapper(GroupRoomsCS, store)
export const VideoConferenceCSModule = getModuleWrapper(VideoConferenceCS, store)
export const GlobalVideoConferenceCSModule = getModuleWrapper(GlobalVideoConferenceCS, store)
export const InboxNuggetCSModule = getModuleWrapper(InboxNuggetCS, store)
export const InboxProjectsCSModule = getModuleWrapper(InboxProjectsCS, store)
export const InboxReleasesCSModule = getModuleWrapper(InboxReleasesCS, store)
export const InboxSprintCSModule = getModuleWrapper(InboxSprintsCS, store)
export const InboxSprintsCSModule = getModuleWrapper(InboxSprintsCS, store)
export const InboxSprintNuggetsCSModule = getModuleWrapper(InboxSprintNuggetsCS, store)
export const InboxProjectNuggetsCSModule = getModuleWrapper(InboxProjectNuggetsCS, store)
export const InboxReleaseNuggetsCSModule = getModuleWrapper(InboxReleaseNuggetsCS, store)
export const InvitationCSModule = getModuleWrapper(InvitationCS, store)
export const LeadDelayedNuggetsCSModule = getModuleWrapper(LeadDelayedNuggetsCS, store)
export const LeadJournalReportCSModule = getModuleWrapper(LeadJournalReportCS, store)
export const LeadNeedApprovalCSModule = getModuleWrapper(LeadNeedApprovalCS, store)
export const LeadOverdueEstimateCSModule = getModuleWrapper(LeadOverdueEstimateCS, store)
export const LeadOverdueTimecardCSModule = getModuleWrapper(LeadOverdueTimecardCS, store)
export const NuggetDetailCSModule = getModuleWrapper(NuggetDetailCS, store)
export const NuggetSummaryCSModule = getModuleWrapper(NuggetSummaryCS, store)
export const NuggetLastThirtyDaysCSModule = getModuleWrapper(NuggetLastThirtyDaysCS, store)
export const NuggetReleasedCSModule = getModuleWrapper(NuggetReleasedCS, store)
export const NuggetSearchCSModule = getModuleWrapper(NuggetSearchCS, store)
export const NuggetSubscriptionsActiveCSModule = getModuleWrapper(NuggetSubscriptionsActiveCS, store)
export const NuggetUnreadCSModule = getModuleWrapper(NuggetUnreadCS, store)
export const PayloadCSModule = getModuleWrapper(PayloadCS, store)
export const PeopleChatCSModule = getModuleWrapper(PeopleChatCS, store)
export const PeopleRoomsCSModule = getModuleWrapper(PeopleRoomsCS, store)
export const PersonalCalendarDetailCSModule = getModuleWrapper(PersonalCalendarDetailCS, store)
export const PhaseDetailCSModule = getModuleWrapper(PhaseDetailCS, store)
export const ProjectDetailCSModule = getModuleWrapper(ProjectDetailCS, store)
export const SprintDetailCSModule = getModuleWrapper(SprintDetailCS, store)
export const ProjectsActiveSprintsCSModule = getModuleWrapper(ProjectsActiveSprintsCS, store)
export const ProjectsAllProjectsCSModule = getModuleWrapper(ProjectsAllProjectsCS, store)
export const ProjectsBackloggedSprintsCSModule = getModuleWrapper(ProjectsBackloggedSprintsCS, store)
export const ProjectsProjectNuggetCSModule = getModuleWrapper(ProjectsProjectNuggetCS, store)
export const ProjectsReleasedCSModule = getModuleWrapper(ProjectsReleasedCS, store)
export const ProjectsSprintNuggetCSModule = getModuleWrapper(ProjectsSprintNuggetCS, store)
export const ReleaseDetailCSModule = getModuleWrapper(ReleaseDetailCS, store)
export const ReleasesActiveCSModule = getModuleWrapper(ReleasesActiveCS, store)
export const ReleasesReleasedCSModule = getModuleWrapper(ReleasesReleasedCS, store)
export const ReportMemberCSModule = getModuleWrapper(ReportMemberCS, store)
export const ReportInProgressCSModule = getModuleWrapper(ReportInProgressCS, store)
export const ReportUpcomingCSModule = getModuleWrapper(ReportUpcomingCS, store)
export const ReportEstimatesCSModule = getModuleWrapper(ReportEstimatesCS, store) 
export const ReportCompletedCSModule = getModuleWrapper(ReportCompletedCS, store)
export const ScreenRecorderCSModule = getModuleWrapper(ScreenRecorderCS, store)
export const SettingsChangePasswordCSModule = getModuleWrapper(SettingsChangePasswordCS, store)
export const SettingsCompanyCalendarCSModule = getModuleWrapper(SettingsCompanyCalendarCS, store)
export const SettingsDateAndTimeCSModule = getModuleWrapper(SettingsDateAndTimeCS, store)
export const SettingsDefaultSettingsCSModule = getModuleWrapper(SettingsDefaultSettingsCS, store)
export const SettingsDepartmentsCSModule = getModuleWrapper(SettingsDepartmentsCS, store)
export const SettingsGroupsCSModule = getModuleWrapper(SettingsGroupsCS, store)
export const SettingsHeaderCSModule = getModuleWrapper(SettingsHeaderCS, store)
export const SettingsPersonalCalendarCSModule = getModuleWrapper(SettingsPersonalCalendarCS, store)
export const SettingsPhasesCSModule = getModuleWrapper(SettingsPhasesCS, store)
export const SettingsSkillsCSModule = getModuleWrapper(SettingsSkillsCS, store)
export const SettingsTagsCSModule = getModuleWrapper(SettingsTagsCS, store)
export const SettingsUserProfileCSModule = getModuleWrapper(SettingsUserProfileCS, store)
export const SettingsUsersCSModule = getModuleWrapper(SettingsUsersCS, store)
export const SettingsWorkflowsCSModule = getModuleWrapper(SettingsWorkflowsCS, store)
export const SkillDetailCSModule = getModuleWrapper(SkillDetailCS, store)
export const SkillDSModule = getModuleWrapper(SkillDS, store)
export const SprintDropdownCSModule = getModuleWrapper(SprintDropdownCS, store)
export const TableFilterCSModule = getModuleWrapper(TableFilterCS, store)
export const TagDetailCSModule = getModuleWrapper(TagDetailCS, store)
export const TimeCardDetailCSModule = getModuleWrapper(TimeCardDetailCS, store)
export const TimeCardDetailEstimateCSModule = getModuleWrapper(TimeCardDetailEstimateCS, store)
export const TimeCardDetailOnHoldCSModule = getModuleWrapper(TimeCardDetailOnHoldCS, store)
export const TimeCardDetailReportCSModule = getModuleWrapper(TimeCardDetailReportCS, store)
export const TimeCardDetailTimeCardsCSModule = getModuleWrapper(TimeCardDetailTimeCardsCS, store)
export const UpdateProfilePictureCSModule = getModuleWrapper(UpdateProfilePictureCS, store)
export const UpdateSprintCSModule = getModuleWrapper(UpdateSprintCS, store)
export const UserDetailCSModule = getModuleWrapper(UserDetailCS, store)
export const UserSkillsCSModule = getModuleWrapper(UserSkillsCS, store)
export const WorkflowDetailCSModule = getModuleWrapper(WorkflowDetailCS, store)
export const WorkflowPhasesCSModule = getModuleWrapper(WorkflowPhasesCS, store)

// DSModules sorted

export const AccountDSModule = getModuleWrapper(AccountDS, store)
export const ApplicationDSModule = getModuleWrapper(ApplicationDS, store)
export const AssignmentDSModule = getModuleWrapper(AssignmentDS, store)
export const AttachmentDocumentsDSModule = getModuleWrapper(AttachmentDocumentsDS, store)
export const AttachmentLinkDSModule = getModuleWrapper(AttachmentLinkDS, store)
export const AttachmentMediaDSModule = getModuleWrapper(AttachmentMediaDS, store)
export const BusinessRuleDSModule = getModuleWrapper(BusinessRuleDS, store)
export const DateAndTimeDSModule = getModuleWrapper(DateAndTimeDS, store)
export const DepartmentDSModule = getModuleWrapper(DepartmentDS, store)
export const DirectDSModule = getModuleWrapper(DirectDS, store)
export const DolphinSocketDSModule = getModuleWrapper(DolphinSocketDS, store);
export const GroupDetailsDSModule = getModuleWrapper(GroupDetailsDS, store);
export const GroupDSModule = getModuleWrapper(GroupDS, store)
export const HolidayDSModule = getModuleWrapper(HolidayDS, store)
export const HolidayTypesDSModule = getModuleWrapper(HolidayTypesDS, store)
export const JaguarSocketDSModule = getModuleWrapper(JaguarSocketDS, store)
export const LeadtsCSModule = getModuleWrapper(BadNewsDelayedNuggetsCS, store)
export const MessageDSModule = getModuleWrapper(MessageDS, store)
export const NuggetAssignmentDSModule = getModuleWrapper(NuggetAssignmentDS, store)
export const NuggetDSModule = getModuleWrapper(NuggetDS, store)
export const NuggetPhasesDSModule = getModuleWrapper(NuggetPhasesDS, store)
export const PayloadDSModule = getModuleWrapper(PayloadDS, store)
export const PermissionDSModule = getModuleWrapper(PermissionDS, store)
export const PhaseDSModule = getModuleWrapper(PhaseDS, store)
export const PhaseResourceDSModule = getModuleWrapper(PhaseResourceDS, store)
export const PriorityDSModule = getModuleWrapper(PriorityDS, store)
export const ProfileDSModule = getModuleWrapper(ProfileDS, store)
export const ProjectDSModule = getModuleWrapper(ProjectDS, store)
export const ProjectPhaseDSModule = getModuleWrapper(ProjectPhaseDS, store)
export const RelatedNuggetDSModule = getModuleWrapper(RelatedNuggetDS, store)
export const ReleaseDSModule = getModuleWrapper(ReleaseDS, store)
export const SessionDSModule = getModuleWrapper(SessionDS, store)
export const SettingsDSModule = getModuleWrapper(SettingsDS, store)
export const SprintDSModule = getModuleWrapper(SprintDS, store)
export const SprintsViewDSModule = getModuleWrapper(SprintsViewDS, store)
export const StatusDSModule = getModuleWrapper(StatusDS, store)
export const PeriodsDSModule = getModuleWrapper(PeriodsDS, store)
export const TagDSModule = getModuleWrapper(TagDS, store)
export const CacheControlDsModule = getModuleWrapper(CacheControlDs, store)
export const TempoDSModule = getModuleWrapper(TempoDS, store);
export const TimeCardDSModule = getModuleWrapper(TimeCardDS, store)
export const TypeDSModule = getModuleWrapper(TypeDS, store)
export const UserDepartmentDSModule = getModuleWrapper(UserDepartmentDS, store)
export const UserDSModule = getModuleWrapper(UserDS, store)
export const UserGroupDSModule = getModuleWrapper(UserGroupDS, store)
export const UserSkillDSModule = getModuleWrapper(UserSkillDS, store)
export const ChatRoomMemberDSModule = getModuleWrapper(ChatRoomMemberDS, store)
export const UserSpecialtyDSModule = getModuleWrapper(UserSpecialtyDS, store)
export const WorkflowDSModule = getModuleWrapper(WorkflowDS, store)
