import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store, {
    ApplicationDSModule,
    AssignmentDSModule,
    NuggetDSModule,
    ProfileDSModule,
    ProjectPhaseDSModule,
    AssignmentDetailResourcesCSModule,
    NuggetPhasesDSModule,
    AssignmentDetailPhasesCSModule
} from '@/store';
import PhaseDM from '@/datamodels/phaseDM';
import AssignmentDetailPhasesRow from '@/datamodels/rows/assignmentDetailPhasesRow';
import {JsonParser} from "@/utils/jsonparser";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {EntityType} from "@/store/modules/datastore/applicationDS";
import {isEmpty} from "@/utils/object";
import NuggetPhaseDM from "@/datamodels/nuggetPhaseDM";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
@Module({ name: 'assignmentdetailphasescs', namespaced: true, stateFactory: true})
export class AssignmentDetailPhasesCS extends TableCS<AssignmentDetailPhasesRow> implements ILifeCycle{
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'assignPhase', type: 'assignPhase', headerType: 'editMode', title: '', path: 'isSkipped', minWidth: '46px' },
        { id: 'phase', type: 'assignmentPhase', headerType: 'text', title: 'Phase', path: 'phase', maxWidth:'130px', minWidth:'95px', width:'99%' },
        { id: 'status', type: 'text', headerType: 'text', title: 'Status', path: 'status' },
        { id: 'startDate', type: 'date', headerType: 'text', title: 'Start Date', path: 'startDate' },
        { id: 'endDate', type: 'date', headerType: 'text', title: 'Target Date', path: 'endDate' },
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth:'120px' }
    ]
    isEditMode = false;
    selectedPhaseId = 0;
    selectedNuggetId = 0;
    selectedAssignmentID = 0;
    selectedProjectId = 0;
    selectedPhase: PhaseDM | undefined = undefined

    constructor(module: VuexModule<ThisType<AssignmentDetailPhasesRow>, AssignmentDetailPhasesRow>) {
        super(module);
    }

    get tableSchema() {
        const managerId = NuggetDSModule?.currentNugget?.project?.managerId
        const secondaryManagerId = NuggetDSModule?.currentNugget?.project?.secondaryManagerId
        if (ProfileDSModule.isProjectMaestro && (ProfileDSModule.identifier === managerId || ProfileDSModule.identifier === secondaryManagerId)) {
            return this._tableSchema;
        }
        return this._tableSchema.filter(schema => schema.headerType !== 'editMode');
    }

    get requestOptions() {
        return
    }

    get refreshOptions() {
        return
    }

    @Mutation
    setTableSchema(value: ITableColumnSchema[]) {
      this._tableSchema = value;
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.projectphaseds.itemWatch;
            },
            async function onChange(projectPhases) {
                const currentProjectId = AssignmentDetailPhasesCSModule.selectedProjectId;
                if(currentProjectId in projectPhases) {
                    if(AssignmentDetailPhasesCSModule.selectedRow) {

                        //Because the backend hard deleted nugget phases when assignments are all removed, we need to reselect the existing row based on title
                        //This can be fixed in future by changing backend approach to hosting all nuggetphases as a full set, regardless if certain phases are not assigned yet.
                        //we need to do this operand on phase title because the selected row is sometimes a nuggetphasedm and sometimes a phasedm
                        const selectedPhaseTitle=  AssignmentDetailPhasesCSModule?.selectedRow?.title 
                        
                        await AssignmentDetailPhasesCSModule.doLoad();

                        const phaseList = AssignmentDetailPhasesCSModule.phaseList as NuggetPhaseDM[] | PhaseDM[]
                        const phaseIndex = phaseList.findIndex(phase => phase?.phaseTitle?.capitalize() === selectedPhaseTitle || phase?.title?.capitalize() === selectedPhaseTitle);
                        AssignmentDetailPhasesCSModule.setSelectedRows([JsonParser.deserializeObject(phaseList[phaseIndex], AssignmentDetailPhasesRow)])
                    } else {
                        await AssignmentDetailPhasesCSModule.doLoad();
                        await AssignmentDetailPhasesCSModule.setDefaultSelection()
    
                    }
                } 
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.nuggetphasesds.itemWatch
            },
            async function onChange(nuggetPhases) {
                const currentNuggetID = AssignmentDetailPhasesCSModule.selectedNuggetId
                if(currentNuggetID in nuggetPhases) {

                    //Because the backend hard deleted nugget phases when assignments are all removed, we need to reselect the existing row based on title
                    //This can be fixed in future by changing backend approach to hosting all nuggetphases as a full set, regardless if certain phases are not assigned yet.
                    //we need to do this operand on phase title because the selected row is sometimes a nuggetphasedm and sometimes a phasedm
                    if(AssignmentDetailPhasesCSModule.selectedRow) {
                        const selectedPhaseTitle=  AssignmentDetailPhasesCSModule?.selectedRow?.title

                        await AssignmentDetailPhasesCSModule.doLoad();

                        const phaseList = AssignmentDetailPhasesCSModule.phaseList as NuggetPhaseDM[] | PhaseDM[]
                        const phaseIndex = phaseList.findIndex(phase => phase?.phaseTitle?.capitalize() === selectedPhaseTitle || phase?.title?.capitalize() === selectedPhaseTitle);
                        if (phaseIndex !== -1){
                            AssignmentDetailPhasesCSModule.setSelectedRows([JsonParser.deserializeObject(phaseList[phaseIndex], AssignmentDetailPhasesRow)])
                        }
                    } else {
                        await AssignmentDetailPhasesCSModule.doLoad();
                        await AssignmentDetailPhasesCSModule.setDefaultSelection()
                    }
                    
                }
            }
        );
    }


    @Action({rawError: true})
    async onRowCellClick(data: {id: string, row: AssignmentDetailPhasesRow}) {
        switch (data.id) {
            case 'assignPhase':
                if(data.row.id) {
                    if(!data.row.isSkipped) {
                        await NuggetDSModule.skipNuggetPhase({nuggetId: data.row.nuggetId || this.selectedNuggetId, phaseId: data.row.phaseId || data.row.id})
                        } else {
                        await NuggetDSModule.unskipNuggetPhase(data.row.id);
                    }
                }
                break;
            default:
                break;
        }

    }

    get projectPhases(): PhaseDM[] {
        const nugget = NuggetDSModule.items[this.selectedNuggetId] || {}
        const projectId = nugget.projectId
        return  ProjectPhaseDSModule.items[projectId] || []
    }

    get phaseList(): (NuggetPhaseDM | PhaseDM)[] | undefined {
        //Nugget is still being loaded, lets return empty table for now
        if (!NuggetPhasesDSModule.items[this.selectedNuggetId]) {
            return undefined
        }

        const nuggetPhases: NuggetPhaseDM[] = NuggetPhasesDSModule.items[this.selectedNuggetId] || []
        const projectPhases: PhaseDM[] =  this.projectPhases;
        const currentPhases = []

        if (!nuggetPhases.length) {
            return projectPhases
        } else {
            const assignedPhasesId = nuggetPhases.map((nuggetPhase) => {return nuggetPhase.phaseId})
            const unassignedPhase = projectPhases.filter(projectPhase => {
                return !assignedPhasesId.includes(projectPhase.id)
            })
            if (!this.isEditMode) {
                const localNuggetPhases = nuggetPhases.filter(phase => phase.isSkipped === false)
                projectPhases.forEach(phase => {
                    if (unassignedPhase.includes(phase)) {
                        // @ts-ignore
                        currentPhases.push(unassignedPhase.find(unassignedPhase => phase.id === unassignedPhase.id))
                    } else if (localNuggetPhases.map(phase => phase.phaseId).includes(phase.id)) {
                        // @ts-ignore
                        currentPhases.push(localNuggetPhases.find(nuggetPhase => nuggetPhase.phaseId === phase.id))
                    }
                })
                nuggetPhases.forEach(phase => {
                    // @ts-ignore
                    if(!currentPhases.includes(phase) && phase.isSkipped === false) {
                        // @ts-ignore
                        currentPhases.unshift(phase)
                    }
                })
                return currentPhases
            } else {
                 projectPhases.forEach(projectPhase => {
                    if (assignedPhasesId.includes(projectPhase.id)) {
                        // @ts-ignore
                        currentPhases.push(nuggetPhases.find(nuggetPhase => projectPhase.id === nuggetPhase.phaseId))
                    } else {
                        // @ts-ignore
                        currentPhases.push(projectPhase)
                    }
                })
                return currentPhases
            }
        }
    }

    @Action({ rawError: true })
    async onHeaderCellClick(data: { id: string, value: Object }) {
        if (data.id === 'assignPhase') {
            this.toggleEditMode();
            this.doLoad();
        }
    }

    @Action({ rawError: true })
    async toggleEditMode() {
        this.setEditMode(!this.isEditMode)
    }


    @Mutation
    setEditMode(value: boolean) {
        if (value !== this.isEditMode) {
            this.isEditMode = value
        }
    }

    @Mutation
    setSelectedPhaseId(value: number) {
        if(value !== this.selectedPhaseId) {
            this.selectedPhaseId = value;
        }
    }
    
    @Mutation
    setSelectedNuggetId(value: number) {
        if(value !== this.selectedNuggetId) {
            this.selectedNuggetId = value;
        }
    }

    @Mutation
    setSelectedAssignmentId(value: number) {
        if(value !== this.selectedAssignmentID) {
            this.selectedAssignmentID = value;
        }
    }

    @Mutation
    setSelectedProjectId(value: number) {
        if(value !== this.selectedProjectId) {
            this.selectedProjectId = value;
        }
    }

    get getHeaderColumnValue() {return (columnSchema: object) => {
        if (columnSchema['id'] === "assignPhase") {
            return this.isEditMode
        } else {
            return columnSchema['title']
        }
    }}

    @Action({rawError: true})
    async setSelectedNuggetPhase() {
        const nuggetPhases: NuggetPhaseDM[] = NuggetPhasesDSModule.items[this.selectedNuggetId] || []
        
        const nugget = NuggetDSModule.items[this.selectedNuggetId]
        const projectId = nugget?.projectId

        const projectPhases: PhaseDM[] =  ProjectPhaseDSModule.items[projectId] || []
        const currentPhaseList = this.phaseList || [];
        if(currentPhaseList) {
            if( this.selectedPhaseId > 0) {
                let phase: NuggetPhaseDM | PhaseDM | null = null;
                const nuggetPhase = nuggetPhases.find(phase => phase.phaseId === this.selectedPhaseId);
                if(nuggetPhase) {
                    phase = nuggetPhase;
                } else {
                    const projectPhase = projectPhases.find(phase => phase.id === this.selectedPhaseId );
                    if(projectPhase) phase = projectPhase;
                }
                this.setSelectedRows([JsonParser.deserializeObject(phase, AssignmentDetailPhasesRow)])
                await this.onRowClick(JsonParser.deserializeObject(phase, AssignmentDetailPhasesRow))
            } else {
                let delayedPhaseIndex = (currentPhaseList as NuggetPhaseDM[]).findIndex(phase => phase.isDelayed);
                if (delayedPhaseIndex === -1) {
                    delayedPhaseIndex = (currentPhaseList as NuggetPhaseDM[]).findIndex(phase => (phase.status === 'in-progress' && !phase.phaseTitle.isSameCaseInsensitive('Triage')));
                }
                if (delayedPhaseIndex === -1) {
                    delayedPhaseIndex = (currentPhaseList as NuggetPhaseDM[]).findIndex(phase => (phase.status === 'to-do' && !phase.phaseTitle.isSameCaseInsensitive('Triage')));
                }
                if (delayedPhaseIndex === -1) {
                    delayedPhaseIndex = (currentPhaseList as NuggetPhaseDM[]).findIndex(phase => (phase.status === 'complete'));
                }
                if (delayedPhaseIndex === -1) {
                    delayedPhaseIndex = (currentPhaseList as NuggetPhaseDM[]).findIndex(phase => (phase.status === 'approved'));
                }
                if (delayedPhaseIndex === -1) {
                    delayedPhaseIndex = 1
                }
                if(currentPhaseList.length > 0 && projectPhases.length > 0){
                    this.setSelectedRows([JsonParser.deserializeObject(currentPhaseList[delayedPhaseIndex], AssignmentDetailPhasesRow)])
                    await this.onRowClick(JsonParser.deserializeObject(currentPhaseList[delayedPhaseIndex], AssignmentDetailPhasesRow))
                }
            }
        }
    }

    @Action({rawError: true})
    async setSelectedAssignmentPhase() {
        const currentPhaseList = this.phaseList
        if(currentPhaseList) {
            const getIndex = item => item && (item['phaseId'] === AssignmentDSModule.currentAssignment.phaseId || item['id'] === AssignmentDSModule.currentAssignment.phaseId);
            const index = currentPhaseList.findIndex(getIndex);
            if (index !== -1) {
                this.setSelectedRows([JsonParser.deserializeObject(currentPhaseList[index], AssignmentDetailPhasesRow)])
             await this.onRowClick(JsonParser.deserializeObject(currentPhaseList[index], AssignmentDetailPhasesRow))
            }
        }
    }

    @Action({ rawError: true })
    async setDefaultSelection() {
        if(ApplicationDSModule.selectedEntityType === EntityType.nugget) {
            await this.setSelectedNuggetPhase();
        } else if (ApplicationDSModule.selectedEntityType === EntityType.assignment) {
            await this.setSelectedAssignmentPhase();
        }
    }


    @Action({rawError: true})
    async doLoad(force = true) {
        if (isEmpty(this.tableData) || force) {
            if (this.selectedProjectId) {
                const phaseList = this.phaseList
                if(phaseList) {
                    await this.doSetRows(JsonParser.deserializeArray(phaseList, AssignmentDetailPhasesRow))
                }
            }
        }
    }

    @Action({rawError: true})
    updateSelectedEntity(data: AssignmentDetailPhasesRow) {
        const phaseId = data.phaseId || data.id || 0
        this.setSelectedPhaseId(phaseId);
        if(data.id){
            AssignmentDetailResourcesCSModule.phaseSelected({phaseId: phaseId, nuggetId: data.nuggetId || this.selectedNuggetId, assignmentId: this.selectedAssignmentID})
        }
    }

    @Action({ rawError: true })
    async activate() {
        const nuggetID = ApplicationDSModule.selectedNuggetID
        const assignmentID = ApplicationDSModule.selectedAssignmentID
        const projectID = ApplicationDSModule.selectedProjectID
        if(this.selectedNuggetId !== nuggetID|| this.selectedAssignmentID !== assignmentID){
            await this.setSelectedPhaseId(0);
            await this.setSelectedNuggetId(nuggetID);
            await this.setSelectedAssignmentId(assignmentID);
            await this.setSelectedProjectId(projectID);
            if(isEmpty(NuggetPhasesDSModule.items[nuggetID]) ||  isEmpty(ProjectPhaseDSModule.currentProjectPhases)){
                await this.clear()
            }
            await this.setEditMode(false);
            await this.doLoad();
            await this.setDefaultSelection();
        } 
    }

    @Action({rawError: true})
    async onRowClick(data: AssignmentDetailPhasesRow) {
        this.setSelectedRows([data]);
        //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
        //instead of expensive store watch operations that are lower priority.
        window.setTimeout(() => this.updateSelectedEntity(data));
    }

    @Action({rawError: true})
    async onRowDoubleClick(data) {
        return
    }

}
