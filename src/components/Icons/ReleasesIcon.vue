<script lang="ts">
import Component from 'vue-class-component'
import {ProfileDSModule} from "@/store";
import BaseIcon from "./Base/BaseIcon.vue";

@Component({name: "ReleasesIcon"})
export default class ReleasesIcon extends BaseIcon {
    public get src() {
        return this.darkMode ? require("@/assets/icons/releases_grey.svg") : require("@/assets/icons/releases_black.svg");
    }

    public get darkMode() {
        return ProfileDSModule.isDarkMode
    }
}
</script>