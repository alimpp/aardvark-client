<template>
  <div
    class="maz-base-component maz-avatar maz-flex maz-flex-center maz-flex-fixed"
    :style="[pictureSize]"
    :class="{'has-link': !!url, 'maz-elevation': !noElevation, 'bordered': bordered, editable, square}">

    <a
      v-if="url"
      :href="url"
      :target="target"
      class="maz-avatar__avatar-link maz-flex maz-flex-center">
        <img v-if="src" :src="src" :alt="alt" class="maz-avatar__picture">
        <Avatar v-else-if="username" :username="username" />
    </a>

    <img v-if="src" :src="src" :alt="alt" class="maz-avatar__picture" @click="editable ? $emit('edit', $event) : null" />
    <Avatar class="w-100 h-100" v-else-if="username" :username="username" />

    <button
      v-if="editable"
      type="button"
      class="maz-avatar__editable-layer maz-flex maz-flex-center"
      @click="$emit('edit', $event)">
      <i class="material-icons" aria-hidden="true">edit</i>
    </button>

  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import Avatar from 'vue-avatar'

@Component({ name: "CoreAvatar",  components: {Avatar} })
export default class CoreAvatar extends Vue {
  @Prop({required: true}) src!: string;
  @Prop({default: null}) url!: string;
  @Prop({default: 'avatar image'}) alt!: string;
  @Prop({default: '_self'}) target!: string;
  @Prop({default: 80}) size!: number;
  @Prop({default: false}) bordered!: string;
  @Prop({default: false}) editable!: string;
  @Prop({default: false}) square!: string;
  @Prop({default: false}) noElevation!: string;
  @Prop({default: null}) username!: string;

  public get pictureSize() {
    return { width: `${this.size}px`, height: `${this.size}px` };
  }

}
</script>
