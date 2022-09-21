import { DolphinService } from '@/utils/request'
export default class BusinessRuleAPI {

    static LOAD() {
        return DolphinService({
            url: `metadata`,
            method: 'GET'
        })
    }

}
