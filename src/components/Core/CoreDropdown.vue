<template>
  <div
    ref="LangSwitcher"
    class="maz-dropdown maz-base-component"
    :class="{'maz-is-dark': dark}"
    @mouseenter="hover ? openMenu() : null"
    @mouseleave="hover ? closeMenu() : null"
  >
    <CoreBtn
      no-shadow
      class="maz-dropdown__btn"
      :color="color"
      v-bind="$attrs"
      @focus.native="openMenu()"
      @blur.native="closeMenu()"
    >
      <slot />
      <i
        class="maz-dropdown__btn__icon material-icons maz-ml-2"
        :class="{rotate: dropdownOpen}"
      >
        keyboard_arrow_down
      </i>
    </CoreBtn>
    <transition
      tag="div"
      :name="hasPositionTop ? 'maz-slideinvert' : 'maz-slide'"
      class="maz-bg-color"
    >
      <div
        v-show="dropdownOpen"
        class="maz-dropdown__dropdown maz-flex maz-direction-column maz-border-radius maz-bg-color maz-border maz-border-solid maz-border-color"
        :class="[
          {'maz-dropdown__dropdown--top': hasPositionTop},
          hasPositionLeft ? 'maz-dropdown__dropdown--left' : 'maz-dropdown__dropdown--right'
        ]"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CoreBtn from "@/components/Core/CoreBtn.vue";

@Component({
  name: "CoreDropdown",
  inheritAttrs: false,
  components: { CoreBtn },
})
export default class CoreDropdown extends Vue {
  @Prop({ default: false }) hover!: boolean;
  @Prop({ default: false }) open!: boolean;
  @Prop({ default: false }) dark!: boolean;
  @Prop({ default: "right bottom" }) position!: string;
  @Prop({ default: "transparent" }) color!: string;
  isOpen = false;

  public get dropdownOpen() {
    return this.open || this.isOpen;
  }
  public get hasPositionTop() {
    return this.position.includes("top");
  }
  public get hasPositionLeft() {
    return this.position.includes("left");
  }

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }
}
</script>
