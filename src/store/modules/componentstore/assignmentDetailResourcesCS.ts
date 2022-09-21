import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store, {
    ApplicationDSModule,
    NuggetAssignmentDSModule,
    ProfileDSModule,
    PhaseResourceDSModule,
    UserDSModule,
    AssignmentDSModule,
    AssignmentDetailResourcesCSModule,
    AssignmentDetailTimeCardsCSModule,
    AssignmentDetailCSModule,
    NuggetPhasesDSModule,
    NuggetDSModule
} from '@/store';
import AssignmentDetailResourcesRow from '@/datamodels/rows/assignmentDetailResourcesRow';
import {JsonParser} from "@/utils/jsonparser";
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {EntityType} from "@/store/modules/datastore/applicationDS";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import {ITableColumnSchema} from '../interfaces/ITableColumnSchema';
import { Roles } from "@/store/modules/datastore/permissionDS";
import { isEmpty } from '@/utils/object';
import AssignmentDM from '@/datamodels/assignmentDM';
import PhaseDM from '@/datamodels/phaseDM';

@Module({ name: 'assignmentdetailresourcescs', namespaced: true, stateFactory: true})
export class AssignmentDetailResourcesCS extends TableCS<AssignmentDetailResourcesRow> implements ILifeCycle{
    private _tableSchema: ITableColumnSchema[] = [
        { id: 'assignResource', type: 'assignResource', headerType: 'editMode', title: '', path: 'isNotAssigned', minWidth: '46px'},
        { id: 'resource', type: 'profile', headerType: 'text', title: 'Resource', path: 'id', maxWidth:'130px', minWidth:'95px', width:'99%' },
        { id: 'status', type: 'text', headerType: 'text', title: 'Status', path: 'status' },
        { id: 'start', type: 'assignmentDate', headerType: 'text', title: 'Start', path: 'startDate' },
        { id: 'target', type: 'assignmentDate', headerType: 'text', title: 'Target', path: 'endDate' },
        { id: 'cadence', type: 'cadence', headerType: 'text', title: 'Cadence', path: 'cadence', minWidth:'120px' },
    ]
    isEditMode = false;
    selectedPhaseId = 0;
    selectedNuggetId = 0;
    selectedAssignmentId = 0
    selectedResourceFullName = ''


    constructor(module: VuexModule<ThisType<AssignmentDetailResourcesRow>, AssignmentDetailResourcesRow>) {
        super(module);
    }

    get tableSchema() {
        const {isLeadResource, isProjectMaestro} = ProfileDSModule;
        const managerId = NuggetDSModule?.currentNugget?.project?.managerId
        const secondaryManagerId = NuggetDSModule?.currentNugget?.project?.secondaryManagerId
        const isProjectManager = isProjectMaestro && (ProfileDSModule.identifier === managerId || ProfileDSModule.identifier === secondaryManagerId)

        if (isProjectManager || isLeadResource) {
            return this._tableSchema;
        }
        return this._tableSchema.filter(schema => schema.headerType !== 'editMode');
    }

    get requestOptions() {
        return
    }

    @Mutation
    setTableSchema(value) {
      this._tableSchema = value;
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
        if(value !== this.selectedAssignmentId) {
            this.selectedAssignmentId = value;
        }
    }

    @Mutation
    setSelectedResourceFullName(value: string) {
        if(value !== this.selectedResourceFullName) {
            this.selectedResourceFullName = value;
        }
    }

    get users(): any[] {
        return UserDSModule.itemsAsArray || []
    }

    get assignedResources() {
        const nuggetAssignments = NuggetAssignmentDSModule.items[this.selectedNuggetId];
        if (this.selectedPhaseId && nuggetAssignments) {
            const assigned = this.users.filter(resource => {
                const assignments = nuggetAssignments.filter(assignment => this.selectedPhaseId === assignment.phaseId)
                const currentAssignment = assignments.find(assignment => assignment.memberId === resource.id)
                if (currentAssignment) {
                    resource.delayedBy = currentAssignment.delayedBy
                    resource.cadenceProgress = currentAssignment.cadenceProgress
                    resource.cadenceTempo = currentAssignment.cadenceTempo
                    resource.remainingHours = currentAssignment.remainingHours
                    resource.estimatedHours = currentAssignment.estimatedHours
                    resource.lastDelayedBy = currentAssignment.lastDelayedBy
                    resource.status = currentAssignment.status
                    resource.startDate = currentAssignment.startDate
                    resource.endDate = currentAssignment.endDate
                    return resource
                }
            })
            const sortedResources = assigned.length ? assigned.sort((first, second) => {
                const lowerCaseFirst = first['firstName'].toLowerCase(), lowerCaseSecond = second['firstName'].toLowerCase();
                if (lowerCaseFirst < lowerCaseSecond) return -1;
                if (lowerCaseFirst > lowerCaseSecond) return 1;
                return 0;
            }) : []
            return sortedResources
        } else {
            return []
        }
    }

