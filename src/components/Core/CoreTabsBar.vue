<template>
  <CoreScrollbar class="coretab-scrollbar" size="regular" suppressScrollY :suppressScrollX=suppressScroll showOnHover>
    <div
      ref="MazTabsBar"
      class="maz-base-component maz-tabs-bar"
      :class="{
        'maz-is-dark': dark,
        'align-left': alignLeft
      }"
    >
      <div class="tabs-bar d-flex">
        <CoreBtn
          v-for="({id, label,highBadgeCount, lowBadgeCount, disabled, icon, tooltip, closable}, index) in [...filteredTabs]"
          :id="id"
          :key="index"
          ref="MazTabsBarItem"
          no-shadow
          tabindex="-1"
          color="transparent"
          :class="{active: isSelectedTab(id), disabled: disabled}"
          class="maz-tabs-bar__item core-btn flex-fill px-1"
          :to="noUseAnchor ? null : `#${id}`"
          :style="buttonStyle(id)"
          @click.native.prevent="disabled ? null : setValue($event, id)"
        >

          <CorePopper tag="div" rootClass="h-100 w-100" strategy="fixed" :disabled="!tooltip" :delayOnMouseOver="500">
            <div class="h-100 w-100 d-flex align-items-center justify-content-center" slot="reference">
              <i v-if="icon" :class="icon"></i>
              <span class="maz-tabs-bar__item__text">{{ label ? label.capitalize() : null }}</span>

              <CoreBadgeCount
                counterPadding="0px"
                :count="computedCount(highBadgeCount,lowBadgeCount)"
                class="badge  position-static badge-text"
                :upperLimit="badgeUpperLimit"
                :badgeCountType ="computedBadgeType(highBadgeCount,lowBadgeCount)"
              />

              <span v-if="isSelectedTab(id)" class="activeLine"></span>
            </div>
            <div slot="popper">{{tooltip}}</div>
          </CorePopper>

          <button
            v-if="closable"
            key="clear-button"
            class="maz-input__toggle-btn --clear maz-flex maz-flex-center"
            title="close"
            type="button"
            tabindex="-1"
            @click.stop="closeTab(id)"
          >
            <i class="maz-input__toggle-btn__icon material-icons"> close </i>
          </button>           

        </CoreBtn>

        <CoreBtn
          v-if="loading"
          no-shadow
          color="transparent"
          class="maz-tabs-bar__item core-btn flex-fill disabled">
            <CoreSpinner :size="20" />
        </CoreBtn>
      </div>
    </div>
  </CoreScrollbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CoreBtn from "@/components/Core/CoreBtn.vue";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import CoreBadgeCount from "@/components/Core/CoreBadgeCount.vue";
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";
import CorePopper from "@/components/Core/CorePopper.vue";
import { BADGE_COUNT_TYPE } from "@/utils/constants";

interface CoreTab {
  id: string
  label?: string
  disabled?: boolean
  hidden?: boolean
  icon?: string
  lowBadgeCount?: number
  highBadgeCount?: number
  tooltip?: string
  closable?: boolean
}

@Component({
  name: "CoreTabsBar",
  components: { CoreBtn, CoreBadgeCount, CoreScrollbar, CoreSpinner, CorePopper },
})
export default class CoreTabsBar extends Vue {
  @Prop() public tabs!: CoreTab[];
  @Prop() public value!: string;
  @Prop() public dark!: boolean;
  @Prop() public alignLeft!: boolean;
  @Prop() public noUseAnchor!: boolean;
  @Prop({default: false}) public loading!: boolean;
  @Prop({default: true}) public showBadgeCount!: boolean;
  @Prop({type: Boolean, default: false}) readonly suppressScroll!: boolean;
  tabsIndicatorState = {};
  $refs!: {
    MazTabsBarItem: Vue[]
  }
  badgeUpperLimit=999;

