<template>
    <div
            class="maz-base-component"
            :style="[
      {height: `${height}px`}
    ]"
    >
        <div
                ref="MazTabsContent"
                :style="[
        tabsContainerState
      ]"
                class="core-tabs-content maz-flex maz-align-start"
        >
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
	import { Component, Prop, Vue, Watch } from "vue-property-decorator";
	import Ro from 'resize-observer-polyfill'
	import CoreTabsContentItem from "./CoreTabsContentItem.vue";

	@Component({
		name: 'CoreTabsContent',
	})
	export default class CoreTabsContent extends Vue {
		@Prop({ type: String, default: null }) public activeTab!: string;
		height = 0;

		get currentTab() {
			return this.$slots.default ? this.$slots.default.findIndex(slot => slot.key === this.activeTab ) : 0;
		}

		get tabsContainerState() {
			return { transform: `translateX(-${this.currentTab}00%)` }
		}

		@Watch('currentTab', {immediate: true})
		async onCurrentTabChange() {
					await this.$nextTick()
					const { currentTab } = this
					this.height = ((this.$children as CoreTabsContentItem[])[currentTab]?.$el.children[0] as HTMLElement).offsetHeight ?? 0
					await this.resizeObserver()
				}

		async resizeObserver() {
				const { $children, currentTab } = this

				const resizeObserver = new Ro((entries: any[]) => {
					for (const entry of entries) {
						const { offsetHeight, classList } = entry.target;
						if (offsetHeight && !classList.contains('maz-tabs-content')) this.height = entry?.target?.offsetHeight ?? 0
					}
				})
				$children.forEach(d => resizeObserver.unobserve(d.$el))
				window.setTimeout(() => { resizeObserver.observe($children[currentTab].$el) }, 700)
			}
	}


</script>

<style lang="scss">
.core-tabs-content {
  position: relative;
  transition: transform 0ms;
  -webkit-transform-style: preserve-3d;
	transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
	backface-visibility: hidden;
  transform: translateZ(0);
  animation-fill-mode: backwards;
}
</style>
