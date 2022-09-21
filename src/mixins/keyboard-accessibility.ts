/*
 * Vue mixin to inject the required methods, events to handle the date navigation
 * with the keyboard.
 * @module mixin - keyboardAccessibility
 */

import { EventBus } from "@/utils/eventBus"
import moment from 'moment'
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, Watch} from "vue-property-decorator"

const addListerner = ({ keyPressed }) => {
  if (typeof window === 'undefined') return null
  window.addEventListener('keydown', keyPressed)
}

const removeListerner = ({ keyPressed }) => {
  if (typeof window === 'undefined') return null
  window.removeEventListener('keydown', keyPressed)
}

@Component
export class KeyboardAccessibility extends Vue {
  @Prop({type: Boolean, default: true}) hasKeyboard!: boolean;
  isVisible!: boolean
  value!: any
  month!: any
  inline!: boolean
  keyboardSelectedDay: moment.Moment | null = null;

  selectDay(day: any) {
    throw new Error("Implement selectDay()");
  }

  isDisabled(day: any): boolean {
    throw new Error("Implement isDisabled()");
  }

  get isRangeMode(): boolean {
    throw new Error("Implemented isRangeMode getter");
  }

  public get currentValue(): moment.Moment {
    const currentValue = this.isRangeMode ? this.keyboardSelectedDay || this.value.end || this.value.start || moment() : this.keyboardSelectedDay || this.value || moment()
    return currentValue instanceof moment ? (currentValue as any).clone() : currentValue
  }
  
  keyPressed(e: KeyboardEvent) {
    /*
      13 : Enter
      27 : Escape
      32 : Space
      35 : Page Down
      36 : Page Up
      37 : Left
      38 : Up
      39 : Right
      40 : Down
      40 : Right
    */
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'PageUp' ) e.preventDefault();
    try {
      if (e.key === 'ArrowUp') {
        this.previousWeek()
      } else if (e.key === 'ArrowLeft') {
        this.previousDay()
      } else if (e.key === 'ArrowRight') {
        this.nextDay()
      } else if (e.key === 'ArrowDown') {
        this.nextWeek()
      } else if (e.keyCode === 32 || e.key === 'Enter') {
        e.preventDefault()
        this.selectDay(this.keyboardSelectedDay)
      } else if (e.key === 'PageUp') {
        this.previousMonth()
      } else if (e.key === 'PageDown') {
        this.nextMonth()
      } else if (e.key === 'Escape') {
        EventBus.$emit('close', e)
      }
      // if ('activeElement' in document) document.activeElement.blur()
    } catch(err) {
      throw new Error('An error occured while switch date ' + err)
    }
  }

  previousWeek() {
    const keyboardSelectedDay = this.currentValue.subtract(1, 'week')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  previousDay() {
    const keyboardSelectedDay = this.currentValue.subtract(1, 'days')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  nextDay() {
    const keyboardSelectedDay = this.currentValue.add(1, 'days')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  nextWeek() {
    const keyboardSelectedDay = this.currentValue.add(1, 'week')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  previousMonth() {
    const keyboardSelectedDay = this.currentValue.subtract(1, 'month')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  nextMonth() {
    const keyboardSelectedDay = this.currentValue.add(1, 'month')
    if (!this.isDisabled(keyboardSelectedDay)) {
      this.keyboardSelectedDay = keyboardSelectedDay
      this.checkMonth()
    }
  }

  checkMonth() {
    this.$nextTick(() => {
      const newYear = parseInt(this.currentValue.format('YYYY'))
      const currentYear = this.month.year
      const isSameYear = newYear === currentYear
      if ( parseInt(this.currentValue.format('MM')) - 1 !== this.month.month && isSameYear ) {
        if (parseInt(this.currentValue.format('MM')) - 1 > this.month.month) {
          this.$emit('change-month', 'next')
        } else {
          this.$emit('change-month', 'prev')
        }
      } else if (!isSameYear) {
        if (newYear > currentYear) {
          this.$emit('change-month', 'next')
        } else {
          this.$emit('change-month', 'prev')
        }
      }
    })
  }

  mounted() {
    if (this.hasKeyboard && (this.inline || this.isVisible)) {
      const { keyPressed } = this
      addListerner({ keyPressed })
    }
  }

  beforeDestroy() {
    const { keyPressed } = this
    removeListerner({ keyPressed })
  }

  @Watch('isVisible')
  onIsVisibleChange(value) {
    const { keyPressed } = this
    if (this.hasKeyboard && value) {
      addListerner({ keyPressed })
    } else {
      removeListerner({ keyPressed })
    }
  }

}
