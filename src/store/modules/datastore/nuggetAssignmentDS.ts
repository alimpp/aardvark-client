import { NuggetDSModule } from './../../index';
import AssignmentAPI from "@/api/assignmentAPI";
import AssignmentDM from "@/datamodels/assignmentDM";
import store, {ApplicationDSModule, NuggetAssignmentDSModule} from "@/store";
import { Action, Module, VuexModule } from "vuex-module-decorators";
import { DetailTabName } from './applicationDS';
import BaseItemsDS from './base/baseItemsDS';
import { JsonParser } from "@/utils/jsonparser"
import {SOCKET_ENTITY_ACTIONS} from "@/utils/constants";
import cloneDeep from 'lodash.clonedeep';
import { Wait, WaitStates } from '@/utils/vuewait';


@Module({ name: "nuggetassignmentds", namespaced: true, stateFactory: true})
export class NuggetAssignmentDS extends BaseItemsDS<AssignmentDM> implements INuggetAssignmentDS {

  constructor(module: VuexModule<ThisType<AssignmentDM>, AssignmentDM>) {
    super(module);
  }

  public get currentNuggetAssignments(): AssignmentDM[] {
    return cloneDeep(this.items[ApplicationDSModule.selectedNuggetID]);
  }
  
  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_NUGGETASSIGNMENT_LOADING)
  async doLoad() {
    const id = ApplicationDSModule.selectedNuggetID
    const response = await AssignmentAPI.LIST({sort: 'id', direction: 'ASC', take: 100, nuggetId: id})
    const assignments = JsonParser.deserializeArray(response.data, AssignmentDM)
    await this.replaceItems({id: id, items: assignments})
  }

  
  @Action({rawError: true})
  async addOrDelete(data: {item: AssignmentDM , selectedNuggetID: number}) {
    const items = [...this.items[data.selectedNuggetID]];
    const item = items.find(element => element.id === data.item.id );
    if(item){
      items.splice(items.indexOf(item), 1);
    }else {
      items.push(data.item);
    }
    await this.replaceItems({id: data.selectedNuggetID, items: items})
    await NuggetDSModule.performIntegrityCheck(data.selectedNuggetID)
  }


  @Action({rawError: true})
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return {id: state.applicationds.selectedNuggetID, tabName: state.applicationds.selectedDetailTab}
      },
      async function onChange({id, tabName}) {
        if(id !== 0 && ApplicationDSModule.selectedDetailTab === DetailTabName.assigned) {
          await NuggetAssignmentDSModule.doLoad();
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.dolphinsocketds.assignment
      },
      function onChange(socketAssignment) {
        if(socketAssignment.assignment && socketAssignment.assignment?.id && socketAssignment.assignment?.nuggetId) {
          const assignment = socketAssignment.assignment;
          const nuggetId = socketAssignment.assignment.nuggetId;
          const items = NuggetAssignmentDSModule.items[nuggetId] || [];
          switch (socketAssignment.action) {
            case SOCKET_ENTITY_ACTIONS.DELETE:
              if(assignment.cadenceProgress === 0 ){
                NuggetAssignmentDSModule.addOrReplaceItem({id: assignment.nuggetId, items: items.filter(item => item.id !== assignment.id)});
              }else {
                NuggetAssignmentDSModule.addOrReplaceItem({id: assignment.nuggetId, items: items.map(item => item.id === assignment.id ? assignment : item)});
              }
              break;
            case SOCKET_ENTITY_ACTIONS.CREATE:
              NuggetAssignmentDSModule.addOrReplaceItem({id: assignment.nuggetId, items: [...items, assignment]});
              break;
            case SOCKET_ENTITY_ACTIONS.UPDATE:
              NuggetAssignmentDSModule.addOrReplaceItem({id: assignment.nuggetId, items: items.map(item => item.id === assignment.id ? assignment : item)});
              break;
            default:
              break;
          }
        }
      }
    );
  }
}

export interface INuggetAssignmentDS {
  items: { [key: number]: AssignmentDM[] }
}