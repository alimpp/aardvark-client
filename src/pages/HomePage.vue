<template>

  <div
    id="HomePage"
    class="container-fluid w-auto h-100"
  >
    <div class="row align-items-center h-100">
      <div class="col-xs-12 mx-auto">
        <!-- LOADING -->
        <MazLoader />

      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import {
  SkillDSModule, BadgeCountCSModule, BusinessRuleDSModule, TagDSModule, ProjectDSModule, PhaseDSModule, UserDSModule, GroupDSModule, WorkflowDSModule, DirectDSModule, ApplicationDSModule, GroupDetailsDSModule, ReleaseDSModule} from "@/store";
import { MazLoader } from "maz-ui";
import { Wait, WaitStates } from "@/utils/vuewait";

@Component({
  name: "HomePage",
  components: { MazLoader },
})
export default class HomePage extends Vue {
  @Wait(WaitStates.NAV_BAR_LOADING)
  async mounted() {
    await Promise.allSettled([
      BusinessRuleDSModule.doLoad(),
      BadgeCountCSModule.doLoad(),
      TagDSModule.doLoad(),
      SkillDSModule.doLoad(),
      ProjectDSModule.doLoad(),
      PhaseDSModule.doLoad(),
      UserDSModule.doLoad(),
      GroupDSModule.doLoad(),
      WorkflowDSModule.doLoad(),
      DirectDSModule.doLoad(),
      GroupDetailsDSModule.doLoad(),
      ReleaseDSModule.doLoad(),
    ]);
    ApplicationDSModule.setChatSidebarOpen(false)
    this.$router.push({ name: "inboxNugget" });
  }
}
</script>
