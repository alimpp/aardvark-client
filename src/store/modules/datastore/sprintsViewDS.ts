import {Action, Module} from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import {Wait, WaitStates} from '@/utils/vuewait';
import store, {ApplicationDSModule, ProfileDSModule, ProjectDSModule, SprintsViewDSModule} from '@/store';
import {JsonParser} from "@/utils/jsonparser"
import SprintDM from '@/datamodels/sprintDM';
import SprintsViewAPI from '@/api/sprintsViewAPI';
import {utcNow} from '@/utils/date';
import ReleaseDM from '@/datamodels/releaseDM';
import {SprintDSModule} from "@/store";
import { SOCKET_ENTITY_ACTIONS } from '@/utils/constants';
import {SUBSCRIBABLE_TYPE} from '@/utils/constants';
import MessageDM from '@/datamodels/messageDM';
import { isEmpty } from '@/utils/object';
import dayjs from 'dayjs';


@Module({name: 'sprintsviewds', namespaced: true})
export class SprintsViewDS extends BaseItemDS<SprintDM> {

  public get currentSprintView(): SprintDM {
    return this.items[ApplicationDSModule.selectedSprintsViewID] || {};
  }

  public get sprintsView() {
    return this.items;
  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_SPRINT_SAVING)
  async appendReleaseSprints(args: {releaseId: number, sprintId: number}) {
    const response = await SprintsViewAPI.APPEND_RELEASE_SPRINT(args);
    const appendedReleaseSprints = JsonParser.deserializeObject(response.data, ReleaseDM)

    const SprintView = this.items[args.sprintId]
    if(SprintView){
      SprintView.releaseId = appendedReleaseSprints.id
      SprintView.cutoff = appendedReleaseSprints.cutoff
      SprintView.launchDate = appendedReleaseSprints.launchDate
      SprintView.releaseTitle = appendedReleaseSprints.title
      this.addOrReplaceItem(SprintView)
    }
    this.updateReleaseSprint({currentRelease:appendedReleaseSprints, sprintId: args.sprintId})
    return appendedReleaseSprints
  }

  @Action({rawError: true}) 
  updateReleaseSprint(args: {currentRelease: ReleaseDM, sprintId: number}) {
    const currentProjectId = this.items[args.sprintId].projectId
    if(SprintDSModule.items[currentProjectId]) {
      const items = SprintDSModule.items[currentProjectId]?.map( sprint => {
        if(args.sprintId === sprint.id) {
          sprint.releaseId = args.currentRelease.id
          sprint.releaseTitle = args.currentRelease.title
        }
        return sprint
      })
      SprintDSModule.addOrReplaceItem({ id: currentProjectId, items })

    }

  }

  @Action({rawError: true})
  @Wait(WaitStates.ACTION_SPRINT_SAVING)
  async removeReleaseSprints(args: {releaseId: number, sprintId: number}) {
    const response = await SprintsViewAPI.REMOVE_RELEASE_SPRINT(args);
    const removedReleaseSprints = JsonParser.deserializeObject(response.data, ReleaseDM)
    const SprintView = this.items[args.sprintId]
    if(SprintView){
      SprintView.releaseId = 0
      SprintView.cutoff = ""
      SprintView.launchDate = ""
      SprintView.releaseTitle = ""
      this.addOrReplaceItem(SprintView)
    }
    return removedReleaseSprints
  }

  @Action({rawError: true})
  async findByRoomId(roomId: number) {
    return this.itemsAsArray.find(sprint => sprint.publicRoomId === roomId || sprint.privateRoomId === roomId);
  }