    get unassignedResources() {
        const nuggetAssignments = NuggetAssignmentDSModule.items[this.selectedNuggetId];
        const phaseResources = PhaseResourceDSModule.items[this.selectedPhaseId] || [];
        if (this.selectedPhaseId && nuggetAssignments) {
            const unassigned = phaseResources?.filter(resource => {
                return nuggetAssignments?.filter(assignment => this.selectedPhaseId === assignment.phaseId)
                .every(assignment => assignment.memberId !== resource.id)
            })
            return unassigned.filter(resource => resource.organizationRoles.includes(Roles.RESOURCE) || resource.organizationRoles.includes(Roles.LEAD_RESOURCE));
        } else {
            return []
        }
    }

    get currentResourcesList() {
        const assignedResources = this.assignedResources
        const unassignedResources = this.unassignedResources

        if (this.isEditMode) {
            return assignedResources.concat(unassignedResources)
        } else {
            return assignedResources
        }
    }

    get phaseAssignments(): AssignmentDM[] {
        const nuggetAssignments = NuggetAssignmentDSModule.items[this.selectedNuggetId];
        if (nuggetAssignments) {
            const assignments = nuggetAssignments?.filter(assignment => assignment.phaseId === this.selectedPhaseId)
            return assignments
        } else {
            return []
        }
    }

    get getHeaderColumnValue() {return (columnSchema: object) => {
        if (columnSchema['id'] === "assignResource") {
            return this.isEditMode
        } else {
            return columnSchema['title']
        }
    }}

    get refreshOptions() {
        return
    }

