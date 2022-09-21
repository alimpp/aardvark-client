import { JsonObject, JsonProperty } from "json2typescript";
import TableRow from "@/datamodels/base/tableRow";

/**
 * @description Base class for all table rows
 * @class TableSubmoduleRow
 * @extends {JsonObject}
 * @implements {TableRow}
 */

@JsonObject("TableSubmoduleRow")
export default class TableSubmoduleRow extends TableRow {
  /**
   * @description The id of the row, represents id of the row, in case of nugget it'll represent nuggetId, vice versa.
   * @type {number | undefined}
   * @memberof TableSubmoduleRow
   * @property id
   * @public
   */
  @JsonProperty("id", Number, true) id: number | undefined = undefined;
  /**
   * @description The number of the row, represents number of the row, in case of nuggetRow it will represent nuggetNumber, viceversa.
   * @type {number | undefined}
   * @memberof TableSubmoduleRow
   * @property number
   * @public
   */
  @JsonProperty("number", Number, true) number: number | undefined = undefined;
  @JsonProperty("privateRoomId", Number, true) privateRoomId = 0;
  @JsonProperty("publicRoomId", Number, true) publicRoomId = 0;
  @JsonProperty("isSubscribedPrivate", Boolean, true) isSubscribedPrivate = false;
  @JsonProperty("isSubscribedPublic", Boolean, true) isSubscribedPublic = false;
  @JsonProperty("publicLatestSeenMessageId", Number, true) publicLatestSeenMessageId: number | null = null;
  @JsonProperty("privateLatestSeenMessageId", Number, true) privateLatestSeenMessageId: number | null = null;
}