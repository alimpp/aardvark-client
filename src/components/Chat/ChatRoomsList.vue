<template>
	<SimpleBar class="xeba-scrollbar vac-rooms-container vac-app-border-r">
		<slot name="rooms-header"></slot>

		<div v-if="canShowSearchBar && (!isLoadingRooms || rooms.length)" class="vac-box-search pl-2 pr-2 pt-2">
			<slot name="rooms-search"></slot>
		</div>

    <CoreSpinner v-if="isLoadingRooms && !rooms.length" class="mt-3 mx-auto" />

		<div v-if="!isLoadingRooms && !rooms.length" class="vac-rooms-empty">
			<slot name="rooms-empty">
				{{ locales.ROOMS_EMPTY }}
			</slot>
		</div>

		<div v-if="!isLoadingRooms || rooms.length" class="vac-room-list pt-2 pl-2 pr-2 mb-2">
			<div
				class="vac-room-item"
				v-for="room in filteredRooms"
				:id="room.id"
				:key="room.id"
				:class="{'vac-room-selected': currentRoomId === room.id}"
				@click="room.id !== currentRoomId && openRoom(room)"
			>
				<slot name="room-list-item" v-bind="{room}">
					<CoreAvatar class="mr-3" :src="room.icon" :username="room.name" :size="45" />

					<div class="vac-name-container vac-text-ellipsis">
						<div class="vac-title-container">
							<div
								v-if="userStatus(room)"
								class="vac-state-circle"
								:class="{'vac-state-online': userStatus(room) === 'online'}"
							></div>
							<div class="vac-room-name vac-text-ellipsis">
								{{ room.name }}
							</div>
							<div v-if="room.timestamp" class="vac-text-date">
								{{ room.timestamp }}
							</div>
						</div>
						<div class="vac-text-last" :class="{'vac-message-new': room.latestMessage && room.unreadCount && !typingUsers()}">
							<span v-if="isMessageCheckmarkVisible()">
								<slot name="checkmark-icon" v-bind="room.latestMessage">
									<i class="material-icons">done</i>
								</slot>
							</span>
							<!-- <div
								v-if="
									room.latestMessage &&
									!room.latestMessage.deleted &&
									room.latestMessage.file &&
									room.latestMessage.file.audio
								"
								class="vac-text-ellipsis"
							>
								<slot name="microphone-icon">
									<i class="material-icons">mic</i>
								</slot>
								{{ formattedDuration(room.latestMessage.file.duration) }}
							</div> -->
							<MessagePreview
								v-if="room.latestMessage"
								:message="room.latestMessage"
							/>
							<!-- <div
								v-if="!room.latestMessage && typingUsers(room)"
								class="vac-text-ellipsis"
							>
								{{ typingUsers(room) }}
							</div> -->
							<div class="vac-room-options-container">
								<div class="vac-room-badge-container">
									<div class="vac-room-badge">
										<CoreBadgeCount
											counterPadding="10px"
											:count="room.unreadCount"
											class="badge  position-static badge-text my-2 pl-3"
											/>
									</div>
								</div>
								<slot name="room-list-options" v-bind="{room}">
									<div
										class="vac-svg-button vac-list-room-options"
										v-if="roomActions.length"
										@click.stop="roomMenuOpened = room.id"
									>
										<slot name="room-list-options-icon">
											<i class="material-icons">expand_more</i>
										</slot>
									</div>
									<transition name="vac-slide-left" v-if="roomActions.length">
										<div
											v-if="roomMenuOpened === room.id"
											v-click-outside="closeRoomMenu"
											class="vac-menu-options"
										>
											<div class="vac-menu-list">
												<div v-for="action in roomActions" :key="action.name">
													<div
														class="vac-menu-item"
														@click.stop="roomActionHandler(action, room)"
													>
														{{ action.title }}
													</div>
												</div>
											</div>
										</div>
									</transition>
								</slot>
							</div>
							</div>
						</div>
				</slot>
			</div>
			<transition name="vac-fade-message">
				<div v-if="rooms.length && !isLoadingRooms && rooms.length >= roomsPerPage && !isRoomsLoaded" class="d-flex my-4 justify-content-center">
					<CoreSpinner v-observe-visibility="{callback: loadMoreRooms}" />
				</div>
			</transition>
		</div>
	</SimpleBar>
