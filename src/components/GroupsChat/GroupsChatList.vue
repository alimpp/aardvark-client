<template>
  <ChatRoomsList
    ref="chatRoomList"
    :roomActions="roomActions"
    :rooms="rooms"
    :filteredRooms="filteredRooms"
    :isRoomsLoaded="isRoomsLoaded"
    :currentRoomId="currentGroupId"
    :roomsPerPage="roomsPerPage"
    @change-room="onRoomChange"
    @fetch-more-rooms="onFetchMoreRooms"
    :canShowSearchBar="true"
    :canShowSenderName="true"
    :isLoadingMoreRooms="isLoadingMoreRooms">

    <div slot="rooms-search" class="d-flex position-relative w-100" :style="searchStyling">
      <CoreInput
        v-model.lazy="searchQuery"
        class="flex-grow-1"
        leftIconName="search"
        placeholder="Search for public Channel"
        noLabel
        autocomplete="off"
        :loading="isSearching"
      />
      <GroupChatSearch
        v-if="showSearch"
        ref="search"
        :isSearching="isSearching"
        :searchedRooms="searchedRooms"
        @select="onGroupSelect"
        position="bottom"
      />
    </div>

  </ChatRoomsList>
</template>

<script lang="ts">
import ChatRoomsList from "@/components/Chat/ChatRoomsList.vue";
import CoreInput from "@/components/Core/CoreInput.vue";
import GroupChatSearch from "@/components/GroupsChat/GroupChatSearch.vue";
import GroupDetailDM from "@/datamodels/groupDetailDM";
import GroupDM from "@/datamodels/groupDM";
import {ApplicationDSModule, GroupChatCSModule, GroupRoomsCSModule, ProfileDSModule} from "@/store";
import {CHAT_LABEL_TYPE, DEBOUNCE, EVENTS} from "@/utils/constants";
import {debounce} from "@/utils/debounce";
import {EventBus} from "@/utils/eventBus";
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
import {State} from "vuex-class";

@Component({
  name: "GroupChatList",
  components: {ChatRoomsList, CoreInput, GroupChatSearch}
})
export default class GroupChatList extends Vue {
  @Ref("chatRoomList") private readonly roomList!: ChatRoomsList;
  @Ref("search") readonly search!: GroupChatSearch;
  @State('searchedRooms', {namespace: 'grouproomscs'})
  readonly searchedRooms!: GroupDM[];
  roomActions = [];
  searchQuery = '';
  roomsPerPage = 20;
  isRoomsLoaded = false;
  isLoadingMoreRooms = false;
  isSearching = false;
  searchStyling = {marginBottom: '0px'};

  @Watch('searchTerms', { immediate: false, deep: false })
  async onSearchQueryChange({ searchQuery, doSearch, clearSearchedRooms }, { searchQuery: oldQuery}): Promise<void> {
    if (doSearch  && !searchQuery.isSame(oldQuery)) {
      this.isSearching = true;
      if (clearSearchedRooms)
        GroupRoomsCSModule.clearSearchedRooms();
      debounce(
        DEBOUNCE.GROUP_CHAT_LIST_SEARCH_TERMS,
        async() => {
          await this.searchRooms(searchQuery);
          this.isSearching = false;
        },
        500);
    }
  }

  @Watch('rooms')
  onRoomsUpdate(rooms: GroupDetailDM[]) {
    this.isRoomsLoaded = rooms.length < this.roomsPerPage;
  }

  @Watch('currentRoomId', {deep: true})
  onCurrentRoomIdChange(roomId: number) {
    const group = this.rooms.find(room => room.id === this.currentGroupId);
    if(group){
      GroupRoomsCSModule.resetUnreadCount({group, roomId });
      this.setTabs(group)
    }

  }

  @Watch('showSearch')
  async onShowSearchChange(value: boolean) {
    await this.$nextTick();
    this.searchStyling.marginBottom = value ? `${this.search.$el.clientHeight}px` : "0px";
  }

  get searchTerms() {
    return {
      searchQuery: this.searchQuery?.trim() as string,
      doSearch: this.searchQuery?.trim()?.length > 0,
      clearSearchedRooms: this.searchQuery?.trim()?.length === 0 || this.searchedRooms?.length > 0
    };
  }

  get currentGroupId() {
    return GroupRoomsCSModule.currentGroupId;
  }

  get currentRoomId() {
    return ApplicationDSModule.selectedGroupChatRoomID;
  }

  get rooms() {
    return GroupRoomsCSModule.rooms;
  }

  get filteredRooms() {
    return GroupRoomsCSModule.rooms.filter(room => room && room.name?.trim()?.toLowerCase().includes(this.searchQuery?.trim()?.toLowerCase()));
  }

  get hasResults() {
    return this.searchedRooms?.length > 0 && !this.isSearching;
  }

  get showSearch() {
    return this.searchQuery.trim().length > 0 && !this.isSearching;
  }

  public get currentUserId() {
    return ProfileDSModule.identifier;
  }

  async onGroupSelect(group: GroupDM) {
    GroupRoomsCSModule.clearSearchedRooms();
    await GroupRoomsCSModule.join({id: group.id, memberId: this.currentUserId});
    this.searchQuery = '';
    const room = GroupRoomsCSModule.rooms?.find(room => room?.id === group?.id) || null;
    if (room) this.onRoomChange({ room, scrollToRoom: true });
  }

  async onRoomChange(event: {room: GroupDetailDM, scrollToRoom: boolean}) {
    const { room, scrollToRoom = false } = event;
    GroupRoomsCSModule.setCurrentGroupId(room.id);
    if(room.latestRoomId) {
      GroupRoomsCSModule.updateRoomId(room.latestRoomId);
    } else if (room.isSubscribedPublic) {
      GroupRoomsCSModule.updateRoomId(room.publicRoomId);
    } else {
      GroupRoomsCSModule.updateRoomId(room.privateRoomId);
    }
    this.setTabs(room);
    await this.$nextTick();
    this.searchQuery = '';
    EventBus.$emit(EVENTS.CHAT_ROOM_INPUT_FOCUS);
    if (scrollToRoom) this.roomList.scrollToSelectedRoom();

  }

  setTabs(room: GroupDetailDM) {
    const tabs: {id: string | number, label: string, highBadgeCount: number}[] = []
    if(room.isSubscribedPrivate ) tabs.push({id: room.privateRoomId, label: CHAT_LABEL_TYPE.PRIVATE , highBadgeCount: room.privateRoom?.unreadCount || 0});
    if(room.isSubscribedPublic ) tabs.push({id: room.publicRoomId, label: CHAT_LABEL_TYPE.PUBLIC,  highBadgeCount: room.publicRoom?.unreadCount || 0});
    GroupChatCSModule.setChatTabs({tabs});
  }

  async onFetchMoreRooms() {
    this.isLoadingMoreRooms = true;
    const rooms = await GroupRoomsCSModule.fetch({take: this.roomsPerPage, skip: this.rooms.length, sort: '-recentMessageAt'});
    this.isRoomsLoaded = rooms.length < this.roomsPerPage;
    this.isLoadingMoreRooms = false;
  }

  private async searchRooms(searchQuery: string): Promise<GroupDM[]> {
     return GroupRoomsCSModule.search(searchQuery);
  }

  activated() {
    GroupRoomsCSModule.updateGroupDetailsFromCache();
  }

}
</script>
