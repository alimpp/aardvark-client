
import { Module, VuexModule } from 'vuex-module-decorators'

@Module({ name: 'periodsds', namespaced: true })
export class PeriodsDS extends VuexModule {
  periods = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" }
  ];
}
