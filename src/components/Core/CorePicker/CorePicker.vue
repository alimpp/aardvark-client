<template>
	<div
		:id="uniqueId"
		ref="CorePicker"
		class="maz-base-component maz-picker"
		:class="[{
      'maz-is-dark': dark
    }, `maz-picker--${color}`]"
		v-click-outside="vcoConfig"
	>
		<CoreInput
			v-if="!inline"
			:id="uniqueId"
			v-model="inputValue"
			v-bind="$attrs"
			:placeholder="placeholder"
			readonly
			:color="color"
			:focus="hasPickerOpen"
			@click="togglePicker"
			v-on="{
				...$listeners
			}"
		>
			<!-- Custom left icon -->
			<slot slot="icon-left" name="icon-left" />
			<div slot="icon-right" class="maz-picker__arrow maz-flex maz-flex-center" tabindex="-1">
				<!-- The arrow icon -->
				<slot name="arrow">
					<!-- Default arrow svg `<ArrowIcon />` -->
					<ArrowIcon :orientation="hasPickerOpen ? 'up': ''" :class="isDarkMode" />
				</slot>
			</div>
		</CoreInput>

		<button v-if="hasOverlay" tabindex="-1" class="maz-picker__overlay" @click="closePicker" />

		<transition :name="pickerTransition">
			<PickersContainer
				v-if="hasPickerOpen"
				ref="PickersContainer"
				v-model="dateMoment"
				:locale="locale"
				:position="calcPosition"
				:format="format"
				:has-header="hasHeader"
				:has-footer="hasFooter"
				:has-validate="hasValidate"
				:has-double="hasDouble"
				:has-keyboard="hasKeyboard"
				:has-now="hasNow"
				:has-time="hasTime"
				:has-date="hasDate"
				:is-visible="hasPickerOpen"
				:minute-interval="minuteInterval"
				:now-translation="nowTranslation"
				:min-date="minDate"
				:max-date="maxDate"
				:no-weekends-days="noWeekendsDays"
				:disabled-dates="disabledDatesMoment"
				:disabled-weekly="disabledWeekly"
				:auto-close="autoClose"
				:shortcuts="shortcuts"
				:shortcut="shortcut"
				:has-shortcuts="hasShortcuts"
				:disabled-hours="disabledHours"
				:inline="inline"
				:color="color"
			/>
		</transition>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import PickersContainer from './PickersContainer.vue';
	import uniqueId from "@/mixins/uniqueId";
	import ArrowIcon from '@/components/Core/ArrowIcon.vue';
	import CoreInput from '@/components/Core/CoreInput.vue';
	import { ProfileDSModule } from "@/store";
	import vClickOutside from "v-click-outside";
	import moment from 'moment';
	import {
		getDefaultLocale,
		EventBus,
		checkIfTargetIsAllowedToCloseComponent,
		hasDateBetweenMinMaxDate,
		forceUpdateComputedData,
		getDateMoment,
		getFormattedValue
	} from '@/utils/corepicker';

	const NOT_ALLOWED_CLASSES_TO_CLOSE = [
		['year-month-selector__btn'],
		['year-month-selector__close']
	];

	const DOUBLE_PICKER_HEIGHT = 435;
	const PICKER_HEIGHT = 386;
	const HEADER_HEIGHT = 57;
	const FOOTER_HEIGHT = 54;


	@Component({
		name: "CorePicker",
		components: {
			PickersContainer,
			ArrowIcon,
			CoreInput
		},
		directives: {
			clickOutside: vClickOutside.directive
		},
		mixins: [uniqueId]
	})
	export default class CorePicker extends Vue {
		@Prop({ validator: prop => ['string', 'object'].includes(typeof prop) || prop === null, default: null }) value!: any;
		@Prop({ type: Boolean, default: false }) open!: boolean;
		@Prop({ type: String, default: null }) position!: string;
		@Prop({ type: String, default: 'YYYY-MM-DD h:mm a' }) format!: string;
		@Prop({ type: String, default: 'llll' }) formatted!: string;
		@Prop({ type: String, default: null }) minDate!: string;
		@Prop({ type: String, default: null }) maxDate!: string;
		@Prop({ type: Boolean, default: false }) dark!: boolean;
		@Prop({ type: Boolean, default: false }) persistent!: boolean;
		@Prop({ type: Boolean, default: false }) noHeader!: boolean;
		@Prop({ type: Boolean, default: false }) noFooter!: boolean;
		@Prop({ type: Boolean, default: false }) noNow!: boolean;
		@Prop({ type: String, default: 'Now' }) nowTranslation!: string;
		@Prop({ type: Boolean, default: false }) noWeekendsDays!: boolean;
		@Prop({ type: Boolean, default: false }) autoClose!: boolean;
		@Prop({ type: Boolean, default: false }) inline!: boolean;
		@Prop({ type: Array, default: Array }) disabledDates!: any[];
		@Prop({ type: Array, default: Array }) disabledWeekly!: any[];
		@Prop({ type: Boolean, default: false }) double!: boolean;
		@Prop({ type: Boolean, default: false }) range!: boolean;
		@Prop({ type: String, default: 'Select date time' }) placeholder!: string;
		@Prop({ type: Boolean, default: false }) noKeyboard!: boolean;
		@Prop({ type: Boolean, default: false }) noTime!: boolean;
		@Prop({ type: Boolean, default: false }) noDate!: boolean;
		@Prop({ type: Number, default: 1 }) minuteInterval!: number;
		@Prop({ type: Array, default: Array }) disabledHours!: any[];
		@Prop({ type: Boolean, default: false }) noOverlay!: boolean;
		@Prop({ type: String, default: null }) shortcut!: string;
		@Prop({ type: Boolean, default: false }) noShortcuts!: boolean;
		@Prop({ type: String, default: 'primary' }) color!: string;
		@Prop({ type: Array, default: () => ([
			{ key: 'thisWeek', label: 'This week', value: 'isoWeek' },
      { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
      { key: 'last7Days', label: 'Last 7 days', value: 7 },
      { key: 'last30Days', label: 'Last 30 days', value: 30 },
      { key: 'thisMonth', label: 'This month', value: 'month' },
      { key: 'lastMonth', label: 'Last month', value: '-month' },
      { key: 'thisYear', label: 'This year', value: 'year' },
      { key: 'lastYear', label: 'Last year', value: '-year' }
		]) }) shortcuts!: any[];
		@Prop({ validator: prop => ['string'].includes(typeof prop) || prop === null, default: getDefaultLocale() }) locale!: string;

		isOpen = false;
		calcPosition = 'bottom left';
		update = false;

		@Watch('minDate')
		onMinDateChange(value: string) {
			const valueDate = moment(this.value);
			if(valueDate.isAfter(moment(value))) return;
			this.checkAndUpdateValue(valueDate);
		}
		@Watch('locale', { immediate: true })
		onLocaleChanged(locale?: any): void {
			moment.locale(locale);
			this.update = !this.update;
		}
		@Watch('hasPickerOpen', { immediate: true })
		async onPickerOpened(value?: 'up' | null | 'down') {
			const verticalPosition = await this.getVerticalPosition();
			if (value) this.calcPosition = this.position || `${verticalPosition} left`;
		}
		mounted(): void {
			['validate', 'now', 'close'].forEach(c => this._eventBusEmitter(c));
		}
		private _eventBusEmitter(event: string): void {
			switch (event) {
				case 'validate':
					EventBus.$on('validate', () => {
						this.closePicker();
						this.$emit('validate');
					});
					break;
				case 'now':
					EventBus.$on('now', () => {
						this.emitValue(moment());
						this.$emit('now');
					});
					break;
				case 'close':
					EventBus.$on('close', () => { this.closePicker(); });
					break;
				default:
					break;
			}
		}
		beforeDestroy(): void {
			EventBus.$off('validate');
			EventBus.$off('now');
			EventBus.$off('close');
			this.$emit('destroy');
		}
		get isDarkMode() {
			return ProfileDSModule.isDarkMode ? 'core-picker-arrow-dark' : 'core-picker-arrow';
		}
		get inputValue() {
			forceUpdateComputedData(this?.update);
			return getFormattedValue(this?.value, this?.format, this?.formatted, this?.range)?.capitalize() ?? '';
		}
		set inputValue(value) {
			this.emitValue(value);
		}
		get dateMoment() {
			forceUpdateComputedData(this.update);
			return getDateMoment(this.value, this.format, this.range);
		}
		set dateMoment(value) {
			this.emitValue(value);
		}
		get minDateDay() {
			return this.minDate ? moment(this.minDate, this.format).startOf('day') : null;
		}
		get maxDateDay() {
			return this.maxDate ? moment(this.maxDate, this.format).endOf('day') : null;
		}
		get hasPickerOpen(): boolean {
			return this.isOpen || this.open || this.inline;
		}
		set hasPickerOpen(value: boolean ) {
			this.isOpen =value;
		}

		get pickerTransition() {
			return this.calcPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert';
		}
		get hasHeader() {
			return !this.noHeader;
		}
		get hasFooter() {
			return !this.noFooter && (this.hasValidate || this.hasNow);
		}
		get hasValidate() {
			return !this.inline && !this.autoClose;
		}
		get hasNow() {
			return !this.noNow && !this.range;
		}
		get hasKeyboard() {
			return !this.noKeyboard && !this.hasDouble;
		}
		get disabledDatesMoment() {
			return this.disabledDates.map(d => moment(d, this.format));
		}
		get hasDouble() {
			return this.double;
		}
		get hasTime() {
			return !this.noTime && !this.range;
		}
		get hasDate() {
			return !this.noDate;
		}
		get hasShortcuts() {
			return !this.noShortcuts && this.range;
		}
		get hasOverlay() {
			return !this.noOverlay && this.hasPickerOpen && !this.inline;
		}
    get vcoConfig() {
      return {
        handler: this.closePicker,
        events: ["click"],
        isActive: this.hasPickerOpen
      };
    }
		checkAndUpdateValue(value) {
			const { minDateDay, maxDateDay, range } = this;
			if (value && (minDateDay || maxDateDay)) {
				if (range) return;

				const { isBefore, isAfter } = hasDateBetweenMinMaxDate(
					value,
					minDateDay,
					maxDateDay,
					range
				);
				if (isAfter) this.emitValue(this.maxDateDay);
				if (isBefore) this.emitValue(this.minDateDay);
			}
			this.emitFormatted(value);
		}
		emitValue(value): void {
			let valueToSend;
			const { range, autoClose, closePicker, format } = this;

			if (range) {
				if (value) {
					const { start, end } = value;
					valueToSend = {
						start: start?.format(format) ?? null,
						end: end?.format(format) ?? null
					};
				} else {
					valueToSend = null;
				}
			} else {
				valueToSend = value?.format(format) ?? null;
			}

			const sameHaseCurrentValue = valueToSend === this.value;
			if (sameHaseCurrentValue) {
				closePicker();
				return;
			}

			if (autoClose && !range && this.isOpen) closePicker();
			if (autoClose && range && value.start && value.end) closePicker();

			// return the date value (in `@input` or `v-model`)
			// @arg date formatted with "format" option
			this.$emit('input', valueToSend);
		}
		emitFormatted(value: any): void {
			if (this.value) {
				// return the date value (in `@formatted` event)
				// @arg date formatted with "formatted" option
				this.$emit('formatted', getFormattedValue(value, this.format, this.formatted, this.range));
			}
		}
		togglePicker() {
			if(!this.isOpen){
				this.openPicker()
			}else {
				this.closePicker()
			}
			
		}
		openPicker(): void {
			this.isOpen = true;
			this.hasPickerOpen = true;
			// emitted when the input is focused
			this.$emit('focus')
			// emitted when picker is shown
			this.$emit('is-shown')
		}
		closePicker(e?: FocusEvent): void {
			if (e && this.$el.contains(e.relatedTarget as Node) || checkIfTargetIsAllowedToCloseComponent(NOT_ALLOWED_CLASSES_TO_CLOSE, e?.target)) return;
			this.isOpen = false;
			this.hasPickerOpen = false;
			// emit when picker is hide
			this.$emit('is-hidden');
			this.$emit('blur');
		}
		async getVerticalPosition(): Promise<"top"|"bottom"> {
			if (typeof window === 'undefined') return 'top';
			await this.$nextTick();

			const parentRect = (this.$refs.CorePicker as Element)?.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			let datePickerHeight = this.hasDouble ? DOUBLE_PICKER_HEIGHT : PICKER_HEIGHT;

			datePickerHeight = this.noFooter ? datePickerHeight - HEADER_HEIGHT : datePickerHeight;
			datePickerHeight = this.noHeader ? datePickerHeight - FOOTER_HEIGHT : datePickerHeight;
			if (parentRect?.top < datePickerHeight) {
				// No place on top --> bottom
				return 'bottom';
			} else if (windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0) {
				// Have place on bottom --> bottom
				return 'bottom';
			} else {
				// No place on bottom --> top
				return 'top';
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "src/assets/scss/variables";

	.maz-picker {
		position: relative;
		font-weight: 300;

		.maz-picker__arrow {
			color: $core-picker-input-icon-color;
			outline: none;
			transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

			svg path.arrow {
				fill: $core-picker-input-icon-color;
			}
		}

		&__overlay {
			display: none;
		}
	}

	.maz-is-dark.maz-picker,
	.maz-is-dark .maz-picker {
		.maz-picker__arrow {
			color: $core-picker-input-icon-color;

			svg path.arrow {
				fill: $core-picker-input-icon-color;
			}
		}
	}

	::v-deep .maz-arrow-icon {
		&.core-picker-arrow {
			path.arrow {
				fill: $core-picker-input-icon-color;
			}
		}
		&.core-picker-arrow-dark {
			path.arrow {
				fill: $core-picker-input-icon-color-dark;
			}
		}
	}

	@media only screen and (max-width: $core-picker-breakpoint-tablet) {
		.maz-picker__overlay {
			display: block;
			position: fixed;
			z-index: 99;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			background-color: $core-picker-overlay-color;
			width: 100%;
			margin: 0;
			border: none;
			padding: 0;
			cursor: pointer;
		}
	}
</style>
