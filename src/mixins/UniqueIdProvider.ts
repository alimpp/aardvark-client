import Vue from "vue";
import {Component} from "vue-property-decorator";

@Component({
    name: 'UniqueIdProvider',
    provide() {
        return {
            [`${this.$options.name}UniqueId`]: `#${this.$data.uniqueId}`
        }
    }
})
export default class UniqueIdProvider extends Vue {
    _uid!: number
    readonly uniqueId: string = `${this.$options.name}-${this._uid}`;
}
