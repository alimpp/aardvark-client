import MessageDM from '@/datamodels/messageDM'
import router from '@/router';
import { NOTIFICATION_TIMEOUT } from '@/settings';
import { ApplicationDSModule } from '@/store';
import { ModuleName } from '@/store/modules/datastore/applicationDS';
import { InboxNuggetCSModule, InboxProjectsCSModule, InboxReleasesCSModule, InboxSprintCSModule } from '@/store';
import {EVENTS, SUBSCRIBABLE_TYPE} from './constants';
import { EventBus } from './eventBus';

const formatChatMessage = (message: MessageDM) => {
    // TODO: We should use the format function in chat.

    return message.content.replaceAll('****', '').replaceAll('**', '');
}

const notifications: { [key: number]: Notification } = {};

export const createChatNotification = (message: MessageDM) => {
    if (Notification.permission === 'granted') {
        let prefix: string = message.subscribableType.charAt(0).toUpperCase() + message.subscribableType.slice(1);
        if (prefix === 'Sprint')   prefix = 'Sprint';
        if (prefix === 'Direct')  prefix = 'Personal';
        if (prefix === 'Channel')   prefix = 'Channel';

        const notification = new Notification(prefix + ' '+ `Message from ${message.username} ${message.roomName ? `in ${message.roomName}` : ``}` , {
            timestamp: Math.floor(Date.now()),
            icon: message.profileUrl ? message.profileUrl : require('../assets/icons/logo.png'),
            image: message.mimetype?.includes('image') && message.attachment ? message.attachment : undefined,
            body: formatChatMessage(message),
            tag: String(message?.id || 0)
        });

        notifications[message.id] = notification;

        notification.onclose = () => {
            if(notifications[message.id] === notification) {
                delete notifications[message.id];
            }
        }

        notification.onclick = async() => {
            window.focus();
            switch (message.subscribableType) {
                case SUBSCRIBABLE_TYPE.NUGGET:
                    if ((router.currentRoute.name !== 'inboxNugget' )){
                        await router.push({ name: 'inboxNugget' } );
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_NUGGET_ENTITY , {roomId:message.roomId});

                    }else {
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_NUGGET_ENTITY , {roomId:message.roomId});
                        InboxNuggetCSModule.doLoad(true);
                    }
                    break;
                case SUBSCRIBABLE_TYPE.DIRECT:
                    if (router.currentRoute.name !== 'People')
                        await router.push({ name: 'People' });
                    if(!(ApplicationDSModule.selectedModule === ModuleName.people && ApplicationDSModule.selectedPeopleChatRoomID === message.roomId)){
                        EventBus.$emit(EVENTS.PEOPLE_NOTIFICATION_CLICKED, {roomId:message.roomId})
                    }
                    break;
                case SUBSCRIBABLE_TYPE.CHANNEL:
                    if ( (router.currentRoute.params.roomId != message.roomId.toString()))
                    {
                        router.push({ name: 'GroupChat' });
                        router.push({ name: 'GroupChat', params: { roomId: `${message.roomId}` } });
                    }
                    break;
                case SUBSCRIBABLE_TYPE.PROJECT:
                    if ((router.currentRoute.name !== 'InboxProjects' )){
                        await router.push({ name: 'InboxProjects' } );
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_PROJECT_ENTITY , {roomId:message.roomId});

                    }else {
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_PROJECT_ENTITY , {roomId:message.roomId});
                        InboxProjectsCSModule.doLoad(true);
                    }
                    break;
                case SUBSCRIBABLE_TYPE.RELEASE:
                    if ((router.currentRoute.name !== 'InboxReleases' )){
                        await router.push({ name: 'InboxReleases' } );
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_RELEASE_ENTITY , {roomId:message.roomId});

                    }else {
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_RELEASE_ENTITY , {roomId:message.roomId});
                        InboxReleasesCSModule.doLoad(true);
                    }
                    break;
                case SUBSCRIBABLE_TYPE.SPRINT:
                    if ((router.currentRoute.name !== 'InboxSprints' )){
                        await router.push({ name: 'InboxSprints' } );
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_SPRINT_ENTITY , {roomId:message.roomId});

                    }else {
                        EventBus.$emit(EVENTS.CLICK_NOTIFICATION_SPRINT_ENTITY , {roomId:message.roomId});
                        InboxSprintCSModule.doLoad(true);
                    }
                    break;
                default:
                    break;
            }
        };
    }
}

export const updateChatNotification = (message: MessageDM) => {
    if(notifications[message.id]){
        createChatNotification(message);
    }
}

export const dismissChatNotification = (message: MessageDM) => {
    if(notifications[message.id]){
        notifications[message.id].close();
    }
}