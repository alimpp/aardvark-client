<template>
  <div
    class="main-container"
  >
    <div class="content h-100">
      <CoreTable
        class="maz-flex-1"
        :datasource="dataSource"
        :loading="$wait.is(waitState.ACTION_CHATROOMMEMBER_LOADING)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import CoreTable from "@/components/Core/Table/CoreTable.vue";
import TableCS from "@/store/modules/componentstore/base/tableCS";
import { ChatRoomMemberCSModule, DialogCSModule } from "@/store";
import TableRow from "@/datamodels/base/tableRow";
import DialogForm from "./Base/DialogForm.vue";
import {WaitStates} from '@/utils/vuewait';


@Component({
  name: "ChatRoomMember",
  components: {
    CoreTable,
  },
})
export default class ChatRoomMember extends DialogForm {
  waitState = WaitStates;

  onConfirm() {
    return
  }
  onOpened() {
    ChatRoomMemberCSModule.doLoad(true)
  }
  onBeforeClosed() {
    DialogCSModule.clear();
    ChatRoomMemberCSModule.clear();
  }
    get dataSource(): TableCS<TableRow>{
    return ChatRoomMemberCSModule
  }
}
</script>
<style lang="scss" scoped>
.main-container{
  // Account for dialog margin + header/footer size.
  height: calc(100vh - 130px);

  div.content {
    ::v-deep .table-line {
      pointer-events: none;
    }
    .form {
      .user-info {
        .user-avatar {
          max-width: 100px;
          .avatar {
            border-radius: 5px;
            justify-self: center;
            ::v-deep .vue-avatar--wrapper {
              border-radius: 0 !important;
              width: 100px !important;
              height: 100px !important;
            }
          }
        }
      }
    }
  }
}
</style>