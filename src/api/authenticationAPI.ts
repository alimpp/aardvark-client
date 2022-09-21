import { DolphinService } from '@/utils/request'

export default class AuthenticationAPI {
    static OBTAIN(params: {authorizationCode: string, accountId: number}) {
        // @ts-ignore
        return DolphinService({
            url: 'oauth2/tokens',
            method: 'OBTAIN',
            data: {authorizationCode: params.authorizationCode, organizationId: params.accountId}
        })
    }
}

