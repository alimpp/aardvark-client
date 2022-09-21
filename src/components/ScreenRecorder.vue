<template>
  <div id="screenRecorder" :style="{display: !isInitMedia ? 'none' : 'inline-block'}"  >
      <div>
          <i class="material-icons recorder-button" @click="reset()" style="margin-right: 12px;">close</i>
           <div class="counter"   v-if="isRecording || canDownloadRecord" >{{timeString}}</div>
          <i class="material-icons recorder-button" v-if="isRecording && !canDownloadRecord "  @click="stopRecording()"  >stop</i>
          <i class="material-icons recorder-button" :class="[{'disabled': !canDownloadRecord}]"  @click="download()" >file_download</i>
          <i class="material-icons recorder-button"  :class="[{'disabled': !canDownloadRecord}]"  @click="sendFile()" >send</i>
      </div>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { EventBus } from '@/utils/eventBus';
import { EVENTS, TOAST_NOTIFICATION_TEXT } from '@/utils/constants';
import {ApplicationDSModule, ScreenRecorderCSModule}   from '@/store';
import { ModuleName } from '@/store/modules/datastore/applicationDS';
import { createToastNotification } from '@/utils/toast';
 
@Component({
  name: 'ScreenRecorder',
  components: { }
})
export default class ScreenRecorder extends Vue {
  mediaRecorder;
  mediaSource = new MediaSource();
  recordedBlobs;
  sourceBuffer;
  isRecording = false ;
  isInitMedia = false ;
  canDownloadRecord = false ;
  stream: MediaStream|undefined ;
  counterSeconds = 0 ;
  timeString = "00:00" ;
  timerInterval!: NodeJS.Timeout;

  mounted() { 
    this.dragElement();   
    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
    EventBus.$on(EVENTS.CLICK_SCREEN_RECORDER, async() => {

      try {
        // TODO: Remove this when TS upgraded to 4.4
        // @ts-ignore      
        const videoStream = await navigator.mediaDevices.getDisplayMedia({
            video: true 
        });
         try {
            const audioStream  = await navigator.mediaDevices.getUserMedia({
              audio: true 
            });
            videoStream.addTrack(audioStream.getAudioTracks()[0]);
            this.successCallback(videoStream )
        } catch(err) {
          this.successCallback(videoStream )
        }
      } catch(err) {
          createToastNotification( TOAST_NOTIFICATION_TEXT.RECORDER_NOT_SUPPORTED , {type: 'error', position: 'bottom'});
      }

 
    }) 
    
    EventBus.$on(EVENTS.RESET_SCREEN_RECORDER, () => {
      this.reset();
    }) 
    
  }

