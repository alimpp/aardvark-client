<template>
    <transition :name="position === 'top' ? 'slide-up' : 'slide-down' ">
      <div
        :class="{'maz-select__options-list--top': position === 'top', 'maz-select__options-list--bottom': position === 'bottom'}"
        class="search-users-container maz-select__options-list maz-flex maz-direction-column maz-direction-column-reverse">
          <SimpleBar class="xeba-scrollbar" ref="scrollbar">
            <div class="search-users-list maz-select__options-list__items-container maz-flex maz-direction-column">
              <template v-if="searchedRooms.length > 0">
                <button
                  v-for="(group, index) in searchedRooms"
                  :key="group.id"
                  ref="users"
                  class="search-user maz-select__options-list__item flex maz-align-center maz-text-center"
                  :class="{'activated': index === selectedIndex, 'dark': isDarkMode}"
                  type="button"
                  @click="emitSelection(group)"
                  @mousedown.prevent>
                    <div class="item maz-flex maz-align-center">
                      <CoreAvatar class="mr-3" :src="group.profileUrl" :username="group.title" :size="45" />
                      <span class="username maz-dots-text maz-text-color">{{group.title}}</span>
                    </div>
                </button>
              </template>
              <template v-else>
                <div v-if="!isSearching" class="search-no-user maz-select__options-list__no-results maz-p-1 maz-flex maz-flex-center">
                  No results found
                </div>
              </template>
            </div>
          </SimpleBar>
      </div>
    </transition>
</template>

<script lang="ts">
import {ProfileDSModule, GroupRoomsCSModule} from "@/store";
import { Component, Prop, Vue } from "vue-property-decorator";
import uniqueId from "./../../mixins/uniqueId";
import SimpleBar from 'simplebar-vue';
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import GroupDM from "@/datamodels/groupDM";
import CoreSpinner from "@/components/Core/CoreSpinner.vue";

@Component({
  name: "GroupChatSearch",
  mixins: [uniqueId],
  components: { CoreAvatar, SimpleBar, CoreSpinner }
})
export default class GroupChatSearch extends Vue {
  @Prop({default: "top"}) position!: string;
  @Prop({default: true, type: Boolean}) showNoResults!: boolean;
  @Prop({default: () => [], type: Array}) readonly searchedRooms!: GroupDM[];
  @Prop({default: false, type: Boolean}) readonly isSearching!: boolean;

  selectedIndex = 0;
  $refs!: {
    users: Element[]
    scrollbar: Vue
  }

  public get isDarkMode() {
    return ProfileDSModule.isDarkMode;
  }

  emitSelection(group: GroupDM): void {
    this.clearSearch();
    this.$emit('select', group);
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
        if(this.selectedIndex + 1 < this.searchedRooms.length) {
          this.selectedIndex++;
          this.updateScroll();
        }
        break;
      case 'Enter':
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
        this.emitSelection(this.searchedRooms[this.selectedIndex]);
        break;
      default:
        break;
    }
  }

  updateScroll() {
    const element = this.$refs.users[this.selectedIndex] as HTMLElement;
    element.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  destroyed() {
    document.removeEventListener('keyup', this.onKeyUp);
    this.clearSearch();
  }

  created() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  private async clearSearch() {
    GroupRoomsCSModule.clearSearchedRooms();
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
