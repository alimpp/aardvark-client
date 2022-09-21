import Vue from "vue"
import ProfilePopup from "@/components/ProfilePopup.vue";
import NuggetPopup from "@/components/NuggetPopup.vue";

export default Vue.component("RenderHtmlMessage", {
  props: {
    string: {
      required: true,
      type: String
    }
  },
  render(h) {
    const render = {
      template: "<div>" + this.string + "</div>",
      components: {
        ProfilePopup,
        NuggetPopup
      }
    }
    return h(render)
  }
})