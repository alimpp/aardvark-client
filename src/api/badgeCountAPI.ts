import {DolphinService} from '@/utils/request'

interface IBadgeCount {
    [index: number]: { path: string, op: string, value: any }
}

export default class BadgeCountAPI {
    static PATCH(params: {data: IBadgeCount}) {
         
        // @ts-ignore
        return DolphinService({
            method: 'patch',
            data: params.data
        }) 
    }
}

