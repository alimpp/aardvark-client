<template>
   <div id="video-conference-ringing w-100 h-100" v-if="user" >
        <div class="avatar"  >
            <coreAvatar class="mx-auto my-3 " :src="user.profileUrl" :username="user.fullName" :size="120" />
        </div>
        <div  class="text-center mx-auto my-4">
            <span>incoming video call from</span>
            <h3>{{user.fullName}}</h3>
        </div>
        <div class=" d-flex justify-content-center mx-auto my-3">
            <CoreBtn color="pink" :loading="$wait.is(waitState.ACTION_DECLINE_VIDEO_CONFERENCE)" outline size="md" @click="declineVideoCall()" >Decline</CoreBtn>
            <CoreBtn class="maz-ml-3" size="md" color="primary" @click="acceptVideoCall()" > Accept </CoreBtn>
        </div>
   </div>
</template>

<script lang="ts">
import { GlobalVideoConferenceCSModule, VideoConferenceCSModule } from "@/store";
import {Component, Vue} from "vue-property-decorator";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import {WaitStates} from "@/utils/vuewait";

@Component({
    name: 'VideoConferenceRingingPopup',
    components: { CoreAvatar , CoreBtn },

})
export default class VideoConferenceRingingPopup extends Vue {

    isUserIdle = true;
    waitState = WaitStates;
    audio: HTMLAudioElement | null= null;
    mounted(){
        this.audio = new Audio('audio/ringing.mp3');
        this.audio.play();
    }

    get user(){
        return GlobalVideoConferenceCSModule.initiateVideoConference?.senderUser
    }
    
    async declineVideoCall(){
        this.isUserIdle = false;
        this.stopAudio();
        await VideoConferenceCSModule.rejectVideoConference();
        GlobalVideoConferenceCSModule.setIsShowVideoConferenceWindow(false);

    }

    async acceptVideoCall(){ 
        this.isUserIdle = false;
        this.stopAudio();
        if(!this.user) return ;
            GlobalVideoConferenceCSModule.acceptCall();
    }
    stopAudio(){
        if(!this.audio) return ;
            this.audio.pause();
            this.audio.currentTime = 0;
    }
    beforeDestroy() {
        if(this.isUserIdle){
            this.declineVideoCall();
        }
    }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

#video-conference-ringing{
    // width: 18vw;
    // height: 100%;
}
.maz-btn {
      &--pink {
        background: $core-button-cancel-bg;
        &:hover {
          background: $core-button-cancel-hover;
        }
      }
}
</style>