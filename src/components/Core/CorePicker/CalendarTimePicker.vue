<template>
	<div
		ref="TimePicker"
		:style="[{height: `${hasDate ? height : 150}px`}]"
		class="time-picker maz-flex maz-flex-fixed maz-flex-1"
		:class="{
      'maz-border-left maz-border-left-solid maz-border-color': hasDate
    }"
	>
		<div
			v-for="column in columns"
			:key="column.type"
			:ref="column.type"
			:class="`time-picker__column-${column.type}`"
			class="time-picker__column maz-flex-1 maz-flex maz-direction-column maz-align-center"
			@scroll="
        noScrollEvent
          ? null
          : column.type === 'hours'
          ? onScrollHours($event)
          : column.type === 'minutes'
          ? onScrollMinutes($event)
          : onScrollApms($event)
      "
		>
			<div class="before" :style="[columnPadding]" />
			<CoreBtn
				v-for="{item, disabled, value: v} in column.items"
				:key="item"
				size="mini"
				tabindex="-1"
				no-shadow
				class="time-picker__column__item maz-flex maz-flex-center maz-flex-fixed maz-bg-transparent maz-text-color maz-p-0"
				:color="color"
				:active="isActive(column.type, v)"
				:disabled="disabled"
				@click="disabled ? null : selectTime(v, column.type)"
			>{{ item }}</CoreBtn>
			<div class="after" :style="[columnPadding]" />
		</div>
	</div>
</template>