</template>

<script lang="ts">
import vClickOutside from 'v-click-outside'
import {Component, Prop, Vue} from "vue-property-decorator";
import { ObserveVisibility } from 'vue-observe-visibility';
import { ProfileDSModule } from '@/store';
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import ChatUserSearch from "@/components/Chat/ChatUserSearch.vue";
import CoreBadgeCount from "@/components/Core/CoreBadgeCount.vue";
import { WaitStates } from '@/utils/vuewait';
import SimpleBar from 'simplebar-vue';
import MessagePreview from "@/components/Chat/MessageComponents/MessagePreview.vue";
import { CHAT_LOCALE } from '@/utils/constants';

@Component({
  name: "ChatRoomsList",
  components: {CoreInput, CoreBtn, CoreSpinner, ChatUserSearch, SimpleBar, CoreAvatar, CoreBadgeCount, MessagePreview},
  directives: { "observe-visibility": ObserveVisibility, clickOutside: vClickOutside.directive}
})
export default class ChatRoomsList extends Vue {
	@Prop({type: Array, default: () => [
			{ name: 'inviteUser', title: 'Invite User' },
			{ name: 'removeUser', title: 'Remove User' },
			{ name: 'deleteRoom', title: 'Delete Room' }
	]}) roomActions!: {name: string, title: string}[];
	@Prop({type: Number, required: true}) currentRoomId!: number;
	@Prop({type: Array, required: true}) rooms!: any[];
	@Prop({type: Array, required: true}) filteredRooms!: any[];
	@Prop({type: Number, default: 20}) roomsPerPage!: number;
	@Prop({type: Boolean, default: false}) isRoomsLoaded!: boolean;
	@Prop({type: Boolean, default: false}) isLoadingMoreRooms!: boolean;
	@Prop({default: true, type: Boolean}) canShowSearchBar!: boolean;
	@Prop({default: false, type: Boolean}) canShowSenderName!: boolean;

	waitState = WaitStates;
  roomMenuOpened = null;
  hasTextFormatting = true;

  public get currentUserId() {
    return ProfileDSModule?.id;
  }

	get isLoadingRooms() {
		return this.$wait.is(this.waitState.ACTION_CHAT_ROOM_LOADING);
	}

	get locales() {
		return CHAT_LOCALE;
	}

	openRoom(room) {
		this.$emit('change-room', {room});
  }

	loadMoreRooms(isVisible: boolean) {
		if (!isVisible) return;
		if (this.isLoadingMoreRooms) return
		this.$emit('fetch-more-rooms');
  }

  userStatus(room) {
		if (!room.users || room.users.length !== 2) return
		const user = room.users.find(u => u._id !== this.currentUserId)
		if (user.status) return user.status.state
  }

  typingUsers() {
		return false
    //
  }

	// formattedDuration(s) {
	// 	s = Math.round(s)
	// 	return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
  // }

	isMessageCheckmarkVisible() {
    return false;
		// return (
		// 	!this.typingUsers(room) &&
		// 	room.latestMessage &&
		// 	!room.latestMessage.deleted &&
		// 	room.latestMessage.sender_id === this.currentUserId &&
		// 	(room.latestMessage.saved ||
		// 		room.latestMessage.distributed ||
		// 		room.latestMessage.seen)
		// )
  }

	roomActionHandler(action, room) {
		this.closeRoomMenu()
		this.$emit('room-action-handler', { action, roomId: room.id })
  }

	closeRoomMenu() {
		this.roomMenuOpened = null
	}

	async scrollToSelectedRoom(): Promise<void> {
		const [selectedRoom, simpleBar] = [this.$el.querySelector('.vac-room-selected'), this.$el.querySelector('.simplebar-content-wrapper')] as HTMLDivElement[];
		if (selectedRoom) {
			simpleBar.scrollTo({top: selectedRoom.offsetTop - selectedRoom.offsetHeight, left: 0, behavior: 'smooth'});
			selectedRoom.animate([
				{ transform: `translateY(-2px)`, opacity: 0, offset: 0 },
				{ transform: `translateY(2px)`, opacity: 0.5, offset: 0.6 },
				{ transform: `translateY(0px)`, opacity: 1, offset: 1 }
			], {
				duration: 900,
				delay: 0,
				endDelay: 0,
				easing: 'linear',
				fill: 'forwards',
				direction: 'alternate'
			});
		}
	}

