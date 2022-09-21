<template>
  <transition
        name="maz-dialog-fade"
  >    
    <div id="GlobalVideoConference" v-if="isShowingWindow">
      <div
        class=" core-window maz-base-component position-absolute maz-bg-color"
        :class="{'minimize': IsMinimizeWindow}"
      >
        <div class="position-relative m-2 window-body">
          <VideoConferenceHeader/>
          <div class="windowBody maz-dialog__body px-3 maz-text-color">
            <VideoConferenceRinging v-if="canShowVideoConferenceRinging"/>
            <VideoConference v-if="canShowVideoConference"/>
            <VideoConferenceFail v-if="canShowVideoConferenceFaild"/>
          </div>
        </div>
      </div>
    </div>
  </transition>  

</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import VideoConferenceHeader from '@/components/VideoConferenceHeader.vue';
import VideoConferenceRinging from '@/components/VideoConferenceRinging.vue';
import VideoConference from '@/components/VideoConference.vue';
import VideoConferenceFail from '@/components/VideoConferenceFail.vue';
import {  GlobalVideoConferenceCSModule  } from "@/store";
import { VIDEO_CONFERENCE_STATUS } from '@/utils/constants';



@Component({
  name: "GlobalVideoConference",
  components: {  CoreBtn,VideoConference ,VideoConferenceHeader ,VideoConferenceRinging, VideoConferenceFail },
})
export default class GlobalVideoConference extends Vue {

  get videoConferenceStatus(){
    return GlobalVideoConferenceCSModule.status;  
  }
  get canShowVideoConference(){
    return this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.ACCEPT_CALL || this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.INITIATE_VIDEO_CALL ||this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.WAIT_FOR_CALEE || this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.JOIN_VIDEO_CALL ;  
  } 
  get canShowVideoConferenceRinging(){
    return this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.RINGING;  
  }
  get canShowVideoConferenceFaild(){
    return this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.REJECT || this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.BUSY || this.videoConferenceStatus === VIDEO_CONFERENCE_STATUS.HANGUP ;  
  }

  get isShowingWindow(){
      return GlobalVideoConferenceCSModule.isShowVideoConferenceWindow
  }

  get IsMinimizeWindow(){
    return GlobalVideoConferenceCSModule.isMinimizeVideoConferenceWindow
  }

  beforeDestroy() {
      GlobalVideoConferenceCSModule.reset();
  }

}
</script>

<style lang="scss" scope>

 @import "src/assets/scss/variables";

.core-window {
  border-radius: 1%;
  border: none;
  color: dodgerblue;
  position: absolute;
  box-shadow: 0px 0px 2px gray;
  top: 15%;
  right: 50%;
  bottom: 50%;
  left:50%;
  transform: translate(-50%);
  z-index: 1030;
  width: fit-content;
  height: fit-content;
}

.minimize{
  animation: 0.5s minimizeAnimation;
  top: 85%;
  .windowBody{
    height: 0;
    display: none;
  }
  .windowFooter{
    height: 0;
    display: none;
  }
}

@keyframes minimizeAnimation {
  0%{opacity: 0;}
  100%{opacity: 1;}  
}

.window-body{
  width: 680px;
}

</style>