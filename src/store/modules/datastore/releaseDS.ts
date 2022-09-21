import ReleaseAPI from "@/api/releaseAPI";
import ReleaseDM from "@/datamodels/releaseDM";
import store, { ApplicationDSModule, ProfileDSModule, ReleaseDSModule, SprintDSModule } from "@/store";
import { Wait, WaitStates } from '@/utils/vuewait';
import { Action, Module } from "vuex-module-decorators";
import BaseItemDS from "./base/baseItemDS";
import { isEmpty } from '@/utils/object';
import { JsonParser } from "@/utils/jsonparser";
import { utcNow } from "@/utils/date";
import {Nullable} from "@/utils/generics";
import MessageDM from "@/datamodels/messageDM";
import {SOCKET_ENTITY_ACTIONS, SUBSCRIBABLE_TYPE} from '@/utils/constants';


@Module({ name: "releaseds", namespaced: true })
export class ReleaseDS extends BaseItemDS<ReleaseDM> {

  public get currentRelease(): ReleaseDM {
    return this.items[ApplicationDSModule.selectedReleaseID] || {};
  }

  @Action({rawError: true})
  async findByRoomId(roomId: number) {
    return this.itemsAsArray.find(release => release.publicRoomId === roomId || release.privateRoomId === roomId);
  }

  @Action({ rawError: true })
  async listReleases(options: { sort?: keyof ReleaseDM, direction?: "ASC" | "DESC", take: number, skip: number, status?: string, filters?: {[key: string]: (string | number)[] }, processCount?: (count: any) => void }) {
    const response = await ReleaseAPI.LIST(options);
    const releases = JsonParser.deserializeArray(response.data, ReleaseDM)
    this.addOrReplaceItems(releases);
    if (typeof response.totalCount === "number" && options.processCount) {
      options.processCount(response.totalCount)
    }
    return releases;
  }
  @Action({ rawError: true })
  async inboxReleases(options: {take: number, zone?: string, processCount?: (count: any) => void}) {
    const response = await ReleaseAPI.LIST_RELEASE_DETAILS(options);
    const inboxReleases = JsonParser.deserializeArray(response.data, ReleaseDM)
    this.addOrReplaceItems(inboxReleases);
    if (typeof response.totalCount === "number" && options.processCount) {
      options.processCount(response.totalCount)
    }
    return inboxReleases;
  }


  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_RELEASE_SAVING)
  async updateRelease(release: ReleaseDM) {
    const updatedRelease = await ReleaseAPI.UPDATE({release});
    this.addOrReplaceItem(updatedRelease);
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_RELEASE_COMPLETING)
  async completeRelease(release: ReleaseDM) {
    const updatedRelease = await ReleaseAPI.COMPLETE({release});
    this.addOrReplaceItem(updatedRelease);
    this.updateSprintRelease(updatedRelease)
    return updatedRelease
  }

  @Action({ rawError: true })
  async updateSprintRelease(release: ReleaseDM) {
    release.projects.forEach(project => {
        const items = SprintDSModule.items[project.id]?.map( sprint => {
        if(sprint.releaseId === release.id) {
          sprint.isReleased = true
        }
        return sprint;
        })
        SprintDSModule.addOrReplaceItem({ id: project.id, items})
    })
  }

  @Action({ rawError: true })
  @Wait(WaitStates.ACTION_RELEASE_PREFLIGHT)
  async preflight(release: ReleaseDM) {
    const warning = await ReleaseAPI.PREFLIGHT({id:release.id, condition: 'warning'});
    const error = await ReleaseAPI.PREFLIGHT({id:release.id, condition: 'error'});
    return {warning: warning, error: error}
  }

  @Action({ rawError: true })
  async create(params: { title: string, managerId: number, description: string, secondaryManagerId: Nullable<number>, releaseCutoff: string, releaseDate: string }) {
    const release = await ReleaseAPI.CREATE({title:params.title, managerId:params.managerId, description:params.description, secondaryManagerId:params.secondaryManagerId, cutoff: params.releaseCutoff, launchDate: params.releaseDate});
    this.addOrReplaceItem(release);
    return release
  }

  @Action({ rawError: true })
  async doLoad() {
    if (isEmpty(this.items)) {
      const releases = await this.listReleases({
        sort: "id",
        direction: "DESC",
        take: 50,
        skip: 0,
        status: "\0"
      });
      this.addOrReplaceItems(releases);
    }
  }
  @Action({rawError: true})
  async flagAsSeen(roomId: number) {
    const release = await this.findByRoomId(roomId);
    if(release) {
      if(release.privateRoomId === roomId) {
        release.privateSeenAt = utcNow();
        release.privateIsUnread = false;
      } else if (release.publicRoomId === roomId) {
        release.publicSeenAt = utcNow();
        release.publicIsUnread = false;
      }
      this.addOrReplaceItem(release);
    }
  }

  @Action({rawError: true})
  async updateLastSeenMessageIdByMessage(message: MessageDM) {
    const release = await this.findByRoomId(message.roomId);
    if(release) {
      if(release.privateRoomId === message.roomId) {
        release.privateLatestSeenMessageId = message.id;
      } else if(release.publicRoomId === message.roomId) {
        release.publicLatestSeenMessageId = message.id;
      }
      this.addOrReplaceItem(release);
    }
  }

  @Action({ rawError: true })
  onInitialization() {
    store.watch(
      function stateToWatch(state) {
        return state.dolphinsocketds.release
      },
      function onChange(socketRelease) {
        if(socketRelease.release && socketRelease.release?.id !== 0) {
          switch (socketRelease.action) {
            case SOCKET_ENTITY_ACTIONS.DELETE:
              ReleaseDSModule.removeItemById(socketRelease.release.id)
              break;
            case SOCKET_ENTITY_ACTIONS.CREATE:
            case SOCKET_ENTITY_ACTIONS.UPDATE:
            case SOCKET_ENTITY_ACTIONS.SEND:
              ReleaseDSModule.addOrReplaceItem(socketRelease.release);
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
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.RELEASE) return;

        if(message.isMine) {
          ReleaseDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.eventMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.RELEASE) return;

        if(message.isMine) {
          ReleaseDSModule.updateLastSeenMessageIdByMessage(message);
        }
      }
    );
    store.watch(
      function stateToWatch(state) {
        return state.jaguarsocketds.seenMessage
      },
      function onChange(message) {
        if(message.subscribableType !== SUBSCRIBABLE_TYPE.RELEASE) return;
        if(message?.seenByMemberReferenceId === ProfileDSModule?.id) {
          ReleaseDSModule.updateLastSeenMessageIdByMessage(message);
          ReleaseDSModule.flagAsSeen(message.roomId);
        }
      }
    );
  }

}
