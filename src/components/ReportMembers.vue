<template>
  <div class="report-Member">
    
  <div class="inp">
  <CoreInput class="flex-grow-1 m-2 mt-2" v-model="userSearch" leftIconName="search" placeholder="Search User"/>
  </div>

    <div class="card-box scrollbar">

    <div
      @click="setActiveMember(member.id)"
      :class="{'active-member': member.id === currentReportUserID}" 
      class="cart ml-2"
      v-for="member in filterReportUsers" :key="member.id"
      >

    <div class="avatar">
    <coreAvatar :src="member.profileUrl" :username="member.fullName" :size="45" />
    </div>

    <div class="user">
    <h6 class="username"> {{member.fullName}}  </h6>
    <h6 class="email"> {{member.email}} </h6>
    </div>

    </div>

    </div> 

  </div>
</template>

<script lang="ts">
import { Vue , Component,} from "vue-property-decorator";
import {
  ApplicationDSModule ,
  ReportMemberCSModule,
  ReportInProgressCSModule,
  ReportUpcomingCSModule,
  ReportEstimatesCSModule,
  ReportCompletedCSModule,
  } from '@/store'
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import {Getter} from "vuex-class";
import CoreInput from '@/components/Core/CoreInput.vue';
import {TABLE_SORT_TYPE} from '@/utils/constants';

@Component({
  name: "ReportMembers",
  components: { CoreAvatar , CoreInput },
})

export default class ReportMembers extends Vue{
    @Getter('profileUrl', {namespace: 'profileds'}) profileUrl: string | undefined;
    @Getter('fullName', {namespace: 'profileds'}) fullName!: string
    currentReportUserID = 0
    userSearch = ""

    get filterReportUsers(){
        return this.members.filter((member) => {
        return member.fullName.trim().toLowerCase().includes(this.userSearch.trim().toLowerCase()) && member.removedAt === ""
      })
    }
    
    get members(){
      return ReportMemberCSModule.userlist
    }

    mounted(){
      const memberID = this.members[0].id ;
      this.currentReportUserID = memberID
      ApplicationDSModule.setSelectedUserID(memberID)
    }

    setActiveMember(id){
      ApplicationDSModule.setSelectedUserID(id)
      this.currentReportUserID = ApplicationDSModule.selectedUserID
      ReportInProgressCSModule.clearSortAndFilter();
      ReportUpcomingCSModule.clearSortAndFilter();
      ReportEstimatesCSModule.clearSortAndFilter();
      ReportCompletedCSModule.clearSortAndFilter();
    }

}
</script>

<style lang="scss" scoped>

.scrollbar{
  scrollbar-color: rgba(170, 170, 170, 0.5) transparent;
  scrollbar-width: auto;
}
.scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 0px;
}
.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(170, 170, 170, 0.5);
  opacity: 0.5;
  border-radius: 5px;
}
.report-Member{
    display: flex;
    flex-direction: column;
    width: 350px;
    background: var(--chat-sidemenu-bg-color);

  .inp{
    width: 350px;
    background: var(--chat-sidemenu-bg-color);
    position: fixed; 
  }
  
  .card-box{
  height: 100%;
  width: 350px;
	overflow:scroll;
  margin-top: 60px;
  }

	.cart{
		display: flex;
		width: 96%;
		margin-top: 5px;
    margin-bottom: 7px;
		border-radius: 10px;
    cursor: pointer;

    &:hover {
		background: var(--chat-sidemenu-bg-color-hover);
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	&:not(:hover) {
		transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
	}

	}
  
	.avatar{
		padding: 5px 5px;
	}

	.user{
		padding: 9px 5px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    .username{
      font-size: 16px;
      font-weight: 500;
      color: var(--chat-room-color-username);
    }
    .email{
      font-size: 15px;
      font-weight: 100;
      color: var(--chat-room-color-username);
    }
	}

}
.active-member{
    color: var(--chat-sidemenu-color-active) !important;
    background: var(--chat-sidemenu-bg-color-active) !important;
    box-shadow:var(--navigation-sidebar-btn-selected-border);
}

</style>
