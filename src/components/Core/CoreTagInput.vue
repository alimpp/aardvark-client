<!-- A helper component used by VueTagsInput and can be put into the tag-center slot -->
<template>
  <input
    v-if="scope.edit"
    v-model="scope.tag.text"
    :maxlength="scope.maxlength"
    type="text"
    class="ti-tag-input maz-input__input maz-border maz-border-color maz-border-color-hover maz-border-solid"
    size="1"
    @input="scope.validateTag(scope.index, $event)"
    @blur="scope.performCancelEdit(scope.index)"
    @keydown="scope.performSaveEdit(scope.index, $event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
@Component({
  name: "CoreTagInput"
})
export default class CoreTagInput extends Vue {
  @Prop() scope!: object;
}
</script>

<style lang="scss" scoped>
.ti-tag-input {
  background-color: transparent;
  color: inherit;
  border: none;
  padding: 0px;
  margin: 0px;
  display: flex;
  top: 0px;
  position: absolute;
  width: 100%;
  line-height: inherit;
}

.ti-tag-input::-ms-clear {
  display: none;
}

input:focus {
  outline: none;
}

input[disabled] {
  background-color: transparent;
}
</style>
