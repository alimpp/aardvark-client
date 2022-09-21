import  PhaseDM  from '@/datamodels/phaseDM';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import store, {AssignmentDSModule, AssignmentDetailPhasesCSModule, AssignmentDetailResourcesCSModule, AssignmentDetailCSModule, AssignmentDetailTimeCardsCSModule} from '@/store';
import NuggetPhaseDM from "@/datamodels/nuggetPhaseDM"
import UserDM from "@/datamodels/userDM"

@Module({ name: 'assignmentdetailcs', namespaced: true , stateFactory: true})
export class AssignmentDetailCS extends VuexModule implements ILifeCycle {
    selectedAssignmentId = 0;
    selectedResourceId = 0;


    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
    }

    public get selectedPhase(): NuggetPhaseDM | PhaseDM {
        // @ts-ignore
        const phase = AssignmentDetailPhasesCSModule.phaseList?.find(phase => (phase.phaseId && phase.phaseId === AssignmentDetailPhasesCSModule.selectedPhaseId) || phase.id === AssignmentDetailPhasesCSModule.selectedPhaseId)
        return phase || {} as NuggetPhaseDM
    }
    public get selectedResource(): UserDM {
        // @ts-ignore
        const resource = AssignmentDetailResourcesCSModule.currentResourcesList?.find(resource => (resource.id && resource.id === AssignmentDetailTimeCardsCSModule.resourceAssignmentId) || resource.id === AssignmentDetailTimeCardsCSModule.resourceAssignmentId )
         return resource || {} as UserDM;
    }
    @Mutation
    setSelectedAssignmentId(value = 0) {
        if(value !== this.selectedAssignmentId) {
            this.selectedAssignmentId = value;
        }
    }



    @Mutation
    setSelectedResourceId(value = 0) {
        if(value !== this.selectedResourceId) {
            this.selectedResourceId = value;
        }
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.applicationds.selectedAssignmentID
            },
            function onChange(assignmentID) {
                if (AssignmentDSModule.currentAssignment) {
                    AssignmentDetailCSModule.setSelectedResourceId(AssignmentDSModule.getItems[assignmentID]?.memberId ?? 0);
                    AssignmentDetailCSModule.setSelectedAssignmentId(assignmentID);
                }
            }
        )
    }

    @Action({ rawError: true })
    async activate() {
        // await AssignmentDetailCSModule.setSelectedTimecardId(0)
    }

}