  @Action({rawError: true})
  async listSprintDetails(options: {sort?: keyof SprintDM, direction?: "ASC" | "DESC", zone?: string, take?: number, skip?: number,isReleased?: boolean, filters?: {[key: string]: (string | number)[]}, hasProductionNuggets?: boolean, hasBackloggedNuggets?: boolean, hasEstimatedNuggets?: boolean, processCount?: (count) => void}): Promise<SprintDM[]> {
      const response = await SprintsViewAPI.LIST_SPRINTS_DETAILS(options);
      if (!(response?.data?.length)) return [];
      const sprintDetails = JsonParser.deserializeArray(response.data, SprintDM);
      this.addOrReplaceItems(sprintDetails);
      ProjectDSModule.updateProjectList(sprintDetails);
      if (typeof response?.totalCount === "number" && options?.processCount)
        options.processCount(response.totalCount);
      return sprintDetails;
  }

  @Action({rawError: true})
  async listSprintViews(options: {sort?: keyof SprintDM, direction?: "ASC" | "DESC", zone: string, take: number, skip: number,isReleased?: boolean, filters?: {[key: string]: (string | number)[]}, hasProductionNuggets: boolean, hasBackloggedNuggets: boolean, processCount?: (count) => void}): Promise<SprintDM[]> {
      const response = await SprintsViewAPI.LIST(options);
      if (!(response?.data?.length)) return [];
    const sprintDetails = JsonParser.deserializeArray(response.data, SprintDM);
      this.addOrReplaceItems(sprintDetails);
      ProjectDSModule.updateProjectList(sprintDetails);
      if (typeof response?.totalCount === "number" && options?.processCount)
        options.processCount(response.totalCount);
      return sprintDetails;
  }

  @Action({rawError: true})
  doLoad(): void {
    return
  }

  @Action({rawError: true})
  async flagAsSeen(roomId: number) {
    const sprintDetail = await this.findByRoomId(roomId);
    if (sprintDetail) {
      if(sprintDetail.privateRoomId === roomId) {
        sprintDetail.privateSeenAt = utcNow();
        sprintDetail.privateIsUnread = false;
      } else if(sprintDetail.publicRoomId === roomId) {
        sprintDetail.publicSeenAt = utcNow();
        sprintDetail.publicIsUnread = false;
      }
      this.addOrReplaceItem(sprintDetail);
    }
  }


  @Action({rawError: true})
  async updateLastSeenMessageIdByMessage(message: MessageDM) {
    const sprint = await this.findByRoomId(message.roomId);
    if(sprint) {
      if(sprint.privateRoomId === message.roomId) {
        sprint.privateLatestSeenMessageId = message.id;
      } else if(sprint.publicRoomId === message.roomId) {
        sprint.publicLatestSeenMessageId = message.id;
      }
      this.addOrReplaceItem(sprint);
    }
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.newMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.SPRINT) return;

        if(message.isMine) {
          SprintsViewDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.eventMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.SPRINT) return;

        if(message.isMine) {
          SprintsViewDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.SPRINT) return;
        if(message?.seenByMemberReferenceId === ProfileDSModule?.id) {
          SprintsViewDSModule.updateLastSeenMessageIdByMessage(message);
          SprintsViewDSModule.flagAsSeen(message.roomId);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
          return state.dolphinsocketds.sprint;
      },
      function onChange(socketSprint) {
        const sprint = socketSprint.sprint ; 

          if(sprint && sprint.id !== 0 ) {
            const sprintViewItems = SprintsViewDSModule.items  
            const currentSprintView =  sprintViewItems[sprint.id];             

              switch (socketSprint.action) {
                  case SOCKET_ENTITY_ACTIONS.DELETE:
                    if(!isEmpty(currentSprintView))SprintsViewDSModule.removeItemById(sprint.id);
                      break;
                  case SOCKET_ENTITY_ACTIONS.CREATE:
                    if(isEmpty(currentSprintView))SprintsViewDSModule.addOrReplaceItem(sprint)
                      break
                  case SOCKET_ENTITY_ACTIONS.UPDATE:                    
                    if(!isEmpty(sprintViewItems) && !isEmpty(currentSprintView) && dayjs(currentSprintView.modifiedAt).isBefore(sprint.modifiedAt)){
                        SprintsViewDSModule.addOrReplaceItem(sprint);
                    }
                      break;
                  default:
                      break;
              }          
          }
      }
  )
  }

}
