import { DolphinService } from '@/utils/request'

export default class OrganizationAPI {
    static LIST(params: {email: string}) {
        // @ts-ignore
        return DolphinService({
            url: 'organizations',
            method: 'list',
            data: {email: params.email}
        })
    }
}

