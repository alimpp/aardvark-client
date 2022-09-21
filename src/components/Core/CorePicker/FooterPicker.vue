<template>
	<div
		class="footer-picker maz-p-2 maz-flex maz-justify-end maz-border-top maz-border-top-solid maz-border-color"
	>
		<CoreBtn
			v-if="hasNow"
			size="mini"
			tabindex="-1"
			:color="color"
			class="footer-picker__now maz-bg-transparent maz-no-shadow maz-px-3 maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color"
			@click="now"
		>{{ nowTranslation }}</CoreBtn>
		<CoreBtn
			v-if="hasValidate"
			outline
			size="mini"
			tabindex="-1"
			:disabled="!currentValue"
			color="success"
			class="footer-picker__validate"
			@click="validate"
		>
			<i class="material-icons">check</i>
		</CoreBtn>
	</div>
</template>

<script lang="ts">
	import {Vue, Component, Prop} from "vue-property-decorator";
	import {EventBus} from '@/utils/corepicker';
	import CoreBtn from '@/components/Core/CoreBtn.vue';

	@Component({
		name: "FooterPicker",
		components: {CoreBtn}
	})
	export default class FooterPicker extends Vue {
		@Prop({type: Object, default: null}) value!: any;
		@Prop({type: Boolean, required: true}) hasValidate!: boolean;
		@Prop({type: Boolean, required: true}) hasNow!: boolean;
		@Prop({type: String, required: true}) nowTranslation!: string;
		@Prop({type: String, required: true}) color!: string;

		get isRangeMode() {
			return !!this.value && Object.keys(this.value).includes('start');
		}

		get currentValue() {
			if (this.isRangeMode) return this.value.end;
			return this.value;
		}

		validate(e: any): void {
			EventBus.$emit('validate', e);
		}

		now(e: any): void {
			EventBus.$emit('now', e);
		}

	}
	</script>

<style lang="scss" scoped>
	@import "src/assets/scss/variables";

	.footer-picker {
		&__validate {
			padding-top: 4px;
			padding-bottom: 4px;

			i.material-icons {
				font-size: 20px;
			}
		}

		> :nth-child(2) {
			margin-left: 0.5rem;
		}
	}

	@each $name, $color in $core-picker-color_types {
		.maz-picker--#{$name} {
			.footer-picker__now {
				color: $color;
			}
		}
	}
</style>
