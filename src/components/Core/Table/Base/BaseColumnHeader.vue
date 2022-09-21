<script lang="ts">
    import { TableFilterCSModule } from "@/store";
    import Component from "vue-class-component";
    import BaseColumn from "../Base/BaseColumn.vue";


    @Component({ name: "BaseColumnHeader" })
    export default class BaseColumnHeader extends BaseColumn {

        protected get isSortableOrFilterable() {
            return typeof this.columnSchema.sortField !== 'undefined' || typeof this.columnSchema.filterType !== 'undefined';
        }

        protected get isSortAscending() {
            return this.currentDirection === 'ASC';
        }

        protected get isSortDescending() {
            return this.currentDirection === 'DESC';
        }

        protected get currentDirection() {
            return this.datasource.sort.direction;
        }

        protected get isActiveSort() {
            if(this.currentSortField && this.currentField) {
                return this.currentSortField === this.currentField;
            }
            return false;
        }

        protected get isActiveFilter() {
            if(this.filters?.key) {
                return this.filters.key in this.datasource.filters
            }
            return false;
        }

        protected get currentSortField() {
            return this.datasource.sort.field
        }

        protected get currentField() {
            return this.columnSchema.sortField;
        }

        protected get filters() {
            if(this.columnSchema.filterType) return TableFilterCSModule.filters[this.columnSchema.filterType]
            return null;
        }

        protected get columnValue() {
            return this.datasource.getHeaderColumnValue(this.columnSchema)
        }

        async onCellClick(id: string = this.columnSchema.id) {
            if (this.datasource.onHeaderCellClick) {
                this.datasource.onHeaderCellClick({ id: this.columnSchema.id, value: this.columnSchema });
            }
        }
    }
</script>
