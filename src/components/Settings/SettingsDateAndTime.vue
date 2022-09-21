<template>
    <CoreScrollbar class="maz-flex maz-direction-row h-100" size="thin" suppressScrollX showOnHover>
    <div id="DateAndTime" class="main-container">
        <div class="content d-flex h-100">
            <h3>Date & Time Settings</h3>
            <CoreSelect class="settings-options" list-width="100%" v-model="dateFormat" placeholder="Date Format" :options="dateFormats"  :config="configs.dateFormats" />
            <CoreSelect class="settings-options" list-width="100%" v-model="timeFormat" placeholder="Time Format" :options="timeFormats" :config="configs.timeFormats" />
            <CoreSelect class="settings-options" list-width="100%" v-model="timeZone" placeholder="Time Zone" :options="timeZones" :config="configs.timeZones" />
        </div>
    </div>
    </CoreScrollbar>

</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import CoreSelect from '@/components/Core/CoreSelect.vue';
    import {SettingsDateAndTimeCSModule} from '@/store';
    import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";

    @Component({
        name: 'SettingsDateAndTime',
        components: {CoreSelect, CoreScrollbar}
    })
    export default class SettingsDateAndTime extends Vue  {
        date = ''
        zone = 0
        time = ''
        configs = {
            timeZones: {labelKey: 'label', valueKey: 'label'},
            timeFormats: {labelKey: 'label', valueKey: 'value'},
            dateFormats: {labelKey: 'label', valueKey: 'value'}
        }

        public get dateFormats() {
            return SettingsDateAndTimeCSModule.dateFormats
        }

        public get timeFormats() {
            return SettingsDateAndTimeCSModule.timeFormats
        }

        public get timeZones() {
            return SettingsDateAndTimeCSModule.timeZones
        }

        public get timeZone() {
            return this.zone
        }
        public set timeZone(value) {
            this.zone = value
        }

        public get timeFormat() {
            return this.time
        }
        public set timeFormat(value) {
            this.time = value
        }

        public get dateFormat() {
            return this.date
        }
        public set dateFormat(value) {
            this.date = value
        }
    }
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/variables';
  #DateAndTime {
    .content{
        flex-flow: column;
        .settings-options{
            padding: 8px 0;
        }
    }
  }
  </style>
