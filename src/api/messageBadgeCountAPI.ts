import {JaguarService} from '@/utils/request'

interface IBadgeCount {
    [index: number]: { path: string, op: string, value: any }
}

export default class MessageBadgeCountAPI {
    static PATCH(params: {data: IBadgeCount}) {
        // @ts-ignore
        return JaguarService({
            method: 'patch',
            data: params.data
        })
    }
}

