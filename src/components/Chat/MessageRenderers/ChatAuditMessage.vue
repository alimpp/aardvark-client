<template>
  <div class="d-flex w-100" :class="{'flex-row-reverse': isMine}">
    <div style="position: relative">
      <MessageAvatar :message="message" :store="store"/>
      <img src="@/assets/icons/audit-icon.svg" class="image-audit" />
    </div>
    <MessageBubble class="bubble" :message="message">
      <div class="d-flex">
        <MessageUsername class="mr-auto" :message="message" />
        <MessageOptions v-if="!isReadOnly" class="ml-2" :message="message" :actions="actions" @onHandleAction="onHandleAction" />
      </div>
      <CorePopper ref="popper" class="audit-message" :disabled="isDisabled" trigger="hover" placement="top" boundarySelector="#messages-container" @created="setDecorateAuditMessage">
        <span slot="popper" class="d-inline-block popper" >
          <CoreScrollbar class="diff">
            <span class="d-inline" ref="audit" />
          </CoreScrollbar>
        </span>
        <span slot="reference" :class="{'popup-audit-message': isNameOrDescription}">
          <RenderHtmlMessage :string="auditMessage" />
        </span>
      </CorePopper>
      <div class="d-flex justify-content-end align-items-center">
        <MessageTimestamp :message="message" />
      </div>
    </MessageBubble>
  </div>
</template>

<script lang="ts">
import { AUDIT_MESSAGE_TYPE, CHAT_ACTIONS } from "@/utils/constants";
import { Component, Ref } from "vue-property-decorator";
import * as Diff from 'diff';
import MessageAvatar from '@/components/Chat/MessageComponents/MessageAvatar.vue';
import MessageBubble from '@/components/Chat/MessageComponents/MessageBubble.vue';
import MessageUsername from '@/components/Chat/MessageComponents/MessageUsername.vue';
import MessageTimestamp from '@/components/Chat/MessageComponents/MessageTimestamp.vue';
import MessageOptions from '@/components/Chat/MessageComponents/MessageOptions.vue';
import BaseChatMessage from "../Base/BaseChatMessage.vue";
import RenderHtmlMessage from "@/utils/RenderHtmlMessage";
import CorePopper from '@/components/Core/CorePopper.vue';
import CoreScrollbar from '@/components/Core/CoreScrollbar.vue';

@Component({
  name: "ChatAuditMessage",
  components: {CorePopper, CoreScrollbar, MessageBubble, MessageAvatar, MessageUsername, MessageTimestamp, MessageOptions, RenderHtmlMessage}
})
export default class ChatAuditMessage extends BaseChatMessage {
  @Ref('popper') popper!: CorePopper;
  @Ref('audit') audit!: HTMLSpanElement;

  get actions() {
    return [
      CHAT_ACTIONS.REPLY_MESSAGE
    ]
  }

  get isNameOrDescription() {
    const TwoFirstWord = this.message.content.split(' ').slice(0,2).join(' ')
    return TwoFirstWord === AUDIT_MESSAGE_TYPE.NAME || TwoFirstWord === AUDIT_MESSAGE_TYPE.DESCRIPTION ? true : false
  }

  get auditMessage() {
    if(this.message.content.match(/(\b[N][\d+]+\b)/g) && !this.isNameOrDescription){
      return this.nuggetHighlight()
    }
    if (this.isNameOrDescription) return this.message.content.split(' ').slice(0,2).join(' ');
    return this.message.content
  }

  get isDisabled() {
    return !this.isNameOrDescription || this.message.details === ''
  }

  nuggetHighlight() {
    const markdownResult =  this.message.content;

      let element = "<span>" ;
      for (const content of markdownResult.split(/(\b[N][\d+]+\b)/g)) {
        const isNuggetNumber = content.match(/(\b[N][\d+]+\b)/g);
        if(isNuggetNumber){
          const nuggetNumber = isNuggetNumber[0].substr(1)
          element =  element +  `<NuggetPopup :nuggetNumber="Number(${nuggetNumber})" />`;
        }else {
          element = element + content
        }
      }
      return  element + "</span>" ;
  }

  async setDecorateAuditMessage() {
    if (this.isNameOrDescription && this.message.details !== '') {
      await this.popper.$nextTick();
      const display = this.audit
      const fragment = document.createDocumentFragment()
      const detailJson = this.message.details.replace('\n', '')
      const detailObject = JSON.parse(detailJson)
      if (!this.audit?.firstElementChild && detailObject.new_value) {
        const diff = Diff.diffWords(detailObject.old_value || '', detailObject.new_value)
        diff.forEach(part => {
          const span = document.createElement('span')
          if(part.removed) span.style.textDecoration = 'line-through'
          else if (part.added) span.style.color = 'dodgerblue'
          span.appendChild(document.createTextNode(part.value))
          fragment.appendChild(span)
        })
        display.appendChild(fragment);
      }
    }
  }

}
</script>
<style lang="scss" scoped>
@import 'src/assets/scss/variables';

.bubble{
  max-width: calc(100% - 100px);
}

.audit-message{
  color: var(--link-default);
}

.popper{
  white-space: pre-line;
  width: 230px;
  max-width: 300px;
  word-break: break-word;
}

.diff{
  text-align: left;
  max-height: 300px;
  min-height: 25px;
}

.popup-audit-message{
  text-decoration: underline;
  color: var(--link-default);
  font-style: italic;
}

.image-audit{
  min-width: 18px;
  max-width: 18px;
  width: 18px;
  position: absolute;
  top: 2px;
  left: 2px;
}

</style>