<template>
  <div
    class="header-picker maz-p-2 maz-text-white maz-flex"
    :class="[`maz-bg-${color}`]"
  >
    <div
      v-if="hasDate"
      class="header-picker__date-container maz-flex-1 maz-flex maz-direction-column maz-space-around"
    >
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="header-picker__year maz-dots-text"
      >
        <span v-for="y in [year]" :key="y">
          {{ y }}
        </span>
      </TransitionGroup>
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="header-picker__date maz-dots-text"
      >
        <span v-for="date in [dateFormatted]" :key="date" class="maz-dots-text">
          {{ dateFormatted ? date : "-" }}
        </span>
      </TransitionGroup>
    </div>
    <div
      v-if="hasTime && !isTwelveFormat"
      class="header-picker__time maz-flex"
      :class="[!hasDate ? 'maz-flex-center' : 'maz-align-end']"
    >
      <TransitionGroup
        v-if="timeFormatted.hour"
        :name="transitionName"
        class="header-picker__hour maz-flex maz-justify-end"
      >
        <span v-for="hour in [timeFormatted.hour]" :key="hour">
          {{ hour }}
        </span>
      </TransitionGroup>
      <span class="header-picker__dots-divider">
        {{ timeFormatted.hour ? ":" : "-" }}
      </span>
      <TransitionGroup
        v-if="timeFormatted.minute"
        :name="transitionName"
        class="header-picker__minute"
      >
        <span v-for="min in [timeFormatted.minute]" :key="min">
          {{ min }}
        </span>
      </TransitionGroup>
    </div>
    <div
      v-else-if="hasTime"
      class="header-picker__time maz-flex"
      :class="[!hasDate ? 'maz-flex-center' : 'maz-align-end']"
    >
      <TransitionGroup
        :name="transitionName"
        class="header-picker__twelve maz-flex maz-justify-center"
      >
        <span v-for="(time, i) in [timeFormatted]" :key="`${time}-${i}`">
          {{ timeFormatted || "-" }}
        </span>
      </TransitionGroup>
    </div>
    <CoreBtn
      fab
      size="mini"
      no-shadow
      class="header-picker__close"
      @click="close"
    >
      <i class="material-icons">
        close
      </i>
    </CoreBtn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import moment from "moment";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import {
  getFormattedValuesIntl,
  getTimeFormat,
  EventBus
} from "@/utils/corepicker";

@Component({
  name: "HeaderPicker",
  components: { CoreBtn }
})
export default class HeaderPicker extends Vue {
  @Prop({ type: Object, default: null }) value!: any;
  @Prop({ type: String, required: true }) locale!: string;
  @Prop({ type: Boolean, required: true }) hasTime!: boolean;
  @Prop({ type: Boolean, required: true }) hasDate!: boolean;
  @Prop({ type: String, required: true }) format!: string;
  @Prop({ type: String, required: true }) color!: string;
  
  currentDate = this.value;
  transitionName = "maz-slidevnext";

  @Watch('value', { immediate: true })
  onValueChanged(): void {
    const newValueIsSmaller = this.currentDate
      ? this.currentValue.isBefore(this.currentDate)
      : false;
    this.transitionName = newValueIsSmaller
      ? "maz-slidevprev"
      : "maz-slidevnext";
    this.$nextTick((): void => {
      this.currentDate = this.currentValue;
    });
  }
  close(e: any): void {
    EventBus.$emit("close", e);
  }
  get isRangeMode(): boolean {
    return !!this.value && Object.keys(this.value).includes("start");
  }
  get currentValue(): any {
    if (this.isRangeMode) {
      return this.value.end || moment();
    }
    return this.value || moment();
  }
   get year(): any {
    return this.currentValue.year();
  }
   get dateFormatted(): any {
    const dates: any[]= [];
    const { locale } = this;
    if (this.isRangeMode) {
      dates.push(this.value.start, this.value.end);
    } else {
      dates.push(this.value);
    }
    return getFormattedValuesIntl({ locale, dates });
  }
  get timeFormatted(): any {
    return !this.isTwelveFormat
      ? {
          hour: this?.value?.format("HH") ?? null,
          minute: this?.value?.format("mm") ?? null
        }
      : this?.value?.format(this.timeFormat) ?? null;
  }
  get timeFormat(): any {
    return getTimeFormat(this.format);
  }
  get isTwelveFormat(): boolean {
    return this.timeFormat.includes("A") || this.timeFormat.includes("a");
  }
}
	</script>

<style lang="scss" scoped>
.header-picker {
  overflow: hidden;
  position: relative;
  height: 60px;

  &__year {
    position: relative;
    overflow: hidden;
    opacity: 0.7;
    height: 21px;
    line-height: 21px;
  }

  &__date {
    position: relative;
    overflow: hidden;
    min-height: 0;
    height: 22px;
    line-height: 22px;
    font-size: 1.285rem;
  }

  &__time {
    width: 147px;
    height: 100%;
    font-size: 1.285rem;
  }

  &__hour,
  &__minute,
  &__dots-divider {
    position: relative;
    overflow: hidden;
    min-height: 0;
    height: 22px;
    line-height: 22px;
  }

  &__twelve {
    position: relative;
    overflow: hidden;
    min-height: 0;
    height: 22px;
    line-height: 22px;
    width: 80px;
  }

  &__hour,
  &__minute {
    width: 22px;
  }

  &__close {
    display: none;

    i {
      font-size: 20px;
    }
  }
}
</style>
