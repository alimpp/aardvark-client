import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from './base/datamodel';

@JsonObject('MemberDM')
export default class MemberDM extends Datamodel {
    @JsonProperty("countryCode", String, true) countryCode = '';
    @JsonProperty("id", Number) id = 0;
    @JsonProperty("email", String) email = '';
    @JsonProperty("phone", String, true) phone = '';
    @JsonProperty("birth", String, true) birthdate = '';
    @JsonProperty("title", String) title = '';
    @JsonProperty("role", String, true) role = '';
    @JsonProperty("timeZone", String, true) timezone = '';
    @JsonProperty("firstName", String) _firstName = '';
    get firstName() {
        return this._firstName.trim();
    }
    set firstName(value: string) {
        this._firstName = value.trim();
    }
    @JsonProperty("lastName", String) _lastName = '';
    get lastName() {
        return this._lastName.trim();
    }
    set lastName(value: string) {
        this._lastName = value.trim();
    }
    @JsonProperty("avatar", String, true) profileUrl = '';
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim().capitalize()
    }

    get phoneNumber() {
        return this.countryCode + this.phone
    }
}
