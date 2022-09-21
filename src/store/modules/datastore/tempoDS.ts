import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({ name: 'tempods', namespaced: true })
export class TempoDS extends VuexModule {
  tempos = [
    { label: "On Time", value: "on-time" },
    { label: "At Risk", value: "at-risk" },
    { label: "Delayed", value: "delayed" },
    { label: "Frozen", value: "frozen" },
    { label: "At Rest", value: "at-rest" },
    { label: 'Released', value: 'released'}
  ];

  @Mutation
  setTempos(tempos: {label: string, value: string}[]) {
    this.tempos = tempos;
  }
}
