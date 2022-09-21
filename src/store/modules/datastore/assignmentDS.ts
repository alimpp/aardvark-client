import AssignmentAPI from "@/api/assignmentAPI";
import AssignmentDM from "@/datamodels/assignmentDM";
import store, { ApplicationDSModule, AssignmentDSModule, NuggetAssignmentDSModule, NuggetDSModule, NuggetPhasesDSModule } from "@/store";
import { Action, Module } from "vuex-module-decorators";
import BaseItemDS from './base/baseItemDS';
import { Wait, WaitStates } from '@/utils/vuewait';
import NuggetDM from "@/datamodels/nuggetDM";
import cloneDeep from 'lodash.clonedeep';
import { JsonParser } from "@/utils/jsonparser"
import {SOCKET_ENTITY_ACTIONS} from "@/utils/constants";
import {BATCH_OPERATION} from '@/utils/constants';

@Module({ name: "assignmentds", namespaced: true })
export class AssignmentDS extends BaseItemDS<AssignmentDM> {

  public get currentAssignment(): AssignmentDM {
    return this.items[ApplicationDSModule.selectedAssignmentID] || {}
  }

  @Action({rawError: true})
  async listAssignments(params: {sort?: keyof AssignmentDM, direction?: "ASC" | "DESC", take: number, skip: number, memberId?: number | string, zone?: string, status?: string, perspective?: string, extendNeedApproval?: boolean | string, boarding?: string, startDate?: string, responseTime?: string, nuggetId?: number, lastTimecardTimestamp?: string, processCount?: (count) => void}) {
      const response = await AssignmentAPI.LIST(params);
      const assignments = JsonParser.deserializeArray(response.data, AssignmentDM)
      this.addOrReplaceItems(assignments)
      if (typeof response.totalCount === "number" && params.processCount) {
        params.processCount(response.totalCount)
      }
      return assignments
  }

  @Action({ rawError: true })
  async assignResource(params: { nuggetId: number, phaseId: number, memberId: number }) {
      const response = await AssignmentAPI.CREATE({nuggetId: params.nuggetId, phaseId: params.phaseId, memberId: params.memberId});
      this.addOrReplaceItem(response);
      await NuggetAssignmentDSModule.addOrDelete({item: response ,selectedNuggetID: params.nuggetId});
      return response
  }

  @Action({ rawError: true })
  async unassignResource(params: { id: number, nuggetId: number, phaseId: number, memberId: number }) {
        const response = await AssignmentAPI.DELETE({id: params.id});
        this.addOrReplaceItem(response);
        await NuggetAssignmentDSModule.addOrDelete({item: response ,selectedNuggetID: params.nuggetId});
        return response
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_ESTIMATE_SAVING)
  async estimate(assignment: AssignmentDM) {
    const estimate = await AssignmentAPI.UPDATE({assignment});
    this.addOrReplaceItem(estimate);
  }

  @Action({ rawError: true })
  async decline(assignmentId: number) {
    const estimate = await AssignmentAPI.DECLINE({assignmentId});
    this.addOrReplaceItem(estimate);
  }

  @Action({rawError: true})
  async patch(body: {op: BATCH_OPERATION, path: string, value: any}[]) {
      await AssignmentAPI.PATCH(body);
      //TODO backend needs to send proper response to patch so we can update our data stores accordingly instead of making assumption as done in method below
      await this.updateNuggetSprint(body)
      await this.updateAssignmentSprint(body)
  }

  @Action({ rawError: true })
  async doLoad() {
    return
  }

  @Action
  async updateNuggetSprint(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
      // eslint-disable-next-line 
      const sprintRemoveRegex = 'projects\/.*\/sprints'

      data.forEach(data => {
          if(data.op === BATCH_OPERATION.APPEND && data.path.isSameCaseInsensitive('nuggetsprints')) {
              data.value.forEach((item: {nuggetId: number, sprintId: number}) => {
                  const currentNugget = NuggetDSModule.items[item.nuggetId];
                  if(currentNugget) {
                      currentNugget.sprintId = item.sprintId;
                      NuggetDSModule.addOrReplaceItem(currentNugget);
                  }
              });
          } else if(data.op === BATCH_OPERATION.REMOVE && data.path.match(sprintRemoveRegex) !== null) {
              const currentNugget =  NuggetDSModule.items[data.value.nuggetId];
              if(currentNugget) {
                  currentNugget.sprintId = 0;
                  currentNugget.sprint = null;
                  NuggetDSModule.addOrReplaceItem(currentNugget);
              }
          }
      });
  }

  @Action
  async updateAssignmentSprint(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
      // eslint-disable-next-line 
      const sprintRemoveRegex = 'projects\/.*\/sprints'

      data.forEach(data => {
          if(data.op === BATCH_OPERATION.APPEND && data.path.isSameCaseInsensitive('nuggetsprints')) {
              data.value.forEach((item: {nuggetId: number, sprintId: number}) => {
                this.itemsAsArray.forEach(assignment => {
                  if(assignment.nuggetId === item.nuggetId) {
                    assignment.sprintId = item.sprintId
                      this.addOrReplaceItem(assignment)
                  }
              })
              });
          } else if(data.op === BATCH_OPERATION.REMOVE && data.path.match(sprintRemoveRegex) !== null) {
            this.itemsAsArray.forEach(item => {
              if(item.nuggetId === data.value.nuggetId ) {
                  item.sprintId = 0
                  this.addOrReplaceItem(item)
              }
          })
          }
      });
  }

  @Action({rawError: true})
  async updateNuggetFieldsInAssignments(data: {nugget: NuggetDM}) {
    const {nugget} = data;
    const assignments = AssignmentDSModule.itemsAsArray
      .filter(assignment => assignment.nuggetId === nugget.id)
      .map(assignment => {
        const assignmentCopy = cloneDeep(assignment);
        assignmentCopy.nuggetTitle = nugget.title;
        assignmentCopy.nuggetPriority = nugget.priority;
        assignmentCopy.nuggetKind = nugget.type;
        return assignmentCopy;
      })
    this.addOrReplaceItems(assignments);
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.nuggetds.itemWatch
      },
      function onChange(nugget) {
        if (nugget?.item)
          AssignmentDSModule.updateNuggetFieldsInAssignments({nugget: nugget.item})
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.dolphinsocketds.assignment
      },
      function onChange(socketAssignment) {
        if(socketAssignment.assignment && socketAssignment.assignment?.id !== 0) {
          switch (socketAssignment.action) {
            case SOCKET_ENTITY_ACTIONS.DELETE:
              AssignmentDSModule.removeItemById(socketAssignment.assignment.id);
              break;
            case SOCKET_ENTITY_ACTIONS.CREATE:
            case SOCKET_ENTITY_ACTIONS.UPDATE:
              AssignmentDSModule.addOrReplaceItem(socketAssignment.assignment);
              break;
            default:
              break;
          }
        }
      }
    );
  }

}