  reset(){
    if(!this.canDownloadRecord){
      clearInterval ( this.timerInterval );
      if(this.mediaRecorder && this.mediaRecorder.state !== "inactive"){
        this.mediaRecorder.stop();
      }
      if(this.stream){
        const tracks = this.stream.getTracks();
        for( let i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
      }
    }
     
    this.isInitMedia = false ;
    this.mediaRecorder = null;
    this.mediaSource = new MediaSource();
    this.recordedBlobs = null;
    this.sourceBuffer = null;
    this.isRecording = false ;
    this.isInitMedia = false ;
    this.canDownloadRecord = false ;
     this.counterSeconds = 0 ;
    this.timeString = "00:00" ;
    ScreenRecorderCSModule.setIsScreenRecordingActive(false)
  } 

  successCallback(stream: MediaStream) {
    this.stream = stream;
    this.isInitMedia = true ;
    setTimeout(()=> this.startRecording() , 500);
  }
  download() {
    if(!this.canDownloadRecord)
      return ;
    const blob = new Blob(this.recordedBlobs, {type: 'video/webm;codecs=vp9,opus'});
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.style.display = 'none';
    element.href = url;
    element.download = 'maestroRecordedFile.webm';
    document.body.appendChild(element);
    element.click();
    setTimeout(function() {
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  startRecording() {
    if(!this.stream) return ;
    let options = {mimeType: 'video/webm;codecs=vp9,opus' };
    this.recordedBlobs = [];
    try {
      // TODO: Remove this when TS upgraded  
      // @ts-ignore   
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (e0) {
      try {
        options = {mimeType: 'video/webm;codecs=vp8,vorbis' };
        // TODO: Remove this when TS upgraded to 4.4
        // @ts-ignore   
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } catch (e1) {
        try {
          // TODO: Remove this when TS upgraded to 4.4
          // @ts-ignore   
          this.mediaRecorder = new MediaRecorder(this.stream);
        } catch (e2) {
          createToastNotification( TOAST_NOTIFICATION_TEXT.RECORDER_NOT_SUPPORTED , {type: 'error', position: 'bottom'});
          return;
        }
      }
    }
    this.mediaRecorder.onstop = this.handleStop;
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start(10);
    this.timerInterval = setInterval(this.setTime, 1000);
    ScreenRecorderCSModule.setIsScreenRecordingActive(true)
    this.isRecording = true ;
  }
  setTime() {
    ++this.counterSeconds;                                                                                                                                                               
    this.timeString = this.parseTimeToAddZero(parseInt(""+(this.counterSeconds / 60)))  +":"+ this.parseTimeToAddZero(this.counterSeconds % 60);
  }
  parseTimeToAddZero(value: number) {
    const valString = value + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
 async stopRecording() {
    if(this.mediaRecorder &&  this.mediaRecorder.state !== "inactive"){
        this.mediaRecorder.stop();
    }
    this.canDownloadRecord = true ;
    if(this.stream){
      const tracks = this.stream.getTracks();
      for( let i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
    }
    clearInterval ( this.timerInterval );
    const blob = new Blob(this.recordedBlobs, {type: 'video/webm;codecs=vp9,opus'});
    const screenRecordedUrl  = URL.createObjectURL(blob);
    const screenRecordedFile = new File([blob], "record.webm");
    await ScreenRecorderCSModule.setScreenRecordedFile({url : screenRecordedUrl, file : screenRecordedFile }) 
    ScreenRecorderCSModule.setIsScreenRecordingActive(false);
    this.isRecording = false ;
  }

  sendFile(){
    if(!this.canDownloadRecord)
      return ;

    const selectedModule = ApplicationDSModule.selectedModule;
    const id = ApplicationDSModule.currentRoomID;

    if(id === 0 || selectedModule === ModuleName.settings || selectedModule === ModuleName.none || selectedModule === ModuleName.timeCards ){
     ScreenRecorderCSModule.setCurrentRoomId(0);
    }else {
      ScreenRecorderCSModule.setCurrentRoomId(id);
    }
    ScreenRecorderCSModule.setHasScreenRecordingFile(true)
    ScreenRecorderCSModule.sendFileToOriginalChat();
    this.reset();
  }

  handleSourceOpen() {
    this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8,vorbis"');
  }

  handleDataAvailable(event) {
    if (this.recordedBlobs != null && event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }
  handleStop() {
    // 
  }

  dragElement() {
   const element: HTMLElement | null = document.getElementById("screenRecorder") ;
    if(!element){
        return ;
    }
    let pos1 = 0, pos2 = 0 , pos3 = 0 , pos4 = 0;
    // eslint-disable-next-line
    element.onmousedown = dragMouseDown;
    function elementDrag(event) {
      if(!element){
        return ;
      }
      event = event || window.event;
      event.preventDefault();
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }    
    function dragMouseDown(event) {
      event = event || window.event;
      event.preventDefault();
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }
  beforeDestroy() {
    EventBus.$off(EVENTS.RESET_SCREEN_RECORDER);
    EventBus.$off(EVENTS.CLICK_SCREEN_RECORDER);
  }
 
}
</script>

<style lang="scss">
#screenRecorder {
  background: var(--brand-color);
  display: inline-block;
  position: absolute;
  z-index: 1050;
  border: 1px solid #1d4f81;
  text-align: center;
  border-radius: 32px;
  padding-top: 4px;
  padding-left: 18px;
  padding-right: 18px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%)
}
#screenRecorderheader {
  padding: 10px;
  cursor: move;
  z-index: 10;
  background-color: #2196F3;
  color: #fff;
}
.counter{
  display: inline-block;
  margin-left: 8px;
  margin-right: 8px;
  line-height: 38px;
  vertical-align: bottom;
}
.recorder-button{
  color: #fff;

  text-shadow: 2px 2px #80808036;
}
.disabled {
      transform: none;
      color: #999;
      cursor: not-allowed !important;
}
</style>