<template>
  <nav id="navigation-bar" class="container-fluid col-12 mh-100 overflow-hidden px-0 py-2">
    <div class="col-12 mh-100 row flex-nowrap align-items-center justify-content-between no-gutters py-0 px-1 mx-auto overflow-hidden">
      <MaestroIcon
        id="logo"
        class="maestro-icon navbar-logo-img flex-grow-0 flex-shrink-0 logo overflow-visible w-10"
        width="48px"
        height="48px"
      />
      <div class="col crumb-layout pl-0" v-show="isCrumbVisible">
        <BreadCrumb class="col crumb-layout p-0 px-1" />
      </div>
      <div :class="['col','no-gutters', 'search-bar-expanded']">
        <Search v-if="isAuthenticated" class="col search-bar-shrinked" />
      </div>
      <div class="right-detail" :style="{'width': rightDetailWidth + 'px'}">
        <div class="col row align-items-center justify-content-between button-layout flex-nowrap">
          <div class="px-0 flex-grow-1">
            <CoreBtn
              v-if="canCreate"
              size="sm"
              class="core-button"
              @click="loadDialog"
              > Create {{currentModule}}
            </CoreBtn>
          </div>
          <SocketStatus class="pr-3" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { ApplicationDSModule, DialogCSModule, ProfileDSModule } from "@/store";
import { MazSwitch } from "maz-ui";
import { Getter } from "vuex-class";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb.vue";
import Search from "@/components/Search.vue";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import {
  ModuleName,
  ModuleTabName,
} from "@/store/modules/datastore/applicationDS";
import CreateProjectForm from "./Form/CreateProjectForm.vue";
import CreateReleaseForm from "./Form/CreateReleaseForm.vue";
import MaestroIcon from "@/components/Icons/MaestroIcon.vue";
import { EventBus } from "@/utils/eventBus";
import { EVENTS } from "@/utils/constants";
import DialogForm from "./Form/Base/DialogForm.vue";
import SocketStatus from "./SocketStatus.vue";

@Component({
  name: "Header",
  components: { MazSwitch, BreadCrumb, Search, CoreBtn, MaestroIcon, SocketStatus },
})
export default class Header extends Vue {
  @Getter("isAuthenticated", { namespace: "applicationds" })
  isAuthenticated!: boolean;
  text = "";
  isExpand = false;
  rightDetailWidth = 440;

  get currentModule() {
    if (
      ApplicationDSModule.selectedModule === ModuleName.projects &&
      ApplicationDSModule.selectedModuleTab !==
      ModuleTabName.projectsProjectNugget &&
      ApplicationDSModule.selectedModuleTab !==
      ModuleTabName.projectsSprintNugget
    ) {
      return "Project";
    } else if (ApplicationDSModule.selectedModule === ModuleName.releases)
      return "Release";
    else
      return null;
  }

  get canCreate() {
    return this.isAuthenticated && this.isAuthorized;
  }

  get isCrumbVisible(): boolean {
    return !ApplicationDSModule.selectedModule.contains(ModuleName.people, ModuleName.groups, ModuleName.settings,  ModuleName.none);
  }

  loadDialog() {
    let content!: typeof DialogForm;
    let width!: number;
    switch (this.currentModule) {
      case "Project":
        content = CreateProjectForm;
        width = 800;
        break;
      case "Release":
        content = CreateReleaseForm;
        width = 800;
        break;
      default:
        break;
    }

    DialogCSModule.load({
      title: `Create ${this.currentModule}`,
      isShowingDialog: true,
      noClose: true,
      confirmLabel: "Create",
      width: width,
      content,
    });
  }

  searchFocus() {
    this.isExpand = true;
  }

  searchBlur() {
    if (!this.text)
      this.isExpand = false;
  }

  get searchText() {
    return this.text;
  }

  set searchText(value: string) {
    this.text = value;
    this.isExpand = !!value;
  }

  get isMaestro(){
    return !(this.currentModule === "Project" && !ProfileDSModule.isProjectMaestro)
  }

  private get isAuthorized() {
    switch (this.currentModule) {
      case "Project":
        return ProfileDSModule.isProjectMaestro;
      case "Release":
        return ProfileDSModule.isReleaseMaestro;
      default:
        return !!this.currentModule;
    }
  }

  mounted() {
    EventBus.$on(EVENTS.DETAILSIDEBAR_WIDTH_CHANGED, (width: number) => {
      this.rightDetailWidth = width;
    })
  }

  beforeDestroy() {
    EventBus.$off(EVENTS.DETAILSIDEBAR_WIDTH_CHANGED)
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.maestro-icon {
  padding-left: 6px;
  padding-right: 1px;
}

.right-detail {
  width: #{$detail-sidebar-width};
  transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
  transition-duration: 0.1s;
}

#navigation-bar {
  background-color: var(--second-color);
  overflow: hidden;
  white-space: nowrap;
  column-gap: 10px;
  width: 100%;

  > div.row > div.col {
    height: 45px;
    padding-inline-end: 10px;
    padding-inline-start: 10px;
    &.search-bar-expanded {
      min-width: unset;
      flex: 0 0 31vw;
    }
    &:not(.search-bar-expanded) > div.col.search-bar-shrinked {
      min-width: unset;
      flex: 0 0 20vw;
    }
  }
  .button-layout {
    flex: 0 0 300px;
  }
  .core-button {
    font-size: $base-font-size;
    font-family: inherit;
    margin-right: 8.5rem;
    height: 40px;
  }
  .crumb-layout {
    flex: 1;
    overflow: hidden;
  }
}
</style>
