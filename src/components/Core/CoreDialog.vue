<template>
  <transition
    name="maz-dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="value"
      class="maz-base-component maz-dialog maz-dialog--mask"
      :class="{
        'maz-dialog--success': success,
        'maz-dialog--danger': danger,
        'maz-dialog--fullsize': fullsize,
        'maz-is-dark': dark
      }"
    >
      <div class="maz-dialog__wrapper maz-flex maz-align-center">
        <div
          v-click-outside="vcoConfig"
          :style="widthStyle"
          class="maz-dialog__container maz-dialog-animation maz-flex maz-direction-column maz-bg-color maz-border-radius"
        >
          <div
            v-if="!noHeader"
            class="maz-dialog__header maz-flex maz-space-between maz-align-center maz-p-3"
          >
            <!-- Replace the title element text -->
            <slot name="title">
              <!-- `<p class="maz-dialog__header__title">Title header</p>` -->
              <p class="maz-dialog__header__title">
                {{ title }}
              </p>
            </slot>

            <div
              class="maz-flex close-dialog"
              @mousedown.capture.prevent
              @click.once="$emit('input', false)"
            >
              <i class="material-icons" v-if="noClose"> close </i>
            </div>
          </div>
          <div class="maz-dialog__body px-3 maz-text-color">
            <!-- Replace the content -->
            <slot>
              <!-- `<p>Content</p>` -->
              <p>Content</p>
            </slot>
          </div>
          <div
            v-if="!noFooter"
            class="maz-dialog__footer maz-flex maz-align-end maz-justify-end pb-2 px-3"
          >
            <!-- Replace the footer bar -->
            <slot name="footer">
              <!-- Two `<CoreBtn />` -->
              <CoreBtn 
                v-if="!noClose" 
                :color="buttonCancelColor" 
                outline 
                size="md" 
                @click="closeDialog" 
                :disabled="$wait.is(waitState.ACTION_DIALOG_CONFIRM)">
                    {{cancelLabel}}
              </CoreBtn>
              <CoreBtn
                v-if="!noConfirm"
                class="maz-ml-3"
                size="md"
                :color="buttonConfirmColor"
                :disabled="disableConfirmButton"
                :loading="$wait.is(waitState.ACTION_DIALOG_CONFIRM)"
                @click="onConfirm($event)">
                    {{confirmLabel}}
              </CoreBtn>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import vClickOutside from "v-click-outside";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { WaitStates } from "@/utils/vuewait";

const addListerner = (keyPressHandler) => {
  if (typeof window === "undefined") return null;
  window.addEventListener("keydown", keyPressHandler);
};

const removeListerner = (keyPressHandler) => {
  if (typeof window === "undefined") return null;
  window.removeEventListener("keydown", keyPressHandler);
};

