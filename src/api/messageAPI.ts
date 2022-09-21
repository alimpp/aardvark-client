import MessageDM from '@/datamodels/messageDM'
import UserDM from '@/datamodels/userDM'
import { JAGUAR_WEBSOCKET_URL } from '@/settings';
import {SOCKET_CONNECTIONS} from '@/utils/constants';
import { JsonParser } from '@/utils/jsonparser'
import { JaguarService } from '@/utils/request'
import { WebsocketConnection } from '@/utils/websocket';

export default class MessageAPI {  
    
    static async SOCKET(token: string) {
        return new WebsocketConnection(SOCKET_CONNECTIONS.JAGUAR, JAGUAR_WEBSOCKET_URL, {token});
    }

    static async SEND(params: {roomId: number, body: string, temporaryId: string, attachment?: File, links?: {title: string, url: string}[]}) {
        let headers: {[key: string]: string} | undefined = undefined;
        const form = new FormData();
        form.append('body', params.body);
        form.append('temporaryId', params.temporaryId);

        if(params.links) form.append('links', JSON.stringify(params.links));

        if(params.attachment) {
            form.append('filename', params.attachment.name);
            form.append('attachment', params.attachment);
            headers = {'content-type': 'multipart/form-data'};
        }


        // @ts-ignore
        const { data } = await JaguarService({
            url: `rooms/${params.roomId}/messages`,
            method: 'SEND',
            data: form,
            headers
        })
        return JsonParser.deserializeObject<MessageDM>(data, MessageDM);
    }

    static async LIST({roomId, skip = 0, take = 15, sort = '-createdAt'}: {roomId: number, skip? , take? , sort?}) {
        // @ts-ignore
        const { data } = await JaguarService({ 
            url: `rooms/${roomId}/messageviews`,
            method: 'LIST',
            params: {sort, skip, take}
        })
        return JsonParser.deserializeArray<MessageDM>(data || [], MessageDM);
    }

    static async SEE(params: {messageId: number}) {
        // @ts-ignore
        const { data } = await JaguarService({
            url: `messages/${params.messageId}`,
            method: 'SEE'
        })
        return JsonParser.deserializeObject<MessageDM>(data, MessageDM);
    }

    static async REPLY(params: {messageId: number, body: string, temporaryId: string, attachment?: File, links?: {title: string, url: string}[]}) {
        let headers: {[key: string]: string} | undefined = undefined;
        const form = new FormData();
        form.append('body', params.body);
        form.append('temporaryId', params.temporaryId);
        if(params.links) form.append('links', JSON.stringify(params.links));

        if(params.attachment) {
            form.append('filename', params.attachment.name);
            form.append('attachment', params.attachment);
            headers = {'content-type': 'multipart/form-data'};
        }

        // @ts-ignore
        const { data } = await JaguarService({
            url: `messages/${params.messageId}`,
            method: 'REPLY',
            data: form,
            headers
        })
        return JsonParser.deserializeObject<MessageDM>(data, MessageDM);
    }

    static async EDIT(params: {messageId: number, body: string, attachment?: File, temporaryId?: string}) {
        let headers: {[key: string]: string} | undefined = undefined;
        const form = new FormData();
        form.append('body', params.body);
        if(params.temporaryId) form.append('temporaryId', params.temporaryId);

        if(params.attachment) {
            form.append('filename', params.attachment.name);
            form.append('attachment', params.attachment);
            headers = {'content-type': 'multipart/form-data'};
        }

        // @ts-ignore
        const { data } = await JaguarService({
            url: `messages/${params.messageId}`,
            method: 'EDIT',
            data: form,
            headers
        })
        return JsonParser.deserializeObject<MessageDM>(data, MessageDM);
    }

    static async DELETE(params: {messageId: number}) {
        // @ts-ignore
        const { data } = await JaguarService({
            url: `messages/${params.messageId}`,
            method: 'DELETE'
        })
        return JsonParser.deserializeObject<MessageDM>(data, MessageDM);
    }

    static async LIST_VIEWERS(params: {messageId: number}) {
        // @ts-ignore
        const { data } = await JaguarService({
            url: `messages/${params.messageId}/seen/members`,
            method: 'LIST'
        })
        return JsonParser.deserializeArray<UserDM>(data, UserDM);
    }

    static PATCH(params: {data: IBadgeCount}) {
        // @ts-ignore
        return JaguarService({
            method: 'patch',
            data: params.data
        }) 
    }
}
 
interface IBadgeCount {
    [index: number]: { path: string, op: string, value: any }
} 