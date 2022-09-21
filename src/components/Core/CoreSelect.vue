<template>
	<CorePopper :root-class="popperRootClass" tag="div" :disabled="disabled" disableArrow :transition="listTransition" attachTo="reference" boundarySelector="#app" trigger="clickToToggle" ref="popper" :placement="position" @created="updateTransition" @placementUpdate="onPopperPlacementUpdate" @enter="openList" @leave="closeList" :padding="0" :offset="[0,0]" :containerStyle="itemListSize" :containerClass="popperClasses" :defaultStyling="false" :excludedClasses="excludedClasses">
		<div slot="reference" class="maz-base-component maz-select" @mouseover="updateTransition"
			:class="[{
				'has-list-open': hasOpenList,
				'maz-is-dark': dark
			}, `maz-select--${color}`]"
			v-click-outside="vcoConfig">

			<div v-if="multiple" ref="SelectedTags" class="maz-select__tags maz-flex maz-align-center" :class="{'maz-left-offset': hasLeftIcon}">
				<transition-group
					ref="SelectedTagsContainer"
					tag="div"
					name="maz-tags"
					class="maz-flex maz-align-center maz-h-100"
				>
					<CoreBtn
						v-for="(option, i) in selectedOptions"
						:key="`tags-${i}`"
						class="maz-select__tag maz-flex maz-align-center"
						:disabled="disabled"
						:color="color"
						:size="size"
						@click.prevent.stop="removeOption(option[config.valueKey])">
						<span class="maz-select__tag__text">{{ option[config.labelKey][0][config.labelText]}}</span>
							<i class="maz-select__tag__clear material-icons">close</i>
					</CoreBtn>
				</transition-group>
			</div>

			<CoreInput
				ref="textField"
				:value="valueShown"
				v-bind="$attrs"
				readonly
				:no-label="hasNoLabel"
				:color="color"
				:size="size"
				:placeholder="placeholderShown"
				:disabled="disabled"
				:focus="hasOpenList"
				:loading="loading"
				@clear="emitValues(null)"
				@keydown.prevent="search ? null : keyboardNav($event)"
				@keyup="$emit('keyup', $event)"
				@change="$emit('change', $event)"
				@input="$emit('input', $event)">
				<!-- custom left icon -->
				<slot slot="icon-left" name="icon-left" />
				<div slot="icon-right" class="maz-select__toggle" tabindex="-1">
					<!-- The arrow icon -->
					<slot name="arrow">
						<!-- the arrow svg -->
						<svg
							mlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="maz-select__toggle__arrow"
						>
							<path class="arrow" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
							<path fill="none" d="M0 0h24v24H0V0z" />
						</svg>
					</slot>
				</div>
			</CoreInput>
		</div>

		<div slot="popper" class="maz-select__options-list position-relative maz-flex maz-direction-column" :style="[itemListSize]">
			<CoreInput
				v-if="search"
				ref="SearchInput"
				:color="color"
				:value="searchQuery"
				:placeholder="searchPlaceholder"
				size="sm"
				no-label
				name="new_search_in_options"
				autocomplete="off"
				class="maz-m-1"
				@input="searchInOptions"
				@keydown="keyboardNav"
				@keydown.esc="closeList"
			/>
			<div ref="optionsList" class="maz-select__options-list__items-container maz-flex maz-direction-column w-100">
				<button
					v-if="action && hasActionButton"
					type="button"
					class="maz-select__options-list__item flex maz-align-center maz-text-left"
					:style="[optionHeight]"
					@click.prevent.stop="action">
						<span class="maz-dots-text maz-flex maz-align-center maz-text-color">
							<i class="material-icons ">add</i> {{actionLabel}}
						</span>
				</button>

				<div v-if="headerLabels && headerLabels.length" class="title-label border-bottom border-secondary maz-align-center" :style="[getMultiColumnStyle]">
					<small v-for="(headerTitle, index) in headerLabels" :key="index" :class="{'first-label': headerLabels.length > 1}" class="text-left">
						{{ headerTitle }}
					</small>
				</div>

				<button
					v-for="(option, i) in optionsShown"
					:key="i"
					tabindex="-1"
					type="button"
					:class="[
						{'selected': values.length && values.includes(option[config.valueKey])},
						{'keyboard-selected': tmpValue === option[config.valueKey]},{'grid': hasMoreButton}
					]"
					class="maz-select__options-list__item flex maz-align-center maz-text-left"
					:style="[
						optionHeight,
						getMultiColumnStyle,
						headerLabels && headerLabels.length ? {'display': 'grid', 'grid-auto-flow': 'column' , 'gap': '5px'} : ' '
					]"
					@click.prevent.stop="updateValue(Array.isArray(option[config.valueKey]) ? option[config.valueKey][0][config.labelText] : option[config.valueKey])">
					<!-- Item template -->
					<slot :option="{...option, isSelected: values.includes(option[config.valueKey])}" tag="div">
						<!-- `<span>{{ option.label }}</span>` -->
						<span
							class="maz-dots-text"
							v-for="(label, index) in option[config.labelKey]"
							:style="[label.color ? {'color': label.color} : 'maz-text-color']"
							:key="index"
							:class="[
								{'maz-text-muted': !option[config.valueKey]},
								values.includes(option[config.valueKey]) ? 'maz-text-white' : 'maz-text-color',
								{'multi-label': option[config.labelKey].length > 1},
								{'first-label': option[config.labelKey].length > 1}
							]">
								{{ label[config.labelText] }}
							</span>

						<span
							v-if="hasMoreButton && option.id !== 0"
							class="more-actions h-100"
							@click.prevent.stop="setSelectedMoreIndex(option, i)"
							@mouseleave="selectedMoreIndex = 0">
							<span class="more-icon" v-if="selectedMoreIndex !== i"><i class="material-icons maz-text-color">more_vert</i></span>
							<span class="edit">
								<transition tag="div" class=" w-100 h-100" v-if="selectedMoreIndex === i">
									<span class="edit" @click="onMore(coreSelectMenuOptions.edit)"><i class="material-icons maz-text-color">create</i></span>
								</transition>
							</span>
							<span class="delete">
								<transition class=" w-100 h-100" v-if="selectedMoreIndex === i">
									<span class="delete" @click="onMore(coreSelectMenuOptions.delete)"><i class="material-icons maz-text-color">remove_circle_outline</i></span>
								</transition>
							</span>
						</span>
					</slot>
				</button>
				<!-- No results template -->
				<slot v-if="!optionsShown.length" name="no-results" tag="div">
					<!-- `<i class="material-icons maz-text-danger">search_off</i>` -->
					<div class="maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center">
							<i class="material-icons maz-text-danger">
									search_off
							</i>
					</div>
				</slot>
			</div>
			<div v-if="loading" class="d-flex justify-content-center align-items-center" :style="{'height': itemHeight + 'px'}"><CoreSpinner :size="25" /></div>
		</div>
	</CorePopper>
