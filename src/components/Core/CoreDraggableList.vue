<template>
  <div
    class="maz-base-component maz-draggable-list maz-mb-3 maz-border-radius maz-border-color maz-border-solid maz-border main"
    :class="{
      'maz-is-dark': dark
    }"
  >
    <div v-if="header" slot="header" class="header maz-border-color maz-border-bottom maz-border-bottom-solid maz-align-center maz-pb-2 maz-mb-2">
        <span class="header-items" v-for="(item, index) in headerValue" :key="index">{{item}}</span>
        <CoreBtn
        class="header-button"
        v-if="headerActionButton"
        size="sm"
        @click="onHeaderAction"
        :disabled="disabled"
      >{{headerActionLable}}</CoreBtn>
    </div>
    <draggable
      v-model="items"
      v-bind="dragOptions"
      group="modules"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group
        type="transition"
        tag="div"
        :name="!drag ? 'maz-flip-list' : null"
      >
        <div
          v-for="(item, i) in value"
          :key="`${itemKey ? item[itemKey] : Object.values(item)[0]}`"
          class="maz-draggable-list__item maz-align-center maz-space-between list"
        >
          <!-- Default item displayed in list -->
          <slot
            :item="item"
            :index="i"
            tag="div"
          >
            <!-- `<span>{{ item }}</span>` -->
            <span>
              {{ item }}
            </span>
          </slot>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import CoreBtn from "@/components/Core/CoreBtn.vue";

/**
 * > Smart Draggable List
 */
export default {
  name: 'CoreDraggableList',
  components: { draggable, CoreBtn },
  props: {
    // Must be an `Array` (use `v-model`)
    value: { type: Array, required: true },
    // is the item's key to build le list (must be different for each item)
    itemKey: { type: String, default: null },
    // set dark theme
    dark: { type: Boolean, default: false },
    // set header
    header: { type: Boolean, default: false },
    headerValue: {type: Array, required: false},
    headerActionButton: {type: Boolean, default: false},
    onHeaderAction: {type: Function, reuired: false},
    headerActionLable: { type: String, default: '+' },
    disabled: {type: Boolean, default: false}
  },
  data() {
    return {
      drag: false,
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  computed: {
    items: {
      get() {
        return this.value
      },
      set(value) {
        // update the v-model
        // @arg list updated
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss">
  .main{
    padding: 8px;
  }
  .header-button{
    justify-self: end;
  }
  .list{
    div{
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 8px;
      justify-content: start;
      grid-auto-columns: 18%;
      text-align: center;
    }
    }
  .header{
    display: grid;
    grid-auto-flow: column;
    font-weight: bold;
    grid-column-gap: 8px;
    justify-content: start;
    grid-auto-columns: 18%;
    text-align: center;
  }
</style>
