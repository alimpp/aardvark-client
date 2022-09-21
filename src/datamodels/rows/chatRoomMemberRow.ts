import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("ChatRoomMemberRow")
export default class ChatRoomMemberRow extends TableRow {

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
}
