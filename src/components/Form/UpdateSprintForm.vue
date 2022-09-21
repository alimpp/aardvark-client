<template>
    <ValidationObserver slim ref="observer">
        <form slot="default" class="mb-3 form" @submit.prevent="onConfirm">
            <ValidationProvider rules="sprints-name" v-slot="{failed, errors, required}">
                <CoreInput
                    :required="required"
                    :error="failed"
                    v-model="name"
                    autocomplete="update-sprint-name"
                    clearable
                />
                <div v-if="failed" class="text-danger text-left mt-2">{{errors[0]}}</div>
            </ValidationProvider>
            <div class="backlog">
                <CoreCheckBox class="check-box" v-model="isBacklog">Backlog</CoreCheckBox>
                <CorePicker
                    ref="picker"
                    v-model="returnToTriageDate"
                    placeholder="Return To Triage"
                    formatted="L"
                    noHeader
                    noFooter
                    noTime
                    autoClose
                    :disabled="isDisabled"
                    :minDate="tomorrow"
                />
            </div>
        </form>
    </ValidationObserver>
</template>

<script lang="ts">
import Component from "vue-class-component";
import CoreInput from "@/components/Core/CoreInput.vue";
import {dateISOFormat, tomorrow} from "@/utils/date";
import moment from "moment";
import DialogForm from "./Base/DialogForm.vue";
import {UpdateSprintCSModule, DialogCSModule, SprintDSModule} from "@/store";
import {ValidationProvider, ValidationObserver} from "vee-validate";
import CoreCheckBox from "@/components/Core/CoreCheckBox.vue";
import CorePicker from "@/components/Core/CorePicker/CorePicker.vue";
import {EventBus} from "@/utils/eventBus";
import {EVENTS} from "@/utils/constants";
import { Ref } from "vue-property-decorator";
import UpdateSprintPopup from "@/components/UpdateSprintPopup.vue"
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
    name: "UpdateSprintForm",
    components: {
        CoreInput,
        ValidationProvider,
        CoreCheckBox,
        CorePicker,
        ValidationObserver,
    },
})
export default class UpdateSprintForm extends DialogForm {
    @Ref('picker') picker!: CorePicker;
    @Ref('observer') observer!: InstanceType<typeof ValidationObserver>;
    hasChanging = false;
    isBacklogActive = false;
    readonly tomorrow = tomorrow;

    public get name(): string {
        return UpdateSprintCSModule.sprint?.name;
    }

    public set name(name: string) {
        UpdateSprintCSModule.setName(name);
    }

    public get returnToTriageDate(): string {
        return UpdateSprintCSModule.sprint?.returnToTriageJobDate || "";
    }

    public set returnToTriageDate(date: string) {
        this.hasChanging = true;
        UpdateSprintCSModule.setReturnToTriage(dateISOFormat(date));
    }

    get isBacklog() {
        return !!UpdateSprintCSModule.sprint?.returnToTriageJobDate || this.isBacklogActive;
    }
    set isBacklog(value: boolean) {
        this.isBacklogActive = value;
        if(value) {
            const currentSprint = SprintDSModule.getItems[UpdateSprintCSModule.sprint.projectId].find(item => item.id === UpdateSprintCSModule.sprint.id)
            if(currentSprint?.returnToTriageJobDate) {
                this.returnToTriageDate = currentSprint?.returnToTriageJobDate;
            } else {
                this.picker.openPicker();
            }
        } else {
            this.picker.closePicker();
            this.returnToTriageDate = "";
        }
    }

    get isDisabled() {
        return !this.isBacklog
    }

    get minDate(): string {
        return moment().startOf("day").add(1, "day").format("YYYY-MM-DD");
    }

    isFormDirty() {
        return Object.keys(this.observer.fields).some((key) => this.observer.fields[key].dirty);
    }

    @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
    async onConfirm() {
        const currentSprint = SprintDSModule.getItems[UpdateSprintCSModule.sprint.projectId].find(item => item.id === UpdateSprintCSModule.sprint.id)
        try {
            if (this.isFormDirty()) await UpdateSprintCSModule.update();
            if (this.hasChanging&&currentSprint) {
                    const resp = await UpdateSprintCSModule.listNuggets(currentSprint.id)
                    if(resp.length) {
                        DialogCSModule.clear()
                    DialogCSModule.load({
                            title: "",
                            isShowingDialog: true,
                            noClose: false,
                            confirmLabel: "Yes",
                            cancelLabel: "No",
                            width: 500,
                            content: UpdateSprintPopup
                        });
                    }
                    else {
                        await UpdateSprintCSModule.rescheduleSprint() 
                        DialogCSModule.clear()
                    }
            }
            EventBus.$emit(EVENTS.UPDATE_SPRINT, UpdateSprintCSModule.sprint);
        }
        finally {
            this.hasChanging = false;
        }
    }


    onOpened() {
        return;
    }

    onBeforeClosed() {
        UpdateSprintCSModule.clear();
        DialogCSModule.clear();

        if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
            this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
        }
    }
}
</script>

<style lang="scss" scoped>
.form {
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-row-gap: 20px;
    .backlog {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
    }
}
</style>