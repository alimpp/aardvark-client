<template>
  <div v-if="!isValueZero" >
      <div class="badge-count-root position-relative" >
      <div class="badge-count-wrapper p-0 m-0 position-absolute" >
        <span class="badge-count-round text-center d-inline-block font-weight-bold align-top" :class="[badgeCountStyle]">
          <span v-if="count > upperLimit && !prefixPlus"   style="font-size: 9px; margin-left: -2px;">+</span>
          <CoreOdometer
            class="iOdometer"
            :value="computedCounter"
          />
        </span>

        <div v-if="count > upperLimit && prefixPlus">+</div>
      </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch} from "vue-property-decorator";
import CoreOdometer from './CoreOdometer.vue'
import 'odometer/themes/odometer-theme-default.css'
import ding from '../../assets/audio/ding-base64'
import { ANIMATION_TIMING } from "@/utils/constants";
import { BADGE_COUNT_TYPE } from "@/utils/constants";
import { ValueOf } from "@/utils/generics";


@Component({
  name: "CoreBadgeCount",
  components: { CoreOdometer },
})

export default class CoreBadgeCount extends Vue {

  @Prop({default: 0, required:true}) count!: number;
  @Prop({default: false, required:false}) ding!: Boolean;
  @Prop({default: 99, required:false}) upperLimit!: number;
  @Prop({default: false, required:false}) prefixPlus!: boolean;
  @Prop({default: false, required:false}) badgeCountType!: ValueOf<typeof BADGE_COUNT_TYPE> ;
  
  isValueZero = false

  get computedCounter() {
    return this.count <= this.upperLimit ? Math.floor(this.count) : Math.floor(this.upperLimit)
  }

  get badgeCountStyle(){
    switch (this.badgeCountType) {
      case BADGE_COUNT_TYPE.LOW_BADGE_COUNT:
        return 'whiteBadgeCount'
      case BADGE_COUNT_TYPE.HIGH_BADGE_COUNT:
      default:
        return 'redBadgeCount'
    }
  }

  playDing() {
      const audio = new Audio(ding);
      audio.play();
  }


  @Watch('count', {immediate: true})
  counter(newValue, oldValue) {
    if (this.ding && newValue > oldValue) {
      this.playDing();
    }
    if(!oldValue && newValue === 0 ){
      this.isValueZero = true
    }else if(newValue === 0 ){
      window.setTimeout(() => {
        this.isValueZero = true
      }, ANIMATION_TIMING.BADGE_COUNT_DURATION);
    }else if(newValue > 0){
      this.isValueZero = false
    }
  }

}
</script>


<style lang="scss">
@import "src/assets/scss/variables";

.badge-count-root{
  width: 20px;
  height: 20px;
}
.badge-count-wrapper{
  top: -11px;
  right: -6px;
}
.badge-count-round{
  padding: 0.2em 0.4em 0.4em;
  min-width: 20px ;   
  height: 20px;
  font-size: 12px;
  line-height: 1em;
}

  .whiteBadgeCount{
    background-color: var(--low-badge-background);
    color: var(--low-badge-text-color);
    padding: 2px 4px;
    margin-top: 8px;
    margin-right: -3px;
    border-radius: 5px;
 
  }
  .redBadgeCount{
    background-color:red;
    color: #ffffff;
    padding: 0.2em 0.4em 0.4em;
    border-radius: 1.1em;
  }
.vac-room-badge{ 
  .badge-count-round{ 
    height: 18px !important;
    font-size: 12px;
    padding: 0.2em 0.3em 0.0em   !important;
  }
}
.BadgeCountBell{
  .BadgeCount{
    .BadgeCountIcon{
      text-align: center;
      width: 100%;
      height: 100%
    };
  .counter-wrapper{
    display: grid;
    grid-auto-flow: column;
  }
    .odometer-inside{
      display: grid;
      grid-auto-flow: column;
    }
  }
}
</style>
