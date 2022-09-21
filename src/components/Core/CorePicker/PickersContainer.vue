<template>
	<div class="pickers-container maz-elevation" :class="[position, {inline: inline}]" tabindex="-1">
		<HeaderPicker
			v-if="hasHeader"
			:value="dateMoment"
			:locale="locale"
			:has-time="hasTime"
			:has-date="hasDate"
			:format="format"
			:color="color"
		/>
		<Calendar
			v-model="dateMoment"
			:format="format"
			:locale="locale"
			:color="color"
			:shortcut="shortcut"
			:min-date="minDate"
			:max-date="maxDate"
			:minute-interval="minuteInterval"
			:no-weekends-days="noWeekendsDays"
			:disabled-dates="disabledDates"
			:disabled-weekly="disabledWeekly"
			:is-visible="isVisible"
			:has-double="hasDouble"
			:shortcuts="shortcuts"
			:has-keyboard="hasKeyboard"
			:has-time="hasTime"
			:has-date="hasDate"
			:has-shortcuts="hasShortcuts"
			:disabled-hours="disabledHours"
		/>
		<FooterPicker
			v-if="hasFooter"
			:color="color"
			:value="dateMoment"
			:has-validate="hasValidate"
			:has-now="hasNow"
			:now-translation="nowTranslation"
		/>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop} from "vue-property-decorator";
	import HeaderPicker from "./HeaderPicker.vue";
	import Calendar from "./Calendar.vue";
	import FooterPicker from "./FooterPicker.vue";

	@Component({
		name: "PickersContainer",
		components: {HeaderPicker, Calendar, FooterPicker}
	})
	export default class PickersContainer extends Vue {
		@Prop({type: Object, default: null}) value!: any;
		@Prop({type: String, default: null}) format!: string;
		@Prop({type: String, default: null}) shortcut!: string;
		@Prop({type: String, default: null}) locale!: string;
		@Prop({type: String, required: true}) position!: string;
		@Prop({type: String, required: true}) color!: string;
		@Prop({type: Boolean, required: true}) hasHeader!: boolean;
		@Prop({type: Boolean, required: true}) hasFooter!: boolean;
		@Prop({type: Boolean, required: true}) hasValidate!: boolean;
		@Prop({type: Boolean, required: true}) hasNow!: boolean;
		@Prop({type: String, required: true}) nowTranslation!: string;
		@Prop({type: String, default: null}) minDate!: string;
		@Prop({type: String, default: null}) maxDate!: string;
		@Prop({type: Boolean, default: false}) noWeekendsDays!: boolean;
		@Prop({type: Boolean, default: false}) autoClose!: boolean;
		@Prop({type: Boolean, default: false}) inline!: boolean;
		@Prop({type: Boolean, default: false}) isVisible!: boolean;
		@Prop({type: Array, required: true}) disabledDates!: any[];
		@Prop({type: Array, required: true}) disabledWeekly!: any[];
		@Prop({type: Boolean, required: true}) hasDouble!: boolean;
		@Prop({type: Boolean, required: true}) hasKeyboard!: boolean;
		@Prop({type: Boolean, required: true}) hasTime!: boolean;
		@Prop({type: Boolean, required: true}) hasDate!: boolean;
		@Prop({type: Array, default: null}) shortcuts!: any[];
		@Prop({type: Boolean, required: true}) hasShortcuts!: boolean;
		@Prop({type: Number, required: true}) minuteInterval!: number;
		@Prop({type: Array, required: true}) disabledHours!: any[];

		get dateMoment(): any {
			return this.value;
		}
		
		set dateMoment(value: any) {
			this.$emit("input", value);
		}
	
	}
</script>

<style lang="scss" scoped>
	@import "src/assets/scss/variables";

	.pickers-container {
		background-color: $core-picker-bg-color;
		border-radius: $core-picker-border-radius;
		overflow: hidden;
		z-index: 9;
		outline: none;

		$this: &;

		&:not(.inline) {
			position: absolute;
			top: 100%;
			left: 0;

			&.top {
				top: inherit;
				bottom: 100%;
			}

			&.right {
				left: inherit;
				right: 0;
			}
		}
	}

	.maz-is-dark.pickers-container,
	.maz-is-dark .pickers-container {
		background-color: $core-picker-bg-color-dark-light;
	}

	@media only screen and (max-width: $core-picker-breakpoint-tablet) {
		.pickers-container:not(.inline),
		.pickers-container:not(.inline).top,
		.pickers-container:not(.inline).right {
			max-width: calc(100% - 20px);
			width: calc(100% - 20px);
			display: flex;
			flex-direction: column;
			z-index: 100;
			max-height: calc(100vh - 20px);

			.header-picker {
				&__close {
					display: block;
					position: absolute;
					top: 4px;
					right: 4px;
				}

				&__time {
					width: auto;
				}
			}

			.calendar {
				&:not(.is-range) {
					flex-direction: column;
				}
				// flex: 1;

				&__months-container {
					flex: none;
				}

				.time-picker {
					width: 100%;
					max-width: 100%;
					border-left-width: 0;
					border-top-width: $core-picker-border-width;
					border-top-style: solid;
					border-color: $core-picker-border-color;
					flex: none;
					height: 150px !important;
				}
			}
		}
	}
</style>
