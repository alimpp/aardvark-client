<template>
  <div id="breadcrumb" class="d-flex align-items-center">
    <component :is="currentBreadcrumb" />
  </div>
</template>

<script lang="ts">
import { default as Vue } from "vue";
import { Component } from "vue-property-decorator"
import { BreadCrumbsCSModule } from "@/store";
import {EntityType} from "@/store/modules/datastore/applicationDS";
import NuggetBreadcrumbs from "./CrumbRenderers/NuggetBreadcrumbs.vue";
import ProjectBreadcrumbs from "./CrumbRenderers/ProjectBreadcrumbs.vue";
import ReleaseBreadcrumbs from "./CrumbRenderers/ReleaseBreadcrumbs.vue";
import SprintBreadcrumbs from "./CrumbRenderers/SprintBreadcrumbs.vue";

@Component({
  name: "BreadCrumb",
  components: {
    NuggetBreadcrumbs,
    ProjectBreadcrumbs,
    ReleaseBreadcrumbs,
    SprintBreadcrumbs
  }
})
export default class BreadCrumb extends Vue {

  get currentBreadcrumb() {
    switch (BreadCrumbsCSModule.selectedEntityType) {
      case EntityType.nugget:
      case EntityType.assignment:
        return NuggetBreadcrumbs;
      case EntityType.project:
        return ProjectBreadcrumbs;
      case EntityType.release:
        return ReleaseBreadcrumbs;
      case EntityType.sprint:
        return SprintBreadcrumbs;
      default:
        return null;
    }
  }

}
</script>
<style lang="scss">
#breadcrumb{
  height: 100%;
  width: 100%;

  @media (max-width:1024px) {
    display: none !important;
  }

  .crumb-container{
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .crumb{
    background-color: var(--primary-color);
    color: var(--text-color);
    height: 40px;
    min-width: 75px;

    .icon {
      margin-top: 7px;
      margin-right: -2px;
    }
    .material-icons {
      font-size: 22px;
      cursor: default;
    }
    p{
      color: var(--text-color);
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: fit-content;
      margin-right: auto;
      &:first-letter {
        text-transform: uppercase;
      }
    }
    &:first-child {
      border-bottom-left-radius: 3px;
      border-top-left-radius: 3px;
    }

    &:last-child {
      flex-shrink: 100000000;
    }

    &:not(:first-child) {
      margin-left: 0;
    }

    &:not(:last-child):not(:first-child) {
      flex-shrink: 10000;
    }

    &:first-child::before {
      display: none;
    }

    &:nth-child(n) {
      text-indent: 2px;
    }
    
    &::after {
      border-bottom: 20px solid transparent;
      border-left: 10px solid var(--primary-color);
      border-right: none;
      border-top: 20px solid transparent;
      top: 0;
      bottom: 0;
      content: "";
      height: 0;
      position: absolute;
      right: 0px;
      width: 0;
      z-index: 100;
      background-color: var(--second-color);
    }
    &::before {
      border-bottom: 20px solid transparent;
      border-left: 10px solid var(--second-color);
      border-right: none;
      border-top: 20px solid transparent;
      content: "";
      height: 0;
      left: 0;
      position: absolute;
      width: 0;
      z-index: 100;
      background-color: var(--primary-color);
    }
  }

}
</style>