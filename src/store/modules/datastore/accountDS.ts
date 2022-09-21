import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"
import OrganizationAPI from "@/api/organizationAPI"
import AccountDM from "@/datamodels/accountDM"
import { JsonParser } from "@/utils/jsonparser"
import { isEmpty } from "@/utils/object"

@Module({ name: "accountds", namespaced: true, stateFactory: false })
export class AccountDS extends VuexModule implements IAccountsStateDS {
	availableAccounts: Array<AccountDM> = []
	selectedAccount: AccountDM = new AccountDM()

	@Mutation
	setAvailableAccounts(accounts: Array<AccountDM>) {
		this.availableAccounts = accounts
	}

	@Mutation
	setSelectedAccount(accountId: number) {
		const result = this.availableAccounts.find(function(account: AccountDM) {
			return account.id == accountId
		})

		if (result !== undefined) {
			this.selectedAccount = result
		}
	}

	@Action({ rawError: true })
	async doLoad(params: { email: string, force?: boolean }) {
		if (isEmpty(this.availableAccounts) || params.force) {
			const data = await OrganizationAPI.LIST({email: params.email})
			const availableAccounts: Array<AccountDM> = JsonParser.deserializeArray(data.data, AccountDM)
			this.setAvailableAccounts(availableAccounts)
		}
	}
}

export interface IAccountsStateDS {
	availableAccounts: Array<AccountDM>
	selectedAccount: AccountDM
}
