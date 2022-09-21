import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {AccountDSModule, ApplicationDSModule, ProfileDSModule, NuggetDSModule, AssignmentDSModule, ProjectDSModule, ReleaseDSModule, SprintsViewDSModule} from "@/store";
import {Wait, WaitStates} from "@/utils/vuewait";
import AuthenticationAPI from "@/api/authenticationAPI";
import router from "@/router";
import {APPLICATION_ID, SCOPES, XAS_FRONTEND_BASE_URL} from "@/settings";
import Vue from "vue";
import LocalForage from "localforage";
import {EventBus} from "@/utils/eventBus";
import {AppVersion, EVENTS, TAB_DETAIL_SIDEBAR} from "@/utils/constants";
import decodeJwt from "jwt-decode";
import {IUserInfo} from "./profileDS";
import {WebsocketConnection} from "@/utils/websocket";
import MemberAPI from '@/api/membersAPI';

export enum ModuleTabName {
  chat = 'chat',
  nuggetUnread = 'nuggetUnread',
  nuggetLastThirtyDays = 'nuggetLastThirtyDays',
  nuggetSubscriptionsActive = 'nuggetSubscriptionsActive',
  nuggetReleased = 'nuggetReleased',
  nuggetSearch = 'nuggetSearch',
  assignmentInProgress = 'assignmentInProgress',
  assignmentUpcoming = 'assignmentUpcoming',
  assignmentNeedEstimate = 'assignmentNeedEstimate',
  assignmentUpcomingEstimates = 'assignmentUpcomingEstimates',
  assignmentCompleted = 'assignmentCompleted',
  goodNewsTriage = 'goodNewsTriage',
  goodNewsNeedApproval = 'goodNewsNeedApproval',
  goodNewsScrum = 'goodNewsScrum',
  goodNewsArchive = 'goodNewsArchive',
  goodNewsBacklog = 'goodNewsBacklog',
  goodNewsUpcoming = 'goodNewsUpcoming',
  goodNewsProduction = 'goodNewsProduction',
  badNewsDelayedNuggets = 'badNewsDelayedNuggets',
  badNewsOverdueTimecard = 'badNewsOverdueTimecard',
  badNewsOverdueEstimate = 'badNewsOverdueEstimate',
  badNewsOverdueTriage = 'badNewsOverdueTriage',
  leadNeedApproval = 'leadNeedApproval',
  leadOverdueTimecard = 'leadOverdueTimecard',
  leadJournalReport = 'leadJournalReport',
  leadOverDueEstimate = 'leadOverdueEstimate',
  leadDelayedNuggets = 'leadDelayedNuggets',
  subscriptionReleased = 'subscriptionReleased',
  projectsActiveSprints = 'projectsActiveSprints',
  projectsBackloggedSprints = 'projectBackloggedSprints',
  projectsReleased = 'projectReleased',
  projectsAllProjects = 'projectAllProject',
  projectsSprintNugget = 'projectsSprintNugget',
  projectsProjectNugget = 'projectsProjectNugget',
  releasesActive = 'releasesActive',
  releasesReleased = 'releasesReleased',
  inboxNugget = 'inboxNugget',
  inboxProjects = 'inboxProjects',
  inboxSprints = 'inboxSprints',
  inboxReleases = 'inboxReleases',
  inboxSprintNuggets = 'inboxSprintNuggets',
  inboxProjectNuggets = 'inboxProjectNuggets',
  inboxReleaseNuggets = 'inboxReleaseNuggets',
  reportInProgress = 'reportInProgress',
  reportUpcoming = 'reportUpcoming',
  reportEstimates = 'reportEstimates',
  reportCompleted = 'reportCompleted', 
  none = 'none'
}
export enum DetailTabName {
  chat = "chat",
  nugget = "nugget",
  lead = "lead",
  project = "project",
  release = "release",
  attachment = "attachment",
  timecard = "timecard",
  assigned = "assigned",
  sprintDetails= "sprintDetails"
}

export enum ModuleName {
  nugget = "nugget",
  assignment = "assignment",
  lead = "lead",
  goodNews = "goodNews",
  badNews = "badNews",
  subscriptions = "subscriptions",
  nuggets = "nuggets",
  projects = "projects",
  releases = "releases",
  report = "report",
  settings = "settings",
  timeCards = "timeCards",
  people = "people",
  groups = "groups",
  inbox = "inbox",
  none = "none"
}

