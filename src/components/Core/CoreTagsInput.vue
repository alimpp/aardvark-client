<template>
  <div
    class="vue-tags-input maz-input__input maz-border maz-border-color maz-border-color-hover maz-border-solid"
    :class="[{'ti-disabled': disabled}, {'is-focused': focused}]"
  >
    <div class="ti-input maz-flex maz-align-center maz-h-100">
      <!-- TODO:(BUG) There is an animation issue here. Removing 1st tag from 3+ selected tags plays animation at the end.  -->
      <transition-group v-if="tagsCopy" name="maz-tags" tag="ul" class="ti-tags maz-flex maz-align-center">
          <li
            v-for="(tag, index) in tagsCopy"
            :key="`tags-${index}`"
            :style="tag.style"
            :class="[
              {'ti-editing': tagsEditStatus[index]},
              tag.tiClasses,
              tag.classes,
              {'ti-deletion-mark': isMarked(index)},
              {'has-list-open': autocompleteOpen},
              {'maz-is-dark': isDarkMode},
              `maz-select--${color}`
            ]"
            tabindex="0"
            class="ti-tag maz-base-component maz-btn maz-select__tag maz-flex maz-align-center maz-btn--primary maz-btn--md maz-tags-enter-to"
            @click="$emit('tag-clicked', {tag, index})"
          >
            <div class="ti-content">
              <div
                v-if="$scopedSlots['tag-left']"
                class="ti-tag-left"
              >
                <slot
                  name="tag-left"
                  :tag="tag"
                  :index="index"
                  :edit="tagsEditStatus[index]"
                  :perform-save-edit="performSaveTag"
                  :perform-delete="performDeleteTag"
                  :perform-cancel-edit="cancelEdit"
                  :perform-open-edit="performEditTag"
                  :deletion-mark="isMarked(index)"
                />
              </div>
              <div ref="tagCenter" class="ti-tag-center">
                <span
                  v-if="!$scopedSlots['tag-center']"
                  class="maz-select__tag__text"
                  :class="{'ti-hidden': tagsEditStatus[index]}"
                  @click="performEditTag(index)"
                >{{ tag.text }}</span>
                <CoreTagInput
                  v-if="!$scopedSlots['tag-center']"
                  :scope="{
                    edit: tagsEditStatus[index],
                    maxlength,
                    tag,
                    index,
                    validateTag: createChangedTag,
                    performCancelEdit: cancelEdit,
                    performSaveEdit: performSaveTag
                  }"
                />
                <slot
                  name="tag-center"
                  :tag="tag"
                  :index="index"
                  :maxlength="maxlength"
                  :edit="tagsEditStatus[index]"
                  :perform-save-edit="performSaveTag"
                  :perform-delete="performDeleteTag"
                  :perform-cancel-edit="cancelEdit"
                  :validate-tag="createChangedTag"
                  :perform-open-edit="performEditTag"
                  :deletion-mark="isMarked(index)"
                />
              </div>
              <div
                v-if="$scopedSlots['tag-right']"
                class="ti-tag-right"
              >
                <slot
                  name="tag-right"
                  :tag="tag"
                  :index="index"
                  :edit="tagsEditStatus[index]"
                  :perform-save-edit="performSaveTag"
                  :perform-delete="performDeleteTag"
                  :perform-cancel-edit="cancelEdit"
                  :perform-open-edit="performEditTag"
                  :deletion-mark="isMarked(index)"
                />
              </div>
            </div>
            <div class="ti-actions">
              <!-- dont use v-if and v-else here -> different event calling on click?! -->
              <i
                v-if="!$scopedSlots['tag-actions']"
                v-show="tagsEditStatus[index]"
                class="ti-icon-undo"
                @click="cancelEdit(index)"
              />
              <i
                v-if="!$scopedSlots['tag-actions']"
                v-show="!tagsEditStatus[index]"
                class="ti-icon-close maz-select__tag__clear material-icons"
                @click="performDeleteTag(index)"
              >close</i>
              <slot
                v-if="$scopedSlots['tag-actions']"
                name="tag-actions"
                :tag="tag"
                :index="index"
                :edit="tagsEditStatus[index]"
                :perform-save-edit="performSaveTag"
                :perform-delete="performDeleteTag"
                :perform-cancel-edit="cancelEdit"
                :perform-open-edit="performEditTag"
                :deletion-mark="isMarked(index)"
              />
            </div>
          </li>
        <li key="tags-newInput" class="ti-new-tag-input-wrapper">
          <input
            ref="newTagInput"
            v-bind="$attrs"
            :class="[createCssClasses(newTag, tags, validation, isDuplicate)]"
            :placeholder="placeholder"
            :value="newTag"
            :maxlength="maxlength"
            :disabled="disabled"
            type="text"
            size="1"
            class="ti-new-tag-input maz-bg-transparent maz-input__input"
            @keydown="performAddTags(
              selectedItem && filteredAutocompleteItems[selectedItem] || newTag, $event
            )"
            @paste="addTagsFromPaste"
            @keydown.8="invokeDelete"
            @keydown.9="performBlur"
            @keydown.38="selectItem($event, 'before')"
            @keydown.40="selectItem($event, 'after')"
            @input="updateNewTag"
            @blur="$emit('blur', $event)"
            @focus="focused = true; $emit('focus', $event)"
            @click="addOnlyFromAutocomplete ? false : selectedItem = null"
          >
          <div v-if="loading" class="maz-input__loader">
            <div class="maz-input__loader__progress-bar"></div>
          </div>
        </li>
      </transition-group>
    </div>
    <slot name="between-elements" />
    <transition name="maz-slide">
      <div
        v-if="autocompleteOpen"
        class="ti-autocomplete maz-select__options-list maz-flex maz-direction-column"
        @mouseout="selectedItem = null"
      >
        <slot name="autocomplete-header" />
            <div class="maz-select__options-list__items-container maz-flex maz-direction-column">
              <!-- <div v-if="!$scopedSlots['autocomplete-item']"> -->
                <button
                  v-for="(item, index) in filteredAutocompleteItems"
                  :key="index"
                  :disabled="disabled"
                  :color="color"
                  class="maz-select__options-list__item flex maz-align-center maz-text-left"
                  :style="[optionHeight]"
                  type="button"
                  @mouseover="disabled ? false : selectedItem = index"
                  @click="performAddTags(item, undefined, 'autocomplete')">
                    <span class="maz-dots-text" :class="isDarkMode ? 'maz-text-white' : 'maz-text-color'" >
                      {{ item.text }}
                    </span>
                </button>
                <slot
                  v-if="!filteredAutocompleteItems.length"
                  name="no-results"
                  tag="div"
                >
                  <div class="maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center">
                    No results found.
                  </div>
                </slot>
              <!-- </div>
              <slot
                v-else
                name="autocomplete-item"
                :item="item"
                :index="index"
                :perform-add="item => performAddTags(item, undefined, 'autocomplete')"
                :selected="isSelected(index)"
              /> -->
            </div>
        <!-- <ul>
          <li
            v-for="(item, index) in filteredAutocompleteItems"
            :key="index"
            :style="item.style"
            :class="[
              item.tiClasses,
              item.classes,
              {'maz-bg-primary': isSelected(index)}
            ]"
            class="ti-item"
            @mouseover="disabled ? false : selectedItem = index"
          >
            <div
              v-if="!$scopedSlots['autocomplete-item']"
              @click="performAddTags(item, undefined, 'autocomplete')"
            >
              {{ item.text }}
            </div>
            <slot
              v-else
              name="autocomplete-item"
              :item="item"
              :index="index"
              :perform-add="item => performAddTags(item, undefined, 'autocomplete')"
              :selected="isSelected(index)"
            />
          </li>
        </ul> -->
        <slot name="autocomplete-footer" />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
