<template>
  <component :is="tag" :class="rootClass" >
    <slot name="reference" />
      <div :id="popperContainerId" ref="popperContainer" class="core-popper-container core-scrollbar" :class="classes" :style="styles">
        <transition
          :name="transition"
          @beforeEnter="emitTransitionEvent('beforeEnter')"
          @enter="emitTransitionEvent('enter')"
          @afterEnter="emitTransitionEvent('afterEnter')"
          @beforeLeave="emitTransitionEvent('beforeLeave')"
          @leave="emitTransitionEvent('leave')"
          @afterLeave="emitTransitionEvent('afterLeave')"
        >
          <slot v-if="isShowing" name="popper" />
        </transition>
        <div tabindex="-1" v-if="!disableArrow && isShowing" ref="arrow" data-popper-arrow key="arrow" />
        <ResizeObserver v-if="handleResize && isShowing" @notify="onResize" key="resizer" />
      </div>
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Ref, Watch } from 'vue-property-decorator';
import { ResizeObserver } from 'vue-resize';
import { createPopper, Instance, PositioningStrategy } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import arrow from '@popperjs/core/lib/modifiers/arrow';
import offset from '@popperjs/core/lib/modifiers/offset';
import 'vue-resize/dist/vue-resize.css'
import { Placement } from '@popperjs/core/lib/enums';
import { Nullable } from '@/utils/generics';

type TransitionEvents = 'beforeEnter' | 'beforeLeave' | 'afterEnter' | 'afterLeave' | 'enter' | 'leave';

const on = (element: Element | Document, event: keyof HTMLElementEventMap, handler: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions | undefined = false) => {
  if (element && event && handler) element.addEventListener(event, handler, options);
}

const off = (element: Element | Document, event: keyof HTMLElementEventMap, handler: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions | undefined = false) => {
  if (element && event) element.removeEventListener(event, handler, options);
}

@Component({
  name: "CorePopper",
  components: {ResizeObserver}
})
export default class CorePopper extends Vue {
  @Prop({type: String, default: 'span'}) tag!: string;
  @Prop({type: String, default: 'bottom'}) placement!: Placement;
  @Prop({type: String, default: 'absolute'}) strategy!: PositioningStrategy;
  @Prop({type: String, default: 'hover', validator: (value) => ['clickToOpen', 'clickToToggle', 'hover', 'focus'].includes(value)}) trigger!: string;
  @Prop({type: Number, default: 200}) delayOnMouseOver!: number;
  @Prop({type: Number, default: 75}) delayOnMouseOut!: number;
  @Prop({type: Boolean, default: false}) disabled!: boolean;
  @Prop({type: String, default: '#app'}) boundarySelector!: string;
  @Prop({type: Boolean, default: false}) forceShow!: boolean;
  @Prop({type: String, default: 'body', validator: (value) => ['body', 'reference'].includes(value)}) attachTo!: 'body' | 'reference';
  @Prop({type: Boolean, default: false}) disableArrow!: boolean;
  @Prop({type: String, default: ''}) transition!: string;
  @Prop({type: Boolean, default: false}) stopPropagation!: boolean;
  @Prop({type: Boolean, default: false}) preventDefault!: boolean;
  @Prop({type: Boolean, default: true}) handleResize!: boolean;
  @Prop({type: String, default: ''}) rootClass!: string;
  @Prop({type: String, default: null}) popperContainerId!: string;
  @Prop({type: Number, default: 5}) padding!: number;
  @Prop({type: Array, default: () => ([0,5])}) offset!: number[];
  @Prop({type: Number, default: 9999}) zIndex!: number[];
  @Prop({type: Boolean, default: true}) defaultStyling!: boolean;
  @Prop({type: Array, default: Array}) excludedClasses!: string[];
  @Prop() containerStyle!: any;
  @Prop() containerClass!: any;
  @Ref('popperContainer') popperContainerRef!: HTMLElement;
  showPopper = false;
  instance: Nullable<Instance> = null;
  _timer: Nullable<number> = null;

