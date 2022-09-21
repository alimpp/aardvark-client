<template>
  <div class="room-header app-border-b d-flex w-100 align-items-center">
    <div class="room-wrapper d-flex align-items-center h-100 w-100 justify-content-end">

      <div v-if="canShowHeaderToggle" class="svg-button toggle-button" @click="$emit('toggleRoomsList')">
        <i class="material-icons">arrow_back</i>
      </div>

      <div v-if="headerInfo.title" class="info-wrapper d-flex w-100 h-100 align-items-center" @click="$emit('titleClicked')">
        <CoreAvatar class="mr-2" :src="headerInfo.icon" :username="headerInfo.title" :size="40" />
        <div class="room-name">{{ headerInfo.title }}</div>
      </div>

      <div v-if="headerActions.length" class="position-relative">
        <div
          class="svg-button room-options"
          @click="isMenuOpened = !isMenuOpened"
        >
          <i class="material-icons">more_vert</i>
        </div>
        <transition name="slide-left">
          <div
            ref="menuOptions"
            v-if="isMenuOpened"
            v-click-outside="closeMenu"
            class="menu-options menu-left"
          >
            <div class="menu-list">
              <div v-for="action in headerActions" :key="action.id">
                <div class="menu-item" @click="menuActionHandler(action)">
                  {{ action.title }}
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import vClickOutside from "v-click-outside";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import { Component } from "vue-property-decorator";
import BaseRoomComponent from "../Base/BaseRoomComponent.vue";

@Component({
  name: "RoomHeader",
  components: {CoreAvatar},
  directives: { clickOutside: vClickOutside.directive }
})
export default class RoomHeader extends BaseRoomComponent {
  isMenuOpened = false;

  get canShowHeaderToggle() {
    return this.store.canShowHeaderToggle;
  }

  get headerActions() {
    return this.store.headerActions;
  }

  get headerInfo() {
    return this.store.headerInfo;
  }

  menuActionHandler(action) {
    this.closeMenu();
    this.store.onHandleHeaderAction({action});
  }

  closeMenu() {
    this.isMenuOpened = false;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';

.app-border {
  border: var(--chat-border-style);
}

.app-border-t {
  border-top: var(--chat-border-style);
}

.app-border-r {
  border-right: var(--chat-border-style);
}

.app-border-b {
  border-bottom: var(--chat-border-style);
}

.item-clickable {
  cursor: pointer;
}

.room-icon {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #ddd;
  height: 42px;
  width: 42px;
  margin-right: 15px;
  border-radius: 50%;
}

.room-header {
  height: $module-tab-height;
  min-height: $module-tab-height;
  z-index: 10;
  background: var(--chat-header-bg-color);
  border-top-right-radius: var(--chat-container-border-radius);
}

.room-wrapper {
  padding: 0 16px;
}

.room-options {
  margin-left: auto;
  margin-right: 30px;
}

.toggle-button {
  margin-right: 15px;
  svg {
    height: 26px;
    width: 26px;
  }
}

.rotate-icon {
  transform: rotate(180deg) !important;
}

.room-name {
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
  color: var(--chat-header-color-name);
}

.room-info {
  font-size: 13px;
  line-height: 18px;
  color: var(--chat-header-color-info);
}

.info-wrapper {
  min-width: 0;
  cursor: pointer;
}

.message-options {
  position: relative;
  text-indent: 12px;
}

.menu-options {
  right: 15px;
  top: 25px;
}

.menu-left {
  right: 35px;
}

@media only screen and (max-width: 768px) {
  .room-header {
    height:  $module-tab-height;
    .room-wrapper {
      padding: 0 10px;
    }
    .room-name {
      font-size: 16px;
      line-height: 22px;
    }
    .room-info {
      font-size: 12px;
      line-height: 16px;
    }
    .room-icon {
      height: 37px;
      width: 37px;
      min-width: 37px;
      min-height: 37px;
    }
  }
}

</style>