import { createTags, createTag, createClasses, clone } from '@/utils/create-tags';
import equal from 'fast-deep-equal';
import CoreTagInput from '@/components/Core/CoreTagInput.vue';
import CoreBtn from '@/components/Core/CoreBtn.vue';
import { Nullable } from '@/utils/generics';
import { State } from 'vuex-class';

const propValidation = (value: any[]) => {
  return !value.some((v) => {
    const missingRule = !v.rule;
    if (missingRule) console.warn('Property "rule" is missing', v);

    const validRule =
      v.rule &&
      (typeof v.rule === "string" ||
        v.rule instanceof RegExp ||
        {}.toString.call(v.rule) === "[object Function]");

    if (!validRule) {
      console.warn(
        "A rule must be type of string, RegExp or function. Found:",
        JSON.stringify(v.rule)
      );
    }

    const missingClasses = !v.classes;
    if (missingClasses) console.warn('Property "classes" is missing', v);

    const invalidType = v.type && typeof v.type !== "string";
    if (invalidType)
      console.warn('Property "type" must be type of string. Found:', v);

    return !validRule || missingRule || missingClasses || invalidType;
  });
};

const propValidatorSeparators = (value: any[]) => {
  return !value.some((s) => {
    const invalidType = typeof s !== "string";
    if (invalidType)
      console.warn("Separators must be type of string. Found:", s);
    return invalidType;
  });
};

