<template>
  <CoreInput
    :editable="true"
    ref="ChatInput"
    :disabled="disabled"
    :loading="loading"
    :placeholder="placeholder"
    @change="onChange"
    @paste="onPaste"
    @click="onClick"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import uniqueId from "./../../mixins/uniqueId";
import ChatUser from '@/components/Chat/ChatUser.vue';
import CoreInput from '@/components/Core/CoreInput.vue';
import { ProfileDSModule, UserDSModule } from '@/store';
import UserDM from "@/datamodels/userDM";
import {EventBus} from "@/utils/eventBus";
import {CHAT_LOCALE, EVENTS} from "@/utils/constants";
import ChatCS from "@/store/modules/componentstore/base/chatCS";
@Component({
  name: "ChatInput",
  mixins: [uniqueId],
  components: {ChatUser, CoreInput}
})
export default class ChatInput extends Vue {
	@Prop({default: false}) disabled!: boolean;
  @Prop({default: false}) loading!: boolean;
  @Prop({required: true}) store!: ChatCS;
  searchUserFilter = '';
  isShowingSearch = false;
  lastKnownCaretPosition = {
    withHtml: 0,
    withoutHtml: 0
  };

  get placeholder() {
    return CHAT_LOCALE.TYPE_MESSAGE;
  }

  activated() {
    EventBus.$on(EVENTS.CHAT_ROOM_INPUT_FOCUS, () => this.focusInput());
  }

  deactivated() {
    EventBus.$off(EVENTS.CHAT_ROOM_INPUT_FOCUS)
  }

  cloneInput(deep = true) {
    return ((this.$refs.ChatInput as Vue).$refs.MazInput as HTMLElement).cloneNode(deep) as HTMLElement;
  }

  getInput() {
    return (this.$refs.ChatInput as Vue).$refs.MazInput as HTMLElement;
  }

  formattedMessage(isVisual?: boolean): string {
    const message = this.cloneInput();
    message.childNodes.forEach(node => {
      if(node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === 'span' && (node as Element).hasAttribute('data-id')) {
        const textNode = document.createTextNode(isVisual ? `**${node.textContent}**` : `**{user_reference_id:${(node as Element).getAttribute('data-id')}}**`);
        node.replaceWith(textNode);
      }
    });
    return message.innerText || '';

  }

  getMentionedUsers() {
    const message = this.cloneInput();
    const mentioned: string[] = []
    message.childNodes.forEach(node => {
      if(node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === 'span') {
        mentioned.push((node as HTMLSpanElement).innerText);
      }
    });
    return this.store.users.filter(user => mentioned.includes(`@${user.fullName}`) && user.referenceId !== ProfileDSModule.id );
  }

  insertHtmlAtIndex(index: number, html: Node, indexOffset: number, appendSpace = true) {
    const input = this.getInput();
    const inputCopy = this.cloneInput();

    inputCopy.innerHTML = input.innerHTML.substr(0, index);
    inputCopy.appendChild(html);
    if(appendSpace) inputCopy.appendChild(document.createTextNode(' '));
    inputCopy.innerHTML += input.innerHTML.substr(indexOffset);
    this.setInput(inputCopy.innerHTML);
  }

  createMentionTag(user: string, userReferenceId?: number) {
    const tag = new ChatUser({propsData: {user, userReferenceId}});
    tag.$mount();
    return tag.$el as HTMLSpanElement;
  }

  getMessage() {
    const input = this.getInput();
    return input.innerHTML;
  }

  setAndFormatMessage(message: string) {
    const formattedMessage = message.replaceAll(/\*{2}(.*?)\*{2}/g, (substr: string, newSubstr: string) => {
      const member = UserDSModule.itemsAsArray.find(user => newSubstr.includes(`@${user.fullName}`));
      return this.createMentionTag(newSubstr, member?.referenceId).outerHTML;
    });
    this.setInput(formattedMessage);
    this.updateCaret();
  }

  clearInput() {
    this.setInput('');
  }

  setInput(message: string) {
    const input = this.getInput();
    input.innerHTML = message;
    this.focusInput();
  }

  insertMention(member: UserDM) {
    const caretIndex = this.lastKnownCaretPosition.withHtml;
    const keyIndex = this.getMessage().lastIndexOf('@', caretIndex);
    const tag = this.createMentionTag(`@${member.fullName}`, member.referenceId);
    this.insertHtmlAtIndex(keyIndex, tag, keyIndex + (this.searchUserFilter.length + 1))
    this.updateCaret(((this.lastKnownCaretPosition.withoutHtml - (this.searchUserFilter.length + 1)) + tag.innerText.length) + 1);
    this.onSearchUser(false, '');
    this.$emit('input', this.formattedMessage());
  }

  getLastSearchText(caretIndex: number, keyIndex: number) {
    const input = this.getInput();
    if (keyIndex !== -1) {
      const searchText = input.innerText.substring(keyIndex + 1, caretIndex)
      if (!/\s/.test(searchText)) {
        return searchText
      }
    }
    return null
  }