<script lang="ts">
	import {Vue, Component, Prop, Watch} from "vue-property-decorator";
	import {
		ArrayHourRange,
		ArrayMinuteRange,
		getTimeFormat,
		scrollSmoothElement,
		findNearestNumberInList,
		getValue,
	} from "@/utils/corepicker";
	import { DEBOUNCE } from "@/utils/constants";
	import {debounce} from "@/utils/debounce";
	import moment from "moment";
	import CoreBtn from "@/components/Core/CoreBtn.vue";

	const ITEM_HEIGHT = 28;
	const vm = (): (vm: any) => string => {
		return (vm: any) => [vm.disabledMinutes, vm._disabledHours].join();
	};
	const isActiveFn = (type: any, hour: number, minute: number, apm: any): any => {
		return type === "hours" ? hour : type === "minutes" ? minute : apm ? apm : null;
	};

	type TimeFormat = Array<{
		value: any
		item: string
		disabled: any
	}>;

	type APM = {
		value: string
		item: string
	};

	@Component({
		name: "CalendarTimePicker",
		components: {CoreBtn},
	})
	export default class CalendarTimePicker extends Vue {

		@Prop({type: Object, default: {}}) value!: any;
		@Prop({type: String, default: null}) format!: string;
		@Prop({type: String, default: null}) minDate!: string;
		@Prop({type: String, default: null}) maxDate!: string;
		@Prop({type: Number, required: true}) minuteInterval!: number;
		@Prop({type: Number, required: true}) height!: number;
		@Prop({type: Boolean, required: true}) hasDate!: boolean;
		@Prop({type: Array, required: true}) disabledHours!: any[];
		@Prop({type: String, default: null}) color!: string;
		$refs!: {
			[key: string]: HTMLElement
		}

		hour!: any;
		minute!: any;
		apm!: any;
		noScrollEvent = false;
		columnPadding = {};

		@Watch("value", {immediate: true})
		async onValChanged(): Promise<void> {
			if (!this.value) return;
			await this.setTime();
			await this.validateTime();
			await this.emitValue();
			await this.initPositionView();
		}
		@Watch("format", {immediate: true})
		async onFormatChanged(newValue: any, oldValue: any): Promise<void> {
			if (newValue !== oldValue) {
				this.validateFormat();
			}
		}
		@Watch("height", {immediate: true})
		async onHeightChanged(newValue: any, oldValue: any): Promise<void> {
			if (newValue === oldValue) return;
			await this.buildColumnPad();
			await this.initPositionView();
		}
		mounted(): void {
			this.$watch(vm, async() => {
				await this.emitValue();
			});
		}
		get timeFormat() {
			const hasTimeFormat = this.format?.toLowerCase().includes("h") ?? false;
			if (hasTimeFormat) {
				return getTimeFormat(this.format);
			} else throw new Error('[MazPicker]: Time format must be indicated or set "no-timer" option');
		}

		get isTwelveFormat(): boolean {
			return this.timeFormat.includes("h");
		}
		get hours(): TimeFormat {
			const {timeFormat, apm, isTwelveFormat, _disabledHours} = this;
			const twoDigit = timeFormat?.toLowerCase().includes("hh") ?? false;
			const isAfternoon = apm ? apm === "pm" || apm === "PM" : false;
			const minH = isTwelveFormat ? 1 : 0;
			const maxH = isTwelveFormat ? 12 : 23;

			return ArrayHourRange(minH, maxH, twoDigit, isAfternoon, _disabledHours);
		}
		get minutes(): TimeFormat {
			const {minuteInterval, disabledMinutes} = this;
			const twoDigit = this.timeFormat?.toLowerCase().includes("mm") ?? false;
			return ArrayMinuteRange(0, 60, twoDigit, minuteInterval, disabledMinutes);
		}
		get apms(): Array<APM> {
			const {isTwelveFormat, timeFormat} = this;
			if (!timeFormat.includes("A") && !timeFormat.includes("a")) return [];
			const upper = [
				{value: "AM", item: "AM"},
				{value: "PM", item: "PM"},
			];
			const lower = [
				{value: "am", item: "am"},
				{value: "pm", item: "pm"},
			];
			return isTwelveFormat ? (timeFormat.includes("A") ? upper : lower) : [];
		}
		get columns(): any[] {
			const {hours, minutes, apms} = this;
			return [
				{type: "hours", items: hours},
				{type: "minutes", items: minutes},
				...(apms ? [{type: "apms", items: apms}] : []),
			];
		}
		get isMinDate(): boolean {
			const {dateMoment, minDate} = this;
			return dateMoment ? dateMoment.isSame(minDate, "day") : false;
		}
		get isMaxDate(): boolean {
			const {dateMoment, maxDate} = this;
			return dateMoment ? dateMoment.isSame(maxDate, "day") : false;
		}
		get isMinHour(): boolean {
			const {dateMoment, minDate} = this;
			return dateMoment.isSame(minDate, "hour");
		}
		get isMaxHour(): boolean {
			const {dateMoment, maxDate} = this;
			return dateMoment.isSame(maxDate, "hour");
		}
		get disabledMinutes(): any[] {
			const {isMinDate, isMaxDate, isMinHour, isMaxHour, minDate, maxDate, format} = this;
			if (isMinDate && isMinHour) {
				// get min limit of minDate
				const minMinute = parseInt(moment(minDate, format).format("m"), 10);
				return Array.from({length: minMinute}, (x, i) => i);
			} else if (isMaxDate && isMaxHour) {
				// get min limit of maxDate
				const maxMinute = parseInt(moment(maxDate, format).format("m"), 10);
				return Array.from({length: maxMinute})
					.fill(null)
					.map((_, i) => 60 - i);
			}
			return [];
		}
		get _disabledHours(): any[] {
			let hoursDisabled: number[] = [];
			const {isMinDate, isMaxDate, minDate, maxDate, format, disabledHours} = this;
			if (isMinDate) {
				const minHour = parseInt(moment(minDate, format).format("H"), 10);
				hoursDisabled = Array.from({length: minHour}, (x, i) => i);
			} else if (isMaxDate) {
				const maxhour = parseInt(moment(maxDate, format).format("H"), 10);
				hoursDisabled = Array.from({length: 24 - maxhour})
					//.fill()
					.map((_, i) => 24 - i);
			}
			return [...(hoursDisabled ? hoursDisabled : []), ...disabledHours];
		}
		get dateMoment(): moment.Moment {
			return this.value || moment();
		}
		set dateMoment(value) {
			this.$emit("input", value);
		}
		setTime(): void {
			const {dateMoment, isTwelveFormat, apms} = this;
			if (!dateMoment) return;

			const hour = parseInt(dateMoment.format("H"), 10);

			// set hour value
			this.hour = isTwelveFormat && [0, 12].includes(hour) ? (hour === 0 ? 12 : 24) : hour;
			// set minute value
			this.minute = parseInt(dateMoment.format("m"), 10);

			if (isTwelveFormat)
				this.apm = this.hour > 12 && apms && apms.length > 0 ? apms[1].value : apms[0].value;
		}
		async validateTime(): Promise<void> {
			await this.$nextTick();

			const {isDisabled, getAvailableTime, hour, minute} = this;

			this.hour = isDisabled("hours", hour) ? getAvailableTime("hours", hour) : hour;

			this.minute = isDisabled("minutes", minute) ? getAvailableTime("minutes", minute) : minute;
		}
		isDisabled(type: string, value: number): boolean {
			return type === "minutes"
				? this.disabledMinutes.includes(value)
				: this._disabledHours.includes(value);
		}
		isActive(type: any, value: any) {
			const {hour, minute, apm} = this;
			return isActiveFn(type, hour, minute, apm) === value;
		}
		getAvailableTime(type: string | number, number: any) {
			const list = this[type]
				.map((i: {disabled: any, value: any}) => (!i.disabled ? i.value : null))
				.filter((i: null) => i !== null);
			return findNearestNumberInList(list, number);
		}
		onScrollHours(scroll: any) {
			debounce(DEBOUNCE.CALENDAR_TIMEPICKER_ON_SCROLL_HANDLER, async() => {
				const {apm, isTwelveFormat, initPositionView, emitValue} = this;
				const value = getValue(scroll);
				const hour = isTwelveFormat
					? (apm?.toLowerCase() ?? false) === "am"
						? value + 1
						: value + 1 + 12
					: value;
				this.hour = hour === 24 && !isTwelveFormat ? 23 : hour;
				await emitValue();
				await initPositionView("hours");
			}, 100);
		}
		onScrollMinutes(scroll: any) {
			debounce(
				DEBOUNCE.CALENDAR_TIMEPICKER_ON_SCROLL_MINUTES_HANDLER,
				async() => {
					const {minuteInterval, initPositionView, emitValue} = this;
					const value = getValue(scroll);
					const minute = value * minuteInterval;
					this.minute = minute === 60 ? 59 : minute;
					await emitValue();
					await initPositionView("minutes");
				}, 100);
		}
		onScrollApms(scroll: any) {
			debounce(
				DEBOUNCE.CALENDAR_TIMEPICKER_ON_SCROLL_APMS,
				async() => {
					const {apms, apm, hour, initPositionView, emitValue} = this;
					const value = getValue(scroll);
					if (apms && apms[value] && apm !== apms[value].value) {
						const newHour = apm === apms[1].value ? hour - 12 : hour + 12;
						this.hour = newHour;
					}
					await emitValue();
					await initPositionView("apms");
				}, 100);
		}
		async selectTime(item: any, type: "hours" | "minutes" | "apms"): Promise<void> {
			const {hour, apm, apms, initPositionView, emitValue} = this;
			if (type === "hours") {
				this.hour = item;
			} else if (type === "minutes") {
				this.minute = item;
			} else if (type === "apms" && apm !== item) {
				const apmValue = apms && apms.length > 0 && apms[1].value ? hour + 12 : hour - 12;
				const newHour = item === apmValue;
				this.hour = newHour;
			}
			await emitValue();
			await initPositionView(type);
		}
		emitValue(): void {
			const {hour: h, minute: m, format, isTwelveFormat} = this;
			const hour = isTwelveFormat && [12, 24].includes(h) ? (h === 24 ? 12 : 0) : h;
			const minute = m ? m : 0;
			this.dateMoment = moment(
				this.dateMoment.set({
					hour,
					minute,
				}),
				format
			);
		}
		validateFormat(): void {
			if (this.isTwelveFormat && !this.apms)
				throw new Error(
					`MazPicker - Format Error : To have the twelve hours format, the format must have "A" or "a" (Ex : ${this.format} a)`
				);
		}
		async buildColumnPad(): Promise<void> {
			await this.$nextTick();
			const pad = (this.$refs?.TimePicker?.clientHeight ?? 150) / 2 - ITEM_HEIGHT / 2;
			this.columnPadding = {
				height: `${pad}px`,
				flex: `0 0 ${pad}px`,
			};
		}
		async initPositionView(
			containers = this.isTwelveFormat
				? ["hours", "minutes", "apms"]
				: (["hours", "minutes"] as any)
		): Promise<void> {
			await this.$nextTick();
			if (!Array.isArray(containers)) containers = [containers];
			this.noScrollEvent = true;
			const hasSmoothEffect = true;

			containers.forEach((container) => {
				if (!this.$refs[container]) return;
				const elem = this.$refs[container][0];
				const timePickerHeight = this.$refs?.TimePicker?.clientHeight ?? null;
				scrollSmoothElement(elem, timePickerHeight, hasSmoothEffect, ITEM_HEIGHT);
			});
			window.setTimeout(() => {
				this.noScrollEvent = false;
			}, 300);
		}
	}