const propValidatorTag = (value: any[]) => {
  return !value.some((t) => {
    const invalidText = !t.text;
    if (invalidText) console.warn('Missing property "text"', t);

    let invalidClasses = false;
    if (t.classes) invalidClasses = typeof t.classes !== "string";
    if (invalidClasses)
      console.warn('Property "classes" must be type of string', t);

    return invalidText || invalidClasses;
  });
};

const propValidatorStringNumeric = (value: any[]) => {
  return !value.some((v) => {
    if (typeof v === "number") {
      const numeric = isFinite(v) && Math.floor(v) === v;
      if (!numeric)
        console.warn("Only numerics are allowed for this prop. Found:", v);
      return !numeric;
    } else if (typeof v === "string") {
      const string = /\W|[a-z]|!\d/i.test(v);
      if (!string)
        console.warn("Only alpha strings are allowed for this prop. Found:", v);
      return !string;
    } else {
      console.warn("Only numeric and string values are allowed. Found:", v);
      return false;
    }
  });
};

@Component({
  name: "CoreTagsInput",
  components: {CoreTagInput, CoreBtn}
})
export default class CoreTagsInput extends Vue {
    @Prop({ required: true, default: "" }) value!: string;
    @Prop({ default: () => [], validator: propValidatorTag }) tags!: any[];
    @Prop({ default: () => [], validator: propValidatorTag }) autocompleteItems!: any[];
    @Prop({ default: false }) allowEditTags!: boolean;
    @Prop({ default: true }) autocompleteFilterDuplicates!: boolean;
    @Prop({ default: false }) addOnlyFromAutocomplete!: boolean;
    @Prop({ default: 1 }) autocompleteMinLength!: number;
    @Prop({ default: false }) autocompleteAlwaysOpen!: boolean;
    @Prop({ default: false }) disabled!: boolean;
    @Prop({ default: "Add Tag" }) placeholder!: string;
    @Prop({ default: () => [13], validator: propValidatorStringNumeric }) addOnKey!: number[];
    @Prop({ default: () => [13], validator: propValidatorStringNumeric }) saveOnKey!: number[];
    @Prop() maxTags!: number;
    @Prop() maxlength!: number;
    @Prop({ default: () => [], validator: propValidation }) validation!: any[];
    @Prop({default: () => [";"], validator: propValidatorSeparators }) separators!: string[];
    @Prop({ default: true }) avoidAddingDuplicates!: boolean;
    @Prop({ default: true }) addOnBlur!: boolean;
    @Prop({ default: null }) isDuplicate!: (tags: any[], tag: any) => boolean;
    @Prop({ default: true }) addFromPaste!: boolean;
    @Prop({ default: true }) deleteOnBackspace!: boolean;
    @Prop({ default: false }) loading!: boolean;
    @Prop({ default: 'primary' }) color!: string;
    @Prop({ default: 35 }) itemHeight!: number;
    @State('isDarkMode', {namespace: 'profileds'}) isDarkMode!: boolean;
    $refs!: {
      [key: string]: HTMLElement
    }
    newTag = ''
    tagsCopy: any[] = []
    tagsEditStatus = {}
    deletionMark: Nullable<number> = null
    deletionMarkTime: Nullable<number> = null;
    selectedItem: Nullable<number> = null
    focused = false

