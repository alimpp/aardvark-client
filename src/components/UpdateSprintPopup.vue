<template>
    <div class="mb-3">Do you want to apply this change to all the Nuggets in this Sprint?</div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import {UpdateSprintCSModule, DialogCSModule} from "@/store";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
    name: "UpdateSprintPopup",
})
export default class UpdateSprintPopup extends DialogForm {

    @Wait(WaitStates.ACTION_DIALOG_CONFIRM)
    async onConfirm() {
        UpdateSprintCSModule.setMoveNugget(true)
        await UpdateSprintCSModule.rescheduleSprint()
        DialogCSModule.clear()
        UpdateSprintCSModule.setMoveNugget(false)
    }

    onOpened() {
        return;
    }

    async onBeforeClosed() {
        if(!UpdateSprintCSModule.moveNugget) {
            await UpdateSprintCSModule.rescheduleSprint()
        }
        if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
            this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
        }

        DialogCSModule.clear();
        UpdateSprintCSModule.setMoveNugget(false)

        if(this.$wait.waiting(WaitStates.ACTION_DIALOG_CONFIRM)){
            this.$wait.end(WaitStates.ACTION_DIALOG_CONFIRM);
        }
    }
}
</script>