</script>

<style lang="scss" scoped>
	@import "src/assets/scss/variables";

	.time-picker {
		width: 160px;
		max-width: 160px;
		position: relative;
		z-index: 1;

		$item-height: 28px;

		.maz-btn {
			transition: 0ms;
		}

		&::after,
		&::before {
			content: "";
			top: calc(50% - 19px);
			position: absolute;
			height: 38px;
			z-index: -1;
			left: 0;
			right: 0;
			border-top: $core-picker-border-width solid $core-picker-border-color;
			border-bottom: $core-picker-border-width solid $core-picker-border-color;
		}

		&__column {
			position: relative;
			overflow-y: auto;
			overflow-x: hidden;

			// hide scroll bar
			overflow: -moz-scrollbars-none;
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}

			&__item {
				height: $item-height;
				width: 45px;

				&::before {
					border: none !important;
				}

				&:hover {
					color: white;
				}

				&.maz-active {
					color: white;
					font-weight: bold;
				}

				&:disabled {
					color: rgba(black, 0.25);
					background-color: transparent;
					border: none;
				}
			}
		}
	}

	@each $name, $color in $core-picker-color_types {
		.maz-picker--#{$name} {
			.time-picker__column__item {
				&:hover,
				&:focus {
					background-color: rgba($color, 0.4);
				}

				&.maz-active {
					background-color: $color;
				}
			}
		}
	}

	.maz-is-dark .time-picker,
	.maz-is-dark.time-picker {
		&::after,
		&::before {
			border-color: $core-picker-border-color-dark;
		}
	}

	@media only screen and (max-width: $core-picker-breakpoint-tablet) {
		.maz-is-dark {
			.time-picker {
				border-color: $core-picker-border-color-dark !important;
			}
		}
	}
</style>
