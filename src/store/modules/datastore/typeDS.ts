import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
export enum NUGGET_TYPE {
    BUG = 'bug',
    FEATURE = 'feature',
    TASK = 'task',
    IDEA = 'idea',
}

@Module({ name: 'typeds', namespaced: true })
export class TypeDS extends VuexModule {
    types = [
        { label: "Bug", value: NUGGET_TYPE.BUG },
        { label: "Feature", value: NUGGET_TYPE.FEATURE },
        { label: "Task", value: NUGGET_TYPE.TASK },
        { label: "Idea", value: NUGGET_TYPE.IDEA }
    ];

    @Mutation
    setTypes(types: any[]) {
        this.types = types;
    }
}
