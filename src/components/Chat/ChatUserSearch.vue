<template>
    <transition :name="position === 'top' ? 'slide-up' : 'slide-down' ">
      <div
        :class="{'maz-select__options-list--top': position === 'top', 'maz-select__options-list--bottom': position === 'bottom'}"
        class="search-users-container maz-select__options-list maz-flex maz-direction-column maz-direction-column-reverse">
          <SimpleBar class="xeba-scrollbar" ref="scrollbar">
              <CoreSpinner v-if="loading"
               :size="45"
               class="information"
              />
            <div v-else class="search-users-list maz-select__options-list__items-container maz-flex maz-direction-column">
             
                <button
                  v-for="(user, index) in filteredUsers"
                  :key="user.referenceId"
                  ref="users"
                  class="search-user maz-select__options-list__item flex maz-align-center maz-text-center"
                  :class="{'activated': index === selectedIndex, 'dark': isDarkMode}"
                  type="button"
                  @click="emitSelection(user)"
                  @mousedown.prevent>
                    <div class="item maz-flex maz-align-center">
                      <CoreAvatar class="mr-3" :src="user.profileUrl" :username="user.fullName" :size="45" />
                      <span class="username maz-dots-text maz-text-color">{{user.fullName}}</span>
                    </div>
                </button>
                <div v-if="!filteredUsers.length && canShowNoResults" class="search-no-user maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center">
                  No results found
                </div>
            </div>
          </SimpleBar>
      </div>
    </transition>
</template>

<script lang="ts">
import { ApplicationDSModule, GroupChatCSModule, ProfileDSModule } from '@/store';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import uniqueId from "./../../mixins/uniqueId";
import SimpleBar from 'simplebar-vue';
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import UserDM from '@/datamodels/userDM';
import ChatCS from '@/store/modules/componentstore/base/chatCS';
import { WaitStates } from '@/utils/vuewait';
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import { ModuleName } from '@/store/modules/datastore/applicationDS';

@Component({
  name: "ChatUserSearch",
  mixins: [uniqueId],
  components: { CoreAvatar, SimpleBar ,CoreSpinner }
})
export default class ChatUserSearch extends Vue {
  @Prop() filter!: string;
  @Prop({default: "top"}) position!: string;
  @Prop({ type: Array, default: () => []}) filterIds!: number[];
  @Prop({default: true, type: Boolean}) canShowNoResults!: boolean;
  @Prop({required: true}) store!: ChatCS;
  selectedIndex = 0;
  $refs!: {
    users: Element[]
    scrollbar: Vue
  }

  public get loading() {
    return this.$wait.is(WaitStates.ACTION_CHANNEL_MEMBER_LOADING);
  }

  public get isDarkMode() {
    return ProfileDSModule.isDarkMode;
  }

  public get filteredUsers(): UserDM[] {
    const  { filter, filterIds } = this;
    const ids = [ProfileDSModule?.id, ...filterIds];
    return this.store.mentionableUsers.filter(user => !ids.includes(user.referenceId) && user.fullName.toLowerCase().includes(filter.toLowerCase()));
  }

  emitSelection(user: UserDM) {
    this.$emit('select', user);
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
        if(this.selectedIndex !== 0) {
          this.selectedIndex--;
          this.updateScroll();
        }
        break;
      case 'ArrowDown':
        if(this.selectedIndex + 1 < this.filteredUsers.length) {
          this.selectedIndex++;
          this.updateScroll();
        }
        break;
      case 'Enter':
      case 'NumpadEnter':
      case 'Tab':
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        this.emitSelection(this.filteredUsers[this.selectedIndex]);
        break;
      default:
        break;
    }
  }

  updateScroll() {
    const element = this.$refs.users[this.selectedIndex] as HTMLElement;
    element.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  beforeDestroy() {
    this.inputRef.removeEventListener('keyup', this.onKeyUp);
  }

  created() {
    this.inputRef.addEventListener('keyup', this.onKeyUp);
    if(ApplicationDSModule.selectedModule === ModuleName.groups) {
        GroupChatCSModule.loadMentionableUsers();
    }

  }

  private get inputRef() {
    return this.$parent.$el as HTMLElement;
  }

}
</script>

<style lang="scss" scoped>
.xeba-scrollbar{
  max-height: 366px;
  min-height: 100%;
  margin-bottom: 0;
}
.search-users-container{
  width: calc(100% - 1rem);
  margin: 0 0.5rem;
  left: 0;
}
.search-user, .search-no-user{
  padding: 0.5rem;
}
.search-user{
  .dark{
    .username{
      color: #EEE;
    }
  }
  &.activated{
    .username{
      color: #212121;
    }
    background-color: #e5e5e5;
  }
}
.search-no-user{
  cursor: default;
  line-height: 2;
}
</style>