export default {
  name: "CoreDialog",
	data() {
		return {
      waitState: WaitStates
		}
	},
  components: { CoreBtn },
  directives: { clickOutside: vClickOutside.directive },
  props: {
    // `true` if dialog is open / `false` if is close
    value: { type: Boolean, required: true },
    // `true` if the data is invalid
    disableConfirmButton: { type: Boolean, required: true },
    // is the `max-width` of the dialog (number in pixels)
    maxWidth: { type: [Number || String], default: null },
    // is the `width` of the dialog (number in pixels)
    width: { type: [Number || String], default: null },
    // if is `true`, is not possible to close he dialog with a click outside
    persistent: { type: Boolean, default: false },
    // remove the header
    noHeader: { type: Boolean, default: false },
    // remove the footer
    noFooter: { type: Boolean, default: false },
    // remove the close button
    noClose: { type: Boolean, default: false },
    // remove the confirm button
    noConfirm: { type: Boolean, default: false },
    // label for confirm button
    confirmLabel: { type: String, default: 'Confirm' },
    // add "success" style to the dialog
    success: { type: Boolean, default: false },
    // add "danger" style to the dialog
    danger: { type: Boolean, default: false },
    // add "dark" style to the dialog
    dark: { type: Boolean, default: false },
    // exclude elements classes (elements sometimes can close the dialog)
    excludedClasses: { type: Array, default: Array },
    // make dialog fullsize
    fullsize: { type: Boolean, default: false },
    // title of the dialog
    title: { type: String, default: "Header title" },
    // specific style for button
    specificButton: {type: Boolean, default: false},
    // label for cancel button
    cancelLabel : { type: String, default: 'Cancel'}
  },
  computed: {
    widthStyle() {
      const { fullsize, maxWidth, width } = this;
      return {
        maxWidth:
          fullsize & !maxWidth
            ? null
            : Number.isInteger(maxWidth)
            ? `${maxWidth}px`
            : maxWidth,
        width:
          fullsize && !width
            ? null
            : Number.isInteger(width)
            ? `${width}px`
            : width,
      };
    },
    buttonConfirmColor() {
      return this.danger ? "danger" : this.success ? "success" : "primary";
    },
    buttonCancelColor() {
      return this.specificButton ? "pink" : "default";
    },
    vcoConfig() {
      return {
        handler: this.closeDialog,
        middleware: this.preventClickOutside,
        events: ["click"],
        isActive: !this.fullsize,
      };
    },
  },
  watch: {
    value: {
      async handler(value) {
        if (value) {
          addListerner(this.keyPressHandler);
          await this.$nextTick();
        } else removeListerner(this.keyPressHandler);
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    removeListerner(this.keyPressHandler);
  },
  methods: {
    keyPressHandler(e) {
      if (e.keyCode === 27) {
        // escape
        this.closeDialog();
      }
    },
    preventClickOutside(event) {
      const { excludedClasses } = this;
      if ((!event && !event.target) || !event.target.classList) return true;

      const eventClasses = Array.from(event.target.classList);
      return !eventClasses.some((c) => excludedClasses.includes(c));
    },
    closeDialog() {
      if (!this.persistent) {
        // sent when dialog is close
        // @arg Boolean `false`
        this.$emit("input", false);
      }
    },
    afterEnter(e) {
      // sent when after dialog is open
      // @arg event
      this.$emit("opened", e);
    },
    afterLeave(e) {
      // sent when after dialog is close
      // @arg event
      this.$emit("closed", e);
    },
    onConfirm(e) {
      // sent when you click on confirm button
      // @arg event
      this.$emit("confirm", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.maz-dialog {
  &--mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    background-color: var(--overlay-color);
    transition: all 300ms ease;
    overflow-y: auto;
    overflow-x: hidden;
    .maz-btn {
      &--pink {
        background: $core-button-cancel-bg;
        &:hover {
          background: $core-button-cancel-hover;
        }
      }
    }
  }

  &__wrapper {
    vertical-align: middle;
    min-height: 100%;
    width: 100%;
  }

  &__body {
    color: var(--maz-text-color);
  }

  &__container {
    margin: 30px auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all 300ms ease;
    max-width: 95%;
    width: 440px;
  }

  &__header {
    background-color: var(--maz-primary);
    border-top-left-radius: var(--maz-border-radius);
    border-top-right-radius: var(--maz-border-radius);
    border: none;

    &__title {
      color: var(----maz-text-color);
      font-size: 1.25rem !important;
      margin: 0;
      padding: 0;
    }

    .close-dialog i {
      font-size: 1.5rem;
      color: var(----maz-text-color);
      cursor: pointer;

      &:hover {
        font-weight: bold;
      }
    }
  }

  &__footer {
    border-bottom-left-radius: var(--maz-border-radius);
    border-bottom-right-radius: var(--maz-border-radius);
  }

  &--success {
    .maz-dialog__header {
      background-color: var(--maz-success);
    }
  }

  &--danger {
    .maz-dialog__header {
      background-color: var(--maz-danger);
    }
  }

  &--fullsize {
    .maz-dialog {
      &__header {
        border-radius: 0;
      }

      &__wrapper {
        height: 100%;
      }

      &__container {
        margin: 0;
        border-radius: 0;
        flex: 1;
        height: 100%;
        width: 100%;
        max-width: 100%;
      }

      &__body {
        flex: 1;
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>