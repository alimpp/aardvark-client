import DirectDM from '@/datamodels/directDM';
import store, {ApplicationDSModule, BadgeCountCSModule, PeopleChatCSModule, DirectDSModule, PeopleRoomsCSModule} from '@/store';
import {utcToUnix} from '@/utils/date';
import { sumBy } from 'lodash';
import {VuexModule, Mutation, Action, Module} from 'vuex-module-decorators'
import {ModuleName} from '../datastore/applicationDS';
import {MessageDS} from '../datastore/messageDS';

@Module({name: "peopleroomscs", namespaced: true})
export class PeopleRoomsCS extends VuexModule {
	isSidebarOpen = true;
	directs: DirectDM[] = []

	get rooms() {
		return this.directs.sort((a, b) => {

			// Sort by direct latest message, or by direct created at.
			if (a.latestMessage !== null) {
				if (b.latestMessage === null) return -1
				if (
					Number(utcToUnix(`${a.latestMessage?.createdAt}`)) >
					Number(utcToUnix(`${b.latestMessage?.createdAt}`))
				)
					return -1
				if (
					Number(utcToUnix(`${a.latestMessage?.createdAt}`)) <
					Number(utcToUnix(`${b.latestMessage?.createdAt}`))
				)
					return 1
			} else {
				if (b.latestMessage !== null) return 1
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
	setDirects(directs: DirectDM[]): void {
		directs.forEach(direct => {
			const index = this.directs.findIndex(cachedDirect => cachedDirect.id === direct.id)
			if (index === -1) {
				this.directs.push(direct)
			} else {
				if (ApplicationDSModule.selectedPeopleChatRoomID === direct.id && ApplicationDSModule.selectedModule === ModuleName.people) direct.unreadCount = 0;
				this.directs.splice(index, 1, direct);
			}
		})
	}

	@Action({rawError: true})
	onInitialization(): void {
		store.watch(
			function stateToWatch(state, getter) {
				return getter['directds/itemsAsArray'] as DirectDM[]
			},
			function onChange(directs) {
				PeopleRoomsCSModule.updateDirectsFromCache(directs);
			}
		)
	}

	@Action({rawError: true})
	async updateDirectsFromCache(directs?: DirectDM[]) {
		this.setDirects(directs || DirectDSModule.itemsAsArray);
	}

	@Action({rawError: true})
	async resetUnreadCount(direct: DirectDM) {
		// TODO: We need to make sure we never set it as a negative value.
		if (direct.unreadCount) BadgeCountCSModule.setPeopleUnread(BadgeCountCSModule.peopleUnread - direct.unreadCount)
		direct.unreadCount = 0
		DirectDSModule.addOrReplaceItem(direct)
	}

	@Action({rawError: true})
	async updateRoomId(roomID: number) {
		ApplicationDSModule.setSelectedPeopleChatRoomID(roomID);
		ApplicationDSModule.setSelectedMediaRoomID(roomID);
		ApplicationDSModule.setSelectedDocumentRoomID(roomID);
		ApplicationDSModule.setSelectedLinkRoomID(roomID);
		PeopleChatCSModule.updateMessagesFromCache({roomID, messages: MessageDS[roomID]});
		PeopleChatCSModule.updateLatestSeenMessageId(roomID);
	}

	@Action({rawError: true})
	updateSidebarOpen(value: boolean) {
		this.setSidebarOpen(value)
	}

	@Action({rawError: true})
	async create(userReferenceId: number) {
		return await DirectDSModule.create(userReferenceId)
	}

	@Action({rawError: true})
	async fetch(data: {skip: number, take: number, unreadCount: boolean}) {
		return await DirectDSModule.fetch(data)
	}

	@Action({ rawError: true })
	async syncPeopleNotifcationCounts(directs: DirectDM[]) {
		if (directs?.length === 0) return;
		const totalUnreadCounts = sumBy(directs, 'unreadCount');
		if (totalUnreadCounts && totalUnreadCounts > BadgeCountCSModule.peopleUnread) {
			BadgeCountCSModule.loadMessages();
		}
	}

	@Action({rawError: true})
	async load() {
		const directs = await DirectDSModule.doLoad();
		this.syncPeopleNotifcationCounts(directs);
		this.setDirects(directs);
	}
}
