<template>
   <div>
        <div class="mx-auto my-3 d-flex justify-content-center flex-nowrap">
            <div  class="mx-3">
                <CoreAvatar class="mx-auto my-2" :src="user.profileUrl"  :username="user.fullName" :size="120" />
                <span class="mx-auto font-weight-bold" v-if="isVideoConferenceStatusReject">{{user.fullName}} rejected your call </span>
                <span class="mx-auto font-weight-bold" v-if="isVideoConferenceStatusBusy" >{{user.fullName}} is Busy</span>
                <span class="mx-auto font-weight-bold" v-if="isVideoConferenceStatusHangup" >{{user.fullName}} hangup the call</span>
            </div>
        </div>
   </div>
</template>

<script lang="ts">
import {  GlobalVideoConferenceCSModule } from "@/store";
import {Component, Vue} from "vue-property-decorator";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import {WaitStates} from "@/utils/vuewait";
import { VIDEO_CONFERENCE_STATUS } from "@/utils/constants";

@Component({
    name: 'VideoConferenceFail',
    components: { CoreAvatar , CoreBtn },
})
export default class VideoConferenceFail extends Vue {
    waitState = WaitStates;
    
    get user(){
        return GlobalVideoConferenceCSModule.initiateVideoConference?.senderUser
    }
    get isVideoConferenceStatusReject(){
        return GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.REJECT;  
    }
    get isVideoConferenceStatusBusy(){
        return GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.BUSY;  
    }
    get isVideoConferenceStatusHangup(){
        return GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.HANGUP;  
    }
   

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

.maz-btn {
      &--pink {
        background: $core-button-cancel-bg;
        &:hover {
          background: $core-button-cancel-hover;
        }
      }
}
</style>