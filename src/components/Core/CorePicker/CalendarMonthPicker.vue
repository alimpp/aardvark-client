<template>
  <TransitionGroup
    class="month-picker maz-position-relative"
    :class="{'month-picker--long': monthDays.length + weekStart > 35}"
    tag="div"
    :name="transitionDaysName"
  >
    <div v-for="m in [month]" :key="m.month" class="month-picker__days" @mousedown.capture.prevent>
      <div
        v-for="(w, i) in Array.from(Array(weekStart).keys())"
        :key="`previous-${i}`"
      />
      <CoreBtn
        v-for="(day, i) in allDays"
        :key="i"
        class="month-picker__day maz-text-color maz-bg-transparent maz-flex maz-flex-center"
        size="mini"
        :color="color"
        tabindex="-1"
        :no-shadow="!isSelectedDate(day)"
        :disabled="isDisabled(day)"
        :active="isSelectedDate(day)"
        :class="{
          highlight: isToday(day),
          'is-keyboard-selected': isKeyboardSelected(day),
          'is-in-range': !isDisabled(day) && isBetween(day),
          'is-between-hoverred':
            value && value.start && !isDisabled(day) && isBetweenHoverred(day),
          'is-first-in-range': isFirstInRange(day),
          'is-last-in-range': isLastInRange(day)
        }"
        @mouseenter="$emit('hoverred-day', day)"
        @mouseleave="$emit('hoverred-day', null)"
        @click="selectDay(day)"
        >{{ day.format("D") }}</CoreBtn
      >
    </div>
  </TransitionGroup>
</template>

<script lang="ts">
import { Prop, Watch } from "vue-property-decorator";
import Component, { mixins } from 'vue-class-component'
import CoreBtn from "@/components/Core/CoreBtn.vue";
import { EventBus } from "@/utils/corepicker";
import moment from "moment";
import { KeyboardAccessibility } from "@/mixins/keyboard-accessibility";

@Component({name: "CalendarMonthPicker", components: { CoreBtn }})
export default class CalendarMonthPicker extends mixins(KeyboardAccessibility) {

	//props

  @Prop({ type: Object, default: null }) value!: any;
  @Prop({ type: Object, required: true }) month!: any;
  @Prop({ type: String, required: true }) color!: string;
  @Prop({ type: String, default: null }) format!: string;
  @Prop({ type: String, default: null }) minDate!: string;
  @Prop({ type: String, default: null }) maxDate!: string;
  @Prop({ type: Boolean, default: false }) noWeekendsDays!: boolean;
  @Prop({ type: Array, required: true }) disabledDates!: any;
  @Prop({ type: Array, required: true }) disabledWeekly!: string | any[];
  @Prop({ type: Boolean, required: true }) isVisible!: boolean;
  @Prop({ type: Boolean, required: true }) hasDouble!: boolean;
  @Prop({ type: Object, default: null }) hoverredDay!: any;

  //data

  transitionDaysName = "maz-slidenext";
  currentMonth = this.month;

  //Watchers

  @Watch("month")
  onMonthChanged(value: any): void {
    const newValueIsSmaller = this.currentMonth.start > value.start;
    this.transitionDaysName = newValueIsSmaller
      ? "maz-slideprev"
      : "maz-slidenext";
    this.$nextTick((): void => {
      this.currentMonth = value;
    });
  }

  //Component mount method

  mounted(): void {
    if (this.noWeekendsDays && this.isWeekEndDay(this.dateMoment)) {
      throw new Error(
        "[MazPicker]: the value provide is a weekend day and you use the option 'no-weekends-days'"
      );
    }
    if (this.isDateDisabled(this.dateMoment)) {
      throw new Error(
        "[MazPicker]: the value provide is a disabled date by the option 'disabled-dates'"
      );
    }
  }

  //Computed getters/setters

  get dateMoment(): any {
    return this.value;
  }
  set dateMoment(value: any) {
    const valueToEmit = this.isRangeMode
      ? value
      : value.set({
          hour: this?.value?.hour() ?? 0,
          minute: this?.value?.minute() ?? 0
        });
    this.$emit("input", valueToEmit);
  }
  get allDays() {
    return this.monthDays;
  }
  get monthDays() {
    return this.month.getMonthDays();
  }
  get weekStart() {
    return this.month.getWeekStart();
  }
  get isRangeMode(): boolean {
    return !!this.dateMoment && Object.keys(this.dateMoment).includes("start");
  }
  get minDateDay(): any {
    return this.minDate
      ? moment(this.minDate, this.format).startOf("day")
      : null;
  }
  get maxDateDay(): any {
    return this.maxDate ? moment(this.maxDate, this.format).endOf("day") : null;
  }

