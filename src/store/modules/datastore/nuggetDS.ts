import NuggetAPI from '@/api/nuggetAPI';
import NuggetDM from '@/datamodels/nuggetDM';
import store, { ApplicationDSModule, AssignmentDSModule, BadgeCountCSModule, NuggetDSModule, NuggetPhasesDSModule, ProfileDSModule, ProjectDSModule, ProjectPhaseDSModule, SprintDSModule } from '@/store';
import { utcNow } from '@/utils/date';
import { isEmpty } from "@/utils/object";
import { Wait, WaitStates } from '@/utils/vuewait';
import cloneDeep from 'lodash.clonedeep';
import { Action, Module } from 'vuex-module-decorators';
import { EntityType } from './applicationDS';
import BaseItemDS from './base/baseItemDS';
import { JsonParser } from "@/utils/jsonparser"
import {SOCKET_ENTITY_ACTIONS, SUBSCRIBABLE_TYPE} from '@/utils/constants';
import {BATCH_OPERATION} from '@/utils/constants';
import MessageDM from '@/datamodels/messageDM';

@Module({ name: 'nuggetds', namespaced: true })
export class NuggetDS extends BaseItemDS<NuggetDM> {

    public get currentNugget(): NuggetDM {
        return this.items[ApplicationDSModule.selectedNuggetID] || {};
    }

    @Action({ rawError: true })
    async searchForNugget(options: { query: string, sort?: keyof NuggetDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, processCount?: (count) => void  }) {
        const response = await NuggetAPI.SEARCH(options);
        const nuggets = JsonParser.deserializeArray(response.data, NuggetDM)
        this.addOrReplaceItems(nuggets);
        if (typeof response.totalCount === "number" && options.processCount) {
          options.processCount(response.totalCount)
        }
        return nuggets
    }