  closeTab(tabId: string) {
    const closedTabIndex = this.tabs.findIndex(tab => tab.id === tabId);
    const newTabs = this.tabs.filter(tab => tab.id !== tabId);

    if(tabId === this.valueComputed && newTabs.length) {
      this.valueComputed = this.tabs[closedTabIndex === 0 ? closedTabIndex+1 : closedTabIndex-1].id
    }

    this.$emit('tabClosed', this.tabs[closedTabIndex]);
  }

  getIndexOfCurrentAnchor = () => {
    if (typeof window === "undefined") return 0;
    const anchor = window.location.hash.replace("#", "");
    const index = this.tabs.findIndex(({id}) => id === anchor);
    return index === -1 ? 0 : index;
  };

  get filteredTabs() {
    return this.tabs.filter(tab => !tab.hidden);
  }

  setValue(event: Event, id: string) {
    event.preventDefault();
    this.valueComputed = id;
  }

    
  computedCount(highBadgeCount: number, lowBadgeCount: number){
    if(!this.showBadgeCount) return 0
    return typeof highBadgeCount === 'undefined' && typeof lowBadgeCount !== 'undefined' ? lowBadgeCount : highBadgeCount
  }

  computedBadgeType(highBadgeCount: number,lowBadgeCount: number){
    return typeof lowBadgeCount !== 'undefined' && typeof highBadgeCount === 'undefined'? BADGE_COUNT_TYPE.LOW_BADGE_COUNT : BADGE_COUNT_TYPE.HIGH_BADGE_COUNT;
  }

  public buttonStyle(id: string) {
    // if (ProfileDSModule.isDarkMode) {
    //   return {'backdrop-filter': this.valueComputed === id ? 'brightness(1.30)' : 'brightness(1.0)'}
    // } else {
    //   return {'backdrop-filter': this.valueComputed === id ? 'brightness(0.97)' : 'brightness(1.0)'}
    // }
  }

  public get valueComputed(): string {
    return this.value;
  }

  public set valueComputed(value: string) {
    this.$emit("input", value);
  }

  public  isSelectedTab(id): boolean {
    const ret: boolean = this.valueComputed == id;
    return ret;
  }
}
</script>

<style lang="scss" >
@import "src/assets/scss/variables";

.activeLine{
    background: dodgerblue;
    width: 100%;
    display: inline-block;
    height: 3px;
    bottom: 0;
    position: absolute;
}
.coretab-scrollbar {
  min-height: $module-tab-height;
  background-color: var(--tab-background);
}

.maz-tabs-bar__indicator{
  transition: transform 0ms;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  animation-fill-mode: backwards;
}


.maz-tabs-bar {
  min-height: $module-tab-height;
  white-space: nowrap;
  overflow-x: initial;
    &__item {
        // box-shadow: none !important;
        border-bottom: 3px solid  var(--second-color);
        border-radius: 8px 8px 0px 0px;
        border-top: 2px;
        border-left: 2px solid  var(--second-color);
        border-right: 2px solid  var(--second-color);


        &.active {
            position: relative;
            border-color: var(--second-color);
            border-width: 2px 2px 0px 2px;
            border-radius: 8px 8px 0px 0px;
            background-color: var(--primary-color);

        }

        &.disabled {
            color: var(--maz-disabled-color);
            cursor: not-allowed;
        }

        &:hover{
            border-radius: 8px 8px 0px 0px;
        }
        &:focus {
            text-decoration: none;
        }

        &__text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 2px;
        }
    }

  .core-btn {
    transition: transform 0ms;
    height: 100%;

    .badge {
      padding: 0px;
        margin-top: 5px;
        margin-left: -5px;
    }

    .low-priority-badge{
      margin-left: 3px;
    }
  }
}

.maz-is-dark .maz-tabs-bar,
.maz-tabs-bar.maz-is-dark {
  .maz-tabs-bar__item {
    &:focus {
      background-color: var(--primary-color);
    }
  }
}


</style>
