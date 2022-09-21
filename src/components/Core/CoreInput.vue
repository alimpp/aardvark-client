<template>
  <div
    ref="parent"
    :class="[
      'core-scrollbar',
      {
        'is-focused': isFocus || focus,
        'is-valid': success,
        'has-value': hasValue,
        'has-error': error,
        'has-warning': warning,
        'is-disabled': disabled,
        'maz-is-dark': dark,
        'has-hint': hint,
        'has-no-label': !hasLabel && !hint,
        'has-left-icon': hasLeftIcon()
      },
      size,
      `has-${leftNumberIcon}-right-icon`,
      `maz-input--${color}`
    ]"
    class="maz-base-component maz-input"
    @click="focusInput"
  >
    <div
      v-if="hasLeftIcon()"
      class="maz-input__icon maz-flex left"
      :class="[textarea ? 'maz-align-start maz-pt-2' : 'maz-align-center']"
      :targetIcon="leftIconName"
      @click="iconclick"
    >
      <!-- Icon slot (`icon-left`) -->
      <slot :name="`icon-left`">
        <!-- none -->
        <i class="material-icons">{{ leftIconName }}</i>
      </slot>
    </div>

    <div
      v-if="hasRightIcon()"
      class="maz-input__icon maz-flex right"
      :class="[textarea ? 'maz-align-start maz-pt-2' : 'maz-align-center']"
    >
      <!-- Icon slot (`icon-right`) -->
      <slot :name="`icon-right`">
        <!-- none -->
        <i class="material-icons">{{ rightIconName }}</i>
      </slot>
    </div>
    <textarea
      v-if="textarea && !editable"
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholderValue"
      :type="type"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      class="maz-input__input maz-textarea maz-border maz-border-color maz-border-color-hover maz-border-solid maz-h-100"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @change="onChange"
      @click="$emit('click', $event)"
    />
    <div
      v-else-if="!textarea && editable"
      class="editable-input maz-input__input maz-textarea maz-border maz-border-color maz-border-color-hover maz-border-solid maz-h-100"
      :contenteditable="!disabled"
      :id="uniqueId"
      ref="MazInput"
      v-bind="$attrs"
      :data-ph="placeholderValue"
      @keydown="keyDown"
      @keyup="keyUp"
      @input="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @click="$emit('click', $event)"
    />
    <input
      v-else
      :id="uniqueId"
      ref="MazInput"
      v-model="inputValue"
      v-bind="{ 
        ...(getType === 'number' && {step: 'any', min: '0'}),
        ...$attrs
      }"
      :placeholder="placeholderValue"
      :type="getType"
      class="maz-input__input maz-border maz-border-color maz-border-color-hover maz-border-solid"
      :aria-label="placeholder"
      :class="{'has-right-icon': hasClearBtn || hasPasswordBtn || hasRightIcon()}"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      @keydown="keyDown"
      @keyup="keyUp"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @change="onChange"
      @click="$emit('click', $event)"
    />
    <label
      v-if="(hasLabel || hint) &&!editable"
      ref="label"
      :for="uniqueId"
      :class="{'label-textarea': textarea ,'label-textarea-disabled': disabled , 'maz-text-danger': error}"
      class="maz-input__label"
      tabindex="-1"
      @click="focusInput"
      style="pointer-events: none;"
    >
      {{ hintValue || placeholderValue }}
    </label>
    <transition-group name="maz-scale">
      <button
        v-if="hasClearBtn"
        key="clear-button"
        class="maz-input__toggle-btn --clear maz-flex maz-flex-center"
        title="clear"
        type="button"
        tabindex="-1"
        :disabled="disabled"
        :class="{'has-right-icon': hasRightIcon(), 'disabled': disabled}"
        @click.stop="clear"
      >
        <i class="maz-input__toggle-btn__icon material-icons"> close </i>
      </button>

      <button
        v-if="hasPasswordBtn"
        key="password-button"
        class="maz-input__toggle-btn password maz-flex maz-flex-center"
        :class="{
          'has-clear-btn': hasClearBtn,
          'has-right-icon': hasRightIcon()
        }"
        title="clear"
        type="button"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        <i class="maz-input__toggle-btn__icon material-icons">
          {{ showPassword ? "visibility_off" : "visibility" }}
        </i>
      </button>
    </transition-group>

    <div v-if="loading" class="maz-input__loader" :class="{textarea}">
      <div class="maz-input__loader__progress-bar" />
    </div>
  </div>
</template>

<script>
import uniqueId from "./../../mixins/uniqueId";

/**
 * > Beautiful input UI with loading & error manager
 */


