<template>
  <CorePopper tag="div" trigger="hover" class="d-inline text-left" :boundarySelector="boundarySelector">
    <div slot="reference" class="username text-truncate" :class="{'expire': isExpired}">{{fullName}}</div>
    <div slot="popper" class="popper profile-container" @click.stop @dblclick.stop>
      <UserProfile :userId="userId"/>
    </div>
  </CorePopper>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";
import UserProfile from "@/components/UserProfile.vue";
import {UserDSModule} from "@/store";
import CorePopper from "@/components/Core/CorePopper.vue";
import { Inject } from "vue-property-decorator";

@Component({
  name: "ProfileColumn",
  components: {UserProfile, CorePopper }
})

export default class ProfileColumn extends BaseColumn {
  @Inject({from: 'CoreTableUniqueId'}) readonly boundarySelector!: string;

  get userId() {
    return UserDSModule.items[this.columnValue]?.referenceId;
  }

  get fullName(){
    return UserDSModule.items[this.columnValue]?.fullName || '';
  }
  
  get isExpired(){
     return this.rowData[`isDelayed`]
  }

}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';

.table-line {
  .username{
    color: var(--brand-color);
  }
  .expire{
      color: $resource-full-name-column-expire-color !important;
  }
  &.active, &.active-alternative{
    .username{
      color: #004487;
    }
  }
}
.profile-container {
  ::v-deep .information {
    max-width: 260px;
  }
}

</style>
