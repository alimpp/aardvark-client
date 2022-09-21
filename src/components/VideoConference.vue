<template>
  <div id="VideoConference" class="overflow-hidden">
      <div class="container-fluid text-center">
        <div  class="text-left"   >
            <div class="position-relative"  >
              <video :ref="'local-video'" :poster="myProfileUrl" autoplay muted class="local-video" ></video>
          </div>
              <div>
                <video :ref="'remote-video'" :poster="profileUrl" autoplay  class="remote-video" ></video>
              </div>
        </div>
          <span class="icon material-icons" :class="[{'icon-red': !isAudioActive}]" @click="muteAudio" >{{audioIcon}}</span>
          <span class="icon material-icons" :class="[{'icon-red': !isVideoActive}]" @click="muteVideo" >{{videoIcon}}</span>
          <span class="icon material-icons" :class="[{'icon-red': isShareScreenActive}]" @click="shareScreen" >{{screenShareIcon}}</span>
          <span class="icon-hangup material-icons"  @click="hangup">call_end</span>
      </div>
  </div>
</template>


<script lang="ts">
import { GlobalVideoConferenceCSModule, UserDSModule, VideoConferenceCSModule } from "@/store";
import Vue from "vue";
import Component from "vue-class-component";
import { Ref, Watch } from "vue-property-decorator";
import { EventBus } from "@/utils/eventBus";
import { EVENTS, VIDEO_CONFERENCE_STATUS } from "@/utils/constants";
import { debounce } from "@/utils/debounce";
import { DEBOUNCE } from "@/utils/constants";
import { createToastNotification } from "@/utils/toast";
import CoreBtn from '@/components/Core/CoreBtn.vue'

@Component({
  name: "VideoConference",
  components: {
    CoreBtn
  },
})

export default class VideoConference extends Vue {
  @Ref('local-video') localVideoComponent!: HTMLMediaElement;
  @Ref('remote-video') remoteVideoComponent!: HTMLMediaElement;
  localStream: MediaStream | undefined = undefined
  remoteStream: MediaStream | undefined = undefined
  shareScreenStream: MediaStream | undefined = undefined
  sender: RTCRtpSender | undefined
  isShareScreenActive = false ;
  isAudioActive = true ;
  isVideoActive = true ;
  hasVideoDevice = false;
  hasAudioDevice = false;
  offer
  peerConnection!: RTCPeerConnection;  
  servers = {
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
      {
        urls: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
    ],
    iceCandidatePoolSize: 10,
  };

  get initiateVideoConference(){
    return GlobalVideoConferenceCSModule.initiateVideoConference ;
  }

  get screenShareIcon(){
    return this.isShareScreenActive ? "stop_screen_share" : "screen_share" ;
  }
  get videoIcon(){
    return this.isVideoActive ? "videocam" : "videocam_off" ;
  }
  get audioIcon(){
    return this.isAudioActive ? "mic_none" : "mic_off" ;
  }

  get profileUrl(){
    return UserDSModule.itemsAsArray.find(user => user.referenceId === +GlobalVideoConferenceCSModule.userId)?.profileUrl || ""
  }
  get myProfileUrl(){
    return UserDSModule.me?.profileUrl || ""
  }

  @Watch('initiateVideoConference')
  onInitiateVideoConference(val: number) {
    this.answer(this.initiateVideoConference?.senderToken);
  }


  async mounted() {
    this.peerConnection = new RTCPeerConnection(this.servers);
    this.peerConnection.onicecandidate = (event) => {
      if(GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.INITIATE_VIDEO_CALL){
        debounce(DEBOUNCE.INITIATE_VIDEO_CALL,() => VideoConferenceCSModule.sendStartCall(JSON.stringify(this.peerConnection.localDescription )) , 500);
      }else if(GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.JOIN_VIDEO_CALL){
        debounce(DEBOUNCE.JOIN_VIDEO_CALL,() => VideoConferenceCSModule.sendACCEPTCall(JSON.stringify(this.peerConnection.localDescription )) , 500);
      }else {
        debounce(DEBOUNCE.KEEP_ALIVE_CALL,() => VideoConferenceCSModule.sendRefreshToken(JSON.stringify(this.peerConnection.localDescription )) , 500);
      }
     };
    await this.init();

    if(GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.INITIATE_VIDEO_CALL){
      this.createConnection();
    }else {
      this.setRemoteDescription(GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.token);
    }
    EventBus.$on(EVENTS.HANGUP_VIDEO_CONFERENCE, () => {      
      this.hangup();
    })
  }


