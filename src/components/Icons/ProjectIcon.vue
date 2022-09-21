<script lang="ts">
import {Component} from "vue-property-decorator"
import BaseIcon from './Base/BaseIcon.vue'

@Component({name: "ProjectIcon"})
export default class ProjectIcon extends BaseIcon {
    public get src() {
        return require("@/assets/icons/project.svg");
    }
}
</script>
