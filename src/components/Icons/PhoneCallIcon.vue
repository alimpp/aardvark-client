<script lang="ts">
import Component from 'vue-class-component'
import BaseIcon from "./Base/BaseIcon.vue";

@Component({name: "PhoneCallIcon"})
export default class PhoneCallIcon extends BaseIcon {
  public get src() {
    return require("@/assets/icons/phone-call.svg")
  }
}
</script>