  async init(){
    try{
        
      if (navigator.mediaDevices?.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices()
          devices.forEach((device) => {
            if(device.kind === "videoinput"){
              this.hasVideoDevice = true ;
            }
            if (device.kind === "audioinput"){
              this.hasAudioDevice= true ; 
            }
        }); 
      }
      if(this.hasVideoDevice || this.hasAudioDevice){
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: this.hasVideoDevice, audio: this.hasAudioDevice });
        this.localStream.getTracks().forEach((track) => {
          if(this.localStream){
            this.sender = this.peerConnection.addTrack(track, this.localStream);
          }
        });

        this.remoteStream = new MediaStream();
        this.peerConnection.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            if(this.remoteStream){
              this.remoteStream.addTrack(track);      
            }
          });
        };
        this.remoteVideoComponent.srcObject = this.remoteStream;
        this.localVideoComponent.srcObject = this.localStream;

      }else{
          createToastNotification("you should have webcam and audio device", {type: 'error', position: 'bottom'});
          GlobalVideoConferenceCSModule.reset()
      } 
    }catch(e){
      createToastNotification("can't access user media", {type: 'error', position: 'bottom'});
      GlobalVideoConferenceCSModule.reset()
    
    }

  }

  async createConnection(){
    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);
  }

  async setRemoteDescription(token){
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(JSON.parse(token))) );
    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);
  }
  
  async answer(token){
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(JSON.parse(token))));
  }

  async muteAudio(){
    const audioTrack = this.localStream?.getTracks().find(track => track.kind === 'audio');
    if(!audioTrack) return ;

    if(audioTrack.enabled){
      audioTrack.enabled = false ;
      this.isAudioActive = false ;
    }else {
      this.isAudioActive = true ;
      audioTrack.enabled = true ;
    }
  }

  async muteVideo(){
    const videoTrack = this.localStream?.getTracks().find(track => track.kind === 'video');
    if(!videoTrack) return ;

    if(videoTrack.enabled){
      this.isVideoActive = false ;
      videoTrack.enabled = false ;
    }else {
      this.isVideoActive = true ;
      videoTrack.enabled = true ;
    }
  }

  async shareScreen(){
    if (this.isShareScreenActive) {
      this.endShareScreen();
    }else {
      // @ts-ignore
      this.shareScreenStream =  await navigator.mediaDevices.getDisplayMedia() ; 
      if(this.shareScreenStream){
          this.sender?.replaceTrack(this.shareScreenStream.getTracks()[0]);
          this.localVideoComponent.srcObject = this.shareScreenStream ;
      }
      //@ts-ignore
      this.shareScreenStream.getTracks()[0].onended = this.endShareScreen ;
      this.isShareScreenActive = true ;
    }
        
  }

  endShareScreen() {
    if(this.localStream){
      this.localVideoComponent.srcObject = this.localStream ;
    }
    const videotrack = this.localStream?.getTracks().find(track => track.kind === 'video') ;
    if(videotrack){
      this.sender?.replaceTrack(videotrack);
    }
    if(this.shareScreenStream){
        const tracks = this.shareScreenStream.getTracks();
        for( let i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
    }
    this.isShareScreenActive = false ;

  }

  beforeDestroy() {
    EventBus.$off(EVENTS.HANGUP_VIDEO_CONFERENCE)
    this.clear();
  }
  
  async hangup(){
    VideoConferenceCSModule.hangupVideoConference();
    this.clear();
    GlobalVideoConferenceCSModule.reset();
  }
  async clear(){
    if(this.localStream){
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    await this.peerConnection.close();
    if(this.shareScreenStream){
      const tracks = this.shareScreenStream.getTracks();
      for( let i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
    }
  }
   
}
</script>
<style lang="scss" scoped>
@import "src/assets/scss/variables";

.icon{
    border-radius: 100%;
    background-color: #303145;
    padding: 8px;
    margin: 4px;
}
.icon-hangup{
  margin-left: 30px;
  padding: 8px 20px;
  border-radius: 50px;
  background-color: 48px;
  background: red;
}
.icon-red{
  background: red;
}
.remote-video{
  height: 480px;
  width: 640px;
  border-radius: 10px;
  border: solid 2px #303144; object-fit: cover; 
}
.local-video{
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  border-radius: 10px;
  border: solid 2px #303144;
}
.maz-btn {
    margin-top: 10px;
      &--pink {
        background: $core-button-cancel-bg;
        &:hover {
          background: $core-button-cancel-hover;
        }
      }
}
</style>
