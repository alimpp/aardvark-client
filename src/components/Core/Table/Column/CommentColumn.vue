<template>
  <div class="table-lines-comment maz-flex maz-space-between maz-align-center">
    <div
      class="maz-text-left maz-flex-1"
      :class="{'maz-dots-text': cropText}"
    >
      <span>{{ columnValue }}</span>
    </div>
    <button
      tabindex="-1"
      class="table-lines-comment__btn-visibility maz-flex maz-align-center maz-justify-center"
      @click.stop="cropText = !cropText"
    >
      <i class="material-icons maz-fs-18">
        {{ cropText ? 'visibility' : 'visibility_off' }}
      </i>
    </button>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import BaseColumn from "../Base/BaseColumn.vue";

@Component({
  name: "CommentColumn"
})
export default class CommentColumn extends BaseColumn {
  cropText = true;
}
</script>

<style lang="scss" scoped>
  .table-lines-comment {
    &__btn-visibility {
      border: none;
      background: none;
      outline: none;
      background-color: transparent;
      border-radius: 50%;
      height: 24px;
      width: 24px;
      cursor: pointer;
      margin-left: 10px;
      color: rgba(black, 0.4);

      &:hover,
      &:focus {
        background-color: rgba(black, 0.2);
        box-shadow: 0 0 0 0.1rem rgba(black, 0.1);
      }
    }
  }
</style>
