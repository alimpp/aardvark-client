import SprintAPI from '@/api/sprintAPI';
import SprintDM from '@/datamodels/sprintDM';
import store, { ApplicationDSModule, SprintDSModule, SprintsViewDSModule, NuggetDSModule } from '@/store';
import { SOCKET_ENTITY_ACTIONS } from '@/utils/constants';
import { isEmpty } from '@/utils/object';
import {Wait, WaitStates} from '@/utils/vuewait';
import dayjs from 'dayjs';
import {Action, Module} from "vuex-module-decorators";
import BaseItemsDS from './base/baseItemsDS';

@Module({name: 'sprintds', namespaced: true})
export class SprintDS extends BaseItemsDS<SprintDM> implements ISprintDS {

    @Action({rawError: true})
    async create(params: {projectId: number, name: string}) {
        const item = await SprintAPI.CREATE({projectId: params.projectId, name: params.name});
        this.addOrReplaceItem({id: params.projectId, items: [...this.getItems[params.projectId], item]});
        return item;
    }

    @Action({rawError: true})
    async fetch(data: {id: number, params?: any}) {
        const items = await SprintAPI.LIST({projectId: data.id, params: data.params});
        this.addOrReplaceItems({id: data.id, items});
        return items;
    }

    @Action({rawError: true})
    async delete(params: {sprintId: number, projectId: number}) {
        const sprint = await SprintAPI.DELETE({sprintId: params.sprintId});
        const items = this.getItems[params.projectId].filter(item => item.id !== sprint.id);
        this.addOrReplaceItems({id: params.projectId, items})
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_SPRINT_SAVING)
    async update(params: {sprintId: number, sprintName: string, projectID: number, period?: string, description?: string}) {
        const item = await SprintAPI.UPDATE({sprintId: params.sprintId, sprintName: params.sprintName, projectId: params.projectID , period:params.period , description: params.description});        
        if(this.getItems[params.projectID])this.addOrReplaceItem({id: params.projectID, items: this.getItems[params.projectID].map(current => current.id === item.id ? item : current)});
        const sprintView = SprintsViewDSModule.items[item.id];
        if (sprintView) {
            sprintView.name = item.name
            sprintView.description = item.description
            sprintView.period = item.period
            sprintView.modifiedAt = item.modifiedAt
            sprintView.modifiedByMemberId = item.modifiedByMemberId
            SprintsViewDSModule.addOrReplaceItem(sprintView)
        }
    }

    @Action({rawError: true})
    @Wait(WaitStates.ACTION_SPRINT_SAVING)
    async rescheduleSprint(args: {returnToTriage: string, sprintId: number, moveNugget?: boolean}) {
        const sprint = await SprintAPI.RESCHEDULE({ returnToTriage: args.returnToTriage, sprintId: args.sprintId, moveNugget: args.moveNugget });
        const sprintView = SprintsViewDSModule.items[sprint.id]
        if (sprintView) {
            sprintView.returnToTriageJobDate = sprint.returnToTriageJobDate 
            sprintView.modifiedAt = sprint.modifiedAt
            sprintView.modifiedByMemberId = sprint.modifiedByMemberId
            SprintsViewDSModule.addOrReplaceItem(sprintView)
        }
        await this.updateNuggetsReturnToTriageDate({ sprint: sprint, moveNugget: args.moveNugget})
        if(this.getItems[sprint.projectId]) this.addOrReplaceItem({id: sprint.projectId, items: this.getItems[sprint.projectId].map(existingSprint => existingSprint.id === sprint.id ? sprint : existingSprint)})
    }
    
    @Action({ rawError: true })
    async updateNuggetsReturnToTriageDate(args: { sprint: SprintDM, moveNugget?: boolean}) {
        if (typeof args.moveNugget === 'undefined') return
        const currentSprint = SprintDSModule.getItems[args.sprint.projectId].find(item => item.id === args.sprint.id)
        NuggetDSModule.itemsAsArray.forEach(nugget => {
            if (!args.moveNugget && nugget.returntotriagejob.at === currentSprint?.returnToTriageJobDate && nugget.sprintId === args.sprint.id) {
                nugget.returntotriagejob = { at: args.sprint.returntotriagejob.at }
                NuggetDSModule.addOrReplaceItem(nugget)
            } else if (args.moveNugget && nugget.sprintId === args.sprint.id) {
                nugget.returntotriagejob = { at: args.sprint.returntotriagejob.at }
                NuggetDSModule.addOrReplaceItem(nugget)
            }
        })
    }


    @Action({rawError: true})
    async doLoad() {
        this.fetch({id: ApplicationDSModule.selectedProjectID});
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.sprint;
            },
            function onChange(socketSprint) {
                const sprint = socketSprint.sprint ; 

                if(sprint && sprint?.id !== 0 ) {
                    const projectId =  sprint.projectId
                    const sprintItems =  SprintDSModule.getItems[sprint.projectId];
                    const currentSprint = sprintItems ? sprintItems.find(item=>sprint.id === item.id) : undefined;

                    switch (socketSprint.action) {
                        
                        case SOCKET_ENTITY_ACTIONS.DELETE:
                            if(currentSprint) SprintDSModule.addOrReplaceItem({id: projectId, items: sprintItems.filter(sprint => sprint.id !== currentSprint.id)})
                            break;
                            
                        case SOCKET_ENTITY_ACTIONS.CREATE:
                            if(!isEmpty(sprintItems) && isEmpty(currentSprint))SprintDSModule.addOrReplaceItem({id: projectId, items: [...sprintItems, sprint]});                            
                            break;

                        case SOCKET_ENTITY_ACTIONS.UPDATE:                            
                            if(!isEmpty(sprintItems) && !isEmpty(currentSprint) && dayjs(currentSprint?.modifiedAt).isBefore(sprint.modifiedAt))SprintDSModule.addOrReplaceItem({id: projectId, items: sprintItems.map(existingSprint => existingSprint.id === sprint.id ? sprint : existingSprint)});
                            break;
                        default:
                        break;
                    }
                }
            }
        )
    }

}
export interface ISprintDS {
    items: {[key: number]: SprintDM[]}
}
 