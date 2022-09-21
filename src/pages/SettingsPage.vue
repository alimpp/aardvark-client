<template>
  <div id="Settings" class="d-flex max-height overflow-hidden">
    <SettingsNavigationSidebar />
    <div class="content w-100">
      <SettingsHeader/>

      <keep-alive>
        <router-view class="maz-h-100" ref="rightForm"/>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SettingsHeader from "@/components/Settings/SettingsHeader.vue";
import { HolidayTypesDSModule } from "@/store";

@Component({
  name: "SettingsPage",
  components: {
    SettingsNavigationSidebar: () =>
      import(
        /* webpackChunkName: "settingsNavigationSidebar" */ "@/components/SettingsNavigationSidebar.vue"
      ),
    SettingsHeader,
  },
})
export default class SettingsPage extends Vue {

  rightDetailWidth = 430

  async updated()
  {
    this.rightSideWidth()
  }

  async mounted() {
    await HolidayTypesDSModule.doLoad()
  }

  rightSideWidth() {
    const contact = this.$refs.rightForm as any
    const classForms = contact.$el.querySelector(".form .simplebar-wrapper")
    if (classForms) return classForms.style.width = (this.rightDetailWidth+ 'px')
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/scss/variables";
#Settings {
  width: 100% !important;
  ::v-deep .main-container {
    width: 100%;
    height:calc(100vh - 7rem) !important;
    display: grid;
    grid-template-columns: 3fr 1fr;
    .form {
      padding: 8px;
    }
    .content {
      display: grid;
      border-right: 2px solid $grey-color-light;
      padding: 8px;
    }
    .simplebar-wrapper {
      height: 100vh;
    }
  }
}
</style>
