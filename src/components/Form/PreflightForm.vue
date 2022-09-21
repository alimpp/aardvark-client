<template>
  <SimpleBar class="xeba-scrollbar preflight-container">
    <div
      slot="default"
      @submit.prevent="onConfirm"
    >
      <div
        class="warning"
        v-if="generateLog('warning').length"
      >
        <b>Warnings:</b>
        <p>The following nuggets are completed but not approved by the Project Maestro</p>
        <div
          v-for="item in generateLog('warning')"
          :key="item.id"
          class="sprint"
        >
          <p class="title">Sprint#{{item.number}}-{{item.title}}</p>
          <p
            v-for="nugget in item.nuggets"
            :key="nugget.number"
          >N{{nugget.number}}-{{nugget.title}}</p>
        </div>
      </div>
      <div
        class="pt-3"
        v-if="generateLog('error').length"
      >
        <b>Error:</b>
        <p>The following nuggets are not completed yet and are blocking the release</p>
        <div
          v-for="item in generateLog('error')"
          :key="item.id"
          class="sprint"
        >
          <p class="title ml-2 m-0 p-0">Sprint#{{item.number}}-{{item.title}}</p>
          <p
            v-for="nugget in item.nuggets"
            :key="nugget.number"
            class="ml-4"
          >N{{nugget.number}}-{{nugget.title}}</p>
        </div>
      </div>
      <div
        class="d-flex justify-content-center p-3"
        v-if="!generateLog('warning').length && !generateLog('error').length"
      >
        <img
          src="@/assets/icons/success.svg"
          alt="alt"
          width="70px"
        >
      </div>
    </div>
  </SimpleBar>

</template>

<script lang="ts">
import Component from "vue-class-component";
import DialogForm from "@/components/Form/Base/DialogForm.vue";
import { DialogCSModule, ReleaseDetailCSModule } from "@/store";
import SimpleBar from "simplebar-vue";

type SprintInfo = Record<string, any>;

@Component({
  name: "PreflightForm",
  components: {
    SimpleBar,
  },
})
export default class PreflightForm extends DialogForm {
  generateLog(logName: PropertyKey): SprintInfo[] {
    const decoratedLog = [] as SprintInfo[];
    let sprints = ReleaseDetailCSModule.preflightLog[logName].map((item: { sprint: SprintInfo }): SprintInfo => {
      return { id: item.sprint.id, title: item.sprint.name, number: item.sprint.number };
    });
    sprints = sprints.reduce((unique: SprintInfo[], o: SprintInfo): any => {
      if (!unique.some((obj: SprintInfo): boolean => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    }, []);
    sprints.forEach((sprint: SprintInfo): void => {
      const sprintNuggets = ReleaseDetailCSModule.preflightLog[logName].filter(
        (nugget: { sprint: SprintInfo}): boolean => nugget.sprint.id === sprint.id
      );
      sprint.nuggets = sprintNuggets;
      decoratedLog.push(sprint);
    });
    return decoratedLog;
  }

  async onConfirm() {
    DialogCSModule.clear();
  }

  onOpened() {
    return;
  }

  onBeforeClosed() {
    DialogCSModule.clear();
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.preflight-container {
  max-height: 400px;
}
b {
  color: $brand-color;
}
.sprint {
  .title {
    color: $brand-color;
  }
}
</style>