</template>

<script>
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import CoreInput from "@/components/Core/CoreInput.vue";
import CoreBtn from '@/components/Core/CoreBtn.vue'
import uniqueId from '@/mixins/uniqueId'
import vClickOutside from "v-click-outside";
import { CORE_SELECT_MENU_OPTIONS } from "@/utils/constants"
import CorePopper from "@/components/Core/CorePopper.vue";

	/**
	 * > Beautiful select input
	 */
	export default {
		name: 'CoreSelect',
		components: { CoreInput, CoreBtn, CoreSpinner, CorePopper },
		mixins: [uniqueId],
		directives: {clickOutside: vClickOutside.directive},
		props: {
			// is the value of the input
			value: {
				required: true,
				validator: prop => ['number', 'string', 'boolean'].includes(typeof prop) || Array.isArray(prop) || prop === null
			},
			// list of the options
			options: { type: Array, required: true },
			// list of the headerLabels
			headerLabels: { type: Array, required: false },
			// show spinner
			loading: { type: Boolean, default: false },
			// When is `true` the select is disabled
			disabled: { type: Boolean, default: false },
			// When is `true` the select has the dark style
			dark: { type: Boolean, default: false },
			// Item in list height in pixel
			itemHeight: { type: Number, default: 35 },
			// List height in pixel
			listHeight: { type: Number, default: 260 },
			// List width in pixel or percent (:list-width="100", list-width="100%")
			listWidth: { type: [Number, String], default: null },
			// The select has no label in the input
			placeholder: { type: String, default: 'Select option' },
			// When is `true` the select you select multiple values
			noLabel: { type: Boolean, default: false },
			// When is `true` the select you select multiple values
			multiple: { type: Boolean, default: false },
			// When is `true` the select has an input to search in options
			search: { type: Boolean, default: false },
			// the search input placeholder
			searchPlaceholder: { type: String, default: 'Search in options' },
			// the search input placeholder
			color: { type: String, default: 'primary' },
			// input size
			size: { type: String, default: 'md' },
			// When is `true` the option list is open
			open: { type: Boolean, default: false },
			// set the position of option list (left, right, top, bottom, [left,right,top,bottom]-start, [left,right,top,bottom]-end)
			position: { type: String, default: 'bottom-start' },
			// set label key and value key - Ex: `{ labelKey: '<your_object_key>', valueKey: '<your_object_key>', searchKey: '<your_object_key>' }`
			config: { type: Object, default: () => ({ labelKey: 'label', valueKey: 'value', searchKey: 'label', labelText:'labelText' }) },
			// force value shown on input
			inputValue: { type: String, default: null },
			// Action Callback
			action: {type: Function, default: null},
			// Action Label
			actionLabel: {type: String, default: "Create"},
			//  When is `true` the hide the action button
			hasActionButton: { type: Boolean, default: false },
			// exclude elements classes (elements sometimes can close CoreSelect)
			excludedClasses: { type: Array, default: Array },
			// Indicates whether there're more buttons
			hasMoreButton: {type: Boolean, default: false},
			onMore: {type: Function, default: null},
			// Used to select the first option when list is opened
			initializeSelection: {type: Boolean, default: false},

		},
		data() {
			return {
				listIsOpen: false,
				query: '',
				tmpValue: null,
				searchQuery: null,
				filteredOptions: null,
				selectedMoreIndex: 0,
				coreSelectMenuOptions: CORE_SELECT_MENU_OPTIONS,
				currentPlacement: this.position,
				listTransition: 'maz-slide'
			}
		},
		computed: {
			currentOptions() {
				const newState = []
				this.options.map(option => {newState.push(option)})
				const options = newState.map(option => {
					if(!Array.isArray(option[this.config.labelKey])){
						const decoratedOption = {}
						decoratedOption[this.config.labelKey] = [{[this.config.labelText]: option[this.config.labelKey]}]
						if(this.config.labelKey !== this.config.valueKey) decoratedOption[this.config.valueKey] = option[this.config.valueKey]
						return decoratedOption
					} else {
						return option
					}
				});
				return options;
			},
			getMultiColumnStyle() {
				if (this.headerLabels && this.headerLabels.length) {
					return {
						'grid-template-columns': `repeat(${this.headerLabels.length}, 1fr)`
					}
				} else {
					return {
						'grid-template-columns': `none`
					}
				}
			},
			vcoConfig() {
				return {
					handler: this.closeList,
					events: ["click"],
					isActive: this.hasOpenList,
					middleware: this.preventClickOutside
				};
			},
			hasPositionTop() {
				return this.currentPlacement.includes('top');
			},
			hasPositionRight() {
				return this.currentPlacement.includes('right');
			},
			popperRootClass() {
				return `position-relative maz-select--${this.color}`;
			},
			popperClasses() {
				return {
					'p-0': true,
					'maz-select__options-list--top': this.hasPositionTop,
					'maz-select__options-list--right': this.hasPositionRight
				}
			},
			hasOpenList() {
				return this.open || this.listIsOpen
			},
			values() {
				const { multiple, value, options } = this
				if (!options) throw new Error('[CoreSelect] options should be provide')
				if (multiple && !Array.isArray(value) && value !== null) throw new Error('[CoreSelect] value should be an array or null')
				if (!multiple && Array.isArray(value)) throw new Error('[CoreSelect] value should be a string, a number or null')
				return value
					? multiple ? [...value]: [value]
					: []
			},
			hasLeftIcon() {
				return this.$attrs.leftIconName || this.$slots['icon-left']
			},
			placeholderShown() {
				const { placeholder, multiple, values } = this
				return multiple && values.length ? null : placeholder
			},
			hasNoLabel() {
				return this.multiple || this.noLabel
			},
			optionHeight() {
				return {
					height: `${this.itemHeight}px`,
					flex: `0 0 ${this.itemHeight}px`
				}
			},
			itemListSize() {
				const { listHeight, listWidth } = this
				const width = !Number.isInteger(listWidth) ? listWidth : `${listWidth}px`
				return {
					maxHeight: `${listHeight}px`,
					width,
					maxWidth: width
				}
			},
			tmpValueIndex() {
				const { config, tmpValue, optionsShown } = this
				return optionsShown.findIndex(c => c[config.valueKey] === tmpValue)
			},
			selectedValueIndex() {
				const { values, currentOptions, config } = this
				return values.length
					? currentOptions.findIndex(c => c[config.valueKey] === values[values.length - 1])
					: null
			},
			valueShown() {
				if (this.inputValue) return this.inputValue
				const { multiple, currentOptions, values, value, config } = this
				const valueSelected = currentOptions.find(o => o[config.valueKey] === value)
				if(valueSelected && valueSelected[config.valueKey] && !multiple) {
					return valueSelected[config.labelKey][0][config.labelText]
				} else if(values[0]) {
					return values[0]
				} else return null
			},
			optionsShown() {
				return this.filteredOptions || this.currentOptions
			},
			selectedOptions() {
				const { values, currentOptions, config } = this
				const optionsSelected = []
				values.forEach(v => optionsSelected.push(currentOptions.find((o) => v === o[config.valueKey])))
				return optionsSelected
			}
		},
		watch: {
			value: {
			handler() {
					const { multiple } = this
					if (multiple) this.scrollTags()
				},
				immediate: true
			}
		},
		methods: {
			onPopperPlacementUpdate(placement) {
				this.currentPlacement = placement || this.position;
				this.listTransition = this.currentPlacement.includes('bottom') ? 'maz-slide' : 'maz-slideinvert';
			},
			updateTransition() {
				let height = this.options.length * this.itemHeight < this.listHeight ? this.options.length * this.itemHeight : this.listHeight;
				if(this.hasActionButton) height += this.itemHeight;
				const rect = this.$el.getBoundingClientRect();
				this.listTransition = rect.bottom + height <= window.innerHeight ? 'maz-slide' : 'maz-slideinvert';
			},
			preventClickOutside(event) {
				const { excludedClasses } = this;
				if ((!event && !event.target) || !event.target.classList) return true;
				let preventClick = false;
				for(const excludedClass of excludedClasses) {
					for(const element of event.path) {
						if(element.classList && element.classList.contains(excludedClass)) {
							preventClick = true;
							break;
						}
					}
				}
				return !preventClick;
			},
			async scrollTags() {
				await this.$nextTick()
				const { SelectedTags, SelectedTagsContainer } = this.$refs
				if (SelectedTags) SelectedTags.scrollLeft = SelectedTagsContainer?.$el?.clientWidth ?? null
			},
			removeOption(value) {
				const { values, multiple } = this
				const leftValues = values.filter(v => v !== value)
				const valueToReturn = leftValues.length
					? multiple ? leftValues : leftValues[0]
					: null
				this.emitValues(valueToReturn)
			},
			closeList(e = {}) {
				if (this.$el.contains(e.relatedTarget)) return
				this.$refs.popper?.doClose();
				this.$emit('close')
				this.listIsOpen = false
				this.isFocus = false
				this.tmpValue = null;
				this.$emit('blur', e);
			},
			toggleList() {
				this.hasOpenList ? this.closeList() : this.openList();
			},
			async openList() {
				const { disabled, search, values } = this
				if (disabled) return
				// sent when the list is open
				this.$emit('open')
				this.isFocus = true
				this.listIsOpen = true
				if (this.initializeSelection) this.selectFirstValue();
				this.selectedMoreIndex = 0
				if (search) this.focusSearchInput()
				if (values.length) this.scrollToSelectedOnFocus(this.selectedValueIndex)
			},
			clearSearch() {
				this.searchQuery = null
				this.filteredOptions = null
			},
			async reset() {
				this.clearSearch()
				if (this.multiple) return
				this.closeList()
				await this.$nextTick()
			},
			selectFirstValue() {
				const { multiple, value, currentOptions, config } = this
				if (value || multiple) return
				const valueToReturn = currentOptions[0][config.valueKey] === undefined ? value : null
				this.tmpValue = valueToReturn
				this.emitValues(valueToReturn, true)
			},
			updateValue(value) {
				const { multiple, values, removeOption } = this
				if (values.includes(value) && multiple) return removeOption(value)
				this.tmpValue = value
				if (value) values.push(value)
				const valueToReturn = multiple && value ? values : value
				this.emitValues(valueToReturn)
			},
			async focusSearchInput() {
				await this.$nextTick()
				const { SearchInput } = this.$refs
				SearchInput.$el.querySelector('input').focus()
			},
			async emitValues(values, noReset) {
				// return the select input
				// @arg the option value selected
				this.$emit('input', values)
				if (noReset) return
				await this.$nextTick()
				this.reset()
			},
			async scrollToSelectedOnFocus(arrayIndex) {
				await this.$nextTick();
				this.$refs.optionsList.scrollTop = arrayIndex * this.itemHeight - (this.itemHeight * 3);
			},
			keyboardNav(event) {

				const { hasOpenList, tmpValueIndex, optionsShown, openList, tmpValue, search, config } = this
				if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.code === 'Tab') {
					if (!hasOpenList) openList()
					let index = event.key === 'ArrowDown' || event.code === 'Tab' && event.shiftKey === false ? tmpValueIndex + 1 : tmpValueIndex - 1
					if (index === -1 || index >= optionsShown.length) {
						index = index === -1 ? optionsShown.length - 1 : 0
					}
					this.tmpValue = optionsShown[index][config.valueKey]
					this.scrollToSelectedOnFocus(index)
				} else if (event.code === 'Enter') {
					event.preventDefault()
					hasOpenList ? this.updateValue(tmpValue) : this.openList()
				} else if (event.code === 'Escape') {
					this.closeList()
				} else if (event.shiftKey === true) {
					event.preventDefault()
				} else if (!search) {
					// typing an option's name
					this.searching(event)
				}
			},
			searching(event) {
				const { config, currentOptions } = this
				const queryTimer = window.setTimeout(() => this.query = '', 2000);
                clearTimeout(queryTimer)
				if (event.code === 'Backspace' && this.query !== '') {
					this.query = this.query.substring(0, this.query.length - 1)
				} else if (/[a-zA-Z-e ]/.test(event.key)) {
					if (!this.hasOpenList) this.openList()
					this.query += event.key.toLowerCase()
					const resultIndex = currentOptions.findIndex(o => {
						this.tmpValue = o?.[config?.valueKey]
						return o?.[config?.searchKey]?.toLowerCase()?.includes(this?.query)
					})
					if (resultIndex !== -1) {
						this.scrollToSelectedOnFocus(resultIndex)
					}
				}
			},
			searchInOptions(query) {
				const { config, currentOptions } = this
				this.searchQuery = query === '' ? null : query
				if (!this.searchQuery) return this.filteredOptions = currentOptions
				const searchQuery = query.toLowerCase()
				const filteredOptions = currentOptions.filter(o => o[config.valueKey] && o[config.searchKey].toLowerCase().includes(searchQuery))
				this.tmpValue = filteredOptions.length ? filteredOptions[0][config.valueKey] : null
				this.filteredOptions = filteredOptions
			},
			setSelectedMoreIndex(option, i) {
				if (i === this.selectedMoreIndex) this.selectedMoreIndex = 0
				else this.selectedMoreIndex = i
				this.$emit('moreActionClick', option)
			}
		}
	}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
