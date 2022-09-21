import ProjectsAPI from '@/api/projectsAPI';
import ProjectDM from '@/datamodels/projectDM';
import {isEmpty} from '@/utils/object';
import {Action, Module} from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import store, { ApplicationDSModule, ProfileDSModule, ProjectDSModule } from '@/store';
import { Wait, WaitStates } from '@/utils/vuewait';
import { JsonParser } from "@/utils/jsonparser";
import { utcNow } from '@/utils/date';
import {Nullable} from '@/utils/generics';
import {SOCKET_ENTITY_ACTIONS, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import NuggetDM from '@/datamodels/nuggetDM';
import SprintDM from '@/datamodels/sprintDM';
import MessageDM from '@/datamodels/messageDM';

@Module({name:'projectds', namespaced: true})
export class ProjectDS extends BaseItemDS<ProjectDM> {

  public get projects() {
    return this.items;
  }

  public get currentProject(): ProjectDM {
    return this.items[ApplicationDSModule.selectedProjectID] || {};
  }

  @Action({rawError: true})
  async findByRoomId(roomId: number) {
    return this.itemsAsArray.find(project => project.publicRoomId === roomId || project.privateRoomId === roomId);
  }

  @Action({rawError: true})
  async listProjects(params?: {sort?: keyof ProjectDM, direction?: "ASC" | "DESC", take?: number, skip?: number, filters?: {[key: string]: (string | number)[] }, processCount?: (count) => void}) {
    const response = await ProjectsAPI.LIST(params)
    const projects = JsonParser.deserializeArray(response.data, ProjectDM)
    this.addOrReplaceItems(projects)
    if (typeof response.totalCount === "number" && params?.processCount) {
      params.processCount(response.totalCount)
    }
    return projects
  }

  @Action({rawError: true})
  async listProjectsDetails(params: {take: number,zone?: string ,skip: number, processCount?: (count) => void}) {
    const response = await ProjectsAPI.LIST_PROJECTS_DETAILS(params)
    const inboxProjects = JsonParser.deserializeArray(response.data, ProjectDM)
    this.addOrReplaceItems(inboxProjects)
    if (typeof response.totalCount === "number" && params?.processCount) {
      params.processCount(response.totalCount)
    }
    return inboxProjects
  }

  @Action({rawError: true})
  async updateProjectList(updatedProjectDetails: Array<SprintDM | NuggetDM >) {

    const newProjects: ProjectDM[] = updatedProjectDetails
      .map((detail: SprintDM | NuggetDM ): ProjectDM => detail.project)
      .filter((project: ProjectDM): boolean => this.items[project?.id] === undefined);

    if (newProjects?.length) {
      this.addOrReplaceItems(newProjects);
    }
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_PROJECT_SAVING)
  async updateProject(project: ProjectDM) {
    const updatedProject = await ProjectsAPI.UPDATE({project});
    this.addOrReplaceItem(updatedProject);
  }

  @Action({ rawError: true })
  async create(params: {title: string, workflowId: number, status: string, managerId: number, description: string, secondaryManagerId: Nullable<number>}) {
    const project = await ProjectsAPI.CREATE({title: params.title, workflowId: params.workflowId, status: params.status, managerId: params.managerId, description: params.description, secondaryManagerId: params.secondaryManagerId});
    this.addOrReplaceItem(project);
    return project
  }

  @Action({rawError: true})
  async doLoad() {
    if(isEmpty(this.items)) {
      const response = await ProjectsAPI.LIST()
      const projects = JsonParser.deserializeArray(response.data, ProjectDM)
      this.addOrReplaceItems(projects);
    }
  }

  @Action({rawError: true})
  async flagAsSeen(roomId) {
    const project = await this.findByRoomId(roomId);
    if(project) {
      if(project.privateRoomId === roomId) {
        project.privateSeenAt = utcNow();
        project.privateIsUnread = false;
      } else if(project.publicRoomId === roomId) {
        project.publicSeenAt = utcNow();
        project.publicIsUnread = false;
      }
      this.addOrReplaceItem(project);
    }
  }

  @Action({rawError: true})
  async updateLastSeenMessageIdByMessage(message: MessageDM) {
    const project = await this.findByRoomId(message.roomId);
    if(project) {
      if(project.privateRoomId === message.roomId) {
        project.privateLatestSeenMessageId = message.id;
      } else if(project.publicRoomId === message.roomId) {
        project.publicLatestSeenMessageId = message.id;
      }
      this.addOrReplaceItem(project);
    }
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.dolphinsocketds.project
      },
      function onChange(socketProject) {
        if(socketProject.project && socketProject.project?.id !== 0) {
          switch (socketProject.action) {
            case SOCKET_ENTITY_ACTIONS.DELETE:
              ProjectDSModule.removeItemById(socketProject.project.id)
              break;
            case SOCKET_ENTITY_ACTIONS.CREATE:
            case SOCKET_ENTITY_ACTIONS.UPDATE:
            case SOCKET_ENTITY_ACTIONS.SEND:
              ProjectDSModule.addOrReplaceItem(socketProject.project);
              break;
            default:
              break;
          }
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.newMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.PROJECT) return;

        if(message.isMine) {
          ProjectDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.eventMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.PROJECT) return;

        if(message.isMine) {
          ProjectDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.PROJECT) return;
        if(message?.seenByMemberReferenceId === ProfileDSModule?.id) {
          ProjectDSModule.updateLastSeenMessageIdByMessage(message);
          ProjectDSModule.flagAsSeen(message.roomId);
        }
      }
    );
  }


}
