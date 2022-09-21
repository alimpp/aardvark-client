import { Store } from 'vuex';
import { ApplicationDSModule, IRootState, ProfileDSModule } from '@/store/index';
import { createChatNotification, dismissChatNotification, updateChatNotification } from '@/utils/notification';
import {MESSAGE_SIGNATURE} from '@/utils/constants';

function createPushNotificationService() {
    return (store: Store<IRootState>) => {
        if (Notification.permission === 'default') Notification.requestPermission();
        
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.newMessage;
            },
            async function onChange(message) {
                if(message.id !== 0 && message.senderId !== ProfileDSModule.id && message.roomId !== ApplicationDSModule.currentRoomID) {
                    if(!message.processedBy.includes(MESSAGE_SIGNATURE.PUSH_SIGNATURE)) {
                        createChatNotification(message);
                        message.processedBy.push(MESSAGE_SIGNATURE.PUSH_SIGNATURE);
                    }
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.seenMessage
            },
            async function onChange(message) {
                if(message.id !== 0 && message.seenByMemberReferenceId === ProfileDSModule?.id){
                    dismissChatNotification(message);
                }
            }
        );
        
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.deleteMessage
            },
            async function onChange(message) {
                if(message.id !== 0){
                    dismissChatNotification(message);
                }
            }
        );
        
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.editMessage
            },
            async function onChange(message) {
                if(message.id !== 0 && message.senderId !== ProfileDSModule.id && message.roomId !== ApplicationDSModule.currentRoomID) {
                    updateChatNotification(message);
                }
            }
        );
    }
}

export const pushNotificationService = createPushNotificationService();