import { PriorityDSModule, ProjectDSModule, ProjectPhaseDSModule, StatusDSModule, TagDSModule, TempoDSModule, TypeDSModule, PhaseDSModule, SkillDSModule } from '@/store';
import { CHAT_LABEL_TYPE, TABLE_FILTER_TYPE } from '@/utils/constants';
import { Module, VuexModule } from 'vuex-module-decorators'

@Module({ name: 'tablefiltercs', namespaced: true, stateFactory: true })
export class TableFilterCS extends VuexModule {

  constructor(module: VuexModule<ThisType<any>, any>) {
    super(module);
  }

  // : {[key in TABLE_FILTER_TYPE]: {id: string | number, value: string | number, label: string}[]}
  get filters() {
    return {
      // Global Filters
      [TABLE_FILTER_TYPE.PROJECT]: {
        key: 'projectId',
        options: ProjectDSModule.itemsAsArray.map(project => {
          return { id: project.id, value: project.id, label: project.title };
        })
      },
      [TABLE_FILTER_TYPE.TEMPO]: {
        key: 'boarding',
        options: TempoDSModule.tempos.map(tempo => {
          return { id: tempo.value, value: tempo.value, label: tempo.label };
        }),
      },
      [TABLE_FILTER_TYPE.TAGS]: {
        key: 'tagId',
        options: TagDSModule.itemsAsArray.map(tag => {
          return { id: tag.id, value: tag.id, label: tag.title }
        }),
      },

      // Nugget Filters
      [TABLE_FILTER_TYPE.NUGGET_SUBSCRIBE]: {
        key: 'isSubscribedPublic',
        options: [
          { id: 0, value: 0, label: 'Not Following' },
          { id: 1, value: 1, label: 'Following' }
        ],
      },
      [TABLE_FILTER_TYPE.NUGGET_TYPE]: {
        key: 'kind',
        options: TypeDSModule.types.map(type => {
          return { id: type.value, value: type.value, label: type.label }
        })
      },
      [TABLE_FILTER_TYPE.NUGGET_PRIORITY]: {
        key: 'priority',
        options: PriorityDSModule.priorities.map(priority => {
          return { id: priority.value, value: priority.value, label: priority.label }
        }),
      },
      [TABLE_FILTER_TYPE.NUGGET_ORIGIN]: {
        key: 'origin',
        options: [
          { id: 'new', value: 'new', label: 'New' },
          { id: 'backlog', value: 'backlog', label: 'Backlog' }
        ],
      },
      [TABLE_FILTER_TYPE.NUGGET_STAGE]: {
        key: 'stage',
        options: [
          { id: 'Archive', value: 'Archive', label: 'Archive' },
          { id: 'Backlog', value: 'Backlog', label: 'Backlog'},
          { id: 'Triage', value: 'Triage', label: 'Triage'},
          { id: 'Production', value: 'Production', label: 'Production'},
          { id: 'Released', value: 'Released', label: 'Released'},
        ],
      },
      [TABLE_FILTER_TYPE.ASSIGNMENT_NUGGET_STAGE]: {
        key: 'nuggetStage',
        options: [
          { id: 'Archive', value: 'Archive', label: 'Archive' },
          { id: 'Backlog', value: 'Backlog', label: 'Backlog'},
          { id: 'Triage', value: 'Triage', label: 'Triage'},
          { id: 'Production', value: 'Production', label: 'Production'},
          { id: 'Released', value: 'Released', label: 'Released'},
        ],
      },
      [TABLE_FILTER_TYPE.NUGGET_STATUS]: {
        key: 'status',
        options: [
          { id: 'to-do', value: 'to-do', label: 'To Do' },
          { id: 'in-progress', value: 'in-progress', label: 'In Progress' },
          { id: 'on-hold', value: 'on-hold', label: 'On Hold' },
          { id: 'complete', value: 'complete', label: 'Complete' },
          { id: 'approved', value: 'approved', label: 'Approved' }
        ],
      },
      [TABLE_FILTER_TYPE.NUGGET_PHASE]: {
        key: 'phaseId',
        options: [
          { id: 0, value: 0, label: 'Triage' },
          { id: -1, value: -1, label: 'Backlog' },
          ...ProjectPhaseDSModule.currentProjectPhases.map(phase => {
            return { id: phase.id, value: phase.id, label: phase.title }
          })
        ],
      },

      // Assignment Filters
      [TABLE_FILTER_TYPE.ASSIGNMENT_PRIORITY]: {
        key: 'nuggetPriority',
        options: PriorityDSModule.priorities.map(priority => {
          return { id: priority.value, value: priority.value, label: priority.label }
        }),
      },
      [TABLE_FILTER_TYPE.ASSIGNMENT_TYPE]: {
        key: 'nuggetKind',
        options: TypeDSModule.types.map(type => {
          return { id: type.value, value: type.value, label: type.label }
        }),
      },
      [TABLE_FILTER_TYPE.ASSIGNMENT_TIMECARD]: {
        key: 'perspective',
        options: [
          { id: 'due', value: 'due', label: 'Due' },
          { id: 'overdue', value: 'overdue', label: 'Overdue' },
          { id: 'submitted', value: 'submitted', label: 'Submitted' }
        ],
      },

      [TABLE_FILTER_TYPE.ASSIGNMENT_LEVEL]: {
        key: 'assignmentLevel',
        options: [
          {id: 'none', value: 'none', label: 'None'},
          {id: 'partial', value: 'partial', label: 'Partial'},
          {id: 'full', value: 'full', label: 'Full'}
        ],
      },
      [TABLE_FILTER_TYPE.ESTIMATED_LEVEL]: {
        key: 'estimatedlevel',
        options: [
          {id: 'none', value: 'none', label: 'None'},
          {id: 'partial', value: 'partial', label: 'Partial'},
          {id: 'full', value: 'full', label: 'Full'}
        ],
      },

      // Projects Filters
      [TABLE_FILTER_TYPE.PROJECTS_STATUS]: {
        key: 'status',
        options: StatusDSModule.statuses.map(status => {
          return { id: status.value, value: status.value, label: status.label }
        }),
      },

      // Releases Filters
      [TABLE_FILTER_TYPE.RELEASES_TEMPO]: {
        key: 'tempo',
        options: TempoDSModule.tempos.map(tempo => {
          return { id: tempo.value, value: tempo.value, label: tempo.label };
        })
      },

      //Settings Filters
      [TABLE_FILTER_TYPE.WORKFLOW_PHASES]: {
        key: 'phaseId',
        options: PhaseDSModule.sortedItems('title')?.filter(phase => !phase.isSystem).map(phase => {
          return { id: phase.id, value: phase.id, label: phase.title };
        })
      },

      [TABLE_FILTER_TYPE.WORKFLOW_ACTIVE_PROJECTS]: {
        key: 'projectId',
        options: ProjectDSModule.itemsAsArray.filter(project => project.status === 'active').map(project => { return { id: project.id, value: project.id, label: project.title } })
      },

      [TABLE_FILTER_TYPE.PHASE_SKILL]: {
        key: 'skillId',
        options: SkillDSModule.itemsAsArray.map(specialty => {
          return { id: specialty.id, value: specialty.id, label: specialty.title };
        })
      },

      [TABLE_FILTER_TYPE.GROUP_TYPE]: {
        key: 'type',
        options: [
          { id: 'private', value: 'private', label: CHAT_LABEL_TYPE.PRIVATE },
          { id: 'public', value: 'public', label: CHAT_LABEL_TYPE.PUBLIC },
          { id: 'both', value: 'both', label: CHAT_LABEL_TYPE.BOTH }
        ],
      },

      [TABLE_FILTER_TYPE.USER_ROLE]: {
        key: 'organizationRoles',
        options: [
          { id: 'Common User', value: 'Common User', label: 'Common User' },
          { id: 'Resource', value: 'Resource', label: 'Resource' },
          { id: 'Lead Resource', value: 'Lead Resource', label: 'Lead Resource' },
          { id: 'Project Maestro', value: 'Project Maestro', label: 'Project Maestro' },
          { id: 'Release Maestro', value: 'Release Maestro', label: 'Release Maestro' },
          { id: 'Admin', value: 'Admin', label: 'Admin' },
          { id: 'Owner', value: 'Owner', label: 'Owner' }
        ],
      },

      [TABLE_FILTER_TYPE.CALENDAR_REPEAT]: {
        key: 'repeat',
        options: [
          { id: 'monthly', value: 'monthly', label: 'Monthly' },
          { id: 'yearly', value: 'yearly', label: 'Yearly' },
          { id: 'never', value: 'never', label: 'Never' },
        ],
      },

      [TABLE_FILTER_TYPE.INACTIVE]: {
        key: 'removedAt',
        options: [
          { id: 'inactive', value: 'inactive', label: 'Inactive' },
          { id: 'active', value: 'active', label: 'Active' }
        ],
      },

      //Inbox Filters
      [TABLE_FILTER_TYPE.IS_UNREAD]: {
        key: 'isUnread',
        options: [
          { id: 'true' , value: 'unread', label: 'Unread' },
          { id: 'false' , value: 'read', label: 'Read' }
        ],
      },
      
    }
  }

}
