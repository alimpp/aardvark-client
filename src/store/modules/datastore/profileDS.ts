import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Roles } from './permissionDS';

export interface IUserInfo {
    id: number
    email: string
    firstName: string
    lastName: string
    title: string
    avatar: string
    referenceId: number
    sessionId: string
    roles: Roles[]
    organizationId: number
}

@Module({
    name: 'profileds', namespaced: true, preserveState: true, stateFactory: true
})
export class ProfileDS extends VuexModule {
    private _fullName = '';
    private _profileUrl = '';
    roles = [] as Roles[];
    displayName = '';
    email = '';
    identifier = 0;
    sessionId = ''
    id = 0;
    isDarkMode = true

    isStackHolder = false
    isResource = false
    isLeadResource = false
    isProjectMaestro = false
    isReleaseMaestro = false
    isAdmin = false
    isOwner = false;

    get fullName(): string {
        return this._fullName.capitalize();
    }
    get profileUrl(): string {
        return this._profileUrl;
    }

    @Mutation
    setDarkMode(mode: boolean) {
        this.isDarkMode = mode
    }

    @Mutation
    setUserInfo(userInfo: IUserInfo) {
        this.displayName = userInfo.title.capitalize();
        this._fullName = userInfo.firstName + ' ' + userInfo.lastName;
        this._profileUrl = userInfo.avatar;
        this.email = userInfo.email;
        this.identifier = userInfo.id;
        this.id = userInfo.referenceId;
        this.sessionId = userInfo.sessionId;
    }

    @Mutation
    setRoles(roles: Roles[]) {
        [this.isAdmin, this.isLeadResource, this.isOwner, this.isProjectMaestro, this.isReleaseMaestro, this.isResource, this.isStackHolder] = Array<boolean>(7).fill(false);
        this.roles = roles;
        roles.forEach((role: Roles) => {
            switch (role) {
                case Roles.ADMIN:
                    this.isAdmin = true;
                    break;
                case Roles.LEAD_RESOURCE:
                    this.isLeadResource = true;
                    break;
                case Roles.OWNER:
                    this.isOwner = true;
                    break;
                case Roles.PROJECT_MAESTRO:
                    this.isProjectMaestro = true;
                    break;
                case Roles.RELEASE_MAESTRO:
                    this.isReleaseMaestro = true;
                    break;
                case Roles.RESOURCE:
                    this.isResource = true;
                    break;
                case Roles.STAKEHOLDER:
                    this.isStackHolder = true;
                    break;
                default:
                    break;
            }
        });
    }



    @Action({ rawError: true })
    updateUserInfo(userDetail: IUserInfo) {
        this.setRoles(userDetail.roles);
        this.setUserInfo(userDetail);
    }

    @Mutation
    setUpdateFullName(fullName: string) {
        this._fullName = fullName ;
    }

    @Mutation
    setProfileUrl(url: string) {
        this._profileUrl = url;
    }
}
