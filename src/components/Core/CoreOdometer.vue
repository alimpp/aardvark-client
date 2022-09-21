<template>
  <span :class="className"></span>
</template>

<script>
import Odometer from '@/assets/odometer/odometer.js';
import '@/assets/odometer/themes/odometer-theme-car.css'
import '@/assets/odometer/themes/odometer-theme-default.css'
import '@/assets/odometer/themes/odometer-theme-digital.css'
import '@/assets/odometer/themes/odometer-theme-minimal.css'
import '@/assets/odometer/themes/odometer-theme-plaza.css'
import '@/assets/odometer/themes/odometer-theme-slot-machine.css'
import '@/assets/odometer/themes/odometer-theme-train-station.css'
import { ANIMATION_TIMING } from "@/utils/constants";

export default {
  name: 'CoreOdometer',

  props: {
    value: { type: Number, default: () => 0 },
    theme: { type: String, default: () => 'minimal' },
    format: { type: String, default: () => '(.ddd),dd' },
    duration: { type: Number, default: () => ANIMATION_TIMING.BADGE_COUNT_DURATION },
    className: { type: String, default: () => 'odometer' },
    animation: { type: String, default: () => '' },
    formatFunction: { type: Function },
  },

  data: () => ({
    instance: null,
  }),

  watch: {
    value: {
      handler(value) {
        if (this.instance && this.instance.update) {
          this.instance.update(value)
        }
      },
      deep: false,
    },
  },

  mounted() {
    this.instance = new Odometer({
      el: this.$el,
      value: this.value,
      theme: this.theme,
      format: this.format,
      duration: this.duration,
      animation: this.animation,
      vueComponent:this
    })

    this.instance.render()
  }

}
</script>
