import { JsonObject, JsonProperty } from "json2typescript"
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { ReleaseNumberConverter } from "../converters";

@JsonObject("InboxReleasesRow")
export default class InboxReleasesRow extends TableSubmoduleRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined;

  @JsonProperty("number", ReleaseNumberConverter, true)
  releaseNumber = '';

  @JsonProperty("title", String)
  title: string | undefined = undefined;

  @JsonProperty("managerFullName", String)
  managerFullName: String | undefined = undefined;

  @JsonProperty("managerId", Number)
  managerId: number | null = null
    
  @JsonProperty("secondaryManagerFullName", String)
  secondaryManagerFullName: String | undefined = undefined;

  @JsonProperty("secondaryManagerId", Number)
  secondaryManagerId: number | null = null

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined;

  @JsonProperty("launchDate", String)
  launchDate: string | undefined = undefined;

  @JsonProperty("cutoff", String)
  cutoff: string | undefined = undefined;

  @JsonProperty("publicSeenAt", String, true)
  publicSeenAt: string | null | undefined = undefined;

  @JsonProperty("privateSeenAt", String, true)
  privateSeenAt: string | null | undefined = undefined;

  @JsonProperty("modifiedAt", String, true)
  modifiedAt: string | null = null;

  @JsonProperty("recentMessageAt", String, true)
  recentMessageAt: string | null = null;

  @JsonProperty("publicIsUnread", Boolean, true) publicIsUnread: boolean | null = null;
  @JsonProperty("privateIsUnread", Boolean, true) privateIsUnread: boolean | null = null;
  get isBold() {
    return this.publicIsUnread || this.privateIsUnread;
  }

}
