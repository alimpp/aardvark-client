<script lang="ts">
import Component from 'vue-class-component'
import BaseIcon from "./Base/BaseIcon.vue";

@Component({name: "VideoCallIcon"})
export default class VideoCallIcon extends BaseIcon {
  public get src() {
    return require("@/assets/icons/video-call.svg")
  }
}
</script>