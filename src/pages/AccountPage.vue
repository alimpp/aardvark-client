<template>
    <div id="Account" class="container-fluid w-auto h-100">
        <div class="row align-items-center h-100">
            <div class="col-xs-12 mx-auto">
                <div id="account-card" class="card shadow-lg rounded p-4 text-center">
                    <!-- LOADING -->
                    <h2 id="welcome-header" class="pb-3">Welcome to Maestro! </h2>
                    <AccountPicker :email="email" :accountid.sync="selectedAccountId"/>
                    <CoreBtn class="mt-4"
                             @click="login"
                             :loading="$wait.is(waitState.ACTION_LOGIN)"
                             :disabled="selectedAccountId === -1"> Login</CoreBtn>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import AccountPicker from '@/components/AccountPicker.vue'
    import {ApplicationDSModule, ProfileDSModule} from "@/store"
    import CoreBtn from '@/components/Core/CoreBtn.vue'
    import {State} from "vuex-class";
    import {Watch} from "vue-property-decorator";
    import AccountDM from "@/datamodels/accountDM";
    import {WaitStates} from "@/utils/vuewait";
    import decodeJwt from "jwt-decode";
    import {IUserInfo} from "@/store/modules/datastore/profileDS"

    @Component({
        name: 'AccountPage',
        components: {AccountPicker, CoreBtn},
    })
    export default class Account extends Vue {
        email = ""
        authorizationCode = ""
        selectedAccountId = -1;
        waitState = WaitStates;

        @State('availableAccounts', {namespace: 'accountds'}) availableAccounts!: Array<AccountDM>;

        @Watch('availableAccounts')
        onAvailableAccounts(val: Array<AccountDM>) {
            if (val.length === 1 && !this.$route.query.organizationId){
                ApplicationDSModule.login({accountid: val[0].id as number, email: this.email,
                    authorizationCode: this.authorizationCode});
            }
        }

        login() {
            if(this.selectedAccountId) {
                ApplicationDSModule.login({accountid: this.selectedAccountId, email: this.email,
                    authorizationCode: this.authorizationCode});
            }
        }

        get darkMode(){
            return ProfileDSModule.isDarkMode
        }
        set darkMode(value: boolean) {
            ProfileDSModule.setDarkMode(value);
        }

        beforeMount() {
            ApplicationDSModule.clearCache()

            if (!this.$route.query.state || !this.$route.query.code) {
                ApplicationDSModule.redirectToCAS()
            } else {
                const email = (decodeJwt(this.$route.query.code as string) as IUserInfo).email || null
                this.email = email || this.$route.query.state as string;
                this.authorizationCode = this.$route.query.code as string;
            }

            if (this.$route.query.organizationId) {
              this.selectedAccountId = Number(this.$route.query.organizationId)
              this.login()
            }
        }
    }
</script>
