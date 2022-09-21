import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({ name: 'statusds', namespaced: true })
export class StatusDS extends VuexModule {
  statuses = [
    { label: "Active", value: "active" },
    { label: "On Hold", value: "on-hold" }
  ];

  @Mutation
  setTypes(types: any[]) {
    this.statuses = types;
  }
}
