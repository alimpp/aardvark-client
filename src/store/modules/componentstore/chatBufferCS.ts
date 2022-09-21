import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import ChatBufferDM from '@/datamodels/chatBufferDM'

@Module({ name: 'chatbuffercs', namespaced: true })
export class ChatBufferCS extends VuexModule implements IChatBufferCS {
    items: ChatBufferDM[]= []
 
    @Mutation
    setChatBuffer(data: {roomId: number, data: ChatBufferDM }){
        this.items[data.roomId.toString()] = data.data;
    }
} 
export interface IChatBufferCS {
    items: ChatBufferDM[] 
}