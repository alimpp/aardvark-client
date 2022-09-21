<template>
    <span class="user" :data-id="userReferenceId" contenteditable="false">{{user}}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "ChatUser",
})
export default class ChatUser extends Vue {
    @Prop({required: true}) user!: string;
    @Prop({required: false}) userReferenceId!: number;
}
</script>
<style lang="scss" scoped>
    .user{
        font-weight: bold;
        cursor: pointer;
    }
</style>