.grid{
	padding: 0 5px 0 5px;
	display:flex;
	max-width: 300px;
    justify-content: space-between;
	.more-actions{
		padding: 0 4px;
		width: 25px;
		display: flex;
		// below fixes node-sass compile error
		justify-self: flex-end;
		justify-content: flex-end;
		align-content: center;
		align-items: center;

		i{
			font-size: 14px;
		}
		.more-icon{
			grid-column: 2;
		}
	}
}

.maz-select__options-list__items-container{
	width: 100%;
}

.maz-select__options-list__item{
	&.keyboard-selected{
		background-color: var(--brand-color);
		&:not(.selected) {
			background-color: $grey-color-light;
			span {
				color: $dark-color;
			}
		}
	}
}


.multi-label{
	flex-basis: 100%;
	width: 85px;
	overflow: hidden;

	&:first-child {
		padding-left: 0;
	}
}

.title-label {
	display: flex;
    min-width: inherit;
    flex: 0 0 20px;
	padding: 5px;
	gap: 5px;
	overflow: hidden;
	&:first-child {
		padding-left: 0;
	}

	small {
		padding: 0 0 4px 0;
		width: 85px;

		&:last-child {
			width: 24px !important;
		}
	}
}

.first-label:first-child {
	width: 135px !important;
}
</style>
