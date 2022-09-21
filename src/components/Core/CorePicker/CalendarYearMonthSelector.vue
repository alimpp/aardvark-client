<template>
	<transition name="maz-slide">
		<div v-if="isOpen" class="year-month-selector maz-p-2 maz-flex maz-direction-column">
			<div class="maz-flex maz-justify-end maz-align-center">
				<div v-if="value === 'year'" class="maz-flex maz-align-center">
					<CoreBtn
						fab
						no-shadow
						size="mini"
						color="grey"
						class="maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
						tabindex="-1"
						@click="updateYears('prev')"
					>
						<ArrowIcon orientation="left" color="text-grey" />
					</CoreBtn>
					<CoreBtn
						fab
						no-shadow
						size="mini"
						color="grey"
						class="maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
						tabindex="-1"
						@click="updateYears('next')"
					>
						<ArrowIcon orientation="right" color="text-grey" />
					</CoreBtn>
				</div>
				<CoreBtn
					fab
					no-shadow
					size="mini"
					color="grey"
					tabindex="-1"
					class="year-month-selector__close maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
					@click="closePanel"
				>
					<i class="material-icons maz-text-color maz-fs-20">close</i>
				</CoreBtn>
			</div>
			<div class="maz-flex-1 maz-flex maz-flex-wrap maz-space-between maz-align-center maz-pt-2">
				<CoreBtn
					v-for="(m, i) in months"
					:key="i"
					:color="color"
					:active="currentMonth === i"
					:class="[
            currentMonth !== i
              ? `maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-${color}`
              : `maz-focus-${color}`,
            {'mx-3': hasDouble}
          ]"
					class="year-month-selector__btn maz-bg-transparent maz-no-shadow maz-px-3 maz-flex-20 maz-mx-1"
					tabindex="-1"
					@click="selectMonth(i)"
				>{{ m }}</CoreBtn>
				<CoreBtn
					v-for="year in years"
					:key="year"
					:color="color"
					:active="currentYear === year"
					size="md"
					tabindex="-1"
					:class="[
            currentYear !== year
              ? `maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-${color}`
              : `maz-focus-${color}`
          ]"
					class="year-month-selector__btn maz-bg-transparent maz-no-shadow"
					@click="selectYear(year)"
				>{{ year }}</CoreBtn>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import { getMonthsByFormat } from "@/utils/corepicker";
	import ArrowIcon from "@/components/Core/ArrowIcon.vue";
	import CoreBtn from "@/components/Core/CoreBtn.vue";

	const ArrayRange = (start: number, end: number) => {
		return Array(end - start + 1)
			.fill(0)
			.map((_, idx) => {
				const n = start + idx;
				return n;
			});
	};


	@Component({
		name: "CalendarYearMonthSelector",
		components: { ArrowIcon, CoreBtn }
	})
	export default class CalendarYearMonthSelector extends Vue {

		// input props

		@Prop({ type: String, default: null }) value!: string;
		@Prop({ type: String, default: null }) color!: string;
		@Prop({ type: Object, required: true }) month!: any;
		@Prop({ type: Boolean, required: true }) hasDouble!: boolean;

		//data

		years: any[] = [];
		months: any[] = [];

		//watchers/output event-emitters

		@Watch("value", { immediate: true })
		onValueChange(): void {
			this.isMonthMode ? this.getMonths() : this.getYears();
		}

		//computed - getters/setters

		get isOpen(): boolean {
			return this.value !== null;
		}
		get currentMonth(): number {
			return this.month.month;
		}
		get currentYear(): number {
			return this.month.year;
		}
		get isMonthMode(): boolean {
			return this.value === "month";
		}
		closePanel(): void {
			this.$emit("input", null);
		}
		getMonths(): void {
			this.years = [];
			this.months = getMonthsByFormat(this.hasDouble ? "MMMM" : "MMM");
		}
		getYears(offset = this.hasDouble ? 17 : 7): void {
			this.months = [];
			this.years = ArrayRange(this.month.year - offset, this.month.year + offset);
		}

		//methods

		selectMonth(monthNumber: number): void {
			this.$emit("change-month-year", {
				month: monthNumber,
				year: this.currentYear
			});
			this.closePanel();
		}
		selectYear(year: number): void {
			this.$emit("change-month-year", { month: this.currentMonth, year: year });
			this.closePanel();
		}
		updateYears(period: string): void {
			const offset = this.hasDouble ? 17 : 7;
			const offsetYears = period === "next" ? offset : -offset;
			this.years = ArrayRange(
				this.years[0] + offsetYears,
				this.years[this.years.length - 1] + offsetYears
			);
		}
	}
</script>

<style lang="scss" scoped>
	@import "src/assets/scss/variables";

	.year-month-selector {
		position: absolute;
		background-color: $core-picker-bg-color;
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
	}

	.maz-is-dark.year-month-selector,
	.maz-is-dark .year-month-selector {
		background-color: $core-picker-bg-color-dark-light;
	}
</style>