  @Watch('instance.state.placement', {deep: true})
  async onInstanceStatePlacementChange() {
    await this.$nextTick();
    this.$emit('placementUpdate', this.instance?.state.placement);
  }

  @Watch('forceShow', {immediate: true})
  onForceShowChange(value: boolean) {
    value ? this.doShow() : this.doClose();
  }

  @Watch('disabled')
  onDisabledChange(value: boolean) {
    if(value) this.doClose();
  }

  @Watch('showPopper')
  async onShowPopperChange(value: boolean) {
    await this.$nextTick();
    value ? this.createPopper() : this.destroyPopper();
  }

  get classes() {
    return {
      ...this.containerClass,
      isShowing: this.isShowing,
      default: this.defaultStyling && this.isShowing
    }
  }

  get styles() {
    return {
      ...this.containerStyle,
      zIndex: this.zIndex
    }
  }

  get isShowing() {
    return !this.disabled && this.showPopper;
  }

  get referenceElement() {
    return this.$slots.reference?.[0].elm as Element | null;
  }

  async createPopper() {
    if(this.attachTo === 'body') this.$root.$el.appendChild(this.popperContainerRef);
    await this.$nextTick();
    if(this.referenceElement) {
      this.instance = createPopper(this.referenceElement, this.popperContainerRef, {
        placement: this.placement,
        strategy: this.strategy,
        modifiers: [
          {
            ...arrow,
            enabled: !this.disableArrow,
            options: {
              padding: 8
            }
          },
          flip,
          {
            ...offset,
            options: {
              ...offset.options,
              offset: this.offset,
            }
          },
          {
            ...preventOverflow,
            options: {
              ...preventOverflow.options,
              boundary: document.querySelector(this.boundarySelector),
              padding: this.padding
            }
          },
          {
            name: 'eventListeners',
            enabled: true
          }
        ]
      });
      await this.$nextTick();
      this.createPopperListeners();
      this.$emit('created', this.instance);
    }
  }

  async emitTransitionEvent(transitionEvent: TransitionEvents) {
    await this.$nextTick();
    this.$emit(transitionEvent);
  }

  removeChildFromRoot() {
    if(this.attachTo === 'body') this.$root.$el.removeChild(this.popperContainerRef);
  }

  destroyPopper() {
    this.removeChildFromRoot();
    this.destroyPopperListeners();
    this.instance?.destroy();
    this.instance = null;
    this.$emit('destroyed', this.instance);
  }

  createPopperListeners() {
    switch (this.trigger) {
      case 'hover':
        on(this.popperContainerRef, 'mouseover', this.onMouseOver);
        on(this.popperContainerRef, 'mouseout', this.onMouseOut);
        break;
      case 'focus':
        on(this.popperContainerRef, 'focus', this.onMouseOver);
        on(this.popperContainerRef, 'blur', this.onMouseOut);
        break;
    }
  }

  destroyPopperListeners() {
    off(this.popperContainerRef, 'mouseover', this.onMouseOver);
    off(this.popperContainerRef, 'mouseout', this.onMouseOut);
    off(this.popperContainerRef, 'focus', this.onMouseOver);
    off(this.popperContainerRef, 'blur', this.onMouseOut);
  }

  createReferenceListeners() {
    if(!this.referenceElement) return;
    switch (this.trigger) {
      case 'clickToOpen':
        on(this.referenceElement, 'click', this.doShow);
        on(this.$root.$el, 'click', this.onDocumentClick);
        on(this.$root.$el, 'touchstart', this.onDocumentClick, {passive: true});
        break;
      case 'clickToToggle':
        on(this.referenceElement, 'click', this.doToggle);
        on(this.$root.$el, 'click', this.onDocumentClick);
        on(this.$root.$el, 'touchstart', this.onDocumentClick, {passive: true});
        break;
      case 'hover':
        on(this.referenceElement, 'mouseover', this.onMouseOver);
        on(this.referenceElement, 'mouseout', this.onMouseOut);
        break;
      case 'focus':
        on(this.referenceElement, 'focus', this.onMouseOver);
        on(this.referenceElement, 'blur', this.onMouseOut);
        break;
    }
  }