    @Watch('value')
    onValueChange(newValue: string) {
        if (!this.addOnlyFromAutocomplete) this.selectedItem = null;
        this.newTag = newValue;
    }

    @Watch('tags', {deep: true})
    onTagsChange() {
        this.newTag = ''
        this.initTags();
    }

    @Watch('autocompleteOpen')
    onAutocompleteOpenChange() {
        this.selectDefaultItem();
    }

		public get optionHeight() {
			return {
				height: `${this.itemHeight}px`,
				flex: `0 0 ${this.itemHeight}px`
			}
		}

    public get filteredAutocompleteItems(): any[] {
        const is = this.autocompleteItems.map(i => {
          return createTag(i, this.tags, this.validation, this.isDuplicate);
        });

        if (!this.autocompleteFilterDuplicates) return is;
        return is.filter(this.duplicateFilter);
    }

    public get autocompleteOpen(): boolean {
      if (this.autocompleteAlwaysOpen) return true;
      return this.newTag !== null
        && this.newTag.length >= this.autocompleteMinLength
        && this.filteredAutocompleteItems.length > 0
        && this.focused;
    }

    createCssClasses(tag: any, tags?: any, validation?: never[], customDuplicateFn?: any) {
      createClasses(tag, tags, validation, customDuplicateFn);
    }

    getSelectedIndex(method) {
      const items = this.filteredAutocompleteItems;
      const selectedItem = this.selectedItem;
      const lastItem = items.length - 1;
      if (items.length === 0) return;
      if (selectedItem === null) return 0;
      if (method === 'before' && selectedItem === 0) return lastItem;
      else if (method === 'after' && selectedItem === lastItem) return 0;
      else return method === 'after' ? selectedItem + 1 : selectedItem - 1;
    }

    selectDefaultItem() {
      if (this.addOnlyFromAutocomplete && this.filteredAutocompleteItems.length > 0) {
        this.selectedItem = 0;
      } else this.selectedItem = null;
    }

    selectItem(e, method) {
      e.preventDefault();
      this.selectedItem = this.getSelectedIndex(method) || null;
    }

    isSelected(index) {
      return this.selectedItem === index;
    }

    isMarked(index) {
      return this.deletionMark === index;
    }

    deleteTag(index) {
      if (this.disabled) return;
      this.deletionMark = null;
      if(this.deletionMarkTime !== null) {
          clearTimeout(this.deletionMarkTime);
      }
      this.tagsCopy.splice(index, 1);
      if ((this as any)._events['update:tags']) this.$emit('update:tags', this.tagsCopy);
      this.$emit('tags-changed', this.tagsCopy);
    }

    performDeleteTag(index) {
      if (!(this as any)._events['before-deleting-tag']) this.deleteTag(index);
      this.$emit('before-deleting-tag', {
        index,
        tag: this.tagsCopy[index],
        deleteTag: () => this.deleteTag(index),
      });
    }

    invokeDelete() {
      // If we shouldn't delete tags on backspace or we have some characters in the input → stop
      if (!this.deleteOnBackspace || this.newTag.length > 0) return;
      const lastIndex = this.tagsCopy.length - 1;
      if (this.deletionMark === null) {
        this.deletionMarkTime = window.setTimeout(() => this.deletionMark = null, 1000);
        this.deletionMark = lastIndex;
      } else this.performDeleteTag(lastIndex);
    }

    performEditTag(index) {
      if (!this.allowEditTags) return;
      if (!(this as any)._events['before-editing-tag']) this.editTag(index);
      /**
       * @description Emits before a tag toggles to it's edit mode
       * @name before-editing-tag
       * @property {events} hook
       * @returns {Object} Contains the to editing tag: 'tag'.
         The tag's index: 'index'. And a function: 'editTag'.
         If the function is invoked, the tag toggles to it's edit mode.
       */
      this.$emit('before-editing-tag', {
        index,
        tag: this.tagsCopy[index],
        editTag: () => this.editTag(index),
      });
    }

