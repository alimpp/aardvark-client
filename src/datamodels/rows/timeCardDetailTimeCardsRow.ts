import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"

@JsonObject("TimeCardDetailTimeCardsRow")
export default class TimeCardDetailTimeCardsRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined;

  @JsonProperty("date", String)
  date: String | undefined = undefined;

  @JsonProperty("hours", Number)
  _hours: number | undefined = undefined;
  get hours() {
    if (!this._hours) return '00:00';
    const hours = this._hours
      .toFixed(1)
      .split('.')
      .map((value: string, index: number) => (index === 0 ? parseInt(value) : parseInt(value) * 6).toString().padStart(2, '0'))
      .join(':');
    return hours;
  }

  @JsonProperty("note", String)
  note: string | undefined = undefined;

  @JsonProperty("lastHoursValue", Number)
  lastHoursValue: number | undefined = undefined;

  get timecardDate() {
    return this
  }
}