import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';
import { Roles } from "@/store/modules/datastore/permissionDS";

@JsonObject('UserDM')
export default class UserDM extends Datamodel {
    @JsonProperty("avatar", String, true) profileUrl = '';
    @JsonProperty("birth", String, true) birth = '';
    @JsonProperty("createdAt", String, true) createdAt = '';
    @JsonProperty("email", String, true) email = '';
    @JsonProperty("firstName", String, true) _firstName = '';
    get firstName() {
        return this._firstName.trim();
    }
    set firstName(value: string) {
        this._firstName = value.trim();
    }
    @JsonProperty("lastName", String, true) _lastName = '';
    get lastName() {
        return this._lastName.trim();
    }
    set lastName(value: string) {
        this._lastName = value.trim();
    }
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("referenceId", Number) referenceId = 0;
    @JsonProperty("autoModifiedAt", String, true) autoModifiedAt = '';
    @JsonProperty("organizationRoles", [String], true) organizationRoles: Roles[] = [];
    @JsonProperty("phone", Number, true) phone: number | null = null;
    @JsonProperty("removedAt", String, true) removedAt = '';
    @JsonProperty("role", String, true) role = '';
    @JsonProperty("title", String, true) username = '';
    @JsonProperty("timeZone", String, true) timezone = '';
    @JsonProperty("countryCode", String, true) countryCode = '';
    @JsonProperty("isSystem" , Boolean , false) isSystem = false 
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim().capitalize()
    }
}
