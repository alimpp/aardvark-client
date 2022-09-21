<template>
  <div class="response-time" :class="{'expired': (responseTime < 0 && !isDeclined)}">
    {{ decoratedColumnValue }}
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';

@Component({
  name: "ResponseTimeColumn",
})
export default class ResponseTimeColumn extends BaseColumn {
  public get responseTime() {
    return this.columnValue;
  }

  get isDeclined(): boolean{
    return ('reason' in this.rowData && this.rowData['reason'] === 'Declined') ;
  }

  get decoratedColumnValue(){
    if(this.isDeclined){
      return '-'
    }else if (!this.responseTime) {
        return '00:00'
    }
      const hour = Math.floor(this.responseTime)
      const minute = Math.floor((this.responseTime - hour) * 60)
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
}
</script>

<style lang="scss" scoped>
.response-time{
  @import 'src/assets/scss/variables';
  &.expired {
    color: $response-time-column-expired-color;
  }
}
</style>