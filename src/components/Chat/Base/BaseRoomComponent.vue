<script lang="ts">
import { Component, Prop, Vue} from "vue-property-decorator";
import ChatCS from "@/store/modules/componentstore/base/chatCS";

@Component({name: "BaseRoomComponent"})
export default class BaseRoomComponent extends Vue {
  @Prop() store!: ChatCS;

  get isReadOnly() {
    return this.store.readOnlyData.isReadOnly
  }

  get readOnlyMessage() {
    return this.store.readOnlyData.message
  }
}
</script>