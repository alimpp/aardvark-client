<template>
    <div class="accountpicker">
        <maz-select v-model="selectedAccount" :options="computeAccounts" list-width="100%" placeholder="Account"
                    :loading="isLoading"/>
    </div>
</template>

<script lang="ts">
    import {Prop, PropSync} from 'vue-property-decorator'
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import {State} from "vuex-class";
    import AccountDM from "@/datamodels/accountDM";
    import {AccountDSModule} from "@/store";
    import {MazSelect} from 'maz-ui'


    @Component({
        name: "AccountPicker",
        components: {MazSelect}
    })
    export default class AccountPicker extends Vue {
        @Prop() private email!: string;
        isLoading = true
        @State('availableAccounts', {namespace: 'accountds'}) availableAccounts!: Array<AccountDM>;
        @PropSync('accountid', {required: true}) selectedAccount!: number

        // Declared as computed property getter
        get computeAccounts() {
            const accounts = this.availableAccounts;

            if (accounts === undefined) {
                return [];
            }

            const data = Object.keys(accounts).map(function(value: string, index: number) {
                const account = accounts[index]
                return {label: account.name, value: account.id} 
            }); 
            if(data.length > 0){
                this.selectedAccount = data[0].value ;
            }
            return data ;
        }

        async beforeMount() {
            await AccountDSModule.doLoad({email:this.email, force:true})
            this.isLoading = false;
        }
    }
</script>

<style scoped>

</style>
