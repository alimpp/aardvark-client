import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("SettingsUsersRow")
export default class SettingsUsersRow extends TableRow {

  @JsonProperty("id", Number)
    id: number | undefined = undefined;

  @JsonProperty("profileUrl", String)
  profileUrl: String | undefined = undefined;

  @JsonProperty("fullName", String)
  fullName: String | undefined = undefined;

  get avatar() {
    return {
      url: this.profileUrl,
      fullName: this.fullName
    }
  }

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

  @JsonProperty("organizationRoles", [String])
  _organizationRoles: [String] | undefined = undefined;

  get organizationRoles() {
    return this._organizationRoles?.map(role => role.removeUnderscore())
  }

  get department() {
    return ''
  }

  get messages() {
    return '0'
  }

  @JsonProperty("removedAt", String)
  removedAt: String | undefined = undefined;

  _deactivate: Boolean | undefined = undefined;
  get deactivate() {
    return this.removedAt ? true : false
  }
  set deactivate(value) {
    this._deactivate = value 
  }
  
}
