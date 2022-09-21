
<template>
  <div
    class="maz-base-component core-checkbox"
    :class="[`core-checkbox--custom`,
    {
      'is-disabled': disabled
    }]"
  >
    <input
      :id="uniqueId"
      :checked="value"
      v-bind="$attrs"
      :name="name"
      type="checkbox"
      class="maz-mr-2"
      :disabled="disabled"
      @change="$emit('input', $event.target.checked)"
    />
    <label :for="uniqueId" class="maz-m-0 maz-flex maz-align-center">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import uniqueId from "./../../mixins/uniqueId";

@Component({
  name: "CoreCheckBox",
  mixins: [uniqueId]
})
export default class CoreCheckBox extends Vue {
  @Prop({ type: Boolean, required: true, default: false }) value!: boolean;
  @Prop({ type: String, default: null }) id!: string | null;
  @Prop({ type: String, default: "primary" }) color!: string;
  @Prop({ type: String, default: "maz-checkbox" }) name!: string;
  @Prop({ type: Boolean, default: false }) disabled!: boolean; 
}
</script>

<style lang="scss">
  .maz-is-dark .maz-base-component:not(.maz-btn).is-disabled{
    color: #777777;
  }
  .is-disabled.core-checkbox {
      [type= 'checkbox']:not(:checked) {
      + label::before {
        border-color: #636363;
      }
    }
    [type= 'checkbox']:not(:checked) + label,
    [type= 'checkbox']:checked + label {
      cursor: not-allowed;
    }
    }
  .core-checkbox {
    transition: all 300ms ease-in-out;
    cursor: pointer;
    margin-left: 2px;
    min-height: 22px;

    [type= 'checkbox']:not(:checked),
    [type= 'checkbox']:checked {
      display: none;
    }

    [type= 'checkbox']:not(:checked) + label,
    [type= 'checkbox']:checked + label {
      position: relative;
      padding-left: 25px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 300ms ease-in-out;
      user-select: none;
    }

    [type= 'checkbox'] + label::before {
      border: 2px solid transparent;
      content: '';
      position: absolute;
      left: 0;
      top: 2px;
      width: 18px;
      height: 18px;
      background: transparent;
      border-radius: 4px;
      transition: all 300ms ease-in-out;
    }

    [type= 'checkbox']:focus + label::before {
      border: 2px solid #A2CCB4;
      content: '';
      position: absolute;
      left: 0;
      top: 2px;
      width: 18px;
      height: 18px;
      background: transparent;
      border-radius: 4px;
      transition: all 300ms ease-in-out;
    }

    [type= 'checkbox']:not(:checked) {
      + label::before {
        border-color: #198648;
      }
    }

    [type= 'checkbox']:not(:checked) + label::after,
    [type= 'checkbox']:checked + label::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 4px;
      width: 10px;
      height: 10px;
      transition: all 300ms ease-in-out;
      border-radius: 2px;
    }

    [type= 'checkbox']:not(:checked) + label::after {
      opacity: 0;
      transform: scale(0);
    }

    [type= 'checkbox']:checked + label::after {
      opacity: 1;
      transform: scale(1);
    }

    [type= 'checkbox']:checked + label::before {
      border-color: #198648;
    }

    [type= 'checkbox']:not(:checked) + label::after,
    [type= 'checkbox']:checked + label::after {
      background-color: #198648;
      color: #A2CCB4;
    }

    [type= 'checkbox']:focus {
      + label::before {
        box-shadow: 0 0 0 .143rem rgba(25, 133, 74, 0.6);
        border-color:  #198648;
      }

      + label::after {
        background-color: #198648;
      }

    }

  }
</style>
