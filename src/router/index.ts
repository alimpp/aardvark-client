import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import { NavigationGuardNext } from "vue-router/types/router";
import store, { ProfileDSModule, ApplicationDSModule, SettingsDSModule } from "@/store";
import {
  ModuleName,
  ModuleTabName
} from "@/store/modules/datastore/applicationDS";

import {DEFAULT_ROUTES, DEFAULT_ROUTES_ROOTS} from "@/utils/constants";
import { AssignmentCompleted, AssignmentInProgress, AssignmentNeedEstimate, AssignmentUpcoming, AssignmentUpcomingEstimates, BadNewsDelayedNuggets, BadNewsOverdueEstimate, BadNewsOverdueTimecard, BadNewsOverdueTriage, GoodNewsArchive, GoodNewsBacklog, GoodNewsNeedApproval, GoodNewsProduction, GoodNewsScrum, GoodNewsTriage, GoodNewsUpcoming, InboxNugget, InboxProjectNuggets, InboxProjects, InboxReleaseNuggets, InboxReleases, InboxSprintNuggets, InboxSprints, LeadDelayedNuggets, LeadJournalReport, LeadNeedApproval, LeadOverdueEstimate, LeadOverdueTimecard, NuggetLastThirtyDays, NuggetReleased, NuggetSearch, NuggetSubscriptionsActive, NuggetUnread, ProjectsActiveSprints, ProjectsAllProjects, ProjectsBackloggedSprints, ProjectsProjectNugget, ProjectsReleased, ProjectsSprintNugget, ReleasesActive, ReleasesReleased, ReportCompleted, ReportEstimates, ReportInProgress, ReportUpcoming, SettingsCompanyCalendar, SettingsDateAndTime, SettingsDefaultSettings, SettingsDepartments, SettingsGroups, SettingsPersonalCalendar, SettingsPhases, SettingsReleaseNote, SettingsSkills, SettingsTags, SettingsUserProfile, SettingsUsers, SettingsWorkflows } from "@/components";
import { AccountPage, AssignmentPage, BadNewsPage, GoodNewsPage, GroupsPage, HomePage, InboxPage, LeadPage, NuggetPage, PeoplePage, ProjectsPage, ReleasesPage, ReportPage, SettingsPage } from "@/pages";
import { SettingsModuleName } from "@/store/modules/datastore/settingsDS";
import decodeJwt from "jwt-decode";
import {IUserInfo} from "@/store/modules/datastore/profileDS"

Vue.use(VueRouter);

const inboxBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  next();
};

const InboxNuggetBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxNugget);
  next();
};

const InboxProjectBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxProjects);
  next();
};

const InboxSprintBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxSprints);
  next();
};

const InboxReleaseBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxReleases);
  next();
};

const InboxSprintNuggetsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxSprintNuggets);
  next();
};

const InboxProjectNuggetsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxProjectNuggets);
  next();
};

const InboxReleaseNuggetsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.inbox);
  ApplicationDSModule.setSelectedModuleTabInbox(ModuleTabName.inboxReleaseNuggets);
  next();
};


const peopleBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.people);
  next();
};

const groupsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.groups);
  next();
};

const homeBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  const email = to?.query?.code ? (decodeJwt<IUserInfo>(to?.query?.code as string)).email : null
  if (!ApplicationDSModule.isAuthenticated || (email && email !== ProfileDSModule.email)) {
    if (to.query.code) {
      next({
        path: "Account",
        query: to.query
      });
    } else {
      ApplicationDSModule.redirectToCAS();
    }
  }

  // Below code prevents going back to 'Account' | 'Login' | 'AccountPicker' page after login
  // Pressing back will do nothing once we're logged in

  else if (from.path.match(/^(\/(inbox|groups|people|nugget|assignment|lead|good-news|bad-news|projects|releases|settings)\/?)+/gm)) {
    history.replaceState(null, '', location.href);
    next(false);
  }
  else {
      //TODO: if there are any unread nuggets it should be forwarded to nugget otherwise to project. See same method in flamingo.
    ApplicationDSModule.setSelectedModule(ModuleName.none);
    next();
  }
};

const accountBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setDolphinToken('')
  next();
};

const nuggetBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  next();
};

const nuggetUnreadBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.nugget);
  ApplicationDSModule.setSelectedModuleTabNugget(ModuleTabName.nuggetUnread);
  next();
};

const nuggetLastThirtyDaysBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.nugget);
  ApplicationDSModule.setSelectedModuleTabNugget(
    ModuleTabName.nuggetLastThirtyDays
  );
  next();
};

const nuggetSubscriptionsActiveBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.nugget);
  ApplicationDSModule.setSelectedModuleTabNugget(
    ModuleTabName.nuggetSubscriptionsActive
  );
  next();
};

const nuggetReleasedBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.nugget);
  ApplicationDSModule.setSelectedModuleTabNugget(
    ModuleTabName.nuggetReleased
  );
  next();
};

const nuggetSearchBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.nugget);
  ApplicationDSModule.setSelectedModuleTabNugget(ModuleTabName.nuggetSearch);
  next();
};

const assignmentBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  if (ApplicationDSModule.selectedModule !== ModuleName.assignment) {
    ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  }

  next();
};

const assignmentInProgressBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  ApplicationDSModule.setSelectedModuleTabAssignment(
    ModuleTabName.assignmentInProgress
  );
  next();
};

const assignmentUpcomingBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  ApplicationDSModule.setSelectedModuleTabAssignment(
    ModuleTabName.assignmentUpcoming
  );
  next();
};

const assignmentNeedEstimateBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  ApplicationDSModule.setSelectedModuleTabAssignment(
    ModuleTabName.assignmentNeedEstimate
  );
  next();
};

const assignmentUpcomingEstimatesBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  ApplicationDSModule.setSelectedModuleTabAssignment(
    ModuleTabName.assignmentUpcomingEstimates
  );
  next();
};

const assignmentCompletedBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.assignment);
  ApplicationDSModule.setSelectedModuleTabAssignment(
    ModuleTabName.assignmentCompleted
  );
  next();
};

const goodNewsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  if (ApplicationDSModule.selectedModule !== ModuleName.goodNews) {
    ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  }

  next();
};

const goodNewsTriageBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(ModuleTabName.goodNewsTriage);
  next();
};

const goodNewsNeedApprovalBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(
    ModuleTabName.goodNewsNeedApproval
  );
  next();
};

const goodNewsBacklogBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(ModuleTabName.goodNewsBacklog);
  next();
};

const goodNewsArchiveBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(ModuleTabName.goodNewsArchive);
  next();
};

const goodNewsScrumBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(
    ModuleTabName.goodNewsScrum
  );
  next();
};

const goodNewsUpcomingBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(
    ModuleTabName.goodNewsUpcoming
  );
  next();
};

const goodNewsProductionBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.goodNews);
  ApplicationDSModule.setSelectedModuleTabGoodNews(
    ModuleTabName.goodNewsProduction
  );
  next();
};

const leadBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  if (ApplicationDSModule.selectedModule !== ModuleName.lead) {
    ApplicationDSModule.setSelectedModule(ModuleName.lead);
  }

  next();
};
const leadDelayedNuggetsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.lead);
  ApplicationDSModule.setSelectedModuleTabLead(
    ModuleTabName.leadDelayedNuggets
  );
  next();
};
const leadOverdueEstimateBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.lead);
  ApplicationDSModule.setSelectedModuleTabLead(
    ModuleTabName.leadOverDueEstimate
  );
  next();
};
const leadNeedApprovalBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.lead);
  ApplicationDSModule.setSelectedModuleTabLead(
    ModuleTabName.leadNeedApproval
  );
  next();
};
const leadJournalReportBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.lead);
  ApplicationDSModule.setSelectedModuleTabLead(
    ModuleTabName.leadJournalReport
  );
  next();
};
const leadOverdueJournalBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.lead);
  ApplicationDSModule.setSelectedModuleTabLead(
    ModuleTabName.leadOverdueTimecard
  );
  next();
};


const badNewsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  if (ApplicationDSModule.selectedModule !== ModuleName.badNews) {
    ApplicationDSModule.setSelectedModule(ModuleName.badNews);
  }

  next();
};

const badNewsDelayedNuggetsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.badNews);
  ApplicationDSModule.setSelectedModuleTabBadNews(
    ModuleTabName.badNewsDelayedNuggets
  );
  next();
};

const badNewsOverdueTimecardBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.badNews);
  ApplicationDSModule.setSelectedModuleTabBadNews(
    ModuleTabName.badNewsOverdueTimecard
  );
  next();
};

const badNewsOverdueEstimateBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.badNews);
  ApplicationDSModule.setSelectedModuleTabBadNews(
    ModuleTabName.badNewsOverdueEstimate
  );
  next();
};

const badNewsOverdueTriageBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.badNews);
  ApplicationDSModule.setSelectedModuleTabBadNews(
    ModuleTabName.badNewsOverdueTriage
  );
  next();
};

const projectsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  next();
};

const projectsActiveSprintsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsActiveSprints);
  next();
};

const projectsBackloggedSprintsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsBackloggedSprints);
  next();
};

const projectsReleasedBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsReleased);
  next();
};

const projectsProjectNuggetBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsProjectNugget);
  next();
};

const projectsSprintNuggetBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects);
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsSprintNugget);
  next();
};

const releasesBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  if (ApplicationDSModule.selectedModule !== ModuleName.releases) {
    ApplicationDSModule.setSelectedModule(ModuleName.releases);
  }

  next();
};

const releasesActiveBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.releases);
  ApplicationDSModule.setSelectedModuleTabReleases(ModuleTabName.releasesActive);
  next();
};
const projectsAllProjectsBeforeEnter = async function(to: Route, from: Route, next: NavigationGuardNext) {
  ApplicationDSModule.setSelectedModule(ModuleName.projects)
  ApplicationDSModule.setSelectedModuleTabProjects(ModuleTabName.projectsAllProjects)
  next()
}


const releasesReleasedBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.releases);
  ApplicationDSModule.setSelectedModuleTabReleases(ModuleTabName.releasesReleased);
  next();
};

const reportBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.report);
  next();
};

const reportInProgressBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.report);
  ApplicationDSModule.setSelectedModuleTabReport(ModuleTabName.reportInProgress);
  next();
};

const ReportUpcomingBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
){
  ApplicationDSModule.setSelectedModule(ModuleName.report);
  ApplicationDSModule.setSelectedModuleTabReport(ModuleTabName.reportUpcoming);
  next();
}

const ReportEstimatesBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
){
  ApplicationDSModule.setSelectedModule(ModuleName.report);
  ApplicationDSModule.setSelectedModuleTabReport(ModuleTabName.reportEstimates);
  next();
}

const ReportCompletedBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
){
  ApplicationDSModule.setSelectedModule(ModuleName.report);
  ApplicationDSModule.setSelectedModuleTabReport(ModuleTabName.reportCompleted);
  next();
}

const settingsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  ApplicationDSModule.setSelectedModule(ModuleName.settings);
  next();
};

const settingsUserProfileBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.userProfile);
  next();
};

const settingsDateAndTimeBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.dateAndTime);
  next();
};

const settingsUsersBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.users);
  next();
};

const settingsWorkflowsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
  ) {
    SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.workflows);
    next();
};

const settingsPersonalCalendarBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.personalCalendar);
  next();
};

const settingsCompanyCalendarBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.companyCalendar);
  next();
};

const settingsDefaultSettingsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.defaultSettings);
  next();
};

const settingsPhasesBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.phases);
  next();
};

const settingsTagsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.tags);
  next();
};

const settingsSkillsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.skills);
  next();
};

const settingsGroupsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.groups);
  next();
};

const settingsDepartmentsBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.departments);
  next();
};

const settingsReleaseNoteBeforeEnter = async function(
  to: Route,
  from: Route,
  next: NavigationGuardNext
) {
  SettingsDSModule.setSelectedSettingsModule(SettingsModuleName.releaseNote);
  next();
};

