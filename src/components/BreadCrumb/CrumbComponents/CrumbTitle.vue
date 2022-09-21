<template>
    <CorePopper tag="p" strategy="fixed" :delayOnMouseOver="500" :disabled="!isTitleTruncated">
        <p ref="title" slot="reference" class="px-2 breadcrumb-title cursor-pointer">
            {{ title }}
            <ResizeObserver @notify="updateIsTitleTruncated()" key="resizer" />
        </p>
        <div slot="popper">{{ title }}</div>
    </CorePopper>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';
import CorePopper from "@/components/Core/CorePopper.vue";
import { ResizeObserver } from 'vue-resize';

@Component({
    name: 'CrumbTitle',
    components: { CorePopper, ResizeObserver }
})
export default class CrumbTitle extends Vue {
    @Prop({ required: true }) readonly title!: string;
    @Ref('title') element!: HTMLElement;
    isTitleTruncated = false;

    async updateIsTitleTruncated() {
        await this.$nextTick()
        if(this.element){
            this.isTitleTruncated = this.element.offsetWidth < this.element.scrollWidth;
        }
    }

    mounted(){
        this.updateIsTitleTruncated()
    }

}
</script>