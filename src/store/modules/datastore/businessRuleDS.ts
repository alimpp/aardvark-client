import BusinessRuleAPI from '@/api/businessRuleAPI';
import { isEmpty } from '@/utils/object';
import { extend } from 'vee-validate';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import store, {BusinessRuleDSModule} from '@/store';
import { ValidationRuleSchema } from 'vee-validate/dist/types/types';

interface BusinessRuleData {
    pattern: string | null
    patternDescription: string | null
    maxLength: number | null
    minLength: number | null
    minimum: number | null
    maximum: number | null
    readonly: boolean
    protected: boolean
    notNone: boolean
    required: boolean
    default: string | null
    name: string
    key: string
    primaryKey: boolean
    label: string | null
    watermark: string | null
    example: string | number | null
    message: string | null
    type: string | null
}

export class BusinessRule {
    __class = 'BusinessRule';
    name: string;
    data: BusinessRuleData;

    constructor(name: string, data: BusinessRuleData) {
        this.name = name;
        this.data = data;
    }

    public load() {
        extend(this.name, this.schema);
    }

    private get schema(): ValidationRuleSchema & {data: BusinessRuleData} {
        const newSchema: ValidationRuleSchema & {data: BusinessRuleData} = {
            validate: this.validate,
            data: this.data,
            computesRequired: this.data.required,
            lazy: true
        }
        return newSchema
    }

    private validate(value: any): boolean | string {
        const { required, minimum, maximum, minLength, maxLength, pattern, patternDescription = '' } = this.data;

        switch (true) {
            case required && value === typeof undefined || value === null || (Array.isArray(value) && value.isEmpty()) || value === false || !String(value).trim().length:
                return 'This field is required';
            case minimum !== null && !isEmpty(value) && Number(value) < Number(minimum):
                return `This field must be greater than ${minimum}.`;
            case maximum !== null && !isEmpty(value) && Number(value) > Number(maximum):
                return `This field must be less than ${maximum}.`;
            case minLength !== null && !isEmpty(value) && String(value).length < Number(minLength):
                return `This field must be at least ${minLength} characters long.`;
            case maxLength !== null && !isEmpty(value) && String(value).length > Number(maxLength):
                return `This field must be at most ${maxLength} characters long.`;
            case pattern !== null && !new RegExp(pattern).test(String(value)):
                return `${patternDescription}`;
            default:
                return true;
        }
    }

}

@Module({ name: 'businessruleds', namespaced: true })
export class BusinessRuleDS extends VuexModule {
    rules: BusinessRule[] = [];

    @Mutation
    addRule(rule: BusinessRule) {
        this.rules = [...this.rules, rule]
    }

    @Action({ rawError: true })
    createRules() {
        this.rules.forEach(rule => rule.load());
    }

    @Action({ rawError: true })
    async doLoad(force = false) {
        if (isEmpty(this.rules) || force) {
            const { data } = await BusinessRuleAPI.LOAD();
            for (const entity in data) {
                for (const field in data[entity].fields) {
                    this.addRule(new BusinessRule(`${entity}-${field}`, data[entity].fields[field]));
                }
            }
        }
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.businessruleds.rules
            },
            function onChange() {
                BusinessRuleDSModule.createRules();
            }
        );
    }
}

export interface IBusinessRuleDS {
    rules: BusinessRule[]
}
