<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

// @ts-ignore

@Component({ name: "DialogForm" })
export default abstract class DialogForm extends Vue {
    abstract onConfirm(event: HTMLElement);
    abstract onOpened(event: HTMLElement);
    abstract onBeforeClosed(event: boolean);
    onClosed?(event: HTMLElement);
}
</script>


