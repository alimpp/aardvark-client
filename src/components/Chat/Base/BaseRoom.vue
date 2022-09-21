<script lang="ts">
import ChatCS from "@/store/modules/componentstore/base/chatCS";
import { Component, Vue} from "vue-property-decorator";

@Component({name: "BaseRoom"})
export default class BaseRoom extends Vue {
  get store(): ChatCS {
    throw new Error("Implement 'store' accessor");
  }
}
</script>