export enum EntityType {
  nugget = "nugget",
  project = "project",
  release = "release",
  assignment = "assignment",
  sprint = "sprint"
}

export interface IApplicationDS {
  selectedModule: string
  readonly selectedModuleTab: string
  selectedDetailTab: DetailTabName
  selectedModuleTabNugget: ModuleTabName
  selectedModuleTabChat: ModuleTabName
  selectedModuleTabAssignment: ModuleTabName
  selectedModuleTabGoodNews: ModuleTabName
  selectedModuleTabLead: ModuleTabName
  selectedModuleTabBadNews: ModuleTabName
  selectedModuleTabProjects: ModuleTabName
  selectedModuleTabReleases: ModuleTabName
  selectedModuleTabInbox: ModuleTabName
  detailSidebarOpen: boolean
  chatSidebarOpen: boolean
  isMobileScreenSize: boolean
  selectedEntityType: EntityType | null
  selectedNuggetID: number
  selectedProjectID: number
  selectedEntityChatRoomID: number
  selectedPeopleChatRoomID: number
  selectedGroupChatRoomID: number
  selectedMediaRoomID: number
  selectedLinkRoomID: number
  selectedReleaseID: number
  selectedSprintsViewID: number
  selectedAssignmentID: number
  selectedDocumentRoomID: number
  version: string
  dolphinToken: string
  selectedUserID: number
  dolphinSocket: WebsocketConnection | null
  jaguarSocket: WebsocketConnection | null
}

@Module({name: "applicationds", namespaced: true})
export class ApplicationDS extends VuexModule implements IApplicationDS {
  selectedModule = "";
  selectedDetailTab = DetailTabName.chat;
  selectedModuleTabNugget = ModuleTabName.nuggetUnread;
  selectedModuleTabAssignment = ModuleTabName.assignmentInProgress;
  selectedModuleTabLead = ModuleTabName.leadOverDueEstimate;
  selectedModuleTabGoodNews = ModuleTabName.goodNewsTriage;
  selectedModuleTabBadNews = ModuleTabName.badNewsOverdueTriage;
  selectedModuleTabProjects = ModuleTabName.projectsAllProjects;
  selectedModuleTabReleases = ModuleTabName.releasesActive;
  selectedModuleTabChat = ModuleTabName.chat;
  selectedModuleTabInbox = ModuleTabName.inboxNugget;
  selectedModuleTabReport = ModuleTabName.reportInProgress;
  detailSidebarOpen = true;
  chatSidebarOpen = false;
  isMobileScreenSize = false;
  selectedEntityType: EntityType | null = null;
  selectedNuggetID = 0;
  selectedEntityChatRoomID = 0;
  selectedPeopleChatRoomID = 0;
  selectedGroupChatRoomID = 0;
  selectedMediaRoomID = 0;
  selectedLinkRoomID = 0;
  selectedProjectID = 0;
  selectedReleaseID = 0;
  selectedSprintsViewID = 0;
  selectedAssignmentID = 0;
  selectedDocumentRoomID = 0;
  selectedUserID = 0;
  version = AppVersion;
  dolphinToken = "";
  isPersisting = true;
  detailSidebarWidth = 440;
  dolphinSocket: WebsocketConnection | null = null
  jaguarSocket: WebsocketConnection | null = null

  get selectedEntity() {
    switch (this.selectedEntityType) {
      case EntityType.nugget:
        return NuggetDSModule?.items[this.selectedNuggetID]
      case EntityType.assignment:
        return AssignmentDSModule?.items[this.selectedAssignmentID];
      case EntityType.project:
        return ProjectDSModule?.items[this.selectedProjectID];
      case EntityType.release:
        return ReleaseDSModule?.items[this.selectedReleaseID]
      case EntityType.sprint:
        return SprintsViewDSModule?.items[this.selectedSprintsViewID]
    }
  }

  public get isAuthenticated(): boolean {
    return this.dolphinToken !== "";
  }

