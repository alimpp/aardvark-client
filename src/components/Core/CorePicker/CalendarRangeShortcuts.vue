<template>
  <div
    :style="[
      {
        height: `${height}px`,
        width: `${140}px`,
        minWidth: `${140}px`
      }
    ]"
    class="range-shortcuts maz-flex maz-direction-column maz-px-2 maz-py-1 maz-border-color maz-border-right maz-border-right-solid maz-overflow-y-auto"
  >
    <CoreBtn
      v-for="shortcut in shortcuts"
      :key="shortcut.key"
      :active="selectedShortcut === shortcut.key"
      size="sm"
      :color="color"
      tabindex="-1"
      :class="[
        selectedShortcut !== shortcut.key
          ? `maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-${color}`
          : `maz-focus-${color}`
      ]"
      class="shortcut-button maz-flex-1 maz-my-1 maz-bg-transparent maz-no-shadow"
      @click="select(shortcut)"
    >
      <span class="maz-flex-1">{{ shortcut.label }}</span>
    </CoreBtn>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from "vue-property-decorator";
  import moment from "moment";
  import { EventBus } from "@/utils/corepicker";
  import CoreBtn from "@/components/Core/CoreBtn.vue";

  const SHORTCUT_TYPES = [
    "day",
    "date",
    "-day",
    "isoWeek",
    "-isoWeek",
    "month",
    "-month",
    "quarter",
    "year",
    "-year",
    "week",
    "-week"
  ];

  const dateFn = value => {
    switch (value) {
      case "year":
      case "month":
      case "quarter":
      case "week":
      case "isoWeek":
      case "day":
      case "date":
        return {
          start: moment().startOf(value),
          end: moment().endOf(value),
          value
        };
      case "-month":
        return {
          start: moment()
            .subtract(1, "months")
            .startOf("month"),
          end: moment()
            .subtract(1, "months")
            .endOf("month"),
          value
        };
      case "-year":
        return {
          start: moment()
            .subtract(1, "years")
            .startOf("year"),
          end: moment()
            .subtract(1, "years")
            .endOf("year"),
          value
        };
      case "-week":
        return {
          start: moment()
            .subtract(1, "weeks")
            .startOf("week"),
          end: moment()
            .subtract(1, "weeks")
            .endOf("week"),
          value
        };
      case "-isoWeek":
        return {
          start: moment()
            .subtract(1, "weeks")
            .startOf("isoWeek"),
          end: moment()
            .subtract(1, "weeks")
            .endOf("isoWeek"),
          value
        };
      case "-day":
        return {
          start: moment()
            .subtract(1, "days")
            .startOf("day"),
          end: moment()
            .subtract(1, "days")
            .endOf("day"),
          value
        };
    }
  };

  @Component({
    name: "CalendarRangeShortcuts",
    components: { CoreBtn }
  })
  export default class CalendarRangeShortcuts extends Vue {
    @Prop({ type: String, default: null }) value!: string;
    @Prop({ type: String, default: null }) color!: string;
    @Prop({ type: Number, required: true }) height!: number;
    @Prop({ type: Array, default: Array, validator: val => val.every(shortcut => {
        const isValueInteger = Number.isInteger(shortcut.value)
        const isFunction = typeof shortcut.value === 'function'
        return shortcut.key && shortcut.label && (isValueInteger || isFunction ? true : SHORTCUT_TYPES.includes(shortcut.value))
      })
    }) shortcuts!: any[];
    computedTypes: any = {};
    selectedShortcut: any = null;

    @Watch("shortcuts", { immediate: true })
    onShortcutsChanged(): void {
      this.init();
    }
    mounted(): void {
      EventBus.$on("day-selected", () => {
        this.selectedShortcut = null;
      });
    }
    beforeDestroy(): void {
      EventBus.$off("day-selected");
    }
    private init(): void {
      /**
       * Find the pre-selected shortcut
       */
      if (this.value) {
        const selectedShortcut = this.shortcuts.find(
          (shortcut: { key: any }) => shortcut.key === this.value
        );
        if (selectedShortcut) this.select(selectedShortcut);
      }
    }

    getShortcutByKey(shortcutKey: null | string): any {
      const shortcut = this.shortcuts.find(
        (sc: { key: null }) => sc.key === shortcutKey
      );
      if (!shortcut) return false;
      const { value } = shortcut;

      /**
       * Case where the value is a specific number of days.
       */
      if (typeof value === "number") {
        return {
          start: moment().subtract(value, "d"),
          end: moment(),
          value
        };
      }

      /**
       * Case where the value is a function that is in charge of
       * handling the start & end values
       */
      if (typeof value === "function") {
        const { start, end } = value();

        if (!start || !end) throw new Error('Missing "start" or "end" values.');
        if (!moment.isMoment(start) || !moment.isMoment(end))
          throw new Error('The "start" or "end" values are not moment objects.');

        return {
          start,
          end
        };
      }

      return dateFn(value);
    }

    select(shortcut: any): void {
      this.selectedShortcut = shortcut.key;
      const { start, end, value } = this.getShortcutByKey(this.selectedShortcut);
      this.$emit("change-range", { start, end, value });

      /**
       * Calls a callback function (if defined) on shortcut click
       */
      if (shortcut.callback) {
        if (typeof shortcut.callback !== "function")
          throw new Error("The callback must be a function.");
        shortcut.callback({
          shortcut,
          start,
          end
        });
      }
    }
  }
</script>
