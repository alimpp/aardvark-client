<template>
    <div :id="uniqueId" class="coretable-root" :class="{'disabled': disabled}">
        <div v-show="loading" class="maz-input__loader">
          <div class="maz-input__loader__progress-bar" />
        </div>
        <SimpleBar
                ref="scroll-content"
                class="scroll-content xeba-scrollbar tracking-table__scroll-content__scroll bg-color-light"
        >
            <table class="tracking-table" v-click-outside="vcoConfig">
                <ValidationObserver tag="div" class="tracking-table__scroll-content" ref="observer" key="validationObserver" >
                    <thead ref="table" >
                    <Header
                            :datasource="datasource"
                            class="table-title"
                            @reorder-column="reorderTableColumn"
                    />
                    </thead>
                    <tbody :name="animated" class="animation" :is="animatedGroup">
                    <!--          <transition-group-->
                    <!--                  v-if="datasource.tableData.length"-->
                    <!--                  name="list"-->
                    <!--                  tag="div"-->
                    <!--          >-->
                    <Rows
                            v-for="(rowData, index) in datasource.tableData"
                            ref="rows"
                            :key="rowData.id"
                            :datasource="datasource"
                            :rowData="rowData"
                            class="table-row-item"
                            :class="{'bold': rowData.isBold}"
                            @click="rowClick($event, rowData, index)"
                            @dblclick="rowDblClick(rowData)"
                    />
                    <!--          </transition-group>-->
                    </tbody>
                    <NoDataLayer v-if="!loading && datasource.tableData.length > 0 && !canShowLoadMore && !isSimple" />
                    <div
                            v-if="isLastPage && datasource.tableData.length === 0  && !loading && !isSimple"
                            class="maz-flex maz-align-center maz-justify-center maz-text-muted maz-fs-12  h-100"
                    >
                        {{noResultFoundMessage}}
                    </div>
                </ValidationObserver>
            </table>
            <div class="d-flex justify-content-center align-items-center">
              <CoreSpinner
                v-if="!loading && canShowLoadMore"
                class="maz-mb-2"
                :size="50"
                v-observe-visibility="{
                  callback: (isVisible, entry) => loadMore(isVisible),
                  intersection: {threshold: 0.1}
                }" />
            </div>
        </SimpleBar>
        <FloatingActionButton id="floatingActionBar" v-if="saveable && $refs.observer" :show="$refs.observer.flags.changed || $refs.observer.flags.dirty" :disableSave="$refs.observer.flags.invalid" :saving="saving" @save="onSave" @reset="onReset" />
    </div>
</template>