    @Action({rawError: true})
    onInitialization() {
        store.watch(
            function stateToWatch(state) {
                return state.phaseresourcesds.itemWatch;
            },
            async function onChange(phaseresources) {
                const phaseId = AssignmentDetailResourcesCSModule.selectedPhaseId;
                if(phaseId in phaseresources) {
                    const shouldSelectDefault = isEmpty(AssignmentDetailResourcesCSModule.selectedRow)
                    await AssignmentDetailResourcesCSModule.doLoad();
                    if(shouldSelectDefault){
                        await AssignmentDetailResourcesCSModule.setDefaultSelection()
                    }
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.nuggetassignmentds.itemWatch;
            },
            async function onChange(nuggetassignments) {
                const nuggetId = AssignmentDetailResourcesCSModule.selectedNuggetId
                if(nuggetId in nuggetassignments) {
                    const shouldSelectDefault = isEmpty(AssignmentDetailResourcesCSModule.selectedRow)
                    await AssignmentDetailResourcesCSModule.doLoad();
                    if(shouldSelectDefault){
                        await AssignmentDetailResourcesCSModule.setDefaultSelection()
                    }
                }
            }
        );
    }

    @Action({rawError: true})
    async phaseSelected(params: {phaseId: number, nuggetId: number, assignmentId: number}) {
        if(this.selectedNuggetId !== params.nuggetId || this.selectedPhaseId !== params.phaseId || this.selectedAssignmentId !== params.assignmentId){
            this.setSelectedNuggetId(params.nuggetId);
            this.setSelectedPhaseId(params.phaseId);
            this.setSelectedAssignmentId(params.assignmentId);

            const nuggetAssignments = NuggetAssignmentDSModule.getItems[this.selectedNuggetId];
            const assignments = nuggetAssignments?.filter(assignment => assignment.phaseId === this.selectedPhaseId) || []

            //if it is instance of PhaseDM instead of NuggetPhaseDM, it means it has currently no assignments and must be in edit mode.
            if (AssignmentDetailCSModule.selectedPhase instanceof PhaseDM) {
                await this.setEditMode(true)
            } else {
                await this.setEditMode(false)
            }

            await this.doLoad()
            await this.setDefaultSelection();
        }
    }



    @Action({rawError: true})
    async onRowCellClick(data: {id: string, row: AssignmentDetailResourcesRow}) {
        switch (data.id) {
            case 'assignResource':
                if(data.row.id) {
                    let response: AssignmentDM = new AssignmentDM ;
                    const selectedNuggetID: number = this.selectedNuggetId
                    const phaseAssignment = this.phaseAssignments.find(assignment => assignment.memberId === data.row.id);
                    if(phaseAssignment) {
                        //TODO the phaseId below should be pulled from the row somehow not the current phase state to avoid race conditions
                        response = await AssignmentDSModule.unassignResource({id: phaseAssignment.id, nuggetId: selectedNuggetID, phaseId: this.selectedPhaseId, memberId: data.row.id})
                    } else {
                        response = await AssignmentDSModule.assignResource({nuggetId: selectedNuggetID, phaseId: this.selectedPhaseId, memberId: data.row.id})
                    }
                    if(!ApplicationDSModule.dolphinSocket?.isOnline || response.id){
                        NuggetPhasesDSModule.listPhases({nuggetId:selectedNuggetID , force: true});
                        NuggetAssignmentDSModule.doLoad();
                    }
                }
                break;
            default:
                break;
        }
    }

    @Action({ rawError: true })
    async onHeaderCellClick(data: { id: string, value: Object }) {
        if (data.id === 'assignResource') {
            await this.toggleEditMode();
            await this.doLoad()
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

    @Action({rawError: true})
    async setSelectedAssignmentResource(){
        const resource = this.currentResourcesList.find(resource => resource.id === AssignmentDSModule.getItems[this.selectedAssignmentId]?.memberId);
        if(resource) {
            this.setSelectedRows([JsonParser.deserializeObject(resource, AssignmentDetailResourcesRow)])
            await this.onRowClick(JsonParser.deserializeObject(resource, AssignmentDetailResourcesRow))
        }else {
            this.setSelectedRows([this.tableData[0]])
            await this.onRowClick(this.tableData[0])
        }
    }

    @Action({rawError: true})
    async setSelectedNuggetResource() {
        let delayedResource = this.currentResourcesList.find(resource => resource.delayedBy);
        if(!delayedResource) {
            delayedResource = this.currentResourcesList.find(resource => resource.status === 'in-progress');
        }
        if(!delayedResource) {
            delayedResource = this.currentResourcesList.find(resource => resource.status === 'complete');
        }
        if(!delayedResource) {
            delayedResource = this.currentResourcesList.find(resource => resource.status === 'approved');
        }
        if(!delayedResource) {
            delayedResource = this.currentResourcesList.find(resource => resource.status === 'to-do');
        }
        if(this.selectedRow) {
            delayedResource = this.currentResourcesList.find(resource => resource.id === this.selectedRow.id);
        }
        if(delayedResource) {
            this.setSelectedRows([JsonParser.deserializeObject(delayedResource, AssignmentDetailResourcesRow)])
            await this.onRowClick(JsonParser.deserializeObject(delayedResource, AssignmentDetailResourcesRow))
        } else {
            this.setSelectedRows([this.tableData[0]])
            await this.onRowClick(this.tableData[0])
        }
    }

    @Action({ rawError: true })
    async setDefaultSelection() {
        if(ApplicationDSModule.selectedEntityType === EntityType.assignment) {
            await this.setSelectedAssignmentResource();
        } else if ((ApplicationDSModule.selectedEntityType === EntityType.nugget)) {
            await this.setSelectedNuggetResource();
        }
    }

    @Action({rawError: true})
    async doLoad() {
        await this.doSetRows(JsonParser.deserializeArray(this.currentResourcesList, AssignmentDetailResourcesRow))
    }

    @Action({rawError: true})
    async onRowClick(data: AssignmentDetailResourcesRow) {
        this.setSelectedRows([data]);
        //this timeout is to introduce a data update stutter to help javascript prioritize any click animations
        //instead of expensive store watch operations that are lower priority.
        window.setTimeout(() => this.updateSelectedEntity(data));
    }

    @Action({rawError: true})
    async onRowDoubleClick(data: any) {
        return
    }

    @Action({rawError: true})
    updateSelectedEntity(data: AssignmentDetailResourcesRow) {
        const phaseAssignment = this.phaseAssignments.find(assignment => assignment.memberId === data?.id);
        if(data?.id){
            this.setSelectedResourceFullName(data?.fullName || '')
            AssignmentDetailTimeCardsCSModule.resourceSelected({resourceAssignmentId: phaseAssignment?.id || 0, selectedNuggetId: this.selectedNuggetId})
        }
    }

    @Action({ rawError: true })
    async activate() {
        if(ApplicationDSModule.selectedNuggetID !== this.selectedNuggetId){
            this.clear();
        }
    }

}
