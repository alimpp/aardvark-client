<script lang="ts">
import Component from 'vue-class-component'
import BaseIcon from "./Base/BaseIcon.vue";

@Component({name: "MessageIcon"})
export default class MessageIcon extends BaseIcon {
  public get src() {
    return require("@/assets/icons/message.svg")
  }
}
</script>