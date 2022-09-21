<template>
  <div class="resource-full-name">
    <div :class="{'epxire': isExpired}">{{resource.fullName}}</div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";
import store from '@/store';

@Component({
  name: "ResourceFullNameColumn",
})
export default class ResourceFullNameColumn extends BaseColumn {
  get resource() {
    return this.columnValue;
  }
  get isExpired() {
    const assignedResourcesId = store.getters['assignmentdetailresourcescs/assignedResources'].map(resource => resource.id)
    return (this.resource.cadenceTempo && this.resource.cadenceTempo === 'at-risk') || (assignedResourcesId.includes(this.resource.id) && this.resource.delayedBy) 
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/assets/scss/variables';
.resource-full-name{
  white-space: nowrap;
  text-align: left;
  .epxire {
    color: $resource-full-name-column-expire-color;
  }
  div {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
