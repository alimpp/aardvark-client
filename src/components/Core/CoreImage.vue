<template>
  <figure
    ref="CoreImage"
    class="maz-base-component maz-img d-flex flex-column justify-content-center align-items-center maz-bg-color-light"
    :style="[containerSize]"
    :class="{
      'maz-img--no-zoom': noZoom,
      'maz-img--no-shadow': noShadow,
      'maz-border-radius': !noBorderRadius,
      'maz-img--fullwidth': fullwidth,
      'maz-img--loading': loading
    }"
  >
    <div
      v-if="!loading"
      v-zoom-img="{src, alt, disabled: noZoom, blur: !noBlur, scale: false}"
      :aria-label="alt"
      :style="{'background-image': `url('${src}')`}"
      class="maz-img__bg-img"
      :class="{
        'maz-img__bg-img--contain maz-bg-color-light': contain
      }"
    />
    <CoreSpinner v-else />
    <figcaption v-if="legend" class="maz-img__legend maz-p-2 text-truncate w-100 text-center" :title="legend">{{ legend }}</figcaption>
  </figure>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import CoreSpinner from '@/components/Core/CoreSpinner.vue'
import imgDirective from 'vue-zoom-img'
import Ro from 'resize-observer-polyfill'

@Component({
  name: "CoreImage",
  components: {CoreSpinner},
  directives: {
    'zoom-img': imgDirective
  }
})
export default class CoreImage extends Vue {
  @Prop({required: true, validator: prop => ['string'].includes(typeof prop) && prop}) src!: string;
  @Prop({type: String, default: "Image description"}) alt!: string;
  @Prop({type: String, default: null}) legend!: string;
  @Prop({type: Boolean, default: false}) contain!: boolean;
  @Prop({type: Boolean, default: false}) noShadow!: boolean;
  @Prop({type: Boolean, default: false}) noZoom!: boolean;
  @Prop({type: Boolean, default: true}) noBlur!: boolean;
  @Prop({type: Boolean, default: false}) noBorderRadius!: boolean;
  @Prop({type: Boolean, default: false}) fullwidth!: boolean;
  @Ref('CoreImage') coreImage!: HTMLElement;
  width = 0;
  height = 0;
  heightImage = 0;
  loading = true;

  @Watch('src')
  onSrcChange() {
    this.setImageSize();
  }

  get containerSize() {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    }
  }

  getHeightRatio(height: number) {
    try {
      const { coreImage, width } = this
      if (!coreImage) return
      const componentWidth = this.coreImage.clientWidth
      const ratio = 1 - ((width - componentWidth) / width)
      return height * ratio
    } catch (e) {
      throw new Error (`[CoreImage] Error while calculte height size, ${e}`)
    }
  }

  setImageSize() {
    try {
      this.loading = true;
      const image = new Image();
      image.src = this.src;
      image.addEventListener("load", event => {
        this.loading = false
        this.width = image.width
        this.heightImage = image.height
        this.height = this.getHeightRatio(image.height) || 0;
      });
    } catch (e) {
      throw new Error(`[CoreImage] Error while getting image dimensions: ${e}`)
    }
  }

  setObserver() {
    const resizeObserver = new Ro(() => this.height = this.getHeightRatio(this.heightImage) || 0)
    resizeObserver.observe(this.coreImage);
  }

  mounted() {
    this.setImageSize();
    this.setObserver();
  }
  
}
</script>

<style lang="scss" scoped>
figure{
  margin: 0;
}

.maz-img__bg-img--contain, .maz-img__bg-img--fullsize {
  background-size: contain;
}

.maz-img__bg-img{
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  height: 100%;
  width: 100%;
  transition: all .3s ease-in-out;
}

</style>