<template>
	<div class="month-year-switcher maz-flex maz-space-between maz-align-center maz-py-2">
		<CoreBtn
			fab
			no-shadow
			color="grey"
			size="mini"
			class="month-year-switcher__previous maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
			tabindex="-1"
			@click="changeMonth('prev')"
		>
			<ArrowIcon orientation="left" />
		</CoreBtn>
		<div class="maz-flex-1 maz-flex maz-flex-center">
			<CoreBtn
				no-shadow
				tabindex="-1"
				color="grey"
				class="maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2 maz-mr-1"
				@click="$emit('open-month-year-selector', 'month')"
			>
				<span v-for="(m, i) in months" :key="i">
					{{ m.getFormatted() }}
					<span v-if="months.length > 1 && i === 0">-&nbsp;</span>
				</span>
			</CoreBtn>
			<CoreBtn
				tabindex="-1"
				no-shadow
				color="grey"
				class="maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2"
				@click="$emit('open-month-year-selector', 'year')"
			>{{ year }}</CoreBtn>
		</div>
		<CoreBtn
			fab
			no-shadow
			color="grey"
			size="mini"
			tabindex="-1"
			class="maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
			@click="changeMonth('next')"
		>
			<ArrowIcon orientation="right" />
		</CoreBtn>
	</div>
</template>

<script lang="ts">
	import {Vue, Component, Prop} from "vue-property-decorator";
	import ArrowIcon from "@/components/Core/ArrowIcon.vue";
	import CoreBtn from "@/components/Core/CoreBtn.vue";

	@Component({
		name: "CalendarMonthYearSwitcher",
		components: {ArrowIcon, CoreBtn}
	})
	export default class CalendarMonthYearSwitcher extends Vue {
		@Prop({type: Array, required: true}) months!: any[];
		get year(): string {
			const years = this.months.map((m: {getYear: () => any}) => m.getYear());
			return Array.from(new Set(years)).join(" - ");
		}
		get isDouble(): boolean {
			return this.months && this.months.length > 1;
		}
		changeMonth(val: string): void {
			this.$emit("change-month", val);
		}
	}
</script>