    addTagsFromPaste() {
      if (!this.addFromPaste) return;
      window.setTimeout(() => this.performAddTags(this.newTag), 10);
    }

    editTag(index) {
      if (!this.allowEditTags) return;
      this.toggleEditMode(index);
      this.focus(index);
    }

    toggleEditMode(index) {
      if (!this.allowEditTags || this.disabled) return;
      this.$set(this.tagsEditStatus, index, !this.tagsEditStatus[index]);
    }

    createChangedTag(index, event) {
      // If the text of a tag changes → we create a new one with a new validation.
      // we take the value from the event if possible, because on google android phones
      // this.tagsCopy[index].text is incorrect, when typing a space on the virtual keyboard.
      // yes, this sucks ...
      const tag = this.tagsCopy[index];
      tag.text = event ? event.target.value : this.tagsCopy[index].text;
      this.$set(this.tagsCopy, index,
        createTag(tag, this.tagsCopy, this.validation, this.isDuplicate)
      );
    }

    focus(index) {
      this.$nextTick(() => {
        const el = this.$refs.tagCenter[index].querySelector('input.ti-tag-input');
        if (el) el.focus();
      });
    }

    quote(regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }

    cancelEdit(index) {
      if (!this.tags[index]) return;
      this.tagsCopy[index] = clone(
        createTag(this.tags[index], this.tags, this.validation, this.isDuplicate)
      );
      this.$set(this.tagsEditStatus, index, false);
    }

    hasForbiddingAddRule(tiClasses) {
      // Does the tag has a rule, defined by the user, which prohibits adding?
      return tiClasses.some(type => {
        const rule = this.validation.find(rule => type === rule.classes);
        return rule ? rule.disableAdd : false;
      });
    }

    createTagTexts(string) {
      const regex = new RegExp(this.separators.map(s => this.quote(s)).join('|'));
      return string.split(regex).map(text => ({ text }));
    }

    noTriggerKey(event, category) {
      const triggerKey = this[category].indexOf(event.keyCode) !== -1
        || this[category].indexOf(event.key) !== -1;
      if (triggerKey) event.preventDefault();
      return !triggerKey;
    }

    performAddTags(tag, event?, source?) {
      // If the input is disabled or the function was invoked by no trigger key → stop
      if (this.disabled || event && this.noTriggerKey(event, 'addOnKey')) return;

      // Convert the string or object into a tags array
      let tags: any[] = [];
      if (typeof tag === 'object') tags = [tag];
      if (typeof tag === 'string') tags = this.createTagTexts(tag);

      // Filter out the tags with no content
      tags = tags.filter(tag => tag.text.trim().length > 0);

      // The basic checks are done → try to add all tags
      tags.forEach(tag => {
        tag = createTag(tag, this.tags, this.validation, this.isDuplicate);
        if (!(this as any)._events['before-adding-tag']) this.addTag(tag, source);
        /**
         * @description Emits before a tag is added
         * @name before-adding-tag
         * @property {events} hook
         * @returns {Object} Contains the to editing tag: 'tag'. And a function: 'addTag'.
           If the function is invoked, the tag is added.
         */
        this.$emit('before-adding-tag', {
          tag,
          addTag: () => this.addTag(tag, source),
        });
      });
    }

