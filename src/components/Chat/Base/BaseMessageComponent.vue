<script lang="ts">
import { Component, Prop, Vue} from "vue-property-decorator";
import MessageDM from "@/datamodels/messageDM";

@Component({name: "BaseMessageComponent"})
export default class BaseMessageComponent extends Vue {
  @Prop({ required: true }) message!: MessageDM;
}
</script>