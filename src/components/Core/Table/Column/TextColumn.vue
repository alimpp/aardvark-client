<template>
  <div class="text-column" :class="[{'declined-color': isDeclined}, Assigned , Estimated]">
    {{ renderText }}
  </div>
</template>

<script lang="ts">

import { Component } from "vue-property-decorator";
import BaseColumn from "../Base/BaseColumn.vue";
@Component({
  name: "TextColumn",
})
export default class TextColumn extends BaseColumn {

  get isDeclined(): boolean{
      return ( this.columnSchema &&
      'reason' in this.rowData &&
      this.rowData['reason'] === 'Declined' &&
               (this.columnSchema.id === 'reason' || this.columnSchema.id === 'resource' )
               ) ;
  }

  get renderText(): string {
    return this.columnValue?.toString();
  }

  get Assigned(): string | boolean{
      if( this.columnSchema.id === 'assignmentLevel'){
       switch (this.rowData['assignmentLevel']) {
          case 'None':
            return 'None'
          case "Partial":
            return 'Partial';
          case 'Full':
            return 'Full';
          default:
            return false;
        }
     }else{
       return false
     }
  }

    get Estimated(): string | boolean{
      if( this.columnSchema.id === 'estimated'){
       switch (this.rowData['estimated']) {
          case 'None':
            return 'None'
          case "Partial":
            return 'Partial';
          case 'Full':
            return 'Full';
          default:
            return false;
        }
     }else{
       return false
     }
  }

}
</script>

<style lang="scss">
@import 'src/assets/scss/variables';

.text-column {
  text-align: left;
  &.None{
    color: $assigned-column-isNone;
  }
  &.Partial{
    color: $assigned-column-isPartial
  }
  &.Full{
    color: $assigned-column-isFull;
  }
}
.declined-color{
  color: $reason-column-declined-color;
}

.table-line {
  &.active {
    p {
      a {
        color: $dark-color;
      }
    }
  }
}
</style>
