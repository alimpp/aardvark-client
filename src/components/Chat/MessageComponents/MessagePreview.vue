<template>
      <CoreMarkDown
        :markdowntext="previewText"
        :inline="true"
        class="text-truncate"
      />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SUBSCRIBABLE_TYPE } from "@/utils/constants";
import CoreMarkDown from "@/components/Core/CoreMarkDown.vue";
import MessageDM from "@/datamodels/messageDM";
import { ProfileDSModule } from "@/store";

@Component({
  name: "MessagePreview",
  components: { CoreMarkDown }
})
export default class MessagePreview extends Vue {
  @Prop({ required: true }) private readonly message!: MessageDM;

  get previewText(): string {
    return this.sender ? `${this.sender}: ${this.content}` : `${this.content}`;
  }

  private get sender(): string | null {
    if (this.message.subscribableType !== SUBSCRIBABLE_TYPE.CHANNEL) return null;
    return this.message.senderId === this?.currentUserId ? "You" : this.message?.username;
  }

  private get content(): string {
    return (this.message.content.removeLineBreaks() || this.message.file) ?? '';
  }

  private get currentUserId() {
    return ProfileDSModule.id;
  }
}
</script>