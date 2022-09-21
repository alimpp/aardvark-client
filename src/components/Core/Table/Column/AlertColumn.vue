<template>
  <div class="center">
    <i :class="materialIcon" :style="iconStyle" >{{ iconSrc }}</i>
  </div>
</template>

<script lang="ts">
import { ProfileDSModule } from "@/store";
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";

@Component({
  name: "AlertColumn",
})
export default class AlertColumn extends BaseColumn {
  get alert() {
    return this.columnValue;
  }

  get iconSrc() {
    if (!this.alert) {
      return 'drafts'
    } else {
      return 'markunread';
    }
  }

  get iconStyle() {
    if (!this.alert) {
      return {
				color: 'gray',
			}
    } else {
      return {
				color: ProfileDSModule.isDarkMode ? '#F2F2F2' : 'gray',
			}
    }
  }

  get materialIcon() {
    if (!this.alert) {
      return 'material-icons-outlined'
      
    } else {
      return 'material-icons';
    }
    
  }
}
</script>

<style lang="scss" scoped>
.center{
  text-align: center;
}
  i {
    font-size: 32px;
    width: 32px;
  }
</style>