    addTag(tag, source = 'new-tag-input') {
      // Check if we should only add items from autocomplete and if so,
      // does the tag exists as an option
      const options = this.filteredAutocompleteItems.map(i => i.text);
      if (this.addOnlyFromAutocomplete && options.indexOf(tag.text) === -1) return;

      // We use $nextTick here, because this.tagsCopy.length would be wrong if tags are added fast
      // like in a loop. With $nextTick we get the correct length value
      this.$nextTick(() => {
        // Maybe we should not add a tag because the maximum has reached already
        const maximumReached = this.maxTags && this.maxTags <= this.tagsCopy.length;

        /**
         * @description Emits if the maximum, the tags array is allowed to hold, is reached.
           The maximum can be defined by the prop 'max-tags'.
         * @name max-tags-reached
         * @property {events}
         * @returns {Object} The 'tag' which could not be added because of the length limitation.
         */
        if (maximumReached) return this.$emit('max-tags-reached', tag);

        // If we shouldn't add duplicates and that is one → stop
        const dup = this.avoidAddingDuplicates && !this.duplicateFilter(tag);
        /**
         * @description Emits if the user tries to add a duplicate to the tag's array
           and adding duplicates is prevented by the prop 'avoid-adding-duplicates'
         * @name adding-duplicate
         * @property {events}
         */
        if (dup) return this.$emit('adding-duplicate', tag);

        // If we find a rule which avoids that the tag is added → stop
        if (this.hasForbiddingAddRule(tag.tiClasses)) return;

        // Everything is okay → add the tag
        this.$emit('input', '');
        this.tagsCopy.push(tag);

        // Special update for the parent if .sync is on
        if ((this as any)._events['update:tags']) this.$emit('update:tags', this.tagsCopy);

        // if the tag was added by autocomplete, focus the input
        if (source === 'autocomplete') this.$refs.newTagInput.focus();

        this.$emit('tags-changed', this.tagsCopy);
      });
    }

    performSaveTag(index, event) {
      const tag = this.tagsCopy[index];

      // If the input is disabled or the function was invoked by no trigger key → stop
      if (this.disabled || event && this.noTriggerKey(event, 'addOnKey')) return;

      // If the tag has no content → stop
      if (tag.text.trim().length === 0) return;

      // The basic checks are done → try to save the tag
      if (!(this as any)._events['before-saving-tag']) this.saveTag(index, tag);
      /**
       * @description Emits before a tag is saved
       * @name before-saving-tag
       * @property {events} hook
       * @returns {Object} Contains the to editing tag: 'tag'.
         The tag's index: 'index'. And a function: 'saveTag'.
         If the function is invoked, the tag is saved.
       */
      this.$emit('before-saving-tag', {
        index,
        tag,
        saveTag: () => this.saveTag(index, tag),
      });
    }

    saveTag(index, tag) {
      // If we shouldn't save duplicates → stop
      if (this.avoidAddingDuplicates) {
        const tagsDiff = clone(this.tagsCopy);
        const inputTag = tagsDiff.splice(index, 1)[0];
        const dup = this.isDuplicate ?
          this.isDuplicate(tagsDiff, inputTag) :
          tagsDiff.map(t => t.text).indexOf(inputTag.text) !== -1;

        /**
         * @description Emits if the user tries to save a duplicate in the tag's array
           and saving duplicates is prevented by the prop 'avoid-adding-duplicates'
         * @name saving-duplicate
         * @property {events}
         */
        if (dup) return this.$emit('saving-duplicate', tag);
      }

      // If we find a rule which avoids that the tag is added → stop
      if (this.hasForbiddingAddRule(tag.tiClasses)) return;

      // Everything is okay → save the tag
      this.$set(this.tagsCopy, index, tag);
      this.toggleEditMode(index);

      // Special update for the parent if .sync is on
      if ((this as any)._events['update:tags']) this.$emit('update:tags', this.tagsCopy);

      this.$emit('tags-changed', this.tagsCopy);
    }

    tagsEqual() {
      return !this.tagsCopy.some((t, i) => !equal(t, this.tags[i]));
    }

    updateNewTag(ievent: InputEvent) {
      const value = (ievent.target as HTMLInputElement).value;
      this.newTag = value;
      this.$emit('input', value);
    }

    initTags() {
      // We always work with a copy of the "real" tags, to easier edit them
      this.tagsCopy = createTags(this.tags, this.validation, this.isDuplicate);

      // Let's create an array which defines whether a tag is in edit mode or not
      this.tagsEditStatus = clone(this.tags).map(() => false);

      // We check if the original and the copied and validated tags are equal →
      // Update the parent if not and sync is on.
      if ((this as any)._events['update:tags'] && !this.tagsEqual()) {
        this.$emit('update:tags', this.tagsCopy);
      }
    }

