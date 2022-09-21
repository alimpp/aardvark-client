<template>
  <CoreScrollbar class="list-hight" size="thin">
    <div class="user-profile">
      <div class="user-avatar">
        <CoreAvatar
          :src="user.profileUrl"
          :username="user.fullName"
          size="60"
          class="avatar"
        />
        <span class="user-name">{{user.fullName}}</span>
        <div class="social-icons">
          <i :class="[canNavigateToDirect ? 'clickable' : 'no-pointer']"
            @click="navigateToDirect" class="material-icons" >chat </i>
          <i class="material-icons mt-n1 mr-n1" v-if="canMakeCall"  @click="navigateToVideoCall()" style="font-size: 35px" >videocam </i>
          <i class="material-icons" v-if="canMakeCall" >call </i>
        </div>
      </div>
      <div
        v-show="userDepartment"
        class="information pt-1"
      >
        <span class="titles">Department:</span>
        <span class="data">{{userDepartment}}</span>
      </div>
      <div
        v-show="user.organizationRoles"
        class="information pt-1"
      >
        <span class="titles">Roles:</span>
        <span class="data">{{organizationRoles}}</span>
      </div>
      <div
        v-show="userSkills && userSkills.length"
        class="information pt-1"
      >
        <span class="titles">Skills:</span>
        <div class="data">
          <p
            class="m-0"
            v-for="skill in userSkills"
            :key="skill.id"
          >{{skill}}</p>
        </div>
      </div>
      <div v-if="isLoading" class="spinner-container d-flex justify-content-center align-items-center">
        <CoreSpinner :size="25" />
      </div>
    </div>
  </CoreScrollbar>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import CoreSpinner from "@/components/Core/CoreSpinner.vue";
import CoreAvatar from "@/components/Core/CoreAvatar.vue";
import UserDM from '@/datamodels/userDM';
import {EVENTS, VIDEO_CONFERENCE_STATUS} from '@/utils/constants';
import {Getter} from 'vuex-class';
import {GlobalVideoConferenceCSModule, ProfileDSModule, UserDepartmentDSModule, UserDSModule, UserSkillDSModule, UserSpecialtyDSModule} from '@/store';
import {WaitStates} from '@/utils/vuewait';
import SpecialtyDM from '@/datamodels/specialtyDM';
import DepartmentDM from '@/datamodels/departmentDM';
import { EventBus } from '@/utils/eventBus';
import Datamodel from '@/datamodels/base/datamodel';
import CoreScrollbar from "@/components/Core/CoreScrollbar.vue"

@Component({
  name: 'UserProfile',
  components: {CoreSpinner, CoreAvatar, CoreScrollbar}
})
export default class UserProfile extends Vue {

  @Getter('itemsAsArray', {namespace: 'userds'})
  private readonly users!: UserDM[];

  @Prop({type: Number, required: true})
  readonly userId!: number;

  get user(): UserDM {
    return this.users.find(user => user.referenceId === this.userId)!;
  }

  get userDepartment(): string {
    const userDepartment = UserDepartmentDSModule.items[this.user.id]?.department ;
    return userDepartment ? userDepartment.name :  "";
  }

  get userSkills(){
    const skills: any[] = []
    UserSkillDSModule.items[this.user.id]?.forEach(skill => {
      const specialties = UserSpecialtyDSModule.items[this.user.id]?.filter(specialty => specialty.skillId === skill.id).map(skillSpecialty => skillSpecialty.title.trim().capitalize()).join(', ')
      const text = specialties ? `${skill.title.trim().capitalize()} (${specialties})` : `${skill.title.trim().capitalize()}`
      skills.push(text)
      })
    return skills
  }

  get userSpecialties(): string {

    return this.getTitles<SpecialtyDM>(UserSpecialtyDSModule.items, 'title');
  }

  get organizationRoles(): string {
    return this.user.organizationRoles?.map(role => role?.trim()?.capitalize() ?? '')?.filter(Boolean)?.join(', ') ?? '';
  }

  get isLoading(): boolean {
    return this.$wait.waiting(WaitStates.ACTION_MESSAGE_INFO);
  }

  get canNavigateToDirect() {
    return this.user.id !== ProfileDSModule.identifier && this.$route.name !== 'People';
  }

  get canMakeCall() {
    return  ( UserDSModule?.me?.referenceId !== this.user.referenceId && GlobalVideoConferenceCSModule.status === VIDEO_CONFERENCE_STATUS.AVAILABLE ) ;
  }

  async navigateToDirect(){
    // disable for People tab's chat as well
    // Because in one to one chat, we can't open our own chat window and the other person's window
    // is already open and we're in it.

    if (this.canNavigateToDirect){
      await this.$router.push({name: 'People'}),      
      EventBus.$emit(EVENTS.MOVE_TO_DIRECT, this.user)
    }
  }

  async navigateToVideoCall(){ 
    GlobalVideoConferenceCSModule.startCall(this.user.referenceId);
   }

  private getTitles<T extends Datamodel>(items: {[key: string]: T[]}, field: keyof T): string {
    return items?.[`${this.user.id}`]?.map((fields: T) => fields?.[`${field}`]?.trim()?.capitalize())
      ?.filter(Boolean)
      ?.join(', ')
      ?? '';
  }

  async beforeMount(): Promise<void> {
      if (!UserDepartmentDSModule.items[this.user.id])
        UserDepartmentDSModule.doLoad(this.user.id);
      if (!UserSkillDSModule.items[this.user.id])
        UserSkillDSModule.listSkills(this.user.id)
      if (!UserSpecialtyDSModule.items[this.user.id])
        UserSpecialtyDSModule.listSpecialties(this.user.id)
  }
  }
</script>

<style lang="scss" scoped>
@import "src/assets/scss/variables";
.list-hight {
  max-height: 50vh !important;
}
.spinner-container{
  height: 40px;
}

i.material-icons {
	font-size: 30px;
}

.user-profile {
  display: grid;
  grid-template-rows: repeat(6, auto);
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .user-avatar {
    font-weight: bold;
    font-size: 18px;
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(2, auto);
    grid-column-gap: 20px;
    justify-content: start;
    width: inherit;
    .user-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .clickable {
      cursor: pointer;
    }
    .no-pointer {
      cursor: default;
      pointer-events: none;
    }
    .avatar {
      grid-row: 1/3;
    }
    .social-icons {
      display: grid;
      grid-template-columns: repeat(3, auto);
      justify-content: center;
      grid-gap: 12px;
      width: inherit;
    }
  }
  .information {
    text-align: left;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 8px;
    min-width: 200px;
    .titles {
      font-weight: bold;
    }
    .data {
      white-space: pre-wrap;
      max-width: 100%;
      word-break: break-word;
    }
  }
}
</style>