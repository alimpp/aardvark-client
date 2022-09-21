<template>
  <div class="assign-button" v-if="isEditMode && canEdit">
    <CoreBtn type="button" :loading="loading" :color="columnValue === true ? 'success' : 'danger'" size="mini" fab @click="onRowCellClick()">
      {{columnValue === true ? '+' : '-'}}
    </CoreBtn>
  </div>
</template>

<script lang="ts"> 
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';
import CoreBtn from '@/components/Core/CoreBtn.vue'
import store, { AssignmentDetailPhasesCSModule } from '@/store';


@Component({
  name: "AssignPhaseColumn",
  components: {CoreBtn}
})
export default class AssignPhaseColumn extends BaseColumn {
  store = store;
  loading = false;
  
  async onRowCellClick(){
    try {
      this.loading = true ;
      await this.onCellClick();
      this.loading = false ;
    } catch (e) {
      this.loading = false ;
    }
  }

  get isEditMode(): boolean {
     return AssignmentDetailPhasesCSModule.isEditMode;
  }
  
  get canEdit(): boolean{
    if (this.rowData[`isSystem`] || this.rowData['status'] !== '') {
      return false
    } else {
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
.assign-button {
    button {
        font-weight: bold;
        font-size: 16px;
    }
}

</style>