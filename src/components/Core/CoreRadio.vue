<template>
  <div
    class="maz-base-component maz-radio maz-flex maz-align-center"
    :class="[`maz-radio--${color}`]"
  >
    <input
      :id="uniqueId"
      :checked="value === radioValue"
      :name="name"
      :value="radioValue"
      type="radio"
      class="maz-mr-2"
      @change="$emit('input', $event.target.value)"
      :disabled="disabled"
    >
    <label
      :for="uniqueId"
      class="maz-m-0 maz-flex maz-align-center"
    >
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import uniqueId from "./../../mixins/uniqueId";

@Component({
  name: "CoreRadio",
  mixins: [uniqueId]
})
export default class CoreRadio extends Vue {
  @Prop({ type: String, required: false }) value!: string;
  @Prop({ type: String, default: null }) id!: string | null;
  @Prop({ type: String, default: "primary" }) color!: string;
  @Prop({ type: String, default: "maz-radio" }) name!: string;
  @Prop({ type: String, required: true }) radioValue!: string;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
}
</script>

<style lang="scss">
@import 'src/assets/scss/variables';

.maz-radio {
  transition: all 300ms ease-in-out;
  cursor: pointer;
  margin-left: 2px;
  min-height: 22px;

  [type= 'radio']:not(:checked),
  [type= 'radio']:checked {
    position: absolute;
    left: -9999px;
  }

  [type= 'radio']:not(:checked) + label,
  [type= 'radio']:checked + label {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    user-select: none;
  }

  [type= 'radio'] + label::before {
    border: 1px solid transparent;
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 18px;
    height: 18px;
    background: transparent;
    border-radius: 50%;
    transition: all 300ms ease-in-out;
  }

  [type= 'radio']:not(:checked) + label::before {
    border-color: $grey-color;
  }

  [type= 'radio']:not(:checked) + label::after,
  [type= 'radio']:checked + label::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 4px;
    font-size: 1rem;
    width: 10px;
    height: 10px;
    transition: all 300ms ease-in-out;
    border-radius: 50%;
  }

  [type= 'radio']:not(:checked) + label::after {
    opacity: 0;
    transform: scale(0);
  }

  [type= 'radio']:checked + label::after {
    opacity: 1;
    transform: scale(1);
  }


  [type= 'radio']:checked + label::before {
    border-color: $brand-color;
  }

  [type= 'radio']:not(:checked) + label::after,
  [type= 'radio']:checked + label::after {
    background-color: $brand-color;
    color: $brand-color;
  }
}
</style>