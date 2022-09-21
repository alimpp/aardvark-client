<template>
  <div class="avatar">
    <CoreAvatar :src="user.url" :username="user.fullName" square :size="45" />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";


@Component({ 
  name: "AvatarColumn",
  components: {CoreAvatar}
})
export default class AvatarColumn extends BaseColumn {
  get user(){
    return this.columnValue;
  }

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";

</style>