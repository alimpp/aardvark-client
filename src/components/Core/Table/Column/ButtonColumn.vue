<template>
  <div class="button">
    <CoreBtn
      size="mini"
      :loading="$wait.is(waitState.ACTION_BUTTON_LOADING)"
      @click="onRowCellClick"
    >{{ label }}</CoreBtn>
  </div>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import BaseColumn from "../Base/BaseColumn.vue";
  import CoreBtn from "@/components/Core/CoreBtn.vue";
  import { Wait, WaitStates } from "@/utils/vuewait";


  @Component({
  name: "ButtonColumn",
  components: {CoreBtn }
})
export default class ButtonColumn extends BaseColumn {
  waitState = WaitStates;

  @Wait(WaitStates.ACTION_BUTTON_LOADING)
  async onRowCellClick(){
    await this.onCellClick();
  }

  get label() {
    return this.columnValue
  }
}
</script>

