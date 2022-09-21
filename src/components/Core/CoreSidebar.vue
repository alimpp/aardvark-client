<template>
  <div
    class="maz-base-component maz-sidebar"
    :class="{
      'maz-is-dark': dark
    }"
    @mouseover="doHover(true)"
    @mouseleave="doHover(false)"
  >
    <div
      :id="uniqueId"
      ref="MazSidebar"
      class="maz-sidebar__wrapper maz-flex maz-flex-fixed max-height"
      :style="[wrapperStyle]"
      :class="{
        'is-close': !isOpen,
        'is-absolute': absolute,
        'has-shadow': !noShadow,
        'is-right': right,
        'is-mini': mini,
        'is-mobile': mobile
      }"
    >
      <transition
        name="fade"
        mode="in-out"

      >
        <div
          class="maz-sidebar__wrapper__content maz-flex maz-flex-1 maz-w-100 maz-direction-column"
        >
          <slot :is-open="isOpen" />
        </div>
      </transition>
      <div
        v-if="hasCloseBtn"
        class="maz-sidebar__wrapper__close-btn"
      >
        <button
          class="maz-flex maz-flex-center"
          @click="isOpen = !isOpen"
        >
          <slot name="button-icon">
            <ArrowIcon :orientation="arrowDirection" />
          </slot>
        </button>
      </div>
      <div
        v-if="loading"
        class="maz-sidebar__wrapper__load-layer maz-flex maz-flex-center"
      >
        <slot name="content-loader">
          <MazLoader />
        </slot>
      </div>
    </div>
    <div
      v-if="layer && isOpen"
      class="maz-sidebar__wrapper__opacity-layer"
      @click="isOpen = false"
    />
  </div>
</template>

<script>
import {MazLoader} from 'maz-ui'
import ArrowIcon from '@/components/Core/ArrowIcon.vue'
import uniqueId from '@/mixins/uniqueId';
import {DEBOUNCE} from '@/utils/constants';
import {debounce} from "@/utils/debounce";

/**
 * Generic component used to show a togglable sidebar (left or right) in the layout
 * @module component - MazSidebar
 * @param {boolean} loading - Show / hide the loader inside the sidebar component
 * @param {number} width - The sidebar width
 * @param {boolean} [noCloseBtn=false] - Specify if the sidebar should have or not the toggle button
 * @param {boolean} [noShadow=false] - Specify if the sidebar should have the drop shadow
 * @param {boolean} [absolute=false] - Specify if the sidebar should be positionned in an absolute way.
 * @param {boolean} [isOpen=false] - Is the sidebar open or not
 * @param {boolean} [right=false] - Specify the sidebar direction, by default the sidebar is positionned in the left side.
 * @param {boolean} [dark=false] - Specify the dark mode
 * @param {boolean} [layer=false] - Add layer under content, click on it to close sidebar
 * @param {boolean} [mini=false] - Add layer under content, click on it to close sidebar
 * @param {number} [miniSize=60] - Mini width
 * @param {boolean} [expandOnHover=false] - With mini, open expand sidebar on hover
 * @emits toggle-menu
 */
export default {
  name: 'CoreSidebar',
  components: {
    MazLoader,
    ArrowIcon
  },
  mixins: [uniqueId],
  props: {
    // Boolean to open or not the sidebar
    value: { type: Boolean, required: false },
    // set id of sidebar
    id: { type: String, default: null },
    // Size bar width
    width: { type: Number, default: 300 },
    rightSideBar: { type: Number, default: 0 },
    // Mobile layout
    mobile: { type: Boolean, default: false},
    // Show loading layer
    loading: { type: Boolean, default: false },
    // So that the user cannot close the sidebar
    noCloseBtn: { type: Boolean, default: false },
    // Remove shadow UI
    noShadow: { type: Boolean, default: false },
    // the sidebar goes over the content
    absolute: { type: Boolean, default: false },
    // Must be activated if you want to integrate it on the right side
    right: { type: Boolean, default: false },
    // Dark mode
    dark: { type: Boolean, default: false },
    // Gray layer above the content, if you click on it, the side bar closes
    layer: { type: Boolean, default: false },
    // reduces the size of the sidebar width
    mini: { type: Boolean, default: false },
    // width size of sidebar with mini mode
    miniWidth: { type: Number, default: 60 },
    // expand sidebar on hover (only with mini option)
    expandOnHover: { type: Boolean, default: false },
    // debounce on hover
    debounceTime: {type: Number, default: 0}
  },
  data() {
    return {
      isHover: false,
      open: this.value,
    }
  },
  computed: {
    isOpen: {
      get() {
        const { open, isHover, hasExpandOnHover } = this
        const showOnExpend = hasExpandOnHover ? isHover : false
        return open || showOnExpend
      },
      set(value) {
        // return a `true` or `false` if the sidebar is open or not
        // @arg Boolean
        this.$emit('input', value)
        this.open = value
      }
    },
    hasExpandOnHover() {
      const { expandOnHover, mini } = this
      return expandOnHover && mini
    },
    hasCloseBtn() {
      const { noCloseBtn, hasExpandOnHover } = this
      return !noCloseBtn && !hasExpandOnHover
    },
    wrapperStyle() {
      const { mini, width, isOpen, layer, miniWidth } = this
      const widthSize = mini ? miniWidth : 0
      return {
        right: `${this.rightSideBar}px`,
        width: `${isOpen ? width : widthSize}px`,
        flex: `0 0 ${isOpen ? width : widthSize}px`,
        zIndex: isOpen && layer ? 1040 : 1030
      }
    },
    arrowDirection() {
      const { right: isOnRightSide = false, value = false, open = false } = this;
      const isOpen = value && open;
      return isOpen ? (isOnRightSide ? 'right' : 'left')  : (isOnRightSide ? 'left' : 'right');
    },
  },
  watch: {
    value(val) {
      this.open = val
    }
  },
  methods: {
    doHover(value) {
      debounce(DEBOUNCE.CORE_SIDEBAR_ON_HOVER, () => { this.isHover = value }, value ? this.debounceTime : 0)
    }
  }
}
</script>

<style lang="scss">
  .maz-sidebar__wrapper {
    transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
    transition-duration: 0.45s;
  }
</style>
