<template>
    <div
      v-html="markdownResult"
      :class="{'message-text': !inline}" >
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {MarkdownInstance} from "@/utils/singletons/markdown";

@Component({
  name: "CoreMarkDown"
})

export default class CoreMarkDown extends Vue {

  @Prop({ required: true, type: String, default: '' })
  private readonly markdowntext!: string;
  @Prop({ required: false, default: false, type: Boolean })
  readonly inline!: boolean;


  get markdownResult() {
    return !this.inline ?  MarkdownInstance.render(this.markdowntext) : MarkdownInstance.renderInline(this.markdowntext);
  }
}
</script>

<style lang="scss" scoped>
  .message-text{
    display: inline-table;
    ::v-deep p{
      margin-top: 0;
      margin-bottom: 16px;
      &:last-child{
        margin-bottom: 0;
      }
    }
    ::v-deep hr{
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }
    ::v-deep blockquote{
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }
    ::v-deep ul{
      white-space: normal;
    }
    ::v-deep ol{
      white-space: normal;
    }
    ::v-deep code{
      padding: 2px 4px;
      font-size: 90%;
      color: #c7254e;
      background-color: #f9f2f4;
      border-radius: 4px;
      display: inline-block;
    }
    ::v-deep pre{
      display: block;
      padding: 9.5px;
      margin: 0 0 5px;
      font-size: 13px;
      line-height: 1.42857143;
      color: #333;
      word-break: break-all;
      word-wrap: break-word;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      code{
        padding: 0;
      font-size: inherit;
      color: inherit;
      white-space: pre-wrap;
      background-color: transparent;
      border-radius: 0;
      }
    }
    ::v-deep table{
      width: 100%;
      max-width: 100%;
      margin-bottom: 20px;
      background-color: transparent;
      border-spacing: 0;
      border-collapse: collapse;
      th{
        border-top: 0;
        vertical-align: bottom;
        border-bottom: 2px solid #ddd;
        padding: 8px;
        line-height: 1.42857143;
        text-align: left;
      }
      tbody{
        tr:nth-child(odd){
          background-color: #f9f9f9;
          color: #333;
        }
        td{
          padding: 8px;
          line-height: 1.42857143;
          vertical-align: top;
          border-top: 1px solid #ddd;
        }
      }
    }
    ::v-deep img{
      max-width: 35%;
      vertical-align: middle;
      border: 0;
    }
  }
</style>