import GroupDetailDM from '@/datamodels/groupDetailDM';
import GroupDM from '@/datamodels/groupDM';
import store, {ApplicationDSModule, BadgeCountCSModule, GroupChatCSModule, GroupDetailsDSModule, GroupDSModule, GroupRoomsCSModule} from '@/store';
import {utcToUnix} from '@/utils/date';
import {Wait, WaitStates} from '@/utils/vuewait';
import { sumBy } from 'lodash';
import {VuexModule, Mutation, Action, Module} from 'vuex-module-decorators'
import {ModuleName} from '../datastore/applicationDS';
import {MessageDS} from '../datastore/messageDS';

@Module({name: "grouproomscs", namespaced: true})
export class GroupRoomsCS extends VuexModule {
	isSidebarOpen = true;
	groups: GroupDetailDM[] = [];
	currentGroupId = 0;
	searchedRooms: GroupDM[] = [];

	get rooms() {
		return this.groups.sort((a, b) => {
			if (a.recentMessageAt !== null) {
				if (b.recentMessageAt === null) return -1
				if (
					Number(utcToUnix(`${a.recentMessageAt}`)) >
					Number(utcToUnix(`${b.recentMessageAt}`))
				)
					return -1
				if (
					Number(utcToUnix(`${a.recentMessageAt}`)) <
					Number(utcToUnix(`${b.recentMessageAt}`))
				)
					return 1
			} else {
				if (b.recentMessageAt !== null) return 1
				if (Number(utcToUnix(`${a.createdAt}`)) > Number(utcToUnix(`${b.createdAt}`))) return -1
				if (Number(utcToUnix(`${a.createdAt}`)) < Number(utcToUnix(`${b.createdAt}`))) return 1
			}
			// Sort wont matter at this point.
			return 0
		})
	}

	@Mutation
	setSidebarOpen(value: boolean) {
		this.isSidebarOpen = value
	}

	@Mutation
	setCurrentGroupId(value: number) {
		this.currentGroupId = value;
	}

	@Mutation
	setSearchedRooms(value: GroupDM[]) {
		this.searchedRooms = value;
	}

	@Mutation
	setGroupsChat(groups: GroupDetailDM[]): void {
		// Remove any removed groups
		this.groups.forEach((oldGroup, oldIndex) => {
			const newGroupIds = groups.map(newGroup => newGroup.id);
			if(!newGroupIds.includes(oldGroup.id)) {
				this.groups.splice(oldIndex, 1);
			}
		});

		groups.forEach(group => {
			const index = this.groups.findIndex(cachedGroup => cachedGroup.id === group.id)
			if (index === -1) {
				this.groups.push(group)
			} else {
				if (ApplicationDSModule.selectedGroupChatRoomID === group.latestRoom?.id && ApplicationDSModule.selectedModule === ModuleName.groups) group.latestRoom.unreadCount = 0;                                                                                                                                        
				this.groups.splice(index, 1, group);
			}
		})
	}

	@Action({rawError: true})
	async clearSearchedRooms() {
		this.setSearchedRooms([]);
	}

	@Action({rawError: true})
	async join(data: {id: number, memberId: number}) {
		const {id} = data;
		await GroupDSModule.join(data);
		await GroupDetailsDSModule.fetch({take: 1, skip: 0, sort: '-recentMessageAt', filters: {id: id.toString()}});
		this.updateGroupDetailsFromCache();
	}
	
	@Action({rawError: true})
	@Wait(WaitStates.ACTION_GROUPDETAILS_SEARCHING)
	async search(query: string) {
		const groups = await GroupDSModule.search({query});
		this.setSearchedRooms(groups);
		return groups;
	}

	@Action({rawError: true})
	onInitialization(): void {
		store.watch(
			function stateToWatch(state, getter) {
				return getter['groupdetailsds/itemsAsArray'] as GroupDetailDM[]
			},
			function onChange(groups) {
				GroupRoomsCSModule.updateGroupDetailsFromCache(groups);
			}
		)
	}

	@Action({rawError: true})
	async updateGroupDetailsFromCache(groups?: GroupDetailDM[]) {
		this.setGroupsChat(groups || GroupDetailsDSModule.itemsAsArray);
	}

	@Action({rawError: true})
	resetUnreadCount(data: {group: GroupDetailDM, roomId: number}) {
		const {group, roomId} = data;
		// TODO: We need to make sure we never set it as a negative value.
		if(group.publicRoomId === roomId) {
			if (group.publicRoom?.unreadCount) BadgeCountCSModule.setGroupsUnread(BadgeCountCSModule.groupsUnread - group.publicRoom.unreadCount)
			if (group.publicRoom) group.publicRoom.unreadCount = 0;
		} else {
			if (group.privateRoom?.unreadCount) BadgeCountCSModule.setGroupsUnread(BadgeCountCSModule.groupsUnread - group.privateRoom.unreadCount)
			if (group.privateRoom) group.privateRoom.unreadCount = 0;
		}
		GroupDetailsDSModule.addOrReplaceItem(group)
	}

	@Action({rawError: true})
	updateRoomId(roomID: number) {
		ApplicationDSModule.setSelectedLinkRoomID(roomID);
		ApplicationDSModule.setSelectedDocumentRoomID(roomID);
		ApplicationDSModule.setSelectedMediaRoomID(roomID);
		ApplicationDSModule.setSelectedGroupChatRoomID(roomID);
		GroupChatCSModule.updateMessagesFromCache({roomID, messages: MessageDS[roomID]});
		GroupChatCSModule.updateLatestSeenMessageId(roomID);
	}

	@Action({rawError: true})
	updateSidebarOpen(value: boolean) {
		this.setSidebarOpen(value)
	}

	@Action({rawError: true})
	async fetch(data: {skip: number, take: number, sort: string}) {
		return await GroupDetailsDSModule.fetch(data)
	}

	@Action({ rawError: true })
	async syncChannelNotificationCounts(directs: GroupDetailDM[]) {
		if (directs?.length === 0) return;
		const totalUnreadCounts = sumBy(directs, 'unreadCount');
		if (totalUnreadCounts && totalUnreadCounts > BadgeCountCSModule.groupsUnread) {
			BadgeCountCSModule.loadMessages();
		}
	}

	@Action({rawError: true})
	async load() {
		const directs = await GroupDetailsDSModule.doLoad();
		this.syncChannelNotificationCounts(directs);
		this.setGroupsChat(GroupDetailsDSModule.itemsAsArray);
	}
}
