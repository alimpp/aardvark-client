import MemberAPI from '@/api/membersAPI';
import SessionDM from '@/datamodels/sessionDM';
import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';

@Module({ name: 'sessionds', namespaced: true })
export class SessionDS extends BaseItemDS<SessionDM> {

  @Action({ rawError: true })
  async doLoad() {
    const sessions = await MemberAPI.LIST_SESSIONS();
    this.addOrReplaceItems(sessions);
    return sessions
  }

  @Action({ rawError: true })
  async deleteSessions(sessionId: string) {
    const removedSessions = await MemberAPI.DELETE_SESSIONS({sessionId});
    this.removeItemById(removedSessions.id)
  }
}
