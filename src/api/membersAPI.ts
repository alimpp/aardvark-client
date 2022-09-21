import { PandaService } from '@/utils/request'
import { JsonParser } from "@/utils/jsonparser";
import { DolphinService } from "@/utils/request"
import MemberDM from "@/datamodels/memberDM";
import SessionDM from '@/datamodels/sessionDM'
import { Toast } from '@/utils/toast';
import UserDM from "@/datamodels/userDM"

export default class MembersAPI {

    static async GET() {
        // @ts-ignore
        const { data } = await PandaService({
            url: `members/me`,
            method: 'GET',
            responseType: "json"
        })
        return JsonParser.deserializeObject<MemberDM>(data, MemberDM);
    }

    @Toast<MemberDM>(() => 'Member Successfully Updated')
    static async UPDATE(params: {member: UserDM, showToast?: boolean}) {
        const form = {}
        if(params.member.firstName) form['firstName'] = params.member.firstName;
        if(params.member.lastName) form['lastName'] = params.member.lastName;
        if(params.member.birth) form['birth'] = params.member.birth;
        if(params.member.phone) form['phone'] = `${params.member.phone}`;
        if(params.member.countryCode) form['countryCode'] = params.member.countryCode;
        // @ts-ignore
        const { data } = await PandaService({
            url: `members/${params.member.referenceId}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, MemberDM)
    }

    @Toast<MemberDM>(() => 'Profile Picture Successfully Updated')
    static async UPDATE_AVATAR(params: {id: number, image, showToast?: boolean}) {
        let headers: {[key: string]: string} | undefined = undefined;
        const form = new FormData();
        form.append('avatar', params.image);
        headers = {'content-type': 'multipart/form-data'}
        // @ts-ignore
        const { data } = await PandaService({
            url: `members/${params.id}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, MemberDM)
    }

    @Toast(() => 'Password Successfully Updated')
    static async CHANGE_PASSWORD(params: {currentPassword: string, newPassword: string}) {
        const form = {};
        form['currentPassword'] = params.currentPassword;
        form['newPassword'] = params.newPassword
        // @ts-ignore
        const { data } = await PandaService({
            url: `passwords`,
            method: 'CHANGE',
            data: form,
            responseType: "json"
        })
        return data
    }

    static async LIST_SESSIONS() {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `sessions`,
            method: 'LIST',
        })
        return JsonParser.deserializeArray(data, SessionDM);
    }

    static async INVALIDATE_TOKEN(params: {sessionId: string}) {
        // @ts-ignore
        const { data } = await DolphinService({
            url: `sessions/${params.sessionId}`,
            method: 'INVALIDATE',
        })
        return data
    }

    @Toast<SessionDM>(() => 'Successfully removed')
    static async DELETE_SESSIONS(params: { sessionId: string, showToast?: boolean }) {
     
        // @ts-ignore
        const { data } = await DolphinService({
            url: `sessions/${params.sessionId}`,
            method: 'INVALIDATE'
        })
        return JsonParser.deserializeObject(data, SessionDM)
    }
}