    @Action({ rawError: true })
    async listNuggets(params: { sort?: keyof NuggetDM, direction?: "ASC" | "DESC", take?: number, skip?: number, seenAt?: string, unread?: boolean, responseTime?: string, zone?: string, stage?: string, status?: string, projectId?: number,releaseId?: number , isSubscribed?: number | boolean, sprintId?: number, returnToTriageJobDate?: string , filters?: { [key: string]: (string | number)[] }, processCount?: (count) => void }) {
        const response = await NuggetAPI.LIST(params)
        const nuggets = JsonParser.deserializeArray(response.data, NuggetDM)
        this.addOrReplaceItems(nuggets)
        if (typeof response.totalCount === "number" && params.processCount) {
            params.processCount(response.totalCount)
        }
        return nuggets
    }


    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGET_SAVING)
    async subscribeNugget(nuggetId: number): Promise<NuggetDM> {
        const updatedNugget = await NuggetAPI.SUBSCRIBE({ nuggetId });
        if (updatedNugget?.status !== 'released')
            BadgeCountCSModule.setNuggetSubscribed(BadgeCountCSModule.nuggetSubscribed + 1);
        else
            BadgeCountCSModule.setNuggetReleased(BadgeCountCSModule.nuggetReleased + 1);
        this.addOrReplaceItem(updatedNugget);
        return updatedNugget;
    }

    @Action({ rawError: true })
    @Wait(WaitStates.ACTION_NUGGET_SAVING)
    async unsubscribeNugget(nuggetId: number): Promise<NuggetDM> {
        const updatedNugget = await NuggetAPI.UNSUBSCRIBE({ nuggetId });
        if (updatedNugget?.status !== 'released')
            BadgeCountCSModule.setNuggetSubscribed(BadgeCountCSModule.nuggetSubscribed - 1);
        else
            BadgeCountCSModule.setNuggetReleased(BadgeCountCSModule.nuggetReleased - 1);
        this.addOrReplaceItem(updatedNugget);
        return updatedNugget;
    }

    @Action({ rawError: true })
    async updateNuggetTags(nugget: NuggetDM) {
        const item = cloneDeep(this.items[nugget.id]);
        const newTagIds = nugget.tags.map(tag => tag.id);
        const previousTagIds = this.currentNugget.tags.map(tag => tag.id);
        const removedTags: number[] = previousTagIds.filter(id => !newTagIds.includes(id));
        const addedTags: number[] = newTagIds.filter(id => !previousTagIds.includes(id));
        if (addedTags.length || removedTags.length) {
            const tags = await NuggetAPI.PATCH_NUGGET_TAGS({nuggetId: nugget.id,tagIdsToAdd: addedTags, tagIdsToRemove: removedTags});
            tags.forEach(tag => {
                if (addedTags.includes(tag.id)) {
                    item.tags.push(tag);
                } else if (removedTags.includes(tag.id)) {
                    const index = item.tags.findIndex(nuggetTag => nuggetTag.id === tag.id);
                    if (index !== -1) item.tags.splice(index, 1);
                }
            })
            this.addOrReplaceItem(item);
        }
    }

    @Action({ rawError: true })
    async updateNuggetProject(params: { id: number, projectId: number }) {
        if (params.projectId !== this.currentNugget.projectId) {
            const updatedNugget = await NuggetAPI.UPDATE_NUGGET_PROJECT({ id: params.id, projectId: params.projectId });
            const currentProject = ProjectDSModule.itemsAsArray.find(project => project.id === updatedNugget.projectId)
            if(currentProject) {
                updatedNugget.projectTitle = currentProject?.title
                AssignmentDSModule.itemsAsArray.forEach(item => {
                    if(item.nuggetId === updatedNugget.id) {
                        item.projectTitle = currentProject.title
                        AssignmentDSModule.addOrReplaceItem(item)
                    }
                })
            }
            this.addOrReplaceItem(updatedNugget)
        }
    }

    @Action({ rawError: true })
    async schedule(params: {returnToTriageJobAt, nuggetId}) {
        const resp = await NuggetAPI.SCHEDULE({ at: params.returnToTriageJobAt, nuggetId: params.nuggetId });
        const currentNugget = this.itemsAsArray.find(nugget => nugget.id === resp.nuggetId)
        if (currentNugget) {
            currentNugget.returntotriagejob = resp
            this.addOrReplaceItem(currentNugget)
        }
    }

    @Action({ rawError: true })
    async removeSprint(params: {projectId, nuggetId}) {
        const resp = await NuggetAPI.REMOVE_SPRINT({ projectId: params.projectId, nuggetId: params.nuggetId });
        const currentNugget = this.items[params.nuggetId]
        if(currentNugget && resp) {
            currentNugget.sprint = null
            currentNugget.sprintId = 0
            this.addOrReplaceItem(currentNugget)
        }
        AssignmentDSModule.itemsAsArray.forEach(item => {
            if(item.nuggetId === params.nuggetId) {
                item.sprintId = 0
                AssignmentDSModule.addOrReplaceItem(item)
            }
        })
    }

    @Action({ rawError: true })
    async appendSprint(params) {
        const projectId = ApplicationDSModule.selectedProjectID
        await NuggetAPI.APPEND_SPRINT(params);
        const sprint = SprintDSModule.items[projectId]?.find(sprint => sprint.id === params[0].sprintId)
        AssignmentDSModule.itemsAsArray.forEach(item => {
            if(item.nuggetId === params[0].nuggetId && sprint) {
                item.sprintId = sprint.id
                item.sprintName = sprint.name
                AssignmentDSModule.addOrReplaceItem(item)
            }
        })
    }

    @Action({ rawError: true })
    async archiveNugget(params) {
        const nugget = await NuggetAPI.ARCHIVE(params);
        this.addOrReplaceItem(nugget)
    }

    @Action({ rawError: true })
    async unarchiveNugget(params) {
        const nugget = await NuggetAPI.UNARCHIVE(params);
        this.addOrReplaceItem(nugget)
    }
    
    @Action({ rawError: true })
    async patch(body: {op: BATCH_OPERATION, path: string, value: any}[]) {
        await NuggetAPI.PATCH({body});
        //TODO backend needs to send proper response to patch so we can update our data stores accordingly instead of making assumption as done in method below
        await this.updateNuggetSprint(body)
    }

    @Action
    async updateNuggetSprint(data: {op: BATCH_OPERATION, path: string, value: any}[]) {
        // eslint-disable-next-line
        const sprintRemoveRegex = 'projects\/.*\/sprints'

        data.forEach(data => {
            if(data.op === BATCH_OPERATION.APPEND && data.path.isSameCaseInsensitive('nuggetsprints')) {
                data.value.forEach((item: {nuggetId: number, sprintId: number}) => {
                    const currentNugget = this.items[item.nuggetId];
                    if(currentNugget) {
                        currentNugget.sprintId = item.sprintId;
                        this.addOrReplaceItem(currentNugget);
                    }
                });
            } else if(data.op === BATCH_OPERATION.REMOVE && data.path.match(sprintRemoveRegex) !== null) {
                const currentNugget =  this.items[data.value.nuggetId];
                if(currentNugget) {
                    currentNugget.sprintId = 0;
                    currentNugget.sprint = null;
                    this.addOrReplaceItem(currentNugget);
                }
            }
        });
    }

    @Action({ rawError: true })
    async updateNugget(params: { id: number, stage?: string, description?: string, title?: string, priority?: string, type?: string, createdByMemberId?: number, leadPhaseId?: number, sprintId?: number, showToast?: boolean }) {
        const updatedNugget = await NuggetAPI.UPDATE_NUGGET(params);
        if (updatedNugget) {
            this.addOrReplaceItem(updatedNugget)
        }

    }


    @Action({ rawError: true })
    async unskipNuggetPhase(nuggetPhaseId: number) {
        const response = await NuggetAPI.UNSKIP_PHASE({nuggetPhaseId})
        const items = NuggetPhasesDSModule.items[response.nuggetId].filter(nuggetPhase => nuggetPhase.id !== response.id);
        NuggetPhasesDSModule.addOrReplaceItem({id: response.nuggetId, items});
        return response
    }

    @Action({ rawError: true })
    async skipNuggetPhase(params: { nuggetId: number, phaseId: number }) {
        const response = await NuggetAPI.SKIP_PHASE({nuggetId: params.nuggetId, phaseId: params.phaseId})
        let currentNuggetPhases = NuggetPhasesDSModule.items[params.nuggetId]
        if (currentNuggetPhases) {
            currentNuggetPhases.push(response)
            NuggetPhasesDSModule.addOrReplaceItem({id: params.nuggetId, items: currentNuggetPhases})
        } else {
            currentNuggetPhases = [response]
            NuggetPhasesDSModule.addOrReplaceItem({id: params.nuggetId, items: currentNuggetPhases})
        }
        return response
    }

    @Action({ rawError: true })
    async create(params: { title: string, type: string, projectId: number, priority: string, description: string, stage: string }) {
        const response = await NuggetAPI.CREATE({ title: params.title, type: params.type, projectId: params.projectId, priority: params.priority, description: params.description, stage: params.stage })
        this.addOrReplaceItem(response)
        return response
    }

    @Action({ rawError: true })
    async subscribeDraftNugget(draftNuggetId: number) {
        const updatedNugget = await NuggetAPI.DRAFT_SUBSCRIBE({draftNuggetId});
        return updatedNugget
    }

    @Action({ rawError: true })
    async unsubscribeDraftNugget(draftNuggetId: number) {
        const updatedNugget = await NuggetAPI.DRAFT_UNSUBSCRIBE({draftNuggetId});
        return updatedNugget
    }

    @Action({ rawError: true })
    async getNuggetById(nuggetId: number): Promise<NuggetDM> {
        const nugget = await NuggetAPI.GET_NUGGET_BY_ID(nuggetId);
        this.addOrReplaceItem(nugget);
        return nugget;

    }

    @Action({ rawError: true })
    async doLoad(force = false) {
        if (isEmpty(this.getItems[ApplicationDSModule.selectedNuggetID]) || force) {
            const newNugget = await this.getNuggetById(ApplicationDSModule.selectedNuggetID);
            this.addOrReplaceItem(newNugget);
            return newNugget
        }
    }

    @Action({rawError: true})
    async findNuggetByRoomId(roomId: number) {
        return this.itemsAsArray.find(nugget => nugget.privateRoomId === roomId || nugget.publicRoomId === roomId)
    }

    @Action({rawError: true})
    async flagAsSeen(roomId: number) {
        const nugget = await this.findNuggetByRoomId(roomId);
        if(nugget) {
            if(nugget.privateRoomId === roomId) {
                nugget.privateSeenAt = utcNow();
                nugget.privateIsUnread = false;
            } else {
                nugget.publicSeenAt = utcNow();
                nugget.publicIsUnread = false;
            }
            this.addOrReplaceItem(nugget);
        }
    }

    @Action({rawError: true})
    async flagAsUnseen(roomId: number) {
        const nugget = await this.findNuggetByRoomId(roomId);
        if(nugget) {
            if(nugget.privateRoomId === roomId) {
                nugget.privateSeenAt = null;
            } else {
                nugget.publicSeenAt = null;
            }
            this.addOrReplaceItem(nugget);
        }
    }

    @Action({rawError: true})
    async updateLastSeenMessageIdByMessage(message: MessageDM) {
        const nugget = await this.findNuggetByRoomId(message.roomId);
        if(nugget) {
            if(nugget.privateRoomId === message.roomId) {
                nugget.privateLatestSeenMessageId = message.id;
            } else if(nugget.publicRoomId === message.roomId) {
                nugget.publicLatestSeenMessageId = message.id;
            }
            this.addOrReplaceItem(nugget);
        }
    }

    @Action({ rawError: true })
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedNuggetID
            },
            function onChange(id) {
                if (id !== 0 && (ApplicationDSModule.selectedEntityType === EntityType.nugget || ApplicationDSModule.selectedEntityType === EntityType.assignment)) {
                    NuggetDSModule.doLoad();
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.dolphinsocketds.nugget
            },
            function onChange(socketNugget) {
                if(socketNugget.nugget && socketNugget.nugget?.id !== 0) {
                    switch (socketNugget.action) {
                        case SOCKET_ENTITY_ACTIONS.DELETE:
                            NuggetDSModule.removeItemById(socketNugget.nugget.id);
                            break;
                        case SOCKET_ENTITY_ACTIONS.CREATE:
                        case SOCKET_ENTITY_ACTIONS.UPDATE:
                        case SOCKET_ENTITY_ACTIONS.SEND:
                            NuggetDSModule.addOrReplaceItem(socketNugget.nugget);
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
                if(message.subscribableType !== SUBSCRIBABLE_TYPE.NUGGET) return;

                if(message.isMine) {
                    NuggetDSModule.updateLastSeenMessageIdByMessage(message);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.eventMessage
            },
            function onChange(message) {
                if(message.subscribableType !== SUBSCRIBABLE_TYPE.NUGGET) return;

                if(message.isMine) {
                    NuggetDSModule.updateLastSeenMessageIdByMessage(message);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
            function onChange(message) {
                if(message.subscribableType !== SUBSCRIBABLE_TYPE.NUGGET) return;

                if(message?.seenByMemberReferenceId === ProfileDSModule?.id) {
                    NuggetDSModule.updateLastSeenMessageIdByMessage(message);
                    NuggetDSModule.flagAsSeen(message.roomId);
                }
            }
        );
    }

    @Action({rawError: true})
    async performIntegrityCheck(nuggetId){
         const selectedNugget = this.items[nuggetId]
         const selectedNuggetphases =  NuggetPhasesDSModule.items[nuggetId]
        if(selectedNugget) {
            const hasAssignment: Boolean =  !NuggetPhasesDSModule.items[nuggetId].filter(phase=> phase.isSystem === false && phase.isSkipped === false).isEmpty()
            const selectedNuggetProjectPhases = ProjectPhaseDSModule.items[selectedNugget.projectId].filter(phase=>phase.isSystem === false).map((ProjPhase) => {return ProjPhase.id})
            const nuggetPhases =  selectedNuggetphases.filter(phase=> phase.isSystem === false || phase.isSkipped === true).map((nuggetPhase)=>nuggetPhase.phaseId)

            if(selectedNuggetProjectPhases.length === nuggetPhases.length)
                selectedNugget.assignmentLevel = 'full'
            else if(hasAssignment)selectedNugget.assignmentLevel = 'partial'
            else selectedNugget.assignmentLevel = 'none'

            this.addOrReplaceItem(selectedNugget)
        }
    }

}
