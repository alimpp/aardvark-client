<template>
	<div class="wrapper">
		<EmojiPicker
			@emoji="append"
			:search="search"
			:emojiTable="emojis"
		>
			<div
				class="svg-button"
				:class="{'button-reaction': hasEmojiReaction, 'disabled': disabled}"
				slot="emoji-invoker"
				slot-scope="{events: {click: clickEvent}}"
				@click.stop="clickEvent"
				@click="openEmoji">
					<i :class="['material-icons', 'user-select-none']">insert_emoticon</i>
			</div>
			<div slot="emoji-picker" slot-scope="{emojis, insert}" v-if="isEmojiOpen">
				<transition name="slide-up" appear>
					<div
						class="emoji-picker d-flex flex-column"
						:class="{'picker-reaction': hasEmojiReaction}"
						:style="{
							height: `${emojiPickerHeight}px`,
							top: hasPositionTop ? emojiPickerHeight : `${emojiPickerTop}px`,
							right: emojiPickerRight,
							display: emojiPickerTop || !hasEmojiReaction ? 'initial' : 'none'
						}"
					>
						<CoreInput v-model.lazy.trim="searchQuery" placeholder="Search" size="sm" class="p-1" noLabel autocomplete="off" clearable />
						<div v-if="!searchQuery" class="shortcuts d-flex justify-content-around align-items-center flex-row py-2">
							<div v-for="(emojiGroup, category) in filteredEmojis(emojis)" :key="category" class="shortcut" @click="navigateToCategory(category)">
								<div v-if="category === 'People'" :title="category">{{emojiGroup.smile}}</div>
								<div v-if="category === 'Nature'" :title="category">{{emojiGroup.cat}}</div>
								<div v-if="category === 'Objects'" :title="category">{{emojiGroup.memo}}</div>
								<div v-if="category === 'Places'" :title="category">{{emojiGroup.house}}</div>
								<div v-if="category === 'Symbols'" :title="category">{{emojiGroup.no_entry_sign}}</div>
							</div>
						</div>
						<CoreScrollbar class="pb-2">
						<div v-for="(emojiGroup, category) in filteredEmojis(emojis)" :key="category">
							<div :id="category" :ref="category" class="emoji-category-title my-1 ml-1 text-left">{{category}}</div>

							<div class="emojis">
								<span
									v-for="(emoji, emojiName) in emojiGroup"
									:key="emojiName"
									@click="insert({emoji, emojiName})"
									:title="emojiName"
								>
									{{ emoji }}
								</span>
							</div>
						</div>
					</CoreScrollbar>
					</div>
				</transition>
			</div>
		</EmojiPicker>
	</div>
</template>

<script lang="ts">
import EmojiPicker from 'vue-emoji-picker'
import Emojis from './Emojis'
import { Component, Prop, Vue } from "vue-property-decorator";
import CoreInput from '@/components/Core/CoreInput.vue';
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';

@Component({
  name: "ChatEmojiPicker",
  components: {EmojiPicker, CoreInput, CoreScrollbar}
})
export default class ChatEmojiPicker extends Vue {
	@Prop({required: true}) isEmojiOpen!: boolean;
	@Prop({default: true}) hasPositionTop!: boolean;
	@Prop({default: true}) hasPositionRight!: boolean;
	@Prop({default: false}) hasEmojiReaction!: boolean;
	@Prop({default: false}) disabled!: boolean;
	@Prop() roomFooterRef!: Element | null;
	readonly emojis: Readonly<typeof Emojis> = Emojis;
	searchQuery = '';
	emojiPickerHeight = 320;
	emojiPickerTop = 0;
	emojiPickerRight = '';

	get search(): string {
		return this.searchQuery.toLowerCase().split(' ').join('_');
	}

	filteredEmojis(emojis: object) {
		if('Frequently used' in emojis) delete emojis['Frequently used'];
		return emojis
	}

	append({ emoji, emojiName }: {emoji: string, emojiName: string}) {
		this.$emit('addEmoji', { icon: emoji, name: emojiName });
	}

	async openEmoji(event: PointerEvent) {
		if(event.view) {
			this.setEmojiPickerPosition(event.clientY, event.view.innerWidth, event.view.innerHeight);
			this.$emit('openEmoji', true);
		}
	}

	navigateToCategory(category: string) {
		const ref = this.$refs?.[category]?.[0] as Element;
		if(ref) ref.scrollIntoView({behavior: 'auto', block: 'start'});
	}

	async setEmojiPickerPosition(clientY: number, innerWidth: number, innerHeight: number) {
		await this.$nextTick();
		const mobileSize = innerWidth < 500 || innerHeight < 700
		if (!this.roomFooterRef) {
			if (mobileSize) this.emojiPickerRight = '0px'
			return
		}
		if (mobileSize) {
			this.emojiPickerRight = `${innerWidth / 2 - 120}px`;
			this.emojiPickerTop = 100
			this.emojiPickerHeight = innerHeight - 200
		} else {
			const roomFooterTop = this.roomFooterRef.getBoundingClientRect().top
			const pickerTopPosition = roomFooterTop - clientY > this.emojiPickerHeight - 50
			if (pickerTopPosition) this.emojiPickerTop = clientY + 10
			else this.emojiPickerTop = clientY - this.emojiPickerHeight - 10
			this.emojiPickerRight = this.hasPositionTop ? '-50px' : this.hasPositionRight ? '60px' : ''
		}
	}


}
</script>

<style lang="scss" scoped>
.svg-button{
	&.disabled{
		&::before {
			cursor: pointer;
		}
		&:hover{
			transform: none;
			opacity: unset;
		}
		i{
			color: #999;
			cursor: not-allowed;
		}
	}
}
.wrapper {
	position: relative;
	display: flex;
}
.emoji-picker {
	position: absolute;
	z-index: 9999;
	bottom: 32px;
	right: 10px;
	width: 240px;
	box-sizing: border-box;
	border-radius: 0.5rem;
	background: var(--chat-emoji-bg-color);
	box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.1),
		0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 1px rgba(0, 0, 0, 0.1);
}
.emoji-category-title{
	margin: 15px 0 8px;
	color: #b1b1b1;
	text-transform: uppercase;
	font-size: 0.8rem;
	cursor: default;

}
.shortcut{
	cursor: pointer;
}
.picker-reaction {
	position: fixed;
	top: initial;
	right: initial;
}
.emoji-picker .emojis {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.emoji-picker .emojis:after {
	content: '';
	flex: auto;
}
.emoji-picker .emojis span {
	padding: 0.2rem;
	cursor: pointer;
	border-radius: 5px;
}
.emoji-picker .emojis span:hover {
	background: var(--chat-sidemenu-bg-color-hover);
	cursor: pointer;
}
.button-reaction svg {
	height: 19px;
	width: 19px;
}
</style>