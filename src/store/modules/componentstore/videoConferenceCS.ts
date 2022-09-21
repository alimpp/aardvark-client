import store, { ApplicationDSModule, GlobalVideoConferenceCSModule, PeopleChatCSModule, ProfileDSModule, UserDSModule, VideoConferenceCSModule } from '@/store';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import { EVENTS, MESSAGE_SIGNATURE, VIDEO_CONFERENCE_STATUS } from '@/utils/constants';
import MessageAPI from '@/api/messageAPI';
import { EventBus } from '@/utils/eventBus';
import VideoConferenceApi from '@/api/videoConferenceApi';
import VideoConferenceDM from '@/datamodels/videoConferenceDM';
import { Wait, WaitStates } from '@/utils/vuewait';

@Module({name:'videoconferencecs', namespaced: true, stateFactory: true })
export class VideoConferenceCS extends VuexModule implements ILifeCycle{

    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
    }
     
    @Action({rawError: true})
    async sendStartCall(token: string){
       const data = await VideoConferenceApi.INITIATE({token: token , memberIds: "["+GlobalVideoConferenceCSModule.userId+"]" , title:"title"});
       GlobalVideoConferenceCSModule.setVideoConferenceRoomId(data.id)  ;
       GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.WAIT_FOR_CALEE);

    } 
    
    @Action({rawError: true})
    async sendACCEPTCall(token: string){
        if(!GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id) return ;
        VideoConferenceApi.ACCEPT({token: token , id: GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id });
    }
    @Action({rawError: true})
    async sendRefreshToken(token: string){
        if(!GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id) return ;
        VideoConferenceApi.REFRESH({token: token , id: GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id });
    } 
     
    @Action({rawError: true})
    @Wait(WaitStates.ACTION_DECLINE_VIDEO_CONFERENCE)
    async rejectVideoConference() {
        if(!GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id) return ;
        VideoConferenceApi.REJECT({id: GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id});
        GlobalVideoConferenceCSModule.reset();
    }

    @Action({rawError: true})
    async busyVideoConference(videoConference: VideoConferenceDM) {
        if(!videoConference?.conferenceRoom?.id) return ;
        VideoConferenceApi.BUSY({id: videoConference.conferenceRoom.id});
    }

    @Action({rawError: true})
    async hangupVideoConference() {
        if(!GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id) return ;
        VideoConferenceApi.HANGUP({id: GlobalVideoConferenceCSModule.initiateVideoConference?.conferenceRoom?.id});
     }
    

    @Action({rawError: true})
    async activate() {
        // 
    }
}
 

