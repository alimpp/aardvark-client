<template>
  <CoreSpinner :size="15" />
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
@Component({
  name: "MessageSyncing",
  components: {CoreSpinner}
})
export default class MessageSyncing extends BaseMessageComponent {}
</script>
