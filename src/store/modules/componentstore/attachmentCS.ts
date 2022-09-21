import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {ILifeCycle} from "@/store/modules/componentstore/base/interfaces/ILifeCycle";
import {ApplicationDSModule} from '@/store';
import {ModuleName} from '../datastore/applicationDS';
import {TAB_ATTACHMENT_ID} from '@/utils/constants';

@Module({name:'attachmentcs', namespaced: true, stateFactory: true})
export class AttachmentCS extends VuexModule implements ILifeCycle {
  selectedAttachmentView: TAB_ATTACHMENT_ID | null = null;
  tabs = [
    { id: TAB_ATTACHMENT_ID.MEDIA, label: 'Media' },
    { id: TAB_ATTACHMENT_ID.DOCUMENTS, label:'Documents', },
    { id: TAB_ATTACHMENT_ID.LINKS, label: 'Links' }
  ];

  @Mutation
  setSelectedAttachmentView(view: TAB_ATTACHMENT_ID) {
    this.selectedAttachmentView = view;
  }

  @Action({rawError: true})
  async activate() {
    if(this.selectedAttachmentView === null) this.setSelectedAttachmentView(TAB_ATTACHMENT_ID.MEDIA);
    let roomId = 0;
    
    if(ApplicationDSModule.selectedModule === ModuleName.people) {
      roomId = ApplicationDSModule.selectedPeopleChatRoomID;
    } else if (ApplicationDSModule.selectedModule === ModuleName.groups) {
      roomId = ApplicationDSModule.selectedGroupChatRoomID;
    } else {
      roomId = ApplicationDSModule.selectedEntityChatRoomID
    }
    
    ApplicationDSModule.setSelectedMediaRoomID(roomId);
    ApplicationDSModule.setSelectedDocumentRoomID(roomId);
    ApplicationDSModule.setSelectedLinkRoomID(roomId);
  }

}