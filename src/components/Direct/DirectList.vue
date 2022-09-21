<template>
  <ChatRoomsList
    ref="chatRoomList"
    :roomActions="roomActions"
    :rooms="rooms"
    :filteredRooms="filteredRooms"
    :isRoomsLoaded="isRoomsLoaded"
    :currentRoomId="currentRoomId"
    :roomsPerPage="roomsPerPage"
    @change-room="onRoomChange"
    @fetch-more-rooms="onFetchMoreRooms"
    :isLoadingMoreRooms="isLoadingMoreRooms">

    <div slot="rooms-search" class="d-flex position-relative w-100" :style="searchStyling">
      <CoreInput v-model="searchQuery" class="flex-grow-1" leftIconName="search" placeholder="Search for People" noLabel autocomplete="off" />
      <ChatUserSearch v-if="canShowSearch" ref="search" :showNoResults="!hasResults" :filter="searchQuery" position="bottom" :filterIds="currentChatUsers" @select="onUserSelect" :store="store" />
    </div>

	</ChatRoomsList>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
import ChatRoomsList from "@/components/Chat/ChatRoomsList.vue";
import CoreInput from "@/components/Core/CoreInput.vue";
import ChatUserSearch from "@/components/Chat/ChatUserSearch.vue";
import {ApplicationDSModule, PeopleRoomsCSModule, UserDSModule, PeopleChatCSModule} from "@/store";
import UserDM from "@/datamodels/userDM";
import DirectDM from "@/datamodels/directDM";
import {EventBus} from "@/utils/eventBus";
import {EVENTS} from "@/utils/constants";

@Component({
  name: "DirectList",
  components: {ChatRoomsList, CoreInput, ChatUserSearch}
})
export default class DirectList extends Vue {
  @Ref('chatRoomList') private readonly roomList!: ChatRoomsList;
  @Ref("search") readonly search!: ChatUserSearch;

  roomActions = [];
  searchQuery = '';
  roomsPerPage = 20;
  isRoomsLoaded = false;
  isLoadingMoreRooms = false;
  searchStyling = {marginBottom: '0px'};

  @Watch('rooms')
  onRoomsUpdate(rooms: DirectDM[]) {
    this.isRoomsLoaded = rooms.length < this.roomsPerPage;
  }

  @Watch('searchQuery')
  onSearchQueryChange() {
    window.setTimeout(() => this.searchStyling.marginBottom = this.canShowSearch ? `${this.search?.$el?.clientHeight || 0}px` : "0px");
  }

  get store() {
    return PeopleChatCSModule;
  }

  get currentChatUsers() {
    const ids: number[] = [];
    this.rooms.map(room => room.members?.map(member => ids.push(member.referenceId)));
    return ids;
  }

  get currentRoomId() {
    return ApplicationDSModule.selectedPeopleChatRoomID;
  }

  get rooms() {
    return PeopleRoomsCSModule.rooms;
  }

  get filteredRooms() {
    return this.rooms.filter(room => room.members?.every(member => UserDSModule.itemsAsArray.some(user => user.referenceId === member.referenceId)) && room.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  get hasResults() {
    return this.filteredRooms.length !== 0;
  }

  get canShowSearch() {
    return this.searchQuery.trim() !== '';
  }

  async onUserSelect(user: UserDM) {
    this.searchQuery = '';
    await PeopleRoomsCSModule.create(user.referenceId);
    const room = PeopleRoomsCSModule.rooms.find(room => room.members?.some(member => member.referenceId === user.referenceId)) as DirectDM;
    if (room)
    this.onRoomChange({room, scrollToRoom: true});

  }

  async onRoomChange(event: {room: DirectDM, scrollToRoom: boolean}) {
    this.searchQuery = '';
    const { room, scrollToRoom = false } = event;
    if(room.id)
    PeopleRoomsCSModule.updateRoomId(room.id);
    PeopleRoomsCSModule.resetUnreadCount(event.room);
    await this.$nextTick();
    EventBus.$emit(EVENTS.CHAT_ROOM_INPUT_FOCUS);
    if (scrollToRoom)
      this.roomList?.scrollToSelectedRoom();
  }

  async onFetchMoreRooms() {
    this.isLoadingMoreRooms = true;
    const rooms = await PeopleRoomsCSModule.fetch({take: this.roomsPerPage, skip: this.rooms.length, unreadCount: false});
    this.isRoomsLoaded = rooms.length < this.roomsPerPage;
    this.isLoadingMoreRooms = false;
  }

  activated() {
    PeopleRoomsCSModule.updateDirectsFromCache();
  }

  mounted() {
    EventBus.$on(EVENTS.MOVE_TO_DIRECT, (user: UserDM) => {
      this.onUserSelect(user)
    })
  }

  destroy() {
    EventBus.$off(EVENTS.MOVE_TO_DIRECT)
  }

}
</script>