export default {
  name: "CoreInput",
  mixins: [uniqueId],
  props: {
    // value of the input
    value: {
      validator: (prop) =>
        ["string", "number"].includes(typeof prop) || prop === null,
      default: null,
    },
    // input id
    id: { type: String, default: null },
    // value of the input
    placeholder: { type: String, default: "Enter text" },
    // replace the label if is present
    hint: { type: String, default: null },
    // input size (`'lg'` / `'sm'`)
    size: { type: String, default: null },
    // is the input size (`text` or `number`)
    type: { type: String, default: "text" },
    // should be a [material icon](https://material.io/resources/icons/) name
    leftIconName: { type: String, default: null },
    // should be a [material icon](https://material.io/resources/icons/) name
    rightIconName: { type: String, default: null },
    // When is `true` the input has the error style ($danger-color)
    error: { type: Boolean, default: false },
    // When is `true` the input has the warning style ($warning-color)
    warning: { type: Boolean, default: false },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the dark theme
    dark: { type: Boolean, default: false },
    // When is `true` the input is on readonly mode
    readonly: { type: Boolean, default: false },
    // When is `true` the input has the valid style ($success-color)
    success: { type: Boolean, default: false },
    // When is `true` the input become required & has the `*` symbol
    required: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    textarea: { type: Boolean, default: false },
    // When true, the input is a contenteditable div
    editable: { type: Boolean, default: false },
    // When is `true` the input is a textarea
    loading: { type: Boolean, default: false },
    // When is `true` the input can be clear with a button on the right
    clearable: { type: Boolean, default: false },
    // When is `true` the input has not label (top placeholder when value is not empty)
    noLabel: { type: Boolean, default: false },
    // When is `true` and is `required`, the `*` symbol is not showing
    noRequiredSymbol: { type: Boolean, default: false },
    // force focus style input
    focus: { type: Boolean, default: false },
    // color name in basic colors
    color: { type: String, default: "primary" },
  },
  data() {
    return {
      isFocus: false,
      showPassword: false,
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        // return the input value (in `@input` or `v-model`)
        // @arg input
        this.$emit(
          "input",
          this.hasNumberType ? (!value ? 0 : parseFloat(value)) : value
        );
      },
    },
    placeholderValue() {
      let { placeholder } = this;
      if (this.required && placeholder && !this.noRequiredSymbol)
        placeholder += " *";
      return placeholder;
    },
    hintValue() {
      let { hint } = this;
      if (this.required && hint) hint += " *";
      return hint;
    },
    hasNumberType() {
      return this.type === "number";
    },
    hasLabel() {
      return !this.noLabel;
    },
    getType() {
      return this.showPassword ? "text" : this.type;
    },
    hasPasswordBtn() {
      return this.type === "password" && this.inputValue;
    },
    hasClearBtn() {
      return this.clearable && this.inputValue && !this.textarea;
    },
    hasValue() {
        switch (typeof this.value) {
          case "string":
            return !!this.value;
          case "number":
            return true;
          default:
            return false;
        }
    },
    leftNumberIcon() {
      const array = [
        !!this.hasRightIcon(),
        !!this.hasClearBtn,
        !!this.hasPasswordBtn,
      ];
      return array.filter((a) => a).length;
    },
  },
  methods: {
    hasLeftIcon() {
      return this.leftIconName || this.$slots["icon-left"];
    },
    hasRightIcon() {
      return this.rightIconName || this.$slots["icon-right"];
    },
    focusInput() {
      this.$refs.MazInput.focus();
    },
    onFocus(e) {
      // sent the focus event
      // @arg event
      this.$emit("focus", e);
      this.isFocus = true;
    },
    onBlur(e) {
      // sent the blur event
      // @arg event
      this.$emit("blur", e);
      this.isFocus = false;
    },
    onPaste(e) {
      // sent when text is past in the textfield
      // @arg event
      this.$emit("paste", e);
    },
    onChange(e) {
      // sent on input change
      // @arg event
      this.$emit("change", e);
    },
    clear() {
      this.$emit("input", this.hasNumberType ? 0 : "");
      // sent when the input is clear
      this.$emit("clear");
    },
    keyUp(e) {
      // sent the keyup event
      // @arg event
      if (e.code === 'Escape')
      {
         if (this.$refs.MazInput.textarea != undefined)
            this.$refs.MazInput.textarea=''
         if (this.$refs.MazInput.value != undefined)
         {
           this.$refs.MazInput.value='';
           this.clear();
         }
         if (this.$refs.MazInput.innerHTML != undefined)
           this.$refs.MazInput.innerHTML='';
      }
      this.$emit("keyup", e);
    },
    keyDown(e) {
      // sent the keydown event
      // @arg event

      if(e.keyCode === 33){
        e.preventDefault();
      }else if(e.keyCode === 34){
        e.preventDefault()
      }
      this.$emit("keydown", e);
    },
    iconclick() {
      this.$emit("iconclick")
    }
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';

.maz-input__icon {
  pointer-events: none;
  &[targetIcon=search] {
    pointer-events: all;
  }
}

.maz-input__toggle-btn{
  &.disabled{
    pointer-events: none;
  }
}

.maz-input__label {
  color: $core-input-label-color !important;
}

.maz-input__input[type=number] {
  -moz-appearance: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
  }
}

.maz-input.is-disabled .maz-input__input {
  background-color: var(--btn-disabled-background-color);
  border-color: transparent;
  color: var(--text-color);
  &::placeholder {
    color: var(--text-color) !important;
  }
}

.editable-input {
  white-space: pre-wrap;
  text-align: left;
  resize: none;
  height: 40px;
  min-height: 40px !important;
  padding-top: 0.2857rem !important;
  max-height: 125px;
  overflow-y: auto;
  word-break: break-word;

  &:empty:not(:focus):before {
    content: attr(data-ph);
    color: grey;
    font-style: italic;
    pointer-events: none;
  }

}

.label-textarea{
  background: var(--primary-color);
  text-align: left;
  padding: 4px 0 ;
  top: 2px;
  width: calc(100% - 23.714px) ;
  &-disabled {
    background-color: var(--btn-disabled-background-color) !important;
  }
}

</style>