    blurredOnClick(e) {
      // if the click occurs on tagsinput → don't hide
      if (this.$el.contains(e.target) || this.$el.contains(document.activeElement)) return;
      this.performBlur();
    }

    performBlur() {
      // If we should add tags before blurring → add tag
      if (this.addOnBlur && this.focused) this.performAddTags(this.newTag);

      // Hide autocomplete layer
      this.focused = false;
    }

    duplicateFilter(tag: any) {
      return this.isDuplicate ? !this.isDuplicate(this.tagsCopy, tag) : !this.tagsCopy.find(t => t.text === tag.text);
    }

    created() {
        this.newTag = this.value || '';
        this.initTags();
    }

    mounted() {
        // We select a default item based on props in the autocomplete
        this.selectDefaultItem();

        // We add a event listener to hide autocomplete on blur
        document.addEventListener('click', this.blurredOnClick);
    }

    destroyed() {
        document.removeEventListener('click', this.blurredOnClick);
    }

}
</script>


<style lang="scss" scoped>
@import 'src/assets/scss/variables';

ul {
  margin: 0px;
  padding: 0px;
  list-style-type: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

input:focus {
  outline: none;
}

input[disabled] {
  background-color: transparent;
  &::placeholder{
    color: var(--text-color);
  }
}
.maz-input__input::placeholder {
  opacity: 1;
}
.vue-tags-input {
  padding: 0;
  z-index: 5;
  height: auto;
  padding: 2.5px 2.5px 2.5px 8px;
  caret-color: var(--brand-color);

  &.is-focused{
    // TODO: Pull from themes.
    border-color: #1e90ff;
  }
}
  // max-width: 450px;
  // position: relative;
  // background-color: #fff;

.maz-is-dark .maz-border-color-hover.ti-disabled:hover{
  border-color: transparent;
}

.ti-disabled{
  background-color: var(--btn-disabled-background-color);
  border-color: transparent;
  :hover{
    cursor: not-allowed;
  }
}

div.vue-tags-input.disabled {
  opacity: 0.5;

  * {
    cursor: default;
  }
}

.ti-input {
  display: flex;
  flex-wrap: wrap;
}

.ti-tags {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  // padding-bottom: 5px;
  // line-height: 1em;
}

.ti-tag {
  display: flex;
  font-size: .875rem;
  height: 33.2115px;
  margin: 2.5px;
  max-width: calc(50% - 6px);

  &:focus {
    outline: none;
  }

  .ti-content {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .ti-tag-center {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    line-height: normal;
  }

  span.ti-hidden {
    padding-left: 14px;
    visibility: hidden;
    height: 0px;
    white-space: pre;
  }

  .ti-actions {
    margin-left: 2px;
    display: flex;
    align-items: center;
    font-size: 1.15em;

    i {
      cursor: pointer;
    }
  }

  &:last-child {
    margin-right: 4px;
  }

  &.ti-invalid,
  &.ti-tag.ti-deletion-mark {
    background-color: $core-tags-input-error;
  }
}

.ti-new-tag-input-wrapper {
  display: flex;
  flex: 1 0 auto;
  // padding: 3px 5px;
  font-size: 0.85em;
  margin: 2.5px;

  input {
    flex: 1 0 auto;
    min-width: 100px;
    border: none;
    padding: 0;
    margin: 0;
    height: 35.7115px;
    min-height: 0;
  }

  .maz-input__loader{
    .maz-input__loader__progress-bar{
      // TODO: Pull from themes.
      background-color: #1e90ff;
    }
  }
}

.ti-new-tag-input {
  line-height: initial;
}

.ti-autocomplete {
  // border: 1px solid #ccc;
  // border-top: none;
  position: absolute;
  width: 100%;
  // background-color: #fff;
  z-index: 20;
  left: 0;
}

.ti-item{
  height: 35px;
  flex: 0 0 35px;
}

// .ti-item > div {
//   cursor: pointer;
//   padding: 3px 6px;
//   width: 100%;
// }

.ti-selected-item {
  background-color: $core-tags-input-primary;
}
</style>