<script lang="ts">
  import Header from '@/components/Core/Table/TableComponents/Header.vue'
  import TableLoader from '@/components/Core/Table/TableComponents/TableLoader.vue'
  import Vue from 'vue'
  import SimpleBar from 'simplebar-vue';
  import Component from "vue-class-component";
  import {Prop, Ref} from "vue-property-decorator";
  import Rows from '@/components/Core/Table/TableComponents/Rows.vue'
  import NoDataLayer from '@/components/Core/Table/TableComponents/NoDataLayer.vue'
  import TableCS from "@/store/modules/componentstore/base/tableCS";
  import TableRow from "@/datamodels/base/tableRow";
  import FloatingActionButton from './TableComponents/FloatingActionButton.vue';
  import {ValidationObserver} from 'vee-validate';
  import CoreSpinner from '@/components/Core/CoreSpinner.vue';
  import vClickOutside from 'v-click-outside';
  import UniqueIdProvider from "@/mixins/UniqueIdProvider"

  @Component({
    name: "CoreTable",
    components: { Header, TableLoader, Rows, NoDataLayer, FloatingActionButton, ValidationObserver, SimpleBar, CoreSpinner },
    directives: {clickOutside: vClickOutside.directive},
    mixins:[UniqueIdProvider]
  })
  export default class TrackingTable extends Vue {
    $refs!: {
      observer: InstanceType<typeof ValidationObserver>
      'scroll-content': SimpleBar
      table: HTMLElement
    };
    isLastPage = true;
    saving = false;
    isLoadingMore = false;
    @Prop({type: Boolean, default: false}) loading!: boolean;
    @Prop({type: Boolean, default: false}) isSimple!: boolean;
    @Prop({type: Boolean, default: false}) saveable!: boolean;
    @Prop({type: Boolean, default: false}) disabled!: boolean;
    @Prop({type: Boolean, default: true}) isAnimated!: boolean;
    @Prop({default: "No available data"}) noResultFoundMessage!: string;
    @Prop({type: Object as () => TableCS<TableRow>, required: true}) datasource!: TableCS<TableRow>;
    @Ref('rows') rows!: Rows[];

    reorderTableColumn(payload) {
      this.datasource.doReorderTableColumn({from: payload.from, to: payload.to})
    }

    get canShowLoadMore() {
      return this.datasource.canShowLoadMore;
    }

    get scrollContent() {
      return this.$refs['scroll-content'].scrollElement as Element;
    }

    public getTableWidth() {
      return this.$refs.table.clientWidth;
    }

    get titles() {
      return this.datasource.tableSchema
    }

    async rowClick(event: PointerEvent, data: TableRow, index: number) {
      if(event.ctrlKey && !event.shiftKey) return this.handleCtrlClick(event, data, index);
      if(event.shiftKey && !event.ctrlKey) return this.handleShiftClick(event, data, index);
      else this.handleDefaultRowClick(data);
    }

    async handleDefaultRowClick(data) {
      await this.datasource.onRowClick(data);
      this.$emit('rowClick', data);
    }

    async handleCtrlClick(event: PointerEvent, data: TableRow, index: number) {
      // Find if the row is in selectedRows
      const selectedRowIndex = this.datasource.selectedRows.findIndex(row => row.id === data.id);
      // if found, and not the first selection, remove it. Else, add it.
      if (selectedRowIndex !== -1 && selectedRowIndex !== 0) {
        this.datasource.setSelectedRows([...this.datasource.selectedRows.filter(row => row.id !== data.id)]);
      } else if (selectedRowIndex === -1) {
        this.datasource.setSelectedRows([...this.datasource.selectedRows, data]);
      }
    }

    async handleShiftClick(event: PointerEvent, data: TableRow, index: number) {
      const lastSelectedIndex = this.datasource.tableData.findIndex(data => data.id === this.datasource.selectedRows[this.datasource.selectedRows.length - 1].id);
      let rows: TableRow[] = [];
      if(lastSelectedIndex > index) {
        rows = this.datasource.tableData.slice(index, lastSelectedIndex);
      } else {
        rows = this.datasource.tableData.slice(lastSelectedIndex + 1, index + 1);
      }
      // Use Set() to filter out rows that are already selected to avoid duplicate data.
      // Set() works here by filtering out by object reference
      const newSelectedRows = Array.from(new Set([...this.datasource.selectedRows, ...rows]));
      this.datasource.setSelectedRows(newSelectedRows);
    }

    get vcoConfig() {
      return {
        handler: this.handleTableOffclick,
        events: ["click"],
        isActive: this.datasource.selectedRows.length > 1,
      };
    }

    handleTableOffclick() {
      this.datasource.setSelectedRows([this.datasource.selectedRows[0]])
    }

    get animated() {
      if (this.isAnimated) {
        return "tableBody";
      } else {
        return "";
      }
    }

    get animatedGroup() {
      if (this.isAnimated) {
        return "transition-group";
      } else {
        return "tbody";
      }
    }

    async rowDblClick(data){
      await this.datasource.onRowDoubleClick(data);
      this.$emit('rowDblClick', data)
    }

    async onSave() {
      this.saving = true;
      await this.datasource.onSave();
      this.saving = false;
      this.$refs.observer.reset();
    }

    async onReset() {
      await this.datasource.doRefreshTable();
      this.$refs.observer.reset();
    }

    async loadMore(isVisible: boolean) {
      if(this.isLoadingMore || !isVisible) return;
      this.isLoadingMore = true;
      await this.datasource.fetchMore();
      this.isLoadingMore = false;
    }

    scrollContentTop() {
      this.$nextTick(() => this.scrollContent.scrollTop = 0);
    }

    scrollToActiveRow() {
      const clientHeight = this.$refs.table.clientHeight
      const [activeRow, tableElement]  = [this.rows.find(row=> row.isActive)?.$el, this.scrollContent] as HTMLDivElement[];
      if(activeRow){
        tableElement.scrollTo({top: activeRow.offsetTop - activeRow.offsetHeight - clientHeight, left: 0, behavior: 'smooth'});
      }
    }

    mounted(){
      // EventBus.$on('scroll-top-table-content', () => {
      //   this.scrollContentTop()
      // })
    }
    beforeDestroy(){
      // EventBus.$off('scroll-top-table-content')
    }
  }

</script>

<style lang="scss" scoped>
 .maz-input__loader{
    position: absolute;
    top: 47px;
    z-index: 100;
    height:18px;
    .maz-input__loader__progress-bar{
      // TODO: Pull from themes.
      top: 0px;
      background-color: #1e90ff;
    }
  }
    .bold {
      font-weight: bold;
      background-color: var(--row-highlight);
    }
    #floatingActionBar {
        position: absolute;
        right: 0px;
    }

    .coretable-root{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .scroll-content {
        width: 100%;
        height: 100%;
    }

    .tableBody-enter-active,.tableBody-leave-active{
        transition: all 0.75s;
    }
    .tableBody-enter,.tableBody-leave-to{
        opacity: 0;
        transform: translateX(-30px);
    }

  .tracking-table {
      border-spacing: 0 6px;
      margin-top: -13px;
      width: 100%;

    &__scroll-content {
      position: relative;
      /*border-bottom-left-radius: 8px;*/
      /*border-bottom-right-radius: 8px;*/

      /*&__scroll {*/
      /*  padding-bottom: 100px;*/
      /*}*/
    }
  }

.disabled {
  ::v-deep .table-line,
  ::v-deep .table-title th {
    cursor: not-allowed;
    background-color: var(--btn-disabled-background-color) !important;
  }
  ::v-deep .table-line:hover {
    box-shadow: none !important;
  }
}
</style>
