import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({ name: 'priorityds', namespaced: true })
export class PriorityDS extends VuexModule {
    priorities = [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" }
    ];

    @Mutation
    setPriorities(priorities: any[]) {
        this.priorities = priorities;
    }
}
