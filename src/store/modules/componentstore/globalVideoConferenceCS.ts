import store, { GlobalVideoConferenceCSModule, VideoConferenceCSModule } from '@/store';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import { ILifeCycle } from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import { VIDEO_CONFERENCE_STATUS } from '@/utils/constants';
import VideoConferenceDM from '@/datamodels/videoConferenceDM';

@Module({name:'globalvideoconferencecs', namespaced: true, stateFactory: true })
export class GlobalVideoConferenceCS extends VuexModule implements ILifeCycle{
    userId = 0;
    videoConferenceRoomId = 0;
    isShowVideoConferenceWindow = false
    isMinimizeVideoConferenceWindow = false 
    status: VIDEO_CONFERENCE_STATUS = VIDEO_CONFERENCE_STATUS.AVAILABLE; 
    initiateVideoConference: VideoConferenceDM | null = null ;

    constructor(module: VuexModule<ThisType<any>, any>) {
        super(module);
    }
      
    
    @Mutation 
    async setUserId(data: number){
        this.userId = data ;
    }
    
    @Mutation 
    async setVideoConferenceRoomId(data: number){
        this.videoConferenceRoomId = data ;
    }

    @Mutation 
    async setStatus(data: VIDEO_CONFERENCE_STATUS ){
        this.status = data ;
    }


    @Action({ rawError: true })
    onInitialization() {
          
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.initiateVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined && GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.AVAILABLE){
                    GlobalVideoConferenceCSModule.setInitiateVideoConference(videoConference);
                    if (videoConference.senderUser) {
                        GlobalVideoConferenceCSModule.setUserId(videoConference.senderUser?.referenceId);
                    }
                    GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.RINGING);
                    GlobalVideoConferenceCSModule.setIsShowVideoConferenceWindow(true);

                }else if (videoConference.status !== undefined ){
                    VideoConferenceCSModule.busyVideoConference(videoConference);
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.acceptVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined){
                    GlobalVideoConferenceCSModule.setInitiateVideoConference(videoConference);
                    GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.ACCEPT_CALL);
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.refreshVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined){
                    GlobalVideoConferenceCSModule.setInitiateVideoConference(videoConference);
                }
            }
        );
        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.rejectVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined && videoConference.conferenceRoom?.id === GlobalVideoConferenceCSModule.videoConferenceRoomId){
                    GlobalVideoConferenceCSModule.setInitiateVideoConference(videoConference);
                    GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.REJECT);
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.busyVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined && videoConference.conferenceRoom?.id === GlobalVideoConferenceCSModule.videoConferenceRoomId){
                    GlobalVideoConferenceCSModule.setInitiateVideoConference(videoConference);
                    GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.BUSY);
                }
            }
        );

        store.watch(
            function stateToWatch(state) {
                return state.jaguarsocketds.hangupVideoConference
            },
            async function onChange(videoConference) {
                if(videoConference.status !== undefined && videoConference.conferenceRoom?.id === GlobalVideoConferenceCSModule.videoConferenceRoomId){
                    GlobalVideoConferenceCSModule.setStatus(VIDEO_CONFERENCE_STATUS.HANGUP);
                }
            }
        );

    }

    @Mutation 
    async setIsShowVideoConferenceWindow(value: boolean){
        this.isShowVideoConferenceWindow = value ;
    }    
    
    @Mutation 
    async setIsMinimizeVideoConferenceWindow(value: boolean){
        this.isMinimizeVideoConferenceWindow = value ;
    }    
    
    @Mutation 
    async setInitiateVideoConference(data: VideoConferenceDM){
        this.initiateVideoConference = data ;
        if(data.conferenceRoom)
            this.videoConferenceRoomId = data.conferenceRoom?.id ;
    }
    
    @Action({rawError: true})
    async reset() {
        this.setUserId(0);
        this.setStatus(VIDEO_CONFERENCE_STATUS.AVAILABLE);
        this.setIsShowVideoConferenceWindow(false)
        
    }

    @Action({rawError: true})
    async startCall(userId: number) {
        this.setUserId(userId);
        this.setStatus(VIDEO_CONFERENCE_STATUS.INITIATE_VIDEO_CALL);
        this.setIsShowVideoConferenceWindow(true)
     }

    @Action({rawError: true})
    async acceptCall() {
        this.setStatus(VIDEO_CONFERENCE_STATUS.JOIN_VIDEO_CALL);
    }

    @Action({rawError: true})
    async activate() {
        // 
    }
}
 

