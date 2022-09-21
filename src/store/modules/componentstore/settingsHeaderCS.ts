import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ name: 'settingsheadercs', namespaced: true, stateFactory: true })
export class SettingsHeaderCS extends VuexModule{

  // @ts-ignore
  constructor(module: Mod<ThisType<any>, any>) {
    super(module);
  }

  formIsDirty = false

  @Mutation
  setFormIsDirty(value: boolean) {
    this.formIsDirty = value;
  }

}
