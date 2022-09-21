import { TimeCardDetailReportCSModule, DialogCSModule } from '@/store'
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'

@Module({ name: 'completenuggetpopupcs', namespaced: true })
export class CompleteNuggetPopupCS extends VuexModule {
  showingPopup = false
  estimate = {}
  timeCard = {}

  @Mutation
    setEstimate(value) {
      this.estimate = value
    }

  @Mutation
    setShowingPopup(value) {
      this.showingPopup = value
    }

  @Action
  async complete() {
    TimeCardDetailReportCSModule.updateJournalReport({assignment: this.estimate, timeCard: this.timeCard  })
  }

  @Action
  clear() {
    this.setShowingPopup(false)
    DialogCSModule.clear(); 
  }

}