  isToday(day: any) {
    return day.isSame(new Date(), "day");
  }
  isBetweenHoverred(day: any) {
    if (!this.isRangeMode || this.dateMoment.end) return false;
    return day.isBetween(this.dateMoment.start, this.hoverredDay, null, "[]");
  }
  isBetween(day: any) {
    if (!this.isRangeMode) return false;
    return day.isBetween(
      this.dateMoment.start,
      this.dateMoment.end,
      null,
      "[]"
    );
  }
  isFirstInRange(day: any) {
    if (!this.isRangeMode) return false;
    return day.isSame(this.dateMoment.start, "day");
  }
  isLastInRange(day: any) {
    if (!this.isRangeMode) return false;
    return day.isSame(this.dateMoment.end, "day");
  }
  isSelectedDate(day: any): any {
    return this.isRangeMode
      ? (this.dateMoment?.start?.isSame(day, "day") ?? false) ||
          (this.dateMoment?.end?.isSame(day, "day") ?? false)
      : this.dateMoment
      ? this.dateMoment.isSame(day, "day")
      : false;
  }
  isDisabled(day: any): boolean {
    return (
      day.startOf("day").isBefore(this.minDateDay) ||
      day.startOf("day").isAfter(this.maxDateDay) ||
      (this.noWeekendsDays && this.isWeekEndDay(day)) ||
      this.isDateDisabled(day) ||
      this.isDayDisabledWeekly(day)
    );
  }
  isWeekEndDay(day: any): boolean {
    const dayConst = day.day();
    const weekendsDaysNumbers = [6, 0];
    return this.noWeekendsDays
      ? weekendsDaysNumbers.indexOf(dayConst) > -1
      : false;
  }
  isDateDisabled(day: any): boolean {
    return this.disabledDates.some((d): any => d.isSame(day, "day"));
  }
  isDayDisabledWeekly(day: any): boolean {
    const dayConst = day.day();
    return this.disabledWeekly.includes(dayConst);
  }
  isKeyboardSelected(day: any) {
    return day.isSame(this.keyboardSelectedDay, "day");
  }
  selectDay(day: any): void {
    EventBus.$emit("day-selected");
    let valueToSend = day;
    if (this.isRangeMode) {
      const { start, end } = this.dateMoment;
      if (!start || (start && end) || day.isBefore(this.dateMoment.start)) {
        valueToSend = {
          start: day,
          end: null
        } as any;
      } else {
        valueToSend = {
          start: this.dateMoment.start,
          end: day
        } as any;
      }
    }
    this.dateMoment = valueToSend;
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

.month-picker {
  min-height: 194px;
  min-width: 268px;
  width: 100%;
  overflow: hidden;

  &--long {
    min-height: 231px;
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
    width: 100%;
    justify-items: center;
  }

  &__day {
    $day-size: 32px;

    padding: 0;
    width: $day-size;
    height: $day-size;
    font-size: 1rem;
    z-index: 1;
    position: relative;

    &::before {
      border: none !important;
    }

    &.highlight:not(.maz-active):not(.btn--disabled)::before,
    &.is-keyboard-selected:not(.maz-active)::before {
      $circle-size: 26px;

      content: "";
      position: absolute;
      height: $circle-size;
      width: $circle-size;
      border-radius: $circle-size;
      background-color: rgba(black, 0.15);
      z-index: -1;
    }

    &.is-keyboard-selected {
      font-weight: 700;

      &:not(.maz-active)::before {
        border-radius: $core-picker-border-radius;
        background-color: rgba(black, 0.15);
      }
    }

    &.is-between-hoverred {
      color: white;
    }

    &.is-in-range {
      color: white;
      width: calc(100% + 5px);

      &:not(.maz-active) {
        border-radius: 0;
      }

      &.maz-active:not(.is-last-in-range) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &.is-last-in-range:not(.is-first-in-range) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    &.maz-active:not(:disabled) {
      color: white;
      font-weight: 600;
    }

    &:hover {
      color: white;
    }

    &:disabled {
      color: rgba(black, 0.25);
      border: none;
    }
  }
}

@each $name, $color in $core-picker-color_types {
  .maz-picker--#{$name} {
    .month-picker {
      &__day {
        &.is-between-hoverred {
          background-color: rgba($color, 0.4);
        }

        &.is-in-range {
          background-color: rgba($color, 0.6);
        }

        &.maz-active:not(:disabled) {
          background-color: $color;
        }

        &:hover {
          background-color: rgba($color, 0.4);
        }

        &:disabled {
          background-color: transparent;
        }
      }
    }
  }
}

.maz-is-dark {
  .maz-picker .month-picker__day:disabled {
    color: darken($core-picker-text-muted-dark, 50%);
  }
}
</style>
