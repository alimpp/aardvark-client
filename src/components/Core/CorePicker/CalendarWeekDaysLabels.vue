<template>
	<div class="week-days-labels">
		<div
			v-for="(days, i) in weekDays"
			:key="i"
			class="week-days-labels__days maz-text-muted"
		>{{ days }}</div>
	</div>
</template>

<script lang="ts">
	import {Vue, Component, Prop} from "vue-property-decorator";
	import {getWeekDays} from "@/utils/corepicker";

	@Component({
		name: "CalendarWeekDaysLabels"
	})
	export default class CalendarWeekDaysLabels extends Vue {
		@Prop({type: String, default: null}) locale!: string;

		get weekDays(): string[] {
			return getWeekDays(this.locale);
		}
	}
</script>

<style lang="scss" scoped>
	.week-days-labels {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-gap: 10px;
		justify-items: center;
		font-size: 0.786rem;
	}
</style>
