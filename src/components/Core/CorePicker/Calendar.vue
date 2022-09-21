<template>
	<div
		:id="`Calendar${uniqueId}`"
		ref="Calendar"
		class="calendar maz-position-relative maz-mw-100 maz-overflow-hidden maz-flex"
		:class="{
      'is-range': isRangeMode
    }"
	>
		<CalendarRangeShortcuts
			v-if="hasShortcuts"
			ref="CalendarRangeShorts"
			:shortcuts="shortcuts"
			:value="shortcut"
			:color="color"
			:height="contentHeight"
			@change-range="$emit('input', $event)"
		/>
		<div
			v-if="hasDate"
			ref="MonthsContainer"
			class="calendar__months-container maz-overflow-hidden maz-flex-1"
		>
			<CalendarMonthYearSwitcher
				:months="months"
				class="maz-px-2"
				@change-month="changeMonth"
				@open-month-year-selector="yearMonthSelectorMode = $event"
			/>
			<div class="maz-flex maz-overflow-x-auto">
				<div
					v-for="(month, i) in months"
					:key="`month-${i}`"
					class="calendar__months maz-flex-1"
					style="min-width: 268px;"
					:class="{
            'has-double maz-border-top maz-border-top-solid maz-border-color': hasDouble
          }"
				>
					<CalendarWeekDaysLabels :locale="locale" class="maz-p-2" />
					<CalendarMonthPicker
						ref="CalendarMonthPicker"
						v-model="dateMoment"
						:month="month"
						:format="format"
						:min-date="minDate"
						:max-date="maxDate"
						:has-keyboard="hasKeyboard"
						:has-double="hasDouble"
						:no-weekends-days="noWeekendsDays"
						:disabled-dates="disabledDates"
						:disabled-weekly="disabledWeekly"
						:color="color"
						:hoverred-day="hoverredDay"
						:is-visible="isVisible"
						class="maz-p-2"
						@change-month="changeMonth"
						@hoverred-day="hoverredDay = $event"
					/>
				</div>
			</div>
			<CalendarYearMonthSelector
				v-if="months.length"
				v-model="yearMonthSelectorMode"
				:month="months[0]"
				:color="color"
				:has-double="hasDouble"
				@change-month-year="changeMonthYear"
			/>
		</div>
		<CalendarTimePicker
			v-if="hasTime"
			v-model="dateMoment"
			:format="format"
			:height="contentHeight"
			:min-date="minDate"
			:max-date="maxDate"
			:has-date="hasDate"
			:color="color"
			:minute-interval="minuteInterval"
			:disabled-hours="disabledHours"
		/>
	</div>
</template>

