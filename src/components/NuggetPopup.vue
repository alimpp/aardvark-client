<template>
  <CorePopper
    tag="div"
    trigger="hover"
    class="d-inline"
    >
    <strong slot="reference" class="nugget-title">N{{nuggetNumber}}</strong>
    <NuggetSummary slot="popper" :nuggetNumber="nuggetNumber" />
  </CorePopper>
</template>

 <script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CorePopper from "@/components/Core/CorePopper.vue";
import NuggetSummary from './NuggetSummary.vue';

@Component({
  name: "NuggetPopup",
  components: { CorePopper, NuggetSummary }
})
export default class NuggetPopup extends Vue {
  @Prop({ required: true, type: Number })
  readonly nuggetNumber!: number;
}
</script>
 <style lang="scss" scoped>
.nugget-title {
  color: var(--brand-color);
  cursor: pointer;
}
</style>