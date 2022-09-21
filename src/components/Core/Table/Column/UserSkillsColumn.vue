<script lang="ts">
import { UserSkillsCSModule, SkillDSModule, UserSkillDSModule, UserDSModule } from "@/store";
import Component from "vue-class-component";
import BaseDropdownColumn from "../Base/BaseDropdownColumn.vue";

@Component({ name: "BaseDropdownColumn" })
export default class UserSkillsColumn extends BaseDropdownColumn {
  config = { labelKey: "title", valueKey: "id" };
  placeholder = "None";
  noLabel = true;
  hasActionButton = false;
  excludedClasses = [];
  hasMoreButton = false;
  menuOptions = [];
  listHeight = 140;
  headerLabels = [];

  get size(): string {
    return "md";
  }

  get selectedValue() {
    const columnValue = this.columnValue;
    if (this.columnSchema.id === "skill") {
      return columnValue?.id || 0;
    } else if (this.columnSchema.id === "specialties") {
      return columnValue?.map((specialty) => specialty.id) || [];
    } else {
      return null;
    }
  }

    set selectedValue(value) {
      if (value) {
        if (this.columnSchema.id === "skill") {
          if ( value !== this.rowData.id) {
            // @ts-ignore
            this.rowData.oldSkillId = this.rowData.id
            this.rowData.id = value;
            this.rowData[this.columnSchema.path].id = value;
          }
        } else if (this.columnSchema.id === "specialties") {
          this.rowData[this.columnSchema.path] = value;
        }
      } else {
        if (this.columnSchema.id === "specialties") {
          this.rowData[this.columnSchema.path] = [];
        }
      }
    }

  get isDisabled() {
    return this.rowData["skill"].id === 0 &&
      this.columnSchema.id === "specialties"
      ? true
      : false;
  }

  get multiple() {
    return this.columnSchema.id === "specialties" ? true : false;
  }

    get options() {
        if (this.columnSchema.id === 'skill') {
            const currentUserSkills = UserSkillDSModule.items[UserDSModule.currentUser?.id]
            const activeSkills = SkillDSModule.itemsAsArray.filter(skill => (skill.removedAt === '' && !currentUserSkills?.some(item =>  item.id === skill.id && item.id !== this.rowData.id)))
            const userSkills = currentUserSkills ?.filter(userSkill => UserSkillsCSModule?.skills?.some(skill => skill.removedAt !== '' && userSkill.id === skill.id && this.rowData.id === skill.id)) || [];
            return  activeSkills.concat(userSkills) || [];
        } else if (this.columnSchema.id === 'specialties') {
            return this.rowData.id === 0 ? [] :  SkillDSModule.items[this.rowData['skill'].id].specialties
        } else {
            return []
        }
    }

  onOpen() {
    return;
  }

  onClose() {
    return;
  }

  onInputChange(value) {
    this.onCellClick();
  }

  onAction() {
    return;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .maz-input.has-1-right-icon .maz-input__input {
  padding-right: 0;
}
</style>
