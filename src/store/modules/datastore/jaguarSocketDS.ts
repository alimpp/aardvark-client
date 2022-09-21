import MessageDM from '@/datamodels/messageDM';
import VideoConferenceDM from '@/datamodels/videoConferenceDM';
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"
import {ApplicationDSModule} from '@/store';

@Module({ name: "jaguarsocketds", namespaced: true })
export class JaguarSocketDS extends VuexModule implements IJaguarSocketDS {
  newMessage = new MessageDM();
  seenMessage = new MessageDM();
  eventMessage = new MessageDM();
  deleteMessage = new MessageDM();
  editMessage = new MessageDM();
  initiateVideoConference = new VideoConferenceDM();
  acceptVideoConference = new VideoConferenceDM();
  refreshVideoConference = new VideoConferenceDM();
  rejectVideoConference = new VideoConferenceDM();
  busyVideoConference = new VideoConferenceDM();
  hangupVideoConference = new VideoConferenceDM();

  @Mutation
  setNewMessage(message: MessageDM) {
    this.newMessage = message;
  }

  @Mutation
  setSeenMessage(message: MessageDM) {
    this.seenMessage = message;
  }

  @Mutation
  setEventMessage(message: MessageDM) {
    this.eventMessage = message;
  }

  @Mutation
  setDeleteMessage(message: MessageDM) {
    this.deleteMessage = message;
  }

  @Mutation
  setEditMessage(message: MessageDM) {
    this.editMessage = message;
  }
  @Mutation
  setInitiateVideoConference(videoConference: VideoConferenceDM) {
    this.initiateVideoConference = videoConference;
  }

  @Mutation
  setAcceptVideoConference(videoConference: VideoConferenceDM) {
    this.acceptVideoConference = videoConference;
  }

  @Mutation
  setRefreshVideoConference(videoConference: VideoConferenceDM) {
    this.refreshVideoConference = videoConference;
  }

  @Mutation
  setRejectVideoConference(videoConference: VideoConferenceDM) {
    this.rejectVideoConference = videoConference;
  }

  @Mutation
  setBusyVideoConference(videoConference: VideoConferenceDM) {
    this.busyVideoConference = videoConference;
  }

  @Mutation
  setHangupVideoConference(videoConference: VideoConferenceDM) {
    this.hangupVideoConference = videoConference;
  }

  @Action({rawError: true})
  receiveVideoConference(data: VideoConferenceDM) {
    this.setInitiateVideoConference(data);
  }
  
  @Action({rawError: true})
  receiveAcceptVideoConference(data: VideoConferenceDM) {
    this.setAcceptVideoConference(data);
  }

  @Action({rawError: true})
  receiveRefreshVideoConference(data: VideoConferenceDM) {
    this.setRefreshVideoConference(data);
  }

  @Action({rawError: true})
  receiveRejectVideoConference(data: VideoConferenceDM) {
    this.setRejectVideoConference(data);
  }

  @Action({rawError: true})
  receiveBusyVideoConference(data: VideoConferenceDM) {
    this.setBusyVideoConference(data);
  }

  @Action({rawError: true})
  receiveHangupVideoConference(data: VideoConferenceDM) {
    this.setHangupVideoConference(data);
  }

  @Action({rawError: true})
  receiveMessage(data: MessageDM) {
    this.setNewMessage(data);
  }

  @Action({rawError: true})
  receiveSeen(data: MessageDM) {
    this.setSeenMessage(data);
  }

  @Action({rawError: true})
  receiveEvent(data: MessageDM) {
    this.setEventMessage(data);
  }

  @Action({rawError: true})
  receiveDelete(data: MessageDM) {
    this.setDeleteMessage(data);
  }

  @Action({rawError: true})
  receiveEdit(data: MessageDM) {
    this.setEditMessage(data);
  }

  @Action({rawError: true})
  public subscribe(data: number) {
    ApplicationDSModule.jaguarSocket?.send(JSON.stringify({action: "subscribe", data:{roomId: data}}));
  }

  @Action({rawError: true})
  public unSubscribe(data: number) {
    ApplicationDSModule.jaguarSocket?.send(JSON.stringify({action: "unsubscribe", data:{roomId: data}}));
  }

}

export interface IJaguarSocketDS {
  newMessage: MessageDM
  seenMessage: MessageDM
  eventMessage: MessageDM
  deleteMessage: MessageDM
  editMessage: MessageDM
}
