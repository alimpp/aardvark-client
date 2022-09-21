import {DolphinService, JaguarService} from "@/utils/request"
import {JsonParser} from "@/utils/jsonparser";
import VideoConferenceDM from "@/datamodels/videoConferenceDM";

export default class VideoConferenceApi {
    static async INITIATE(params: {token: string, memberIds: string, title: string }){
        const form = {};
        form['token'] = JSON.stringify(params.token);
        form['memberReferenceIds'] =params.memberIds; 
        form['title'] = params.title;

        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms`,
            method: 'INITIATE',
            data: form
        })
        return  data ;
    }
    
    static async REJECT(params: {id: number }){
        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms/${params.id}`,
            method: 'REJECT',
        })
        return data ;
    }

    static async BUSY(params: {id: number }){
        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms/${params.id}`,
            method: 'BUSY',
        })
        return data ;
    }

    static async HANGUP(params: {id: number }){
        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms/${params.id}`,
            method: 'HANGUP',
        })
        return data ;
    }

    static async ACCEPT(params: {id: number , token: string }){
        const form = {};
        form['token'] = JSON.stringify(params.token);

        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms/${params.id}`,
            method: 'ACCEPT',
            data: form

        })
        return data ;
    }

    static async REFRESH(params: {id: number , token: string }){
        const form = {};
        form['token'] = JSON.stringify(params.token);

        // @ts-ignore
        const { data } = await JaguarService({
            url: `conferencerooms/${params.id}`,
            method: 'REFRESH',
            data: form

        })
        return data ;
    }

}