  get selectedModuleTab(): string {
    switch (ApplicationDSModule.selectedModule) {
      case ModuleName.nugget:
        return ApplicationDSModule.selectedModuleTabNugget;
      case ModuleName.assignment:
        return ApplicationDSModule.selectedModuleTabAssignment;
      case ModuleName.goodNews:
        return ApplicationDSModule.selectedModuleTabGoodNews;
      case ModuleName.badNews:
        return ApplicationDSModule.selectedModuleTabBadNews;
      case ModuleName.projects:
        return ApplicationDSModule.selectedModuleTabProjects;
      case ModuleName.lead:
        return ApplicationDSModule.selectedModuleTabLead;
      case ModuleName.releases:
        return ApplicationDSModule.selectedModuleTabReleases;
      case ModuleName.people:
        return ApplicationDSModule.selectedModuleTabChat;
      case ModuleName.inbox:
        return ApplicationDSModule.selectedModuleTabInbox;
      case ModuleName.report:
        return ApplicationDSModule.selectedModuleTabReport;
      default:
        return "";
    }
  }

  public get currentRoomID(){
    switch (ApplicationDSModule.selectedModule) {
      case ModuleName.people:
        return this.selectedPeopleChatRoomID;
      case ModuleName.groups:
        return this.selectedGroupChatRoomID;
      default:
        return this.selectedEntityChatRoomID;
    }
  }

  @Mutation
  setDolphinToken(token: string) {
    this.dolphinToken = token;
  }

  @Mutation
  setIsPersisting(value: boolean) {
    this.isPersisting = value;
  }

  @Mutation
  setSelectedNuggetId(value = 0) {
    if (this.selectedNuggetID != value) {
      this.selectedNuggetID = value;
    }
  }

  @Mutation
  setIsMobileScreenSize(value: boolean) {
    this.isMobileScreenSize = value;
  }

  @Mutation
  setDetailSidebarOpen(value: boolean) {
    this.detailSidebarOpen = value;
  }

  @Mutation
  setSelectedUserID(value = 0) {
    if (this.selectedUserID != value) {
      this.selectedUserID = value;
    }
  }

  @Mutation
  setChatSidebarOpen(value: boolean) {
    if (value) {
      if (ApplicationDSModule.selectedDetailTab === DetailTabName.chat) {
        EventBus.$emit(EVENTS.CLICK_DETAIL_TAB_ID, TAB_DETAIL_SIDEBAR.DETAILS)
      }
    }

    this.chatSidebarOpen = value;
  }

  @Mutation
  setSelectedDetailTabName(value: DetailTabName) {
    if (this.selectedDetailTab != value) {
      this.selectedDetailTab = value
    }
  }

  @Mutation
  setSelectedModule(value: ModuleName) {
    if (this.selectedModule != value) {
      this.selectedModule = value;
    }
  }

  @Mutation
  setSelectedModuleTabNugget(value: ModuleTabName) {
    if (this.selectedModuleTabNugget != value) {
      this.selectedModuleTabNugget = value;
    }
  }

  @Mutation
  setSelectedModuleTabAssignment(value: ModuleTabName) {
    if (this.selectedModuleTabAssignment != value) {
      this.selectedModuleTabAssignment = value;
    }
  }

  @Mutation
  setSelectedModuleTabGoodNews(value: ModuleTabName) {
    if (this.selectedModuleTabGoodNews != value) {
      this.selectedModuleTabGoodNews = value;
    }
  }

  @Mutation
  setSelectedModuleTabLead(value: ModuleTabName) {
    if (this.selectedModuleTabLead != value) {
      this.selectedModuleTabLead = value;
    }
  }

  @Mutation
  setSelectedModuleTabInbox(value: ModuleTabName) {
    this.selectedModuleTabInbox = value;
  }

  @Mutation
  setSelectedModuleTabBadNews(value: ModuleTabName) {
    if (this.selectedModuleTabBadNews != value) {
      this.selectedModuleTabBadNews = value;
    }
  }

  @Mutation
  setSelectedModuleTabProjects(value: ModuleTabName) {
    if (this.selectedModuleTabProjects != value) {
      this.selectedModuleTabProjects = value;
    }
  }

  @Mutation
  setSelectedModuleTabReleases(value: ModuleTabName) {
    if (this.selectedModuleTabReleases != value) {
      this.selectedModuleTabReleases = value;
    }
  }

  @Mutation
  setSelectedModuleTabReport(value: ModuleTabName) {
    this.selectedModuleTabReport = value;
  }

