import { JsonObject, JsonProperty } from "json2typescript"
import TableSubmoduleRow from "../base/tableSubmoduleRow";
import { ReleaseNumberConverter } from "../converters";

@JsonObject("ReleasesActiveRow")
export default class ReleasesActiveRow extends TableSubmoduleRow {

  @JsonProperty("id", Number, true)
  id: number | undefined = undefined

  @JsonProperty('number', ReleaseNumberConverter, true)
  releaseNumber = '';

  @JsonProperty("title", String)
  title: string | undefined = undefined;

  @JsonProperty("tempo", String)
  tempo: string | undefined = undefined;

  @JsonProperty("launchDate", String)
  launchDate: string | undefined = undefined;

  @JsonProperty("cutoff", String)
  cutoff: string | undefined = undefined;

  @JsonProperty("managerFullName", String)
    managerFullName: String | undefined = undefined;

    @JsonProperty("secondaryManagerFullName", String)
    secondaryManagerFullName: String | undefined = undefined;

    @JsonProperty("managerId", Number)
    managerId: number | null = null

    @JsonProperty("secondaryManagerId", Number)
    secondaryManagerId: number | null = null

    @JsonProperty("isSubscribedPublic", Boolean)
    isSubscribedPublic= false

    @JsonProperty("isSubscribedPrivate", Boolean)
    isSubscribedPrivate= false

    @JsonProperty("publicSeenAt", String, true)
    publicSeenAt: string | null | undefined = undefined;

    @JsonProperty("privateSeenAt", String, true)
    privateSeenAt: string | null | undefined = undefined;

    get alert() {
      return ((this.isSubscribedPrivate && !this.privateSeenAt) || (this.isSubscribedPublic && !this.publicSeenAt) ) 
    }
}
