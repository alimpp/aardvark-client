<template>
   <div>Do you want to remove all previous journal cards with zero hours reported?</div>
</template>

<script lang="ts">
import { DeleteEmptyTimeCardPopupCSModule } from "@/store";
import Component from "vue-class-component";
import DialogForm from "./Form/Base/DialogForm.vue";

@Component({
    name: "DeleteEmptyTimeCardPopup"
})
export default class DeleteEmptyTimeCardPopup extends DialogForm {

    async onConfirm(){
        await DeleteEmptyTimeCardPopupCSModule.DeleteEmptyTimeCard()
        DeleteEmptyTimeCardPopupCSModule.clear()
    }

    onOpened() {
       return 
    }

    onBeforeClosed() {
        return        
    }
}
</script>

<style lang="scss" scoped>

</style>