  destroyReferenceListeners() {
    if(!this.referenceElement) return;
    off(this.referenceElement, 'click', this.doToggle);
    off(this.referenceElement, 'mouseup', this.doClose);
    off(this.referenceElement, 'mousedown', this.doShow);
    off(this.referenceElement, 'focus', this.doShow);
    off(this.referenceElement, 'blur', this.doClose);
    off(this.referenceElement, 'mouseout', this.onMouseOut);
    off(this.referenceElement, 'mouseover', this.onMouseOver);
    off(this.$root.$el, 'click', this.onDocumentClick);
  }

  beforeDestroy() {
    this.destroyReferenceListeners();
    if(this.instance) this.destroyPopper();
  }

  mounted() {
    this.createReferenceListeners();
  }

  doToggle(event: Event) {
    if(this.stopPropagation) event.stopPropagation();
    if(this.preventDefault) event.preventDefault();
    if(this.disabled) return;
    if(!this.forceShow) this.showPopper = !this.showPopper;
  }

  doShow() {
    if(this.disabled) return;
    this.showPopper = true;
  }

  doClose() {
    this.showPopper = false;
  }

  async onResize() {
    await this.$nextTick();
    this.instance?.update();
  }

  onMouseOver() {
    if(this._timer) clearTimeout(this._timer);
    this._timer = window.setTimeout(this.doShow, this.delayOnMouseOver);
  }

  onMouseOut() {
    if(this._timer) clearTimeout(this._timer);
    this._timer = window.setTimeout(this.doClose, this.delayOnMouseOut);
  }

  private pathHasExcludedClass(event: PointerEvent) {
    const { excludedClasses } = this;
    if(!event || !event.target || !(event.target as HTMLElement).classList) return false;
    let preventClick = false;
    for(const excludedClass of excludedClasses) {
      for(const element of event.composedPath() as Element[]) {
        if(element.classList && element.classList.contains(excludedClass)) {
          preventClick = true;
          break;
        }
      }
    }
    return preventClick;
  }

  onDocumentClick(e) {
    if (!this.$el || !this.referenceElement ||
      this.elementContains(this.$el, e.target) ||
      this.elementContains(this.referenceElement, e.target) ||
      !this.popperContainerRef || this.elementContains(this.popperContainerRef, e.target) ||
      this.excludedClasses.length && this.pathHasExcludedClass(e)
    ) {
      return;
    }
    this.$emit('documentClick', this);
    if (this.forceShow) return;
    this.doClose();
  }

  elementContains(elm: Element, otherElm: Element) {
    if (typeof elm.contains === 'function') return elm.contains(otherElm);
    return false;
  }

}
</script>

<style lang="scss">
.core-popper-container{
  position: absolute;
  display: none;
  isolation: isolate;

  &.isShowing{
    display: block;
    left: 0;
    top: 0;
  }

  &.default{
    box-shadow: 0px 4px 8px 0px var(--second-shadow-color), 0px 6px 20px 0px var(--second-shadow-color);
    border: none;
    color: var(--text-color);
    background: var(--primary-color);
    padding: 10px 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    white-space: normal;
  }

  [data-popper-arrow],
  [data-popper-arrow]::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    z-index: -1;
  }

  [data-popper-arrow] {
    visibility: hidden;
  }

  [data-popper-arrow]::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  &[data-popper-placement^='top'] > [data-popper-arrow] {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > [data-popper-arrow] {
    top: -4px;
  }

  &[data-popper-placement^='left'] > [data-popper-arrow] {
    right: -4px;
  }

  &[data-popper-placement^='right'] > [data-popper-arrow] {
    left: -4px;
  }

}
</style>