<script lang="ts">
	import {Vue, Component, Prop, Watch} from "vue-property-decorator";
	import CalendarWeekDaysLabels from "./CalendarWeekDaysLabels.vue";
	import CalendarMonthPicker from "./CalendarMonthPicker.vue";
	import CalendarMonthYearSwitcher from "./CalendarMonthYearSwitcher.vue";
	import CalendarYearMonthSelector from "./CalendarYearMonthSelector.vue";
	import CalendarRangeShortcuts from "./CalendarRangeShortcuts.vue";
	import CalendarTimePicker from "./CalendarTimePicker.vue";
	import Month from "@/utils/corepicker";
	import uniqueId from "@/mixins/uniqueId";

	import moment from "moment";

	const CONTENT_HEIGHT = 275;

	type ValueChange = {end: any, start: any};
	type MonthValueChange = {
		month: () => any
	};

	type YearValueChange = {
		year: () => any
	};

	type PayLoad = {
		month: any
		year: any
	};

	@Component({
		name: "Calendar",
		components: {
			CalendarWeekDaysLabels,
			CalendarMonthPicker,
			CalendarMonthYearSwitcher,
			CalendarYearMonthSelector,
			CalendarRangeShortcuts,
			CalendarTimePicker
		},
		mixins: [uniqueId]
	})
	export default class Calendar extends Vue {

		//props
		@Prop({type: Object, default: null}) value!: any;
		@Prop({type: String, default: null}) format!: string;
		@Prop({type: String, default: null}) shortcut!: string;
		@Prop({type: String, default: null}) locale!: string;
		@Prop({type: String, default: null}) color!: string;
		@Prop({type: String, default: null}) minDate!: string;
		@Prop({type: String, default: null}) maxDate!: string;
		@Prop({type: Boolean, default: false}) noWeekendsDays!: boolean;
		@Prop({type: Array, required: true}) disabledDates!: any[];
		@Prop({type: Array, required: true}) disabledWeekly!: any[];
		@Prop({type: Boolean, default: false}) isVisible!: boolean;
		@Prop({type: Boolean, required: true}) hasDouble!: boolean;
		@Prop({type: Boolean, required: true}) hasKeyboard!: boolean;
		@Prop({type: Array, default: null}) shortcuts!: any[];
		@Prop({type: Boolean, required: true}) hasShortcuts!: boolean;
		@Prop({type: Boolean, required: true}) hasTime!: boolean;
		@Prop({type: Boolean, required: true}) hasDate!: boolean;
		@Prop({type: Number, required: true}) minuteInterval!: number;
		@Prop({type: Array, required: true}) disabledHours!: any[];

		//data

		months: any[] = [];
		yearMonthSelectorMode = null;
		hoverredDay = null;
		contentHeight = CONTENT_HEIGHT;

		//Watchers

		@Watch("value", {immediate: true})
		onValueChanged(
			newValue: ValueChange,
			oldValue: ValueChange
		): void {
			const newCurrentValue =
				this.isRangeMode && newValue ? newValue.end || newValue.start : newValue;
			const oldCurrentValue =
				this.isRangeMode && oldValue ? oldValue.end || oldValue.start : oldValue;

			if (
				!this.months.length ||
				this.isDifferentYear(newCurrentValue, oldCurrentValue) ||
				(this.monthsAreDifferent(newCurrentValue, oldCurrentValue) &&
					!this.valueIsInMonths(newCurrentValue.month()))
			) {
				this.updateMonth();
			}
		}

		@Watch("month", {immediate: true})
		async onMonthChanged(): Promise<void> {
			this.contentHeight = CONTENT_HEIGHT;
			await this.$nextTick();
			const {MonthsContainer} = this.$refs;
			this.contentHeight = (MonthsContainer as Element).clientHeight ?? CONTENT_HEIGHT;
		}

		@Watch("locale", {immediate: true})
		onLocaleChanged(): void {
			this.updateMonth();
		}

		// getters/setters/methods

		get dateMoment(): any {
			return this.value;
		}
		set dateMoment(value) {
			this.$emit("input", value);
		}

		get isRangeMode(): boolean {
			return !!this.value && Object.keys(this.value).includes("start");
		}

		get currentValue(): moment.Moment {
			const {value} = this;
			if (this.isRangeMode) {
				return value.end || value.start || moment();
			}
			return value || moment();
		}
		updateMonth(): void {
			const {value} = this;
			const currentYear = this.currentValue.year();
			const currentMonth = this.currentValue.month();
			const hasRangeValuesOnDifferentsMonths =
				value &&
				value.start &&
				value.end &&
				value.start.month() !== value.end.month();
			this.months = this.getMonths({
				year: currentYear,
				month: hasRangeValuesOnDifferentsMonths ? currentMonth - 1 : currentMonth
			});
		}
		monthsAreDifferent(newValue: MonthValueChange, oldValue: MonthValueChange): boolean {
			if (!newValue || !oldValue) return false;
			return newValue.month() !== oldValue.month();
		}
		valueIsInMonths(newMonth: any): boolean {
			return this.months.some((m: Month) => m.month === newMonth);
		}
		isDifferentYear(newCurrentValue: YearValueChange, oldCurrentValue: YearValueChange): boolean {
			if (!newCurrentValue || !oldCurrentValue) return false;
			return newCurrentValue.year() !== oldCurrentValue.year();
		}
		changeMonth(val: string): void {
			let month = this.months[0].month + (val === "prev" ? -1 : +1);
			let year = this.months[0].year;
			if (month > 11 || month < 0) {
				year += val === "prev" ? -1 : +1;
				month = val === "prev" ? 11 : 0;
			}
			this.months = this.getMonths({year, month});
		}
		changeMonthYear(payload: PayLoad): void {
			this.months = this.getMonths(payload);
		}
		getMonths({month, year}): Array<number | Month> {
			const numberOfMonths = Array.from(Array(this.hasDouble ? 2 : 1).keys());
			return numberOfMonths.map(i => {
				const newMonthNumber = month + i;
				const monthNumber = newMonthNumber === 12 ? 0 : newMonthNumber;
				const yearNumber = newMonthNumber === 12 ? year + 1 : year;
				return new Month(monthNumber, yearNumber, this.locale);
			});
		}
	}
</script>