	mounted() {
		if(this.currentRoomId) {
			const room = this.rooms.find(room => room.id === this.currentRoomId);
			if(room) this.openRoom(room);
		}
	}

}
</script>

<style lang="scss" scoped>
.badge {
	margin-left: -1.8rem;
}

.vac-rooms-container {
	display: flex;
	flex-flow: column;
	position: relative;
	background: var(--chat-sidemenu-bg-color);
	border-top-left-radius: var(--chat-container-border-radius);
	border-bottom-left-radius: var(--chat-container-border-radius);
}

.vac-box-search {
	position: sticky;
	display: flex;
	align-items: center;
	z-index: 20;
	top: 0;
  background: var(--chat-sidemenu-bg-color);
}

.vac-icon-search {
	display: flex;
	position: absolute;
	left: 30px;

	svg {
		width: 18px;
		height: 18px;
	}
}

.vac-add-icon {
	margin-left: auto;
	padding-left: 10px;
}

.vac-input {
	height: 38px;
	width: 100%;
	background: var(--chat-bg-color-input);
	color: var(--chat-color);
	border-radius: 4px;
	font-size: 15px;
	outline: 0;
	caret-color: var(--chat-color-caret);
	padding: 10px 10px 10px 40px;
	border: 1px solid var(--chat-sidemenu-border-color-search);
	border-radius: 20px;

	&::placeholder {
		color: var(--chat-color-placeholder);
	}
}

.vac-rooms-empty {
	font-size: 14px;
	color: #9ca6af;
	font-style: italic;
	text-align: center;
	margin: 40px 0;
	line-height: 20px;
	white-space: pre-line;
}

.vac-room-list {
	flex: 1;
	position: relative;
	max-width: 100%;
	cursor: pointer;
}

.vac-room-item {
	border-radius: 8px;
	align-items: center;
	display: flex;
	flex: 1 1 100%;
	margin-bottom: 5px;
	padding: 0 14px;
	position: relative;
	min-height: 71px;

	&:hover {
		background: var(--chat-sidemenu-bg-color-hover);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	&:not(:hover) {
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}
}

.vac-room-selected {
	color: var(--chat-sidemenu-color-active) !important;
	background: var(--chat-sidemenu-bg-color-active) !important;
	box-shadow:var(--navigation-sidebar-btn-selected-border);


	&:hover {
		background: var(--chat-sidemenu-bg-color-active) !important;
	}
}

.vac-name-container {
	flex: 1;
}

.vac-title-container {
	display: flex;
	align-items: center;
	line-height: 25px;
}

.vac-text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.vac-room-name {
	flex: 1;
	color: var(--chat-room-color-username);
	font-weight: 500;
}

.vac-text-last {
	display: flex;
	align-items: center;
	font-size: 14px;
	line-height: 20px;
	color: var(--chat-room-color-message);
}

.vac-message-new {
	color: var(--chat-room-color-username);
	font-weight: 500;
}

.vac-text-date {
	margin-left: 5px;
	font-size: 12px;
	color: var(--chat-room-color-timestamp);
}

.vac-icon-check {
	display: flex;
	vertical-align: middle;
	height: 14px;
	width: 14px;
	margin-top: -2px;
	margin-right: 2px;
}

.vac-state-circle {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background-color: var(--chat-room-color-offline);
	margin-right: 6px;
	transition: 0.3s;
}

.vac-state-online {
	background-color: var(--chat-room-color-online);
}

.vac-icon-microphone {
	height: 15px;
	width: 15px;
	vertical-align: middle;
	margin: -3px 1px 0 -2px;
	fill: var(--chat-room-color-message);
}

.message-preview-container{
  height: 20px;
	::v-deep .message-text * {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.vac-room-options-container {
	display: flex;
	margin-left: auto;
}

.vac-room-badge {
	height: 8px;
  width: 28px;
  min-width: 8px;
  margin-left: 20px;

}

.vac-list-room-options {
	height: 19px;
	width: 19px;
	align-items: center;
	margin-left: 5px;
}

@media only screen and (max-width: 768px) {
	.vac-box-search {
		height: 58px;
	}

	.vac-room-item {
		min-height: 60px;
		padding: 0 8px;
	}
}

.ps {
  height: 100%;
}
</style>
