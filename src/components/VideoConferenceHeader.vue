<template>
    <div class="header d-flex flex-row-reverse maz-p-3">
        <span class="material-icons"  @click="handlerClosedWindow()" >close </span>
        <span class="material-icons" v-if="!IsMinimizeWindow" @click="minimizeAndMaximizeWindow(!IsMinimizeWindow)">minimize</span>
        <span class="material-icons" v-if="IsMinimizeWindow" @click="minimizeAndMaximizeWindow(!IsMinimizeWindow)">maximize</span>
        <div class="d-flex mr-auto">
            <i class="material-icons mx-2">perm_phone_msg</i>
            <span class="font-weight-bold">{{callStatus}}</span>
        </div>
    </div>    
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import { GlobalVideoConferenceCSModule } from "@/store";
import { EVENTS } from "@/utils/constants";
import { EventBus } from "@/utils/eventBus";


@Component({
    name: 'VideoConferenceHeader',
    components: {  },

})
export default class VideoConferenceHeader extends Vue {

    get callStatus(){
        return GlobalVideoConferenceCSModule.status
    }

    get IsMinimizeWindow(){
        return GlobalVideoConferenceCSModule.isMinimizeVideoConferenceWindow
    }


    minimizeAndMaximizeWindow(value) {
        GlobalVideoConferenceCSModule.setIsMinimizeVideoConferenceWindow(value)
    }

    handlerClosedWindow(){
        EventBus.$emit(EVENTS.HANGUP_VIDEO_CONFERENCE );
        GlobalVideoConferenceCSModule.reset();
    }
  

    


}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";



</style>