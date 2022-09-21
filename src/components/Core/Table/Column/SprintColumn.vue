<script lang="ts">
import {SprintDropdownCSModule, CreateSprintCSModule, UpdateSprintCSModule, DialogCSModule} from "@/store";
import Component from "vue-class-component";
import BaseDropdownColumn from "../Base/BaseDropdownColumn.vue";
import CreateSprintForm from "@/components/Form/CreateSprintForm.vue";
import UpdateSprintForm from "@/components/Form/UpdateSprintForm.vue";
import {CORE_SELECT_MENU_OPTIONS, EVENTS} from "@/utils/constants"
import SprintDM from "@/datamodels/sprintDM";
import dayjs from "dayjs";
import cloneDeep from 'lodash.clonedeep';
import { Watch } from "vue-property-decorator";
import {EventBus} from "@/utils/eventBus";
import {isBefore, today, isSame} from "@/utils/date";

@Component({name: "SprintColumn"})
export default class SprintColumn extends BaseDropdownColumn {
    config = {labelKey: 'label', valueKey: 'id', labelText: 'labelText'}
    placeholder = 'None';
    noLabel = true;
    disabled = false;
    multiple = false;
    hasActionButton = true;
    excludedClasses = ['maz-dialog__container'];
    hasMoreButton = true;
    sprint!: SprintDM;
    sprints: SprintDM[] = [];

    @Watch('lastUpdatedSprints')
    onLastUpdatedSprintsChange(value: {[key: string]: SprintDM[]}) {
        if(this.projectId in value) {
            const cachedSprint = this.cachedFilteredSprints.find(sprint => sprint.id === this.columnValue);
             if(cachedSprint) {
                this.sprints = this.sprints.map(sprint => sprint.id === cachedSprint.id ? cachedSprint : sprint)
            }
        }
    }

    @Watch('columnValue')
    onColumnValueChange(id = 0) {
        if (id) {
            this.updateSprintList();
        }
    }

    get size(): string {
        return 'sm'
    }

    get isDisabled() {
        return 'moveToArchive' in this.rowData && this.rowData['moveToArchive'];
    }

    get selectedValue(): number {
        if('moveToArchive' in this.rowData && this.rowData['moveToArchive']) return 0
        return this.columnValue || 0;
    }

    set selectedValue(value: number) {
        this.rowData[this.columnSchema.path] = value ?? 0;
    }

    get projectId(): number {
        return (this.rowData as any).projectId
    }

    get currentSprint(): SprintDM {
        return this.rowData['sprint'];
    }

    get options() {
        const options = [ {label: [{labelText: 'None'}], id: 0} ];
        if(!this.sprints.length) return options
        const details = this.sprints.map(item => {
            return {...item, label: [{labelText: item.name}, {labelText: item.returnToTriageJobDate? dayjs(item.returnToTriageJobDate).format("L"): '',
            // If the returnToTriageJobDate is before today, the color property add to the object
            ...((item.returnToTriageJobDate && (isBefore(item.returnToTriageJobDate, today) || isSame(item.returnToTriageJobDate, today)) ) && {color: '#D82929'})}]
            };
        })
        return [ ...options, ...details ];
    }

    get headerLabels() {
        return [ 'Sprint Name', 'Triage Date', ' ' ]
    }

    get isSprintUndefined() {
        if(!SprintDropdownCSModule.sprints(this.projectId)) return true;
        else return typeof SprintDropdownCSModule.sprints(this.projectId).find(sprint => sprint.id === this.columnValue) === 'undefined';
    }

    get cachedFilteredSprints() {
        return (SprintDropdownCSModule.sprints(this.projectId) || [])?.filter(sprint => !sprint?.isReleased || sprint?.id === this.selectedValue);
    }

    get lastUpdatedSprints() {
        return SprintDropdownCSModule.lastUpdatedSprints;
    }

    updateSprintList() {
        this.sprints = this.currentSprint?.isReleased && !this.cachedFilteredSprints.some(sprint => sprint.id === this.currentSprint.id) ? [this.currentSprint, ...this.cachedFilteredSprints] : this.cachedFilteredSprints;
    }

    async onOpen() {
        if (!SprintDropdownCSModule.isProjectSprintsLoaded(this.projectId)) {
            this.loading = true;
            await SprintDropdownCSModule.loadSprints(this.projectId);
            this.loading = false;
        }
        this.updateSprintList();
    }

    async onClose() {
        EventBus.$off([EVENTS.CREATED_NEW_SPRINT, EVENTS.UPDATE_SPRINT]);
    }

    onInputChange(value: number) {
        this.selectedValue = value;
        this.onCellClick()
    }

    onAction() {
        CreateSprintCSModule.setProjectId(this.projectId);
        EventBus.$on(EVENTS.CREATED_NEW_SPRINT, this.onSprintCreated);
        DialogCSModule.load({
            title: 'Add Sprint',
            content: CreateSprintForm,
            isShowingDialog: true,
            noClose: true,
            confirmLabel: "Save"
        });
    }

    moreOptionAction(option: SprintDM) {
        this.sprint = option
    }

    async onMore(option: CORE_SELECT_MENU_OPTIONS) {
        switch(option) {
            case CORE_SELECT_MENU_OPTIONS.delete:
                await this.deleteSprint();
                break;
            case CORE_SELECT_MENU_OPTIONS.edit:
                await this.editSprint();
                break;
            default:
                break;
        }
    }

    async mounted() {
        await this.$nextTick();

        if(!this.columnValue) {
            return
        }

        if(SprintDropdownCSModule.isProjectSprintsLoaded(this.projectId)) {
            this.updateSprintList();
        } else {
            this.sprints = [this.currentSprint];
        }
    }

    private async deleteSprint() {
        this.loading = true;
        try {
            await SprintDropdownCSModule.delete(this.sprint!);
        }
        finally {
            this.loading = false;
            this.updateSprintList();
        }
    }

    private async editSprint() {
        UpdateSprintCSModule.setSprint(cloneDeep(this.sprint));
        EventBus.$on(EVENTS.UPDATE_SPRINT, this.onSprintUpdated);
        DialogCSModule.load({
            title: 'Update Sprint',
            content: UpdateSprintForm,
            isShowingDialog: true,
            noClose: true,
            confirmLabel: "Update"
        });
    }


    private onSprintUpdated(sprint: SprintDM) {
        this.sprints = this.sprints.map(item => item.id === sprint.id ? sprint : item);
        this.sprint = sprint;
    }

    private onSprintCreated(sprint: SprintDM) {
        this.sprints = [sprint, ...this.sprints];
        this.selectedValue = sprint.id;
        this.select.updateValue(sprint.id);
        this.select.$refs.popper.doClose();
    }

}
</script>

<style lang="scss" scoped>
::v-deep .maz-input.has-1-right-icon .maz-input__input {
    padding-right: 1.8rem;
}
</style>