  @Mutation
  setSelectedEntityType(value: EntityType) {
    if (this.selectedEntityType != value) {
      this.selectedEntityType = value;
    }
  }

  @Mutation
  setSelectedEntityChatRoomID(value = 0) {
    if (this.selectedEntityChatRoomID != value) {
      this.selectedEntityChatRoomID = value;
    }
  }

  @Mutation
  setSelectedGroupChatRoomID(value = 0) {
    if (this.selectedGroupChatRoomID != value) {
      this.selectedGroupChatRoomID = value;
    }
  }

  @Mutation
  setSelectedPeopleChatRoomID(value = 0) {
    if (this.selectedPeopleChatRoomID != value) {
      this.selectedPeopleChatRoomID = value;
    }
  }

  @Mutation
  setSelectedDocumentRoomID(value = 0) {
    if (this.selectedDocumentRoomID != value) {
      this.selectedDocumentRoomID = value;
    }
  }

  @Mutation
  setSelectedMediaRoomID(value = 0) {
    if (this.selectedMediaRoomID != value) {
      this.selectedMediaRoomID = value;
    }
  }

  @Mutation
  setSelectedLinkRoomID(value = 0) {
    if (this.selectedLinkRoomID != value) {
      this.selectedLinkRoomID = value;
    }
  }

  @Mutation
  setSelectedProjectId(value = 0) {
    if (this.selectedProjectID != value) {
      this.selectedProjectID = value;
    }
  }

  @Mutation
  setSelectedReleaseId(value = 0) {
    if (this.selectedReleaseID != value) {
      this.selectedReleaseID = value;
    }
  }

  @Mutation
  setSelectedSprintsViewId(value = 0) {
    if (this.selectedSprintsViewID != value) {
      this.selectedSprintsViewID = value;
    }
  }

  @Mutation
  setSelectedAssignmentId(value = 0) {
    if (this.selectedAssignmentID != value) {
      this.selectedAssignmentID = value
    }
  }

  @Mutation
  setDetailSidebarWidth(value: number) {
    if (this.detailSidebarWidth != value) {
      this.detailSidebarWidth = value
    }
  }

  @Mutation
  setDolphinSocket(socket: WebsocketConnection | null) {
    this.dolphinSocket = socket;
  }

  @Mutation
  setJaguarSocket(socket: WebsocketConnection | null) {
    this.jaguarSocket = socket;
  }

  @Action({ rawError: true })
  doCheckVersion() {
    if (this.version !== AppVersion) {
      Vue.swal({
        title: "It appears we have released a new version, please login again!",
        heightAuto: false
      }).then(ApplicationDSModule.redirectToCAS);
    }
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_LOGIN)
  async login(action: {
    authorizationCode: string
    email: string
    accountid: number
  }) {
    const {data} = await AuthenticationAPI.OBTAIN(
      {
        authorizationCode: action.authorizationCode,
        accountId: action.accountid
      }
    );

    if (data.token) {
      this.setDolphinToken(data.token);
      const userInfo = decodeJwt(data.token) as IUserInfo;
      ProfileDSModule.updateUserInfo(userInfo);
      if (!AccountDSModule.availableAccounts.some(account => account.id == userInfo.organizationId)) {
        await AccountDSModule.doLoad({email: userInfo.email, force: true})
      }
      AccountDSModule.setSelectedAccount(userInfo.organizationId);
      await router.push({name: "HomePage"});
    } else {
      this.redirectToCAS();
    }
  }

  @Action({rawError: true})
  clearCache(callback?: () => void) {
    window.localStorage.clear();
    window.sessionStorage.clear();
    LocalForage.clear(callback);
  }

  @Action({rawError: true})
  async invalidateToken() {
    await MemberAPI.INVALIDATE_TOKEN({ sessionId: ProfileDSModule.sessionId })
  }

  @Action({rawError: true})
  async redirectToCAS() {
    const postClear = () => {
      const {location} = window;
      const url = new URL('/permissions', XAS_FRONTEND_BASE_URL);
      url.searchParams.set("applicationId", String(APPLICATION_ID));
      url.searchParams.set("scopes", SCOPES.join(","));
      url.searchParams.set("redirectUri", location.origin);
      location.replace(url as any);

    };
    await this.setIsPersisting(false);
    await this.clearCache(postClear);
  }
}
