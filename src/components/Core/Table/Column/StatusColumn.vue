<template>
  <span
    class="table-lines-status maz-flex maz-align-center maz-justify-center"
  >
    <div :class="`maz-label maz-label-${colorLabel}`">
      {{ statusText }}
    </div>
  </span>

</template>

<script lang="ts">
  export const GetStatusText = (status) => {
    switch (status) {
      case 'all':
        return 'All requests'
      case 'waiting':
        return 'Waiting'
      case 'reserved':
        return 'Reserved'
      case 'inProgress':
        return 'In progress'
      case 'toTreat':
        return 'To treat'
      case 'finished':
        return 'Finished'
      default:
        return status
    }
  }

  export const GetStatusClassColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'warning'
      case 'reserved':
        return 'dark'
      case 'inProgress':
        return 'info'
      case 'toTreat':
        return 'danger'
      case 'finished':
        return 'success'
      default:
        return null
    }
  }
  import Component from "vue-class-component";
  import BaseColumn from "../Base/BaseColumn.vue";

  @Component({
  name: "StatusColumn"
})
export default class StatusColumn extends BaseColumn {

  public get statusText(): string {
    //@ts-ignore
    return GetStatusText(this.columnValue);
  }

  public get colorLabel(): string {
    //@ts-ignore
    return GetStatusClassColor(this.columnValue) || '';
  }
}
</script>
