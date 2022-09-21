<template>
    <transition-group name="maz-scale" tag="div" class="floating-container">
      <CoreBtn key="floating-reset" v-if="show" fab leftIconName="close" :size="size" :disabled="saving" @click="$emit('reset')" class="mr-1" />
      <CoreBtn key="floating-save" v-if="show" fab leftIconName="save" :size="size" :loading="saving" :disabled="disableSave" @click="$emit('save')" />
    </transition-group>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CoreBtn from '@/components/Core/CoreBtn.vue';
import { Prop } from "vue-property-decorator";

@Component({ name: "FloatingActionButton", components: {CoreBtn}})
export default class FloatingActionButton extends Vue {
    @Prop({default: false}) show!: boolean;
    @Prop({default: 'lg'}) size!: string;
    @Prop({default: false}) saving!: boolean;
    @Prop({default: false}) disableSave!: boolean;
}
</script>

<style lang="scss" scoped>
.floating-container{
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 1rem;
    margin-bottom: 1rem;
    font-size: 0.5rem;
}
</style>