  checkKey() {
    const input = this.getInput();
    if(this.lastKnownCaretPosition.withoutHtml >= 0) {
      const keyIndex = input.innerText.lastIndexOf('@', this.lastKnownCaretPosition.withoutHtml - 1);
      if (!(keyIndex < 1 || /\r\n|\r|\n|\s/.test(input.innerText[keyIndex - 1]))) return null;
      const searchText = this.getLastSearchText(this.lastKnownCaretPosition.withoutHtml, keyIndex);
      if (searchText !== null) {
        this.onSearchUser(true, searchText);
        return
      }
    }
    this.onSearchUser(false, '');
    return;
  }

  getCaretPositionWithHTML(): number {
    if (window.getSelection && window.getSelection()?.getRangeAt) {
      const range = window.getSelection()?.getRangeAt(0);
      const selectedObj = window.getSelection();
      let rangeCount = 0;
      const childNodes = selectedObj?.anchorNode?.parentNode?.childNodes;
      if(childNodes && range) {
        for (const childNode of childNodes) {
          if(childNode === selectedObj?.anchorNode) break;
          if((childNode as HTMLElement).outerHTML) rangeCount += (childNode as HTMLElement).outerHTML.length;
          else if(childNode.nodeType === 3) rangeCount += (childNode as HTMLElement).textContent?.length || 0;
        }
        return range.startOffset + rangeCount;
      }
    }
    return -1;
  }

  getCaretPositionWithoutHTML(): number {
    const input = this.getInput();
    const selection = window.getSelection();
    let caretOffset = 0;
    if(selection) {
      const range = selection.getRangeAt(0)
      if(range) {
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNode(input)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
      }
    }
    return caretOffset
  }

  onChange() {
    this.updateLastKnown();
    this.checkKey();
    this.$emit('input', this.formattedMessage());
  }

  onSearchUser(isShowingSearch: boolean, filter: string) {
    this.searchUserFilter = filter;
    this.isShowingSearch = isShowingSearch;
    this.$emit("search", {isShowingSearch, filter});
  }

  createRange(node: Node, chars: {count: number}, range?: Range): Range {
    if (!range) {
      range = document.createRange()
      range.selectNode(node);
      range.setStart(node, 0);
    }
    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (const childNode of node.childNodes) {
          range = this.createRange(childNode, chars, range);
          if (chars.count === 0) {
            break;
          }
        }
      }
    }
    return range;
  }

  updateCaret(position = this.lastKnownCaretPosition.withoutHtml) {
    const input = this.getInput();
    const selection = window.getSelection();
    const range = this.createRange(input, {count: position});
    if (range) {
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    this.updateLastKnown();
  }

  updateLastKnown() {
    this.lastKnownCaretPosition = { withHtml: this.getCaretPositionWithHTML(), withoutHtml: this.getCaretPositionWithoutHTML() };
  }

  addEmoji(emoji: {icon: string, name: string}) {
    const caretIndex = this.lastKnownCaretPosition.withHtml;
    const emojiNode = document.createTextNode(emoji.icon);
    this.insertHtmlAtIndex(caretIndex, emojiNode, caretIndex, false)
    this.updateCaret(this.lastKnownCaretPosition.withoutHtml + emoji.icon.length);
    this.$emit('input', this.formattedMessage());
  }

  onClick() {
    this.updateLastKnown();
  }

  onPaste(pasteEvent) {
    pasteEvent.preventDefault()
    const items = pasteEvent.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && items[i].type.indexOf("image") === 0 ){
        const blob = items[i].getAsFile();
        this.addImage(blob);
      }else if (items[i].type === "text/plain") {

        let text = pasteEvent.clipboardData?.getData("text/plain");
        text = text.split("<").join('&lt;');
        text = text.split(">").join('&gt;');
        document.execCommand("insertHTML", false, text);
      }
    }


  }

  addImage(file) {
    if (!file.type.match("image.*")) {
      return;
    }

    this.$emit("clipBoardImage", file);

  }

  focusInput(): void {
    this.getInput().focus();
  }

  onKeyDown(event: KeyboardEvent) {
    if((event.code === 'ArrowUp' || event.code === 'ArrowDown') && this.isShowingSearch) event.preventDefault();
    if(event.code === 'Enter' && !event.shiftKey) event.preventDefault();
    if(event.code === 'Escape') this.clearInput(), this.onSearchUser(false, '');
    this.$emit('keydown', event);
  }

  onKeyUp(event: KeyboardEvent) {
    if((event.code === 'ArrowUp' || event.code === 'ArrowDown') && this.isShowingSearch) event.preventDefault();
    if ((event.code === 'Enter' || event.code === 'NumpadEnter' ) && !event.shiftKey) {
      this.$emit('send');
    } else {
      this.updateLastKnown();
    }
  }

}
</script>
<style scoped lang="scss">
  ::v-deep .editable-input {
    height: auto;
  }
</style>
