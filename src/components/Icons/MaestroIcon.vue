<script lang="ts">
import Component from 'vue-class-component'
import BaseIcon from "./Base/BaseIcon.vue";

@Component({name: "MaestroIcon"})
export default class MaestroIcon extends BaseIcon {
  public get src() {
    return require("@/assets/icons/maestro.svg");
  }
}
</script>