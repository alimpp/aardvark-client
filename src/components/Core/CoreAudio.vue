<template>
	<div :style="style" class="maz-bg-color-light p-2 mb-1">
		<div v-if="legend" class="core-audio-legend text-truncate">{{legend}}</div>
		<div class="core-audio-player mt-2 mb-1">

			<div class="core-audio-button" @click="playback">
				<i v-if="isPlaying" class="material-icons">pause</i>
				<i v-else class="material-icons">play_arrow</i>
			</div>

			<div
				ref="progress"
				class="core-audio-player-bar mx-3"
				@mousedown="onMouseDown"
				@mouseover="$emit('hover-audio-progress', true)"
				@mouseout="$emit('hover-audio-progress', false)"
			>
				<div class="core-audio-player-progress w-100">
					<div class="core-audio-line-container">
						<div class="core-audio-line-progress" :style="{width: `${percentage}%`}" />
						<div
							class="core-audio-line-dot"
							:class="{'core-audio-line-dot__active': isMouseDown}"
							:style="{left: `${percentage}%`}"
						/>
					</div>
				</div>
			</div>

			<audio ref="audio" :src="audioSource" @ended="onEnded" @loadeddata="onLoadedData" @timeupdate="onTimeUpdate" />
		</div>
		<div class="core-audio-progress-time ml-1">{{ progressTime }}</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";

@Component({ name: "CoreAudio" })
export default class CoreAudio extends Vue {

	@Ref('audio')
	readonly audio!: HTMLAudioElement;
	@Ref('progress')
	readonly progress!: HTMLDivElement;

	@Prop({ type: String, default: null }) src!: string;
	@Prop({default: false}) messageSelectionEnabled!: boolean;
	@Prop({type: String, default: null}) legend!: string;
	@Prop({type: Number, default: null}) width!: number;
	@Prop({type: Number, default: null}) height!: number;

	isPlaying = false;
	duration = this.convertTimeMMSS(0);
	playedTime = this.convertTimeMMSS(0);
	percentage = 0;
	isMouseDown = false;
	progressTime = '- : -';

	get style() {
		return {
			height: `${this.height}px`,
			width: `${this.width}px`,
		}
	}

	get audioSource() {
		if (this.src) return this.src
		this.resetProgress()
		return null
	}

	public convertTimeMMSS(seconds: number) {
		return new Date(seconds * 1000).toISOString().substr(14, 5)
	}

	public playback() {
		if (this.messageSelectionEnabled || !this.audioSource) return
		if (this.isPlaying) this.audio.pause()
		else window.setTimeout(() => this.audio.play())
		this.isPlaying = !this.isPlaying
	}

	public resetProgress() {
		if (this.isPlaying) this.audio.pause()
		this.duration = this.convertTimeMMSS(0)
		this.playedTime = this.convertTimeMMSS(0)
		this.percentage = 0
		this.isPlaying = false
		this.updateProgressTime()
	}

	public onTimeUpdate() {
		this.playedTime = this.convertTimeMMSS(this.audio.currentTime)
		this.percentage = (this.audio.currentTime / this.audio.duration) * 100
		this.updateProgressTime()
	}

	public onUpdateProgress(position: number) {
		if (position) this.audio.currentTime = position * this.audio.duration
	}

	public updateProgressTime() {
		this.progressTime = this.percentage > 1 ? this.playedTime : this.duration;
	}

	onMouseDown(event: MouseEvent) {
		if (this.messageSelectionEnabled) return
		this.isMouseDown = true
		const seekPosition = this.calculateLineHeadPosition(event, this.progress)
		this.onUpdateProgress(seekPosition)
		document.addEventListener('mousemove', this.onMouseMove)
		document.addEventListener('mouseup', this.onMouseUp)
	}

	onMouseUp(event: MouseEvent) {
		if (this.messageSelectionEnabled) return
		this.isMouseDown = false
		document.removeEventListener('mouseup', this.onMouseUp)
		document.removeEventListener('mousemove', this.onMouseMove)
		const seekPosition = this.calculateLineHeadPosition(event, this.progress)
		this.onUpdateProgress(seekPosition)
	}

	onMouseMove(event: MouseEvent) {
		if (this.messageSelectionEnabled) return
		const seekPosition = this.calculateLineHeadPosition(event, this.progress)
		this.onUpdateProgress(seekPosition)
	}

	calculateLineHeadPosition(event: MouseEvent, element: HTMLDivElement) {
		const progressWidth = element.getBoundingClientRect().width
		const leftPosition = element.getBoundingClientRect().left
		let pos = (event.clientX - leftPosition) / progressWidth
		pos = pos < 0 ? 0 : pos
		pos = pos > 1 ? 1 : pos
		return pos
	}

	beforeDestroy() {
		if (!this.audio.paused) {
			this.audio.pause();
		}
		this.unregisterListeners();
	}

	private unregisterListeners(): void {
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('mousedown', this.onMouseDown);
	}

	onEnded() {
		this.isPlaying = false;
	}

	onLoadedData(): void {
		this.resetProgress();
		if (this.audio) {
			this.duration = this.convertTimeMMSS(this.audio.duration);
		}
		this.updateProgressTime();
	}
}
</script>

<style lang="scss" scoped>
figure {
	margin: 0;
}

.core-audio-player {
	display: flex;

	.core-audio-button {
		cursor: pointer;
		height: 24px;
		width: 24px;
		i{
			user-select: none;
		}
	}
}

.core-audio-progress-time {
	font-size: 12px;
}
.core-audio-legend{
	font-size: 12px;
}

.core-audio-player-bar {
	display: flex;
	align-items: center;
	flex: auto;

	.core-audio-player-progress {

		.core-audio-line-container {
			position: relative;
			height: 4px;
			border-radius: 5px;
			background-color: #00000026;

			.core-audio-line-progress {
				position: absolute;
				height: inherit;
				background-color: var(--brand-color);
				border-radius: inherit;
			}

			.core-audio-line-dot {
				position: absolute;
				top: -5px;
				margin-left: -7px;
				height: 14px;
				width: 14px;
				border-radius: 50%;
				background-color: var(--brand-color);
				transition: transform 0.25s;
				user-select: none;

				&__active {
					transform: scale(1.2);
				}
			}
		}
	}
}

@media only screen and (max-width: 768px) {
	.core-audio-player-bar {
		margin-right: 5px;

		.core-audio-player-progress .core-audio-line-container {
			height: 3px;

			.core-audio-line-dot {
				height: 12px;
				width: 12px;
				top: -5px;
				margin-left: -5px;
			}
		}
	}
}

@media only screen and (max-width: 768px) {
	.core-audio-player {
		margin: 4px 0 0px;

		.core-audio-button {
			max-width: 16px;
			margin-left: 5px;
		}
	}
}
</style>