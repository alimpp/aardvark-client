<template>
  <CoreSpinner v-if="isLoading" :size="25" class="d-flex justify-self-center align-self-center"/>
  <div class="cadence" :class="borderColor" v-else-if="showingCadance && !isLoading">
    <div ref="filled" :class="['filled']"></div>
    <CorePopper v-if="totalHours > 0" trigger="hover" :disabled="cadenceType !== types.resource">
      <div slot="popper">
        {{cadence.isDelayedByEstimatedHours === true ? cadence.lastDelayedBy :`${workedHours}/${totalHours}`}}
      </div>
       <div class="hours-label" slot="reference">
        <span>
          <span>{{`${workedHours}/`}}</span>
          <span :class="{expired: cadence.isDelayedByEstimatedHours === true}">{{ `${totalHours}` }}</span>
        </span>
      </div>
    </CorePopper>
    <div v-else class="not-assigned-label">
      {{ notAssignedLabel }}
    </div>
  </div>
</template>

// TODO: Need to update this for phase status
// - Is assigned, has hours
// - Is assigned, no hours
// - not assigned
// - skipped
<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from '../Base/BaseColumn.vue';
import {Watch, Ref} from "vue-property-decorator";
import { cadenceTypes} from "@/utils/create-cadence";
import CorePopper from '@/components/Core/CorePopper.vue';
import CoreSpinner from "@/components/Core/CoreSpinner.vue";

@Component({
  name: "cadence",
  components: {CorePopper, CoreSpinner}
})
export default class CadenceColumn extends BaseColumn {
  @Ref('filled') readonly filled!: HTMLDivElement
  types = cadenceTypes;

  get notAssignedLabel() {
    if(this.cadence === undefined) {
      return 'Not Assigned'
    } else if (this.cadenceType === cadenceTypes.phase && this.rowData['status'] === '') {
      return 'Not Assigned'
    } else {
      return 'Estimating'
    }
  }

  get isLoading() {
    return this.datasource.isLoadingColumn(this.columnSchema, this.rowData)[this.columnSchema.title]
  }

  get progress() {
    return this.columnValue?.progress
  }

  get cadenceType() {
    return this.columnValue?.cadenceType
  }

  get backgroundColor() {
    return this.totalHours > 0 &&  this.workedHours > 0? this.cadence?.tempo : 'not-assigned'
  }

  get borderColor() {
    return this.totalHours > 0 ? `border-${this.cadence?.tempo}` : 'border-not-assigned'
  }

  get remainedHours(){
    return this.cadence?.hours || this.cadence.hours === 0 ? this.cadence.hours : this.totalHours
  }

  get cadence() {
    return this.columnValue;
  }

  get showingCadance() {
    if (this.cadenceType === cadenceTypes.phase && ( this.rowData['isSkipped'] === true || this.rowData['phaseTitle'] === 'Triage' ) ) {
      return false
    } else if (this.cadenceType === cadenceTypes.nugget) {
      const phase = this.rowData['nuggetPhases']?.find(phase => phase?.phaseTitle === this.columnSchema?.title)
      return phase?.isSkipped === true ? false : true
    } else if (this.cadenceType === cadenceTypes.resource) {
      if(this.rowData['phaseTitle'] === 'Triage'){
        return false
      }
      if(this.rowData['isSystemPhase'] === true){
        return false
      }

      return !this.rowData['isNotAssigned']
    }
    return true
  }

  get totalHours(){
    return this.cadence?.totalHours ? this.cadence.totalHours : 0
    }

  get workedHours(){
      const workedHours = this.totalHours - this.remainedHours
      if (Number.isInteger(workedHours)) {
        return workedHours
      }
      return Math.round(workedHours * 100) / 100
    }

  @Watch('progress', {immediate: true})
  onProgressChanged(value: number, oldValue: number) {

      this.$nextTick(() => {
        if(this.filled) {
            this.filled.className = ""
            this.filled.classList?.add('filled');
            this.filled.classList?.add(`${this.backgroundColor}`);
            this.filled.style.width = value ? `${value > 100 ? 100 : Number(value)}%` : '0'
          }
        });
  }
}
</script>
<style lang="scss" scoped>

.cadence {
    @import 'src/assets/scss/variables';
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    box-sizing: border-box;
    height: 32px;
    position: relative;
    width: 100%;
    background-color: $cadence-column-bg;
    border-radius: 5px;
    color: $text-color;

    &.border-on-time {
      border: 0.25rem solid  $cadence-column-on-time-bg;
    }

    &.border-delayed {
      border: 0.25rem solid  $cadence-column-delayed-bg;
    }

    &.border-at-risk {
      border: 0.25rem solid  $cadence-column-at-risk-bg;
    }

    &.border-at-rest {
      border: 0.25rem solid  $cadence-column-at-rest-bg;
    }

    &.border-frozen{
      border: 0.25rem solid  $cadence-column-frozen-bg;
    }

    &.border-not-assigned{
      border: 0.25rem solid  white;
    }

    .filled {
        height: 100%;
        transition-delay: 0.5s;
        transition-duration: 0.75s;
        transition-property: width;
        color: $text-color !important;
        // border-radius: 3px;
        box-shadow: $cadence-column-bg 0px 0px 0px 1px;

        // box-shadow: $cadence-column-bg 0px 0px 0px 1px;

        &.on-time {
            background-color: $cadence-column-on-time-bg;
            box-shadow: $cadence-column-on-time-bg 0px 0px 0px 1px;
        }

        &.delayed {
            background-color: $cadence-column-delayed-bg;
            box-shadow: $cadence-column-delayed-bg 0px 0px 0px 1px;
        }

        &.at-risk {
            background-color: $cadence-column-at-risk-bg;
            box-shadow: $cadence-column-at-risk-bg 0px 0px 0px 1px;
        }

        &.at-rest {
          background-color: $cadence-column-at-rest-bg;
            box-shadow: $cadence-column-at-rest-bg 0px 0px 0px 1px;
        }

        &.frozen{
            background-color: $cadence-column-frozen-bg;
            box-shadow: $cadence-column-frozen-bg 0px 0px 0px 1px;
        }

        &.not-assigned{
          background-color: white;
          box-shadow: white 0px 0px 0px 1px;
        }
    }

    .hours-label{
        padding-right: 8px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .expired{
        color: $cadence-column-expired-bg;
    }

    .not-assigned-label{
      position: absolute;
      left: 0;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      font-size: 15px;
    }

}
</style>
