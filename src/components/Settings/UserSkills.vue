<template>
  <CoreTable
    class=" table"
    :datasource="userSkillsSource"
  />

</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import TableRow from "@/datamodels/base/tableRow";
import { UserSkillsCSModule } from "@/store";

@Component({
  name: "UserSkills",
  components: {
    CoreTable,
  },
})
export default class UserSkills extends Vue {

  get userSkillsSource(): TableCS<TableRow> {
    return UserSkillsCSModule;
  }
}
</script>

<style lang="scss" scoped>
</style>
