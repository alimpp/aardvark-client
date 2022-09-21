import { Store } from 'vuex';
import {ApplicationDSModule, DolphinSocketDSModule, IRootState} from '@/store/index';
import { WebsocketConnection } from '@/utils/websocket';
import { DOLPHIN_WEBSOCKET_URL } from '@/settings';
import {JsonParser} from '@/utils/jsonparser';
import CountsDM from '@/datamodels/countsDM';
import {SOCKET_CONNECTIONS} from '@/utils/constants';
import SocketUserDM from '@/datamodels/socketUserDM';
import SocketNuggetDM from '@/datamodels/socketNuggetDM';
import SocketAssignmentDM from '@/datamodels/socketAssignmentDM';
import SocketProjectDM from '@/datamodels/socketProjectDM';
import SocketNuggetPhaseDM from '@/datamodels/socketNuggetPhaseDM';
import SocketSprintDM from '@/datamodels/socketSprintDM';
import SocketReleaseDM from '@/datamodels/socketReleaseDM';
import SocketWorkflowDM from '@/datamodels/socketWorkflowDM';

function createDolphinSocketService() {
    return (store: Store<IRootState>) => {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.dolphinToken
            },
            async function onChange(token) {
                if(token) {
                    const socket =  new WebsocketConnection(SOCKET_CONNECTIONS.DOLPHIN, DOLPHIN_WEBSOCKET_URL, {token});
                    ApplicationDSModule.setDolphinSocket(socket);

                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'counts'], regex: /.*/}],
                        callback: item => DolphinSocketDSModule.receiveCounts(JsonParser.deserializeObject(item.content?.counts, CountsDM))
                    }));

                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^nugget$/}],
                        callback: item => DolphinSocketDSModule.receiveNugget(JsonParser.deserializeObject(item, SocketNuggetDM))
                    }));

                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^assignment$/}],
                        callback: item => DolphinSocketDSModule.receiveAssignment(JsonParser.deserializeObject(item, SocketAssignmentDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^project$/}],
                        callback: item => DolphinSocketDSModule.receiveProject(JsonParser.deserializeObject(item, SocketProjectDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^nugget_phase$/}],
                        callback: item => DolphinSocketDSModule.receiveNuggetPhase(JsonParser.deserializeObject(item, SocketNuggetPhaseDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^sprint$/}],
                        callback: item => DolphinSocketDSModule.receiveSprint(JsonParser.deserializeObject(item, SocketSprintDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^release$/}],
                        callback: item => DolphinSocketDSModule.receiveRelease(JsonParser.deserializeObject(item, SocketReleaseDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^workflow$/}],
                        callback: item => DolphinSocketDSModule.receiveWorkflow(JsonParser.deserializeObject(item, SocketWorkflowDM))
                    }));
                    
                    socket.registerMessageCallback(({
                        filters: [{key: ['content', 'entityType'], regex: /^member$/}],
                        callback: item => DolphinSocketDSModule.receiveUser(JsonParser.deserializeObject(item, SocketUserDM))
                    }));

                    socket.connect();
                }
            }
        );
    }
}

export const dolphinSocketService = createDolphinSocketService();