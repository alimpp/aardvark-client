<template>
  <CoreScrollbar>
   <div class="message-text" >
    <RenderHtmlMessage :string="htmlContent" />
   </div>
  </CoreScrollbar>
</template>

<script lang="ts">
 import CoreMarkDown from "@/components/Core/CoreMarkDown.vue";
import ProfilePopup from "@/components/ProfilePopup.vue";
import {  UserDSModule } from "@/store";
import BaseMessageComponent from "../Base/BaseMessageComponent.vue";
import {MarkdownInstance} from "@/utils/singletons/markdown";
import Component from "vue-class-component";
import RenderHtmlMessage from "@/utils/RenderHtmlMessage";
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue";

@Component({
  name: "MessageContent",
  components: {CoreMarkDown , ProfilePopup ,RenderHtmlMessage, CoreScrollbar }
})
export default class MessageContent extends BaseMessageComponent {
   get content() {
    return this.message.content;
  }

  get htmlContent(){
    if(this.content.contains("**@") && this.message.details.length > 0 ){
      let text= "";
      let count =0 ;
      const userIds =  JSON.parse( this.message.details).rawMessage.match(/\*\*{user_reference_id:\d+}\*\*/g).join(" ").replaceAll("**{user_reference_id:","").replaceAll("}**" ,"").split(" ");
      const data = this.content.split('**') ;
      for (const s of data) {
        if(s.charAt(0) === "@"){
          text =  text + "#@!" +  userIds[count].trim() +"#@!" ;
          count++ ;
        }else {
          text =  text + s ;
        }
      }
      return this.userHighLight(text)

    } else if(this.content.match(/(\b[N][\d+]+\b)/g)) {
      return this.nuggetHighlight(this.content)
    }else {
      return MarkdownInstance.render(this.content) ;
    }

  }

  nuggetHighlight(content: string) {
    const markdownResult =  MarkdownInstance.render(content) ;

      let element = "<span>" ;
      for (const content of markdownResult.split(/(\b[N][\d+]+\b)/g)) {
        const isNuggetNumber = content.match(/(\b[N][\d+]+\b)/g);
        if(isNuggetNumber){
          const nuggetNumber = isNuggetNumber[0].substr(1)
          element =  element +  `<NuggetPopup :nuggetNumber="Number(${nuggetNumber})" />`;
        }else {
          element = element + content
        }
      }
      return  element + "</span>" ;
  }

  userHighLight(content: string) {
    const markdownResult =  MarkdownInstance.render(content) ;

    let html = "<span>" ;
      for (const s of markdownResult.split('#@!')) {
        if(!isNaN(+s) && this.user(s)){
          const user = this.user(s);
          html =  html +  `<ProfilePopup :userId="Number(${user?.referenceId})" />`;
        } else if(s.match(/(\b[N][\d+]+\b)/g)) {
          for (const content of s.split(/(\b[N][\d+]+\b)/g)) {
            const isNuggetNumber = content.match(/(\b[N][\d+]+\b)/g);
            if(isNuggetNumber){
              const nuggetNumber = isNuggetNumber[0].substr(1)
              html =  html +  `<NuggetPopup :nuggetNumber="Number(${nuggetNumber})" />`;
            }else {
              html = html + content
            }
          }
        } else {
          html = html + s
        }
      }
      return  html + "</span>" ;
  }



  user(id){
      return  UserDSModule.itemsAsArray.find(user => user.referenceId === parseInt(id)) ;
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
      margin-top: 0;
      margin-bottom: 0;
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
      max-width: 100%;
      vertical-align: middle;
      border: 0;
    }
  }
</style>