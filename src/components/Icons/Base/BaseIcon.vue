<template>
    <InlineSvg
        :src="src"
        :title="title"
        :keepDuringLoading="keepDuringLoading"
        :transformSource="transformSource"
        v-bind="$attrs"
        @loaded="$emit('loaded', $event)"
        @unloaded="$emit('unloaded')"
        @error="$emit('error', $event)"
    />
</template>

<script lang="ts">
import { Component, Prop, Vue} from "vue-property-decorator";
import InlineSvg from 'vue-inline-svg';

@Component({name: "BaseIcon", components: {InlineSvg}})
export default class BaseIcon extends Vue {
    @Prop({required: false}) transformSource!: Function;
    @Prop({required: false}) title!: string;
    @Prop({required: false}) keepDuringLoading!: string;

    public get src(): string {
        throw new Error("Implement 'src' accessor");
    }
}
</script>