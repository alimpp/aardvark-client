import { JsonObject, JsonProperty } from "json2typescript";
import Datamodel from "@/datamodels/base/datamodel";


@JsonObject("Organization")
export default class AccountDM extends Datamodel {
    @JsonProperty("id", Number, true)
    id = 0

    @JsonProperty("membersCount", Number, true)
    membersCount = 0

    @JsonProperty("title", String, true)
    name = ''
}
