import { PeopleChatCSModule } from '@/store';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'

 
@Module({ name: 'screenrecordercs', namespaced: true })
export class ScreenRecorderCS extends VuexModule{
  screenRecordedFile: {file: File|undefined, url: string} ={ file: undefined, url: '' } ;
  isScreenRecordingActive =  false
  hasScreenRecordingFile = false
  originalRoomId = 0 ;
  currentRoomId = 0 ;

  @Mutation
  setOriginalRoomId(value){
    this.originalRoomId = value
  }
  @Mutation
  setCurrentRoomId(value){
    this.currentRoomId = value
  }

  
  @Mutation
  setIsScreenRecordingActive(value){
    this.isScreenRecordingActive = value
  }

  @Mutation
  setHasScreenRecordingFile(value){
    this.hasScreenRecordingFile = value
  }   
  
  @Mutation
  setScreenRecordedFile(value){
    this.screenRecordedFile = value
  }
  
  @Action
  sendFileToOriginalChat(){
    if(this.screenRecordedFile.file !== undefined){
      const files: {file: File, url: string} =  {file: this.screenRecordedFile.file , url: this.screenRecordedFile.url} ;
      const data = {
          displayBody: '',
          rawBody: '',
          roomId: this.originalRoomId ,
          file: files,
          links: undefined
      };
      PeopleChatCSModule.sendMessage(data);
      // GroupChatCSModule.sendMessage({});
      // EntityChatCSModule.sendMessage({});
    }
  }
  
}
