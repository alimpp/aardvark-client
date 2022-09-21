<template>
  <div class="assign-button" v-if="isEditMode && canAssign && canEdit">
    <CoreBtn type="button" :loading="loading" :color="columnValue === true ? 'success' : 'danger'" size="mini" fab @click="onRowCellClick()">
      {{columnValue === true ? '+' : '-'}}
    </CoreBtn>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component"; 
import BaseColumn from '../Base/BaseColumn.vue';
import CoreBtn from '@/components/Core/CoreBtn.vue'
import store, {ProfileDSModule} from '@/store';

@Component({
  name: "AssignResourceColumn",
  components: {CoreBtn}
})
export default class AssignResourceColumn extends BaseColumn {
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

  get canEdit(): boolean {
    return (this.rowData && !(this.rowData['status'] === 'Complete'  || this.rowData['status'] === 'Approved' ))
  }
  get isEditMode(): boolean {
    return store.state.assignmentdetailresourcescs?.isEditMode;
  }

  get canAssign(): boolean{
     if (this.rowData['isSystemPhase']) {
      return true
    } else {
      // project maestro can assign any resource
      if (ProfileDSModule.isProjectMaestro) {
        return true;
      }

      //team lead can only assign other resources
      //TODO IF they are currently assigned themselves
      const selectedUser = this.rowData.id
      const {isLeadResource, identifier} = ProfileDSModule;
      return !(isLeadResource && selectedUser === identifier )
    }
  }
}
</script>

<style lang="scss" scoped>
.assign-button {
    button {
        font-weight: bold;
    }
}

</style>