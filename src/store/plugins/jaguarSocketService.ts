import { Store } from 'vuex';
import {ApplicationDSModule, IRootState, JaguarSocketDSModule} from '@/store/index';
import MessageAPI from '@/api/messageAPI';
import {JsonParser} from '@/utils/jsonparser';
import MessageDM from '@/datamodels/messageDM';
import VideoConferenceDM from '@/datamodels/videoConferenceDM';

const process = (data: object) => JsonParser.deserializeObject(data, MessageDM);

function createJaguarSocketService() {
    return (store: Store<IRootState>) => {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.dolphinToken
            },
            async function onChange(token) {
                if(token) {
                    const socket = await MessageAPI.SOCKET(token);
                    ApplicationDSModule.setJaguarSocket(socket);
                    // New Message Callback
                    socket.registerMessageCallback<MessageDM>({
                        filters: [{key: 'type', regex: /message/}, {key: 'removedAt', regex: /null/}, {key: 'modifiedAt', regex: /null/}],
                        callback: message => JaguarSocketDSModule.receiveMessage(process(message))
                    });

                    // New Message(Mention Only) Callback
                    socket.registerMessageCallback<MessageDM>({
                        filters: [{key: 'type', regex: /mention/}, {key: 'removedAt', regex: /null/}],
                        callback: message => JaguarSocketDSModule.receiveMessage(process(message))
                    });

                    // Seen Message Callback
                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /seen/}],
                        callback: message => JaguarSocketDSModule.receiveSeen(process(message))
                    });

                    // Delete Message Callback
                    socket.registerMessageCallback<MessageDM>({
                        filters: [{key: 'type', regex: /message/}, {key: 'removedAt', regex: /^((?!null).)*$/}],
                        callback: message => JaguarSocketDSModule.receiveDelete(process(message))
                    });

                    // Edit Message Callback
                    socket.registerMessageCallback<MessageDM>({
                        filters: [{key: 'type', regex: /message/}, {key: 'removedAt', regex: /null/}, {key: 'modifiedAt', regex: /^((?!null).)*$/}],
                        callback: message => JaguarSocketDSModule.receiveEdit(process(message))
                    });

                    // Event Message Callback
                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /message/}, {key: 'mimetype', regex: /^application\/x-auditlog$/}],
                        callback: message => JaguarSocketDSModule.receiveEvent(process(message))
                    });

                    
                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^initiate$/}],
                        callback: data => JaguarSocketDSModule.receiveVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    }); 

                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^accept$/}],
                        callback: data => JaguarSocketDSModule.receiveAcceptVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    });

                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^refresh$/}],
                        callback: data => JaguarSocketDSModule.receiveRefreshVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    });

                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^rejected$/}],
                        callback: data => JaguarSocketDSModule.receiveRejectVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    });
                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^busy$/}],
                        callback: data => JaguarSocketDSModule.receiveBusyVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    });
                    socket.registerMessageCallback({
                        filters: [{key: 'type', regex: /web-rtc/}, {key: 'status', regex: /^hangup$/}],
                        callback: data => JaguarSocketDSModule.receiveHangupVideoConference(JsonParser.deserializeObject(data, VideoConferenceDM) )
                    });

                    socket.connect();
                }
            }
        );
    }
}

export const jaguarSocketService = createJaguarSocketService();