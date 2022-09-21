<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {Prop} from "vue-property-decorator";
    import {ITableColumnSchema} from "@/store/modules/interfaces/ITableColumnSchema";
    import TableCS from "@/store/modules/componentstore/base/tableCS";
    import TableRow from "@/datamodels/base/tableRow";

    @Component({ name: "BaseColumn" })
    export default class BaseColumn extends Vue {
        @Prop() public datasource!: TableCS<TableRow>;
        @Prop() public columnSchema!: ITableColumnSchema;
        @Prop() public rowData!: TableRow;
        preventClickRowSelection = false;

        protected get columnValue(): any {
            if(typeof this.columnSchema.path === 'object') {
                let data = '';
                this.columnSchema.path[Object.keys(this.columnSchema.path)[0]]?.forEach(field => data = (data || this.rowData[Object.keys(this.columnSchema.path)[0]])[field])
                return data;
            }
            return this.rowData[this.columnSchema.path]
        }

        protected async onCellClick(id: string = this.columnSchema.id) {
            if (this.datasource.onRowCellClick) {
               await this.datasource.onRowCellClick({ id, row: this.rowData });
            }
        }
    }
</script>