const redirectRouteConfigInjector = (component: DEFAULT_ROUTES_ROOTS): Partial<RouteConfig> => {
  return {
    redirect: {
      path: DEFAULT_ROUTES[component],
    }
  };
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "HomePage",
    beforeEnter: homeBeforeEnter,
    component: HomePage
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: InboxPage,
    beforeEnter: inboxBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.INBOX),
    children:[
      {
        path: "nugget/:roomId?",
        name: "inboxNugget",
        component: InboxNugget,
        beforeEnter: InboxNuggetBeforeEnter
      },
      {
        path: "projects/:roomId?",
        name: "InboxProjects",
        component: InboxProjects,
        beforeEnter: InboxProjectBeforeEnter
      },
      {
        path: "sprint/:roomId?",
        name: "InboxSprints",
        component: InboxSprints,
        beforeEnter: InboxSprintBeforeEnter
      },
      {
        path: "sprint/:projectId/:sprintId/nuggets",
        name: "InboxSprintNuggets",
        component: InboxSprintNuggets,
        beforeEnter: InboxSprintNuggetsBeforeEnter
      },
      {
        path: "project/:projectId/nuggets",
        name: "InboxProjectNuggets",
        component: InboxProjectNuggets,
        beforeEnter: InboxProjectNuggetsBeforeEnter
      },
      {
        path: "release/:releaseId/nuggets",
        name: "InboxReleaseNuggets",
        component: InboxReleaseNuggets,
        beforeEnter: InboxReleaseNuggetsBeforeEnter
      },
      {
        path: "releases/:roomId?",
        name: "InboxReleases",
        component: InboxReleases,
        beforeEnter: InboxReleaseBeforeEnter
      }
    ]

  },
  {
    path: '/people/:roomId?',
    name: 'People',
    beforeEnter: peopleBeforeEnter,
    component: PeoplePage
  },
  {
    path: '/groups/:roomId?',
    name: 'GroupChat',
    beforeEnter: groupsBeforeEnter,
    component: GroupsPage
  },
  {
    path: "/account",
    name: "AccountPage",
    beforeEnter: accountBeforeEnter,
    component: AccountPage
  },
  {
    path: "/nugget",
    name: "Nugget",
    component: NuggetPage,
    beforeEnter: nuggetBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.NUGGET),
    children: [
      {
        path: "unread/:roomId?",
        name: "NuggetUnread",
        component: NuggetUnread,
        beforeEnter: nuggetUnreadBeforeEnter
      },
      {
        path: "last-thirty-days",
        name: "NuggetLastThirtyDays",
        component: NuggetLastThirtyDays,
        beforeEnter: nuggetLastThirtyDaysBeforeEnter
      },
      {
        path: "subscriptions",
        name: "NuggetSubscriptionsActive",
        component: NuggetSubscriptionsActive,
        beforeEnter: nuggetSubscriptionsActiveBeforeEnter
      },
      {
        path: "search",
        name: "NuggetSearch",
        component: NuggetSearch,
        beforeEnter: nuggetSearchBeforeEnter
      },
      {
        path: "released",
        name: "NuggetReleased",
        component: NuggetReleased,
        beforeEnter: nuggetReleasedBeforeEnter
      }
    ]
  },
  {
    path: "/assignment",
    name: "Assignment",
    component: AssignmentPage,
    beforeEnter: assignmentBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.ASSIGNMENT),
    children: [
      {
        path: "in-progress",
        name: "AssignmentInProgress",
        component: AssignmentInProgress,
        beforeEnter: assignmentInProgressBeforeEnter
      },
      {
        path: "upcoming",
        name: "AssignmentUpcoming",
        component: AssignmentUpcoming,
        beforeEnter: assignmentUpcomingBeforeEnter
      },
      {
        path: "need-estimate",
        name: "AssignmentNeedEstimate",
        component: AssignmentNeedEstimate,
        beforeEnter: assignmentNeedEstimateBeforeEnter
      },
      {
        path: "upcoming-estimates",
        name: "AssignmentUpcomingEstimates",
        component: AssignmentUpcomingEstimates,
        beforeEnter: assignmentUpcomingEstimatesBeforeEnter
      },
      {
        path: "completed",
        name: "AssignmentCompleted",
        component: AssignmentCompleted,
        beforeEnter: assignmentCompletedBeforeEnter
      }
    ]
  },
  {
    path: "/lead",
    name: "Lead",
    component: LeadPage,
    beforeEnter: leadBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.LEAD),
    children: [
      {
        path: "delayed-nuggets",
        name: "LeadDelayedNuggets",
        component: LeadDelayedNuggets,
        beforeEnter: leadDelayedNuggetsBeforeEnter
      },
      {
        path: "overdue-timecard",
        name: "LeadOverdueTimecard",
        component: LeadOverdueTimecard,
        beforeEnter: leadOverdueJournalBeforeEnter
      },
      {
        path: "overdue-estimate",
        name: "LeadOverdueEstimate",
        component: LeadOverdueEstimate,
        beforeEnter: leadOverdueEstimateBeforeEnter
      },
      {
        path: "need-approval",
        name: "LeadNeedApproval",
        component: LeadNeedApproval,
        beforeEnter: leadNeedApprovalBeforeEnter
      },
      {
        path: "journal-report",
        name: "LeadJournalReport",
        component: LeadJournalReport,
        beforeEnter: leadJournalReportBeforeEnter
      }
    ]
  },
  {
    path: "/good-news",
    name: "GoodNews",
    component: GoodNewsPage,
    beforeEnter: goodNewsBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.GOOD_NEWS),
    children: [
      {
        path: "triage",
        name: "GoodNewsTriage",
        component: GoodNewsTriage,
        beforeEnter: goodNewsTriageBeforeEnter
      },
      {
        path: "need-approval",
        name: "GoodNewsNeedApproval",
        component: GoodNewsNeedApproval,
        beforeEnter: goodNewsNeedApprovalBeforeEnter
      },
      {
        path: "hours-reported",
        name: "GoodNewsScrum",
        component: GoodNewsScrum,
        beforeEnter: goodNewsScrumBeforeEnter
      },
      {
        path: "backlog",
        name: "GoodNewsBacklog",
        component: GoodNewsBacklog,
        beforeEnter: goodNewsBacklogBeforeEnter
      },
      {
        path: "upcoming",
        name: "GoodNewsUpcoming",
        component: GoodNewsUpcoming,
        beforeEnter: goodNewsUpcomingBeforeEnter
      },
      {
        path: "production",
        name: "GoodNewsProduction",
        component: GoodNewsProduction,
        beforeEnter: goodNewsProductionBeforeEnter
      },
      {
        path: "archive",
        name: "GoodNewsArchive",
        component: GoodNewsArchive,
        beforeEnter: goodNewsArchiveBeforeEnter
      },
    ]
  },
  {
    path: "/bad-news",
    name: "BadNews",
    component: BadNewsPage,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.BAD_NEWS),
    beforeEnter: badNewsBeforeEnter,
    children: [
      {
        path: "delayed-nuggets",
        name: "BadNewsDelayedNuggets",
        component: BadNewsDelayedNuggets,
        beforeEnter: badNewsDelayedNuggetsBeforeEnter
      },
      {
        path: "overdue-timecard",
        name: "BadNewsOverdueTimecard",
        component: BadNewsOverdueTimecard,
        beforeEnter: badNewsOverdueTimecardBeforeEnter
      },
      {
        path: "overdue-estimate",
        name: "BadNewsOverdueEstimate",
        component: BadNewsOverdueEstimate,
        beforeEnter: badNewsOverdueEstimateBeforeEnter
      },
      {
        path: "overdue-triage",
        name: "BadNewsOverdueTriage",
        component: BadNewsOverdueTriage,
        beforeEnter: badNewsOverdueTriageBeforeEnter
      }
    ]
  },
  {
    path: "/projects",
    name: "Projects",
    component: ProjectsPage,
    beforeEnter: projectsBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.PROJECTS),
    children: [
      {
        path: "active/:roomId?",
        name: "ProjectsActiveSprints",
        component: ProjectsActiveSprints,
        beforeEnter: projectsActiveSprintsBeforeEnter
      },
      {
        path: "backlogged/:roomId?",
        name: "ProjectsBackloggedSprints",
        component: ProjectsBackloggedSprints,
        beforeEnter: projectsBackloggedSprintsBeforeEnter
      },
      {
        path: "released/:roomId?",
        name: "ProjectsReleased",
        component: ProjectsReleased,
        beforeEnter: projectsReleasedBeforeEnter
      },
      {
        path: 'active-projects/:roomId?',
        name: 'ProjectsAllProjects',
        component: ProjectsAllProjects,
        beforeEnter: projectsAllProjectsBeforeEnter,
      },
      {
        path: "active/:projectId/:sprintId/nuggets",
        name: "ProjectsActiveSprintNugget",
        component: ProjectsSprintNugget,
        beforeEnter: projectsSprintNuggetBeforeEnter
      },
      {
        path: "backlogged/:projectId/:sprintId/nuggets",
        name: "ProjectsBackloggedSprintNugget",
        component: ProjectsSprintNugget,
        beforeEnter: projectsSprintNuggetBeforeEnter
      },
      {
        path: "released/:projectId/:sprintId/nuggets",
        name: "ProjectsReleasedSprintNugget",
        component: ProjectsSprintNugget,
        beforeEnter: projectsSprintNuggetBeforeEnter
      },
      {
        path: "projects/:projectId/nuggets",
        name: "ProjectsProjectNugget",
        component: ProjectsProjectNugget,
        beforeEnter: projectsProjectNuggetBeforeEnter
      }
    ]
  },
  {
    path: "/releases",
    name: "Releases",
    component: ReleasesPage,
    beforeEnter: releasesBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.RELEASES),
    children: [
      {
        path: "active/:roomId?",
        name: "ReleasesActive",
        component: ReleasesActive,
        beforeEnter: releasesActiveBeforeEnter
      },
      {
        path: "released/:roomId?",
        name: "ReleasesReleased",
        component: ReleasesReleased,
        beforeEnter: releasesReleasedBeforeEnter,
      }
    ]
  },

  {
    path: "/report",
    name: "Report",
    component: ReportPage,
    beforeEnter: reportBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.REPORT),
    children: [
      {
        path: "in-progress",
        name: "ReportInProgress",
        component: ReportInProgress,
        beforeEnter: reportInProgressBeforeEnter,
      },
      {
        path: "upcoming",
        name: "ReportUpcoming",
        component: ReportUpcoming,
        beforeEnter: ReportUpcomingBeforeEnter,
      },
      {
        path: "estimate-due",
        name: "ReportEstimates",
        component: ReportEstimates,
        beforeEnter: ReportEstimatesBeforeEnter,
      },
      {
        path: "completed",
        name: "ReportCompleted",
        component: ReportCompleted,
        beforeEnter: ReportCompletedBeforeEnter,
      }
    ]
  },

  {
    path: "/settings",
    name: "Settings",
    component: SettingsPage,
    beforeEnter: settingsBeforeEnter,
    ...redirectRouteConfigInjector(DEFAULT_ROUTES_ROOTS.SETTINGS),
    children: [
      {
        path: "user-profile",
        name: "UserProfile",
        component: SettingsUserProfile,
        beforeEnter: settingsUserProfileBeforeEnter
      },
      {
        path: "date-time",
        name: "DateAndTime",
        component: SettingsDateAndTime,
        beforeEnter: settingsDateAndTimeBeforeEnter
      },
      {
        path: "personal-calendar",
        name: "PersonalCalendar",
        component: SettingsPersonalCalendar,
        beforeEnter: settingsPersonalCalendarBeforeEnter
      },
      {
        path: "company-calendar",
        name: "CompanyCalendar",
        component: SettingsCompanyCalendar,
        beforeEnter: settingsCompanyCalendarBeforeEnter
      },
      {
        path: "tags",
        name: "Tags",
        component: SettingsTags,
        beforeEnter: settingsTagsBeforeEnter
      },
      {
        path: "skills",
        name: "Skills",
        component: SettingsSkills,
        beforeEnter: settingsSkillsBeforeEnter
      },
      {
        path: "groups",
        name: "Groups",
        component: SettingsGroups,
        beforeEnter: settingsGroupsBeforeEnter
      },
      {
        path: "departments",
        name: "Departments",
        component: SettingsDepartments,
        beforeEnter: settingsDepartmentsBeforeEnter
      },
      {
        path: "default-settings",
        name: "DefaultSettings",
        component: SettingsDefaultSettings,
        beforeEnter: settingsDefaultSettingsBeforeEnter
      },
      {
        path: "workflows",
        name: "Workflows",
        component: SettingsWorkflows,
        beforeEnter: settingsWorkflowsBeforeEnter
      },
      {
        path: "phases",
        name: "Phases",
        component: SettingsPhases,
        beforeEnter: settingsPhasesBeforeEnter
      },
      {
        path: "users",
        name: "Users",
        component: SettingsUsers,
        beforeEnter: settingsUsersBeforeEnter
      },
      {
        path: "release-note",
        name: "ReleaseNote",
        component: SettingsReleaseNote,
        beforeEnter: settingsReleaseNoteBeforeEnter
      }
    ]
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
});

const waitForAppSetup = async(to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  // @ts-ignore
  store.restored.then(function() {
    if (!ApplicationDSModule.isAuthenticated && !to.query.code) {
      ApplicationDSModule.redirectToCAS();
    }
    ApplicationDSModule.doCheckVersion();
    next();
  });
};

const routeRedirectHook = (to: Route, from: Route): void => {

  const { matched: components } = to;

  const [rootCmp = undefined, lastChildCmp = undefined] = [components[0], components[components.length - 1]];

  if (rootCmp && lastChildCmp && rootCmp?.redirect)
    rootCmp.redirect = {
      path: lastChildCmp.path,
    };
};

router.beforeEach(waitForAppSetup);

router.onReady((_isReady: boolean) => {
  if (_isReady)
    router.afterEach(routeRedirectHook);
});

export default router;
