<template>
  <CoreScrollbar>
    <div class="a max-height-moduletab-content">
      <div
        v-for="note in releaseNotes"
        :key="note.id"
        class="single-note"
      >
        <p class="date m-0">{{ moment(note.date).format('DD MMMM, YYYY') }}</p>
        <p class="title m-0">{{ note.title }}</p>
        <ul class="description">
          <li
            v-for="(item, index) in shortenReleaseNoteDescription(note)"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <a
          v-if="note.description.length > 3"
          href="#"
          class="maz-link"
          @click.prevent="setSelectedReleaseNote(note)"
        >{{ note.id === selectedReleaseNote.id ? 'Read Less' : 'Read More' }}</a>
      </div>

    </div>
  </CoreScrollbar>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import moment from "moment";
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue"

@Component({
  name: "ReleaseNote",
  components: { CoreScrollbar },
})
export default class SettingsPhases extends Vue {
  selectedReleaseNote: any = {};
  moment = moment;

  get releaseNotes() {
    return require("../../../public/release-notes.json");
  }

  shortenReleaseNoteDescription(note) {
    if (
      note.description.length > 3 && this.selectedReleaseNote.id !== note.id
    ) {
      return note.description.slice(0, 3).concat(["..."]);
    } else {
      return note.description;
    }
  }

  setSelectedReleaseNote(note) {
    if (note.id === this.selectedReleaseNote.id) {
      this.selectedReleaseNote = {};
    } else {
      this.selectedReleaseNote = note;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.a {
  .single-note {
    border-bottom: 1px solid #cfcfcf;
    display: grid;
    padding: 10px;
    &:not(:first-child) {
      padding: 10px;
    }

    &:first-child {
      padding-bottom: 12px;
    }

    .description {
      padding-left: 18px;
    }
  }
}
</style>
