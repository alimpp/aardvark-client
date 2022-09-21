<template>
  <tr
    class="table-line maz-align-center"
    :class="{
      'active': isActive,
      'active-alternative': isActiveAlt
    }"
  >
    <td
      v-for="(columnSchema, index) in datasource.tableSchema"
      @click="onHandleClick($event, index)"
      @dblclick="$emit('dblclick')"
      :key="columnSchema.key"
      class="table-line__cell text-center"
      :class="{'maz-flex-1': columnSchema.width === 'max'}"
      :style="{'width': columnSchema.width ? columnSchema.width : null,
      'max-width': columnSchema.maxWidth ? columnSchema.maxWidth : null,
      'min-width': columnSchema.minWidth ? columnSchema.minWidth : null,
      'white-space': columnSchema.whiteSpace ? columnSchema.whiteSpace : 'nowrap'}"
    >
    <div class="column mx-2 my-1 d-flex flex-column justify-content-center">
      <!-- If data is a date -->
      <DateColumn
        v-if="columnSchema.type === 'date'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
        filter="L"
        class="maz-fs-12"
      />
      <!-- If data is a status -->
      <StatusColumn
        v-else-if="columnSchema.type === 'status'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a comment -->
      <CommentColumn
        v-else-if="columnSchema.type === 'comment'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a tempo -->
      <TempoColumn
        v-else-if="columnSchema.type === 'tempo'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a checkbox -->
      <CheckboxColumn
        v-else-if="columnSchema.type === 'checkbox'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a perspective -->
      <PerspectiveColumn
        v-else-if="columnSchema.type === 'perspective'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a cadence -->
      <cadenceColumn
        v-else-if="columnSchema.type === 'cadence'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a tag -->
      <TagColumn
        v-else-if="columnSchema.type === 'tag'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a response time -->
      <ResponseTimeColumn
        v-else-if="columnSchema.type === 'responseTime'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a alert -->
      <AlertColumn
        v-else-if="columnSchema.type === 'alert'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a Sprint -->
      <SprintColumn
        v-else-if="columnSchema.type === 'sprintDropdown'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a Return To Triage -->
      <ReturnToTriageColumn
        v-else-if="columnSchema.type === 'returnToTriage'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a timecard date -->
      <TimecardDateColumn
        v-else-if="columnSchema.type === 'timecardDate'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
        filter="L"
      />
      <!-- If data is a assignment date -->
      <AssignmentDateColumn
        v-else-if="columnSchema.type === 'assignmentDate'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
        filter="L"
      />
      <!-- If data is a assign resource button -->
      <AssignResourceColumn
        v-else-if="columnSchema.type === 'assignResource'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />

      <!-- If data is a assign phase button -->
      <AssignPhaseColumn
        v-else-if="columnSchema.type === 'assignPhase'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a resource fullname -->
      <ResourceFullNameColumn
        v-else-if="columnSchema.type === 'resourceFullName'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a specialty -->
      <SpecialtyColumn
        v-else-if="columnSchema.type === 'specialty'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a phase -->
      <PhaseColumn
        v-else-if="columnSchema.type === 'phases'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a project -->
      <ProjectColumn
        v-else-if="columnSchema.type === 'project'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a assignment phase -->
      <AssignmentPhaseColumn
        v-else-if="columnSchema.type === 'assignmentPhase'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a avatar -->
      <AvatarColumn
        v-else-if="columnSchema.type === 'avatarColumn'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a user skill -->
      <UserSkillsColumn
        v-else-if="columnSchema.type === 'skillDropdown'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a Button -->
      <ButtonColumn
        v-else-if="columnSchema.type === 'button'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      <!-- If data is a User Profile -->
      <ProfileColumn
        v-else-if="columnSchema.type === 'profile'"
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />
      
      <TextColumn
        v-else
        ref="column"
        :datasource="datasource"
        :columnSchema="columnSchema"
        :rowData="rowData"
      />

      </div>
    </td>
  </tr>

</template>

<script lang="ts">
import Component from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";
import Vue from "vue";

  import StatusColumn from '../Column/StatusColumn.vue'
  import CommentColumn from '../Column/CommentColumn.vue'
  import TextColumn from '../Column/TextColumn.vue'
  import DateColumn from '../Column/DateColumn.vue'
  import TempoColumn from '../Column/TempoColumn.vue'
  import CheckboxColumn from '../Column/CheckboxColumn.vue'
  import PerspectiveColumn from '../Column/PerspectiveColumn.vue'
  import TagColumn from '../Column/TagColumn.vue'
  import ResponseTimeColumn from '../Column/ResponseTimeColumn.vue'
  import TableCS from "@/store/modules/componentstore/base/tableCS";
  import TableRow from "@/datamodels/base/tableRow";
  import AlertColumn from '../Column/AlertColumn.vue';
  import SprintColumn from '../Column/SprintColumn.vue';
  import TimecardDateColumn from '../Column/TimecardDateColumn.vue'
  import ReturnToTriageColumn from '../Column/ReturnToTriageColumn.vue';
  import AssignResourceColumn from '../Column/AssignResourceColumn.vue';
  import AssignPhaseColumn from '../Column/AssignPhaseColumn.vue';
  import AssignmentDateColumn from '../Column/AssignmentDateColumn.vue'
  import ResourceFullNameColumn from '../Column/ResourceFullNameColumn.vue'
  import cadenceColumn from "@/components/Core/Table/Column/CadenceColumn.vue";
  import SpecialtyColumn from "../Column/SpecialtyColumn.vue";
  import PhaseColumn from "../Column/PhaseColumn.vue";
  import ProjectColumn from "../Column/ProjectColumn.vue";
  import AssignmentPhaseColumn from "../Column/AssignmentPhaseColumn.vue";
  import AvatarColumn from "@/components/Core/Table/Column/AvatarColumn.vue";
  import UserSkillsColumn from "@/components/Core/Table/Column/UserSkillsColumn.vue";
  import ButtonColumn from "@/components/Core/Table/Column/ButtonColumn.vue";
  import ProfileColumn from "@/components/Core/Table/Column/ProfileColumn.vue";
  import BaseColumn from "../Base/BaseColumn.vue";


@Component({
  name: "TableLine",
  components: {
    StatusColumn,
    CommentColumn,
    TextColumn,
    DateColumn,
    TempoColumn,
    CheckboxColumn,
    PerspectiveColumn,
    cadenceColumn,
    TagColumn,
    ResponseTimeColumn,
    AlertColumn,
    TimecardDateColumn,
    ReturnToTriageColumn,
    SprintColumn,
    AssignResourceColumn,
    AssignPhaseColumn,
    AssignmentDateColumn,
    ResourceFullNameColumn,
    SpecialtyColumn,
    PhaseColumn,
    ProjectColumn,
    AssignmentPhaseColumn,
    AvatarColumn,
    UserSkillsColumn,
    ButtonColumn,
    ProfileColumn
  },
})
export default class TableLine extends Vue {
  @Prop({ type: Object, default: Object }) datasource!: TableCS<TableRow>;
  @Prop({ type: Object, default: Object }) rowData!: TableRow;
  @Ref('column') column!: BaseColumn[];

  onHandleClick(event: PointerEvent, index: number) {
    if(!this.column[index]?.preventClickRowSelection) {
      this.$emit('click', event);
    }
  }

  get isActive() {
    if(this.rowData?.id && this.datasource.selectedRows[0]) {
      return this.datasource.selectedRows[0].id === this.rowData.id;
    }
    return false;
  }

  get isActiveAlt() {
    if(!this.isActive && this.rowData?.id && this.datasource.selectedRows.length > 1) {
      return this.datasource.selectedRows.some(selectedRow => selectedRow.id === this.rowData.id);
    }
    return false;
  }

}
</script>

<style lang="scss" scoped>
@import "../../../../assets/scss/variables";

.column {
   min-height:35px;
}

.table-line {

  // Set border-radius on the top-left and bottom-left of the first table data on the table row
  td:first-child,
  th:first-child {
    border-radius: 8px 0 0 8px;
  }

  // Set border-radius on the top-right and bottom-right of the last table data on the table row
  td:last-child,
  th:last-child {
    border-radius: 0 8px 8px 0;
  }

  background-color: var(--primary-color);
  color: var(--text-color);

  &:hover {
    box-shadow: 0 0 0 0.2rem var(--light-color);
    background-color: var(--hover-color);
    color: var(--text-color);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem var(--light-color);
    background-color: var(--hover-color);
  }


  min-width: 1000px;
  border-radius: 8px;
  margin: 0px 0;
  cursor: pointer;
  user-select: none;
  border: none;
  outline: none;
  width: 100%;
  min-height: 50px;
  padding: 0;
  box-shadow: 0 6px 10px 0 rgba(12, 8, 60, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &__cell {
    border-right: 1.5px solid var(--second-color);
    font-size: 1rem;
    font-family: $base-font-family;
    height: 100%;
    min-width: 0;

    &:last-child {
      border-right: none;
    }
  }

  &.active {
    background-color: var(--brand-color) !important;
  }

  &.active-alternative{
    background-color: darken($brand-color, 15);
  }

  &.active, &.active-alternative{
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba($brand-color, 0.7);
    }
    color: #fff;
    .table-line__cell {
      //removed due to coloring artifact caused when selected row is added/removed. The animation fade in-out animation tranisition causes color changes that interact with the darken() causing issues.
      // border-right: 1.5px solid darken($brand-color, 8%);
      &:last-child {
        border-right: none;
      }
    }
  }

}
</style>
