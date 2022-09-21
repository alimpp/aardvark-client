<template>
    <div class="chat-sidebar" :class="{'visible': isOpen}">
        <CoreSidebar
                v-model="isOpen"
                :width="440"
                :rightSideBar="right"
                :loading="false"
                :no-shadow="false"
                :no-close-btn="false"
                :absolute="true"
                :layer="false"
                :mini="false"
                :expand-on-hover="false"
                :mobile="isMobileScreenSize"
                right
            >
            <EntityChatRoom ref="chat" :isSlider="true" class="h-100 chatroom" />
        </CoreSidebar>
    </div>
</template>

<script lang="ts">
    import {Component, Ref, Vue, Watch} from 'vue-property-decorator'
    import {ApplicationDSModule, EntityChatCSModule} from '@/store'
    import CoreSidebar from '@/components/Core/CoreSidebar.vue'
    import {State} from 'vuex-class'
    import EntityChatRoom from "@/components/Chat/Rooms/EntityChatRoom.vue";
    import {EventBus} from "@/utils/eventBus";
    import {EVENTS} from "@/utils/constants";

    @Component({
        name: 'ChatSidebar',
        components: {CoreSidebar, EntityChatRoom}
    })
    export default class ChatSidebar extends Vue {
        right = 440 ;
        @State('isMobileScreenSize', {namespace: 'applicationds'}) isMobileScreenSize!: boolean;
        @State('detailSidebarWidth', {namespace: 'applicationds'}) rightSideBar!: number;
        @Ref('chat') chat!: EntityChatRoom;

        @Watch('isMobileScreenSize')
        onIsMobileScreenSize(val: boolean) {
            if (val){
                ApplicationDSModule.setChatSidebarOpen(false);
                this.right = 0 ;
            }else {
                this.right = this.rightSideBar ;
            }
        }

        @Watch('isOpen')
        onIsOpen(val: boolean) {
            if(val) this.chat.input.focusInput();
        }

        @Watch('rightSideBar')
        onRightSideBar(val: number) {
           this.right = this.rightSideBar ;

        }

        closeSidebar(){
            ApplicationDSModule.setChatSidebarOpen(false)
        }

        set isOpen(value){
            ApplicationDSModule.setChatSidebarOpen(value)
        }

        get isOpen(){
            return ApplicationDSModule.chatSidebarOpen
        }
        created(){
           if (this.isMobileScreenSize){
               this.right = 0 ;
            }else {
              this.right = this.rightSideBar ;
            }
        }
        mounted(){
            EventBus.$on(EVENTS.CLICK_TABLE_SUBMODULE, () => {
                EntityChatCSModule.activate()
            })
        }
        beforeDestroy() {
            EventBus.$off(EVENTS.CLICK_TABLE_SUBMODULE)
        }
    }
</script>

<style lang="scss">
    @import 'src/assets/scss/variables';

    .chatroom{
        min-width: #{$chat-sidebar-width};
        overflow: hidden;

        // This fixes PerfectScrollbar showing up in wrong places in Chat.
        ::v-deep .ps__rail-y {
            left: auto !important;
        }
        ::v-deep .ps__rail-x{
            top: auto !important;
        }
    }

    .maz-is-dark .maz-sidebar .maz-sidebar__wrapper__close-btn button,
    .maz-is-dark.maz-sidebar .maz-sidebar__wrapper__close-btn button {
        background-color: var(--primary-color);
        border: 2px solid var(--second-color);
    }

    .chat-sidebar {
        &.visible{
            .maz-sidebar__wrapper__content{
                overflow: visible;
            }
        }
        .maz-tabs-bar {
            .tabs-bar{
                width: 100%;
            }
        }
        .maz-sidebar {
            &__wrapper {
                transition: all 0.1s;
                transition-timing-function: cubic-bezier(0.0, 0.0, 0.0, 1.0);
                &__close-btn {

                    button {
                        background-color: var(--primary-color);
                        border: 2px solid var(--second-color);
                        margin-top: -8px;
                        padding-right: 1px;
                        width: 35px;
                        height: $module-tab-height;
                    }
                }
                &.is-absolute.is-right {
                    position: absolute;
                    right: $chat-sidebar-width;
                }
                &.is-absolute.is-right.is-mobile {
                    position: absolute;
                    right: 0px;
                }
            }

            white-space: nowrap;
            text-align: center;
        }
    }




</style>
