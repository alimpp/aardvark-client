<script lang="ts">
import { Component, Prop, Vue} from "vue-property-decorator";
import MessageDM from "@/datamodels/messageDM";

@Component({name: "BaseMessage"})
export default class BaseMessage extends Vue {
  @Prop({ required: true }) message!